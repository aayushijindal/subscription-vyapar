import { apiClient } from "./axios";

const createCrudEndpoints = <T = any, CreateDTO = any, UpdateDTO = any>(resource: string) => ({
  list: async (params?: Record<string, any>) => {
    const response = await apiClient.get<T[] | { results: T[] }>(`/sales/${resource}/`, { params });
    return response.data;
  },
  create: async (data: CreateDTO) => {
    const response = await apiClient.post<T>(`/sales/${resource}/`, data);
    return response.data;
  },
  get: async (id: number | string) => {
    const response = await apiClient.get<T>(`/sales/${resource}/${id}/`);
    return response.data;
  },
  update: async (id: number | string, data: UpdateDTO) => {
    const response = await apiClient.put<T>(`/sales/${resource}/${id}/`, data);
    return response.data;
  },
  partialUpdate: async (id: number | string, data: Partial<UpdateDTO>) => {
    const response = await apiClient.patch<T>(`/sales/${resource}/${id}/`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await apiClient.delete(`/sales/${resource}/${id}/`);
    return response.data;
  },
});

export const salesApi = {
  orderBooking: createCrudEndpoints('order-booking'),
  salesReturn: createCrudEndpoints('sales-return'),
  sales: {
    ...createCrudEndpoints('sales'),
    // E-Invoice (IRN) Actions
    generateIrn: async (id: number | string) => {
      const response = await apiClient.post(`/sales/sales/${id}/generate-irn/`);
      return response.data;
    },
    cancelIrn: async (id: number | string, payload: { cancel_reason: string; cancel_remark: string }) => {
      const response = await apiClient.post(`/sales/sales/${id}/cancel-irn/`, payload);
      return response.data;
    },
    getIrnStatus: async (id: number | string) => {
      const response = await apiClient.get(`/sales/sales/${id}/irn-status/`);
      return response.data;
    },
    // E-Way Bill (EWB) Actions
    generateEwb: async (id: number | string) => {
      const response = await apiClient.post(`/sales/sales/${id}/generate-ewb/`);
      return response.data;
    },
    cancelEwb: async (id: number | string, payload: { cancel_reason_code: string; cancel_remark: string }) => {
      const response = await apiClient.post(`/sales/sales/${id}/cancel-ewb/`, payload);
      return response.data;
    },
    getEwbStatus: async (id: number | string) => {
      const response = await apiClient.get(`/sales/sales/${id}/eway-status/`);
      return response.data;
    },
  }
};
