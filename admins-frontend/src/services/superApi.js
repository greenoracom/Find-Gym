import axiosInstance from './axiosInstance';

// DASHBOARD
export const getDashboardStats = async () => {
  return { data: { totalUsers: 1500, totalGyms: 120, totalRevenue: 450000, activeBookings: 85 } };
};

export const getDashboardCharts = async () => {
  return { data: { userGrowth: [], revenueGrowth: [] } };
};

export const getRecentActivities = async () => {
  return { data: { activities: [] } };
};

// USERS
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  return { data: { users: [], total: 0, pages: 0 } };
};

export const getUserById = async (userId) => {
  return { data: {} };
};

// ADMINS
export const getAllAdmins = async () => {
  return { data: { admins: [] } };
};

// GYMS
export const getAllGyms = async (page = 1, limit = 10, filters = {}) => {
  return { data: { gyms: [], total: 0, pages: 0 } };
};

export const getGymById = async (gymId) => {
  return { data: {} };
};

export const approveGym = async (gymId, reason) => {
  return { data: { message: 'Gym approved successfully' } };
};

export const rejectGym = async (gymId, reason) => {
  return { data: { message: 'Gym rejected' } };
};

// PAYMENTS
export const getTransactionHistory = async (page = 1, limit = 10, filters = {}) => {
  return { data: { transactions: [], total: 0, pages: 0 } };
};

// CMS
export const uploadBanner = async (formData) => {
  return axiosInstance.post('/superadmin/cms/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAllBanners = async () => {
  return axiosInstance.get('/superadmin/cms/banners');
};
