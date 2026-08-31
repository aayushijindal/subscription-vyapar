import { apiClient } from "./axios";
import type { BaseResponse, Tenant } from "./types";

export const tenantApi = {
  getTenantDetails: async () => {
    const response = await apiClient.get<BaseResponse<Tenant>>("/tenant/");
    return response.data;
  },

  updateTenantDetails: async (data: Partial<Tenant>) => {
    const response = await apiClient.patch<BaseResponse<Tenant>>("/tenant/", data);
    return response.data;
  },

  uploadLogo: async (logo: File) => {
    const formData = new FormData();
    formData.append("logo", logo);
    const response = await apiClient.post<BaseResponse<{ logo: string }>>("/tenant/logo/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
