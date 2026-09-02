import { apiClient } from "./axios";
import type { BaseResponse, AuthData } from "./types";

export const authApi = {
  register: async (data: Record<string, any>) => {
    const response = await apiClient.post<BaseResponse<AuthData>>("/users/register/", data);
    return response.data;
  },

  login: async (credentials: Record<string, string>) => {
    const response = await apiClient.post<BaseResponse<AuthData>>("/users/login/", credentials);
    // Since we also need to store company/financial_year for global headers if present
    if (response.data?.data?.user?.company) {
      localStorage.setItem('active_company_id', response.data.data.user.company.toString());
    }
    if (response.data?.data?.user?.financial_year) {
      localStorage.setItem('active_fy_id', response.data.data.user.financial_year.toString());
    }
    return response.data;
  },

  logout: async (refreshToken: string) => {
    localStorage.removeItem('active_company_id');
    localStorage.removeItem('active_fy_id');
    const response = await apiClient.post<BaseResponse<null>>("/users/logout/", { refresh: refreshToken });
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
