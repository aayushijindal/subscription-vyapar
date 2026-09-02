import { apiClient } from "./axios";

const createCrudEndpoints = <T = any, CreateDTO = any, UpdateDTO = any>(resource: string) => ({
  list: async (params?: Record<string, any>) => {
    const response = await apiClient.get<T[] | { results: T[] }>(`/finish-goods/${resource}/`, { params });
    return response.data;
  },
  create: async (data: CreateDTO) => {
    const response = await apiClient.post<T>(`/finish-goods/${resource}/`, data);
    return response.data;
  },
  get: async (id: number | string) => {
    const response = await apiClient.get<T>(`/finish-goods/${resource}/${id}/`);
    return response.data;
  },
  update: async (id: number | string, data: UpdateDTO) => {
    const response = await apiClient.put<T>(`/finish-goods/${resource}/${id}/`, data);
    return response.data;
  },
  partialUpdate: async (id: number | string, data: Partial<UpdateDTO>) => {
    const response = await apiClient.patch<T>(`/finish-goods/${resource}/${id}/`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await apiClient.delete(`/finish-goods/${resource}/${id}/`);
    return response.data;
  },
});

export const finishGoodsApi = {
  // Use generic endpoints on base route /finish-goods/ by passing an empty string or adapting the URL if needed.
  // The documentation specifies `GET | POST /api/finish-goods/` for conversion entry. 
  conversion: createCrudEndpoints(''),
  
  getAvailableRawReceipts: async () => {
    const response = await apiClient.get(`/finish-goods/available-raw-receipts/`);
    return response.data;
  }
};
