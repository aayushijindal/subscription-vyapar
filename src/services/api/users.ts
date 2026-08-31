import { apiClient } from "./axios";
import { BaseResponse, PaginatedData, User } from "./types";

export const usersApi = {
  listUsers: async (page: number = 1, pageSize: number = 25) => {
    const response = await apiClient.get<BaseResponse<User[]> & PaginatedData<User>>("/users/", {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  createUser: async (data: Partial<User> & { password?: string }) => {
    const response = await apiClient.post<BaseResponse<User>>("/users/", data);
    return response.data;
  },

  getUserDetails: async (uuid: string) => {
    const response = await apiClient.get<BaseResponse<User>>(`/users/${uuid}/`);
    return response.data;
  },

  updateUser: async (uuid: string, data: Partial<User>) => {
    const response = await apiClient.patch<BaseResponse<User>>(`/users/${uuid}/`, data);
    return response.data;
  },

  deleteUser: async (uuid: string) => {
    const response = await apiClient.delete<BaseResponse<null>>(`/users/${uuid}/`);
    return response.data;
  },
};
