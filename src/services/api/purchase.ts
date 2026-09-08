
import { apiClient as api } from './axios';

export const purchaseApi = {
  getAccounts: () => api.get('/master/accounts/'),
  getItems: (category?: string) => api.get(`/master/items/${category ? `?category=${category}` : ''}`),
  getTaxDetails: () => api.get('/master/tax-details/'),
  getTransports: () => api.get('/master/transports/'),

  getPurchases: (params?: any) => api.get('/purchase/purchases/', { params }),
  getPurchase: (id: number) => api.get(`/purchase/purchases/${id}/`),
  createPurchase: (data: any) => api.post('/purchase/purchases/', data),
  updatePurchase: (id: number, data: any) => api.put(`/purchase/purchases/${id}/`, data),
  deletePurchase: (id: number) => api.delete(`/purchase/purchases/${id}/`),

  getGRNs: (params?: any) => api.get('/purchase/grns/', { params }),
  getGRN: (id: number) => api.get(`/purchase/grns/${id}/`),
  createGRN: (data: any) => api.post('/purchase/grns/', data),
  updateGRN: (id: number, data: any) => api.put(`/purchase/grns/${id}/`, data),
  deleteGRN: (id: number) => api.delete(`/purchase/grns/${id}/`),

  getAvailableRawReceipts: () => api.get('/finish-goods/available-raw-receipts/'),
  getFinishGoodsList: (params?: any) => api.get('/finish-goods/', { params }),
  getFinishGoods: (id: number) => api.get(`/finish-goods/${id}/`),
  createFinishGoods: (data: any) => api.post('/finish-goods/', data),
  updateFinishGoods: (id: number, data: any) => api.put(`/finish-goods/${id}/`, data),
  deleteFinishGoods: (id: number) => api.delete(`/finish-goods/${id}/`),

  getPurchaseReturns: (params?: any) => api.get('/purchase/purchase-returns/', { params }),
  getPurchaseReturn: (id: number) => api.get(`/purchase/purchase-returns/${id}/`),
  createPurchaseReturn: (data: any) => api.post('/purchase/purchase-returns/', data),
  deletePurchaseReturn: (id: number) => api.delete(`/purchase/purchase-returns/${id}/`)
};
