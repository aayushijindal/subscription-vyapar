import { apiClient } from "./axios";
import { BaseResponse, AuthData, TokenRefreshData, User } from "./types";

export const authApi = {
  register: async (data: Record<string, any>) => {
    const response = await apiClient.post<BaseResponse<AuthData>>("/auth/register/", data);
    return response.data;
  },

  login: async (credentials: Record<string, string>) => {
    const response = await apiClient.post<BaseResponse<AuthData>>("/auth/login/", credentials);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await apiClient.post<BaseResponse<null>>("/auth/logout/", { refresh: refreshToken });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<BaseResponse<AuthData>>("/auth/me/");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post<BaseResponse<null>>("/auth/forgot-password/", { email });
    return response.data;
  },

  resetPassword: async (data: Record<string, string>) => {
    const response = await apiClient.post<BaseResponse<null>>("/auth/reset-password/", data);
    return response.data;
  },

  changePassword: async (data: Record<string, string>) => {
    const response = await apiClient.post<BaseResponse<null>>("/auth/change-password/", data);
    return response.data;
  },
};
