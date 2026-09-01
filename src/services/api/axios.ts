import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://first-computer.onrender.com/api/v1/').replace(/\/?$/, '/');
export const apiClient = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status !== 401 || originalRequest?._retry || originalRequest?.url?.includes('/auth/refresh/')) return Promise.reject(error);
  originalRequest._retry = true;
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) { window.dispatchEvent(new Event('auth-expired')); return Promise.reject(error); }
  try {
    const response = await axios.post(`${BASE_URL}auth/refresh/`, { refresh });
    const access = response.data?.data?.access;
    if (!access) throw new Error('Token refresh failed');
    localStorage.setItem('accessToken', access);
    originalRequest.headers.Authorization = `Bearer ${access}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('auth-expired'));
    return Promise.reject(refreshError);
  }
});
