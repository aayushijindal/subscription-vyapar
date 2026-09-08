import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://first-computer.onrender.com/api/').replace(/\/?$/, '/');
export const apiClient = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Backend natively scopes data by JWT token, so we no longer need to pass company/fy headers.

  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  
  if (error.response?.status !== 401 || originalRequest?._retry || originalRequest?.url?.includes('refresh')) {
    return Promise.reject(error);
  }
  
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    window.dispatchEvent(new Event('auth-expired'));
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise(function(resolve, reject) {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;
  
  try {
    const response = await axios.post(`${BASE_URL}users/login/refresh/`, { refresh });
    const access = response.data?.access || response.data?.data?.access;
    if (!access) throw new Error('Token refresh failed');
    
    localStorage.setItem('access_token', access);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    originalRequest.headers.Authorization = `Bearer ${access}`;
    
    processQueue(null, access);
    return apiClient(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-expired'));
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});
