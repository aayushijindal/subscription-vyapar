import { apiClient } from "./axios";

const createCrudEndpoints = <T = any, CreateDTO = any, UpdateDTO = any>(resource: string) => ({
  list: async (params?: Record<string, any>) => {
    const response = await apiClient.get<T[] | { results: T[] }>(`/purchase/${resource}/`, { params });
    return response.data;
  },
  create: async (data: CreateDTO) => {
    const response = await apiClient.post<T>(`/purchase/${resource}/`, data);
    return response.data;
  },
  get: async (id: number | string) => {
    const response = await apiClient.get<T>(`/purchase/${resource}/${id}/`);
    return response.data;
  },
  update: async (id: number | string, data: UpdateDTO) => {
    const response = await apiClient.put<T>(`/purchase/${resource}/${id}/`, data);
    return response.data;
  },
  partialUpdate: async (id: number | string, data: Partial<UpdateDTO>) => {
    const response = await apiClient.patch<T>(`/purchase/${resource}/${id}/`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await apiClient.delete(`/purchase/${resource}/${id}/`);
    return response.data;
  },
});

export const purchaseApi = {
  grns: createCrudEndpoints('grns'),
  purchases: createCrudEndpoints('purchases'),
  purchaseReturns: createCrudEndpoints('purchase-returns'),
};
