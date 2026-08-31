import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token refresh automatically if a 401 response is received
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loop if the refresh token endpoint itself fails
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh")) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt to refresh the token using an independent axios instance
          const res = await axios.post(`${BASE_URL}auth/refresh/`, { refresh: refreshToken });
          
          if (res.data?.success && res.data?.data?.access) {
            const newAccessToken = res.data.data.access;
            localStorage.setItem("accessToken", newAccessToken);
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, meaning the session has truly expired
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // Optionally redirect to login or show an alert, depending on your routing setup
          window.dispatchEvent(new Event("auth-expired"));
        }
      } else {
        // No refresh token available, session is essentially dead
        window.dispatchEvent(new Event("auth-expired"));
      }
    }

    return Promise.reject(error);
  }
);
