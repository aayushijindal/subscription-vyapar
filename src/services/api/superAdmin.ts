import { apiClient } from './axios';

// --- Shared Wrapper ---
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Specific Types ---
export interface Inquiry {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM';
  is_resolved: boolean;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Company {
  id: number;
  company_code: string;
  name: string;
  email: string;
  mobile_no: string;
  city: string;
  state: string;
  country: string;
  gstin_no: string;
  is_active: boolean;
  status: string;
  subscription_plan: string;
  subscription_status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  total_users: number;
  active_users: number;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  role: number;
  role_name: string;
  company: number;
  company_name: string;
  company_code: string;
  date_joined: string;
  last_login: string;
}

export interface DashboardStats {
  total_companies: number;
  active_companies: number;
  total_users: number;
  active_users: number;
  new_inquiries: number;
  resolved_inquiries: number;
}

export const superAdminApi = {
  // --- Auth ---
  login: async (credentials: any) => {
    const response = await apiClient.post<ApiResponse<{ access: string; refresh: string; user: any }>>('/super-admin/auth/login/', credentials);
    return response.data.data;
  },

  // --- Dashboard ---
  getDashboardStats: async () => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/super-admin/stats/');
    return response.data.data;
  },

  // --- Companies ---
  getCompanies: async (params?: { search?: string; is_active?: boolean; status?: string; page?: number; page_size?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Company>>('/super-admin/companies/', { params });
    return response.data;
  },

  getCompanyById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Company>>(`/super-admin/companies/${id}/`);
    return response.data.data;
  },

  updateCompany: async (id: number, data: Partial<Company>) => {
    const response = await apiClient.patch<ApiResponse<Company>>(`/super-admin/companies/${id}/`, data);
    return response.data.data;
  },

  // --- Users ---
  getUsers: async (params?: { search?: string; company_id?: number; role_id?: number; is_active?: boolean; page?: number; page_size?: number }) => {
    const response = await apiClient.get<PaginatedResponse<User>>('/super-admin/users/', { params });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<User>>(`/super-admin/users/${id}/`);
    return response.data.data;
  },

  updateUser: async (id: number, data: Partial<User>) => {
    const response = await apiClient.patch<ApiResponse<User>>(`/super-admin/users/${id}/`, data);
    return response.data.data;
  },

  // --- Inquiries ---
  getInquiries: async (params?: { search?: string; status?: string; is_resolved?: boolean; page?: number; page_size?: number }) => {
    const response = await apiClient.get<PaginatedResponse<Inquiry>>('/super-admin/inquiries/', { params });
    return response.data;
  },

  getInquiryById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Inquiry>>(`/super-admin/inquiries/${id}/`);
    return response.data.data;
  },

  updateInquiry: async (id: number, data: Partial<Inquiry>) => {
    const response = await apiClient.patch<ApiResponse<Inquiry>>(`/super-admin/inquiries/${id}/`, data);
    return response.data.data;
  },

  deleteInquiry: async (id: number) => {
    const response = await apiClient.delete(`/super-admin/inquiries/${id}/`);
    return response.data;
  }
};
