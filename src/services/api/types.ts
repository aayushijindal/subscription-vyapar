export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string | number;
  role_name?: string;
  company: number | null;
  company_name?: string;
  financial_year: number | null;
  financial_year_name?: string;
  is_active?: boolean;
  date_joined?: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  company_code?: string;
  gstin?: string;
  bank_name?: string;
  account_no?: string;
  ifsc_code?: string;
  branch?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
}

export interface TeamMember {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role_name: string;
  status: string;
}

export interface Workspace {
  total_users: number;
  team_members: TeamMember[];
}

export interface ProfileData {
  user: User;
  company: CompanyProfile;
  workspace: Workspace;
}

export interface Tenant {
  uuid: string;
  business_name: string;
  business_type: string;
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
  tenant?: Tenant;
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
