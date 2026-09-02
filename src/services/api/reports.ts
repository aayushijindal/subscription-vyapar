import { apiClient } from "./axios";

export const reportsApi = {
  getLedgerStatement: async (params: { account_id?: number | string; from_date?: string; to_date?: string }) => {
    const response = await apiClient.get('/reports/ledger/', { params });
    return response.data;
  }
};
