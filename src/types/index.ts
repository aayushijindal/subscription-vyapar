export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'owner';
}

export interface Company {
  id: string;
  name: string;
  ownerName: string;
  gstNumber?: string;
  mobile: string;
  email: string;
  country: string;
  state: string;
  city: string;
  businessType: string;
}

export interface Subscription {
  id: string;
  planId: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'expired' | 'trialing' | 'cancelled';
  currentPeriodEnd: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  planName: string;
}
