import { apiClient } from "./axios";

// Helper for standard REST operations
const createCrudEndpoints = <T = any, CreateDTO = any, UpdateDTO = any>(resource: string) => ({
  list: async (params?: Record<string, any>) => {
    const response = await apiClient.get<T[] | { results: T[] }>(`/master/${resource}/`, { params });
    return response.data;
  },
  create: async (data: CreateDTO) => {
    const response = await apiClient.post<T>(`/master/${resource}/`, data);
    return response.data;
  },
  get: async (id: number | string) => {
    const response = await apiClient.get<T>(`/master/${resource}/${id}/`);
    return response.data;
  },
  update: async (id: number | string, data: UpdateDTO) => {
    const response = await apiClient.put<T>(`/master/${resource}/${id}/`, data);
    return response.data;
  },
  partialUpdate: async (id: number | string, data: Partial<UpdateDTO>) => {
    const response = await apiClient.patch<T>(`/master/${resource}/${id}/`, data);
    return response.data;
  },
  delete: async (id: number | string) => {
    const response = await apiClient.delete(`/master/${resource}/${id}/`);
    return response.data;
  },
});

export const masterApi = {
  accounts: createCrudEndpoints('accounts'),
  companies: createCrudEndpoints('companies'),
  financialYears: createCrudEndpoints('financial-years'),
  departments: createCrudEndpoints('departments'),
  subDepartments: createCrudEndpoints('sub-departments'),
  designations: createCrudEndpoints('designations'),
  employees: createCrudEndpoints('employees'),
  roles: createCrudEndpoints('roles'),
  employeeRoleRights: createCrudEndpoints('employee-role-rights'),
  accountGroups: createCrudEndpoints('account-groups'),
  itemGroups: createCrudEndpoints('item-groups'),
  items: {
    ...createCrudEndpoints('items'),
    // Special Filter
    getByCategory: async (category: 'RAW' | 'FINISH') => {
      const response = await apiClient.get(`/master/items/?category=${category}`);
      return response.data;
    }
  },
  taxDetails: createCrudEndpoints('tax-details'),
  transports: createCrudEndpoints('transports'),

  // Custom Endpoint
  getPincodeDistance: async (fromPincode: string, toPincode: string) => {
    const response = await apiClient.get<{ distance: number }>('/master/pincode-distance/', {
      params: { fromPincode, toPincode }
    });
    return response.data;
  }
};
