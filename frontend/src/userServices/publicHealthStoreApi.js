import api from './api';

// ─── PUBLIC LISTINGS ─────────────────────────────────────────────────────────
export const getPublicDiets = async (params) => {
  const response = await api.get('/health-store/categories/diet', { params });
  return response.data;
};

export const getPublicSupplements = async (params) => {
  const response = await api.get('/health-store/categories/supplements', { params });
  return response.data;
};

export const getPublicProductById = async (id) => {
  const response = await api.get(`/health-store/categories/products/${id}`);
  return response.data;
};

// ─── PAYMENTS & ORDERS ────────────────────────────────────────────────────────
export const createRazorpayOrder = async (orderData) => {
  const response = await api.post('/health-store/payment/create-order', orderData);
  return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post('/health-store/payment/verify', paymentData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/health-store/payment/orders');
  return response.data;
};

// ─── ONBOARDING FLOWS ────────────────────────────────────────────────────────
export const validateInviteToken = async (token) => {
  const response = await api.get(`/health-store/invite/${token}`);
  return response.data;
};

export const registerHealthStore = async (token, formData) => {
  const response = await api.post(`/health-store/register/${token}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
