export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "OWNER" | "ADMIN" | "ACCOUNTANT" | "MANAGER" | "STAFF" | "SALES" | "PURCHASE" | "SUPER_ADMIN";
  mobile?: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Tenant {
  uuid: string;
  business_name: string;
  business_type: "RETAIL" | "WHOLESALE" | "SERVICES" | "MANUFACTURING" | "OTHERS";
  is_active: boolean;
  legal_name?: string;
  gstin?: string;
  pan?: string;
  email?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  logo?: string;
  timezone?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthData {
  access: string;
  refresh: string;
  user: User;
  tenant: Tenant;
  subscription: any | null;
}

export interface TokenRefreshData {
  access: string;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
