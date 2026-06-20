import axiosInstance from './axiosInstance';

// DASHBOARD
export const getDashboardStats = async () => {
  return axiosInstance.get('/superadmin/dashboard');
};

export const getDashboardCharts = async () => {
  return axiosInstance.get('/superadmin/dashboard/charts');
};

export const getRecentActivities = async () => {
  return { data: { activities: [] } };
};

// USERS
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  return axiosInstance.get('/superadmin/users');
};

export const getUserById = async (userId) => {
  return axiosInstance.get(`/superadmin/users/${userId}`);
};

export const updateSuperadminUser = async (userId, data) => {
  return axiosInstance.patch(`/superadmin/users/${userId}`, data);
};

// ADMINS
export const getAllAdmins = async () => {
  return { data: { admins: [] } };
};

// GYMS
export const getAllGyms = async (page = 1, limit = 10, filters = {}) => {
  return axiosInstance.get('/superadmin/gyms');
};

export const getGymById = async (gymId) => {
  return axiosInstance.get(`/superadmin/gyms/${gymId}`);
};

export const updateSuperadminGym = async (gymId, data) => {
  return axiosInstance.patch(`/superadmin/gyms/${gymId}`, data);
};

export const approveGym = async (gymId, reason) => {
  return axiosInstance.patch(`/superadmin/gyms/${gymId}`, { verified: true, reason });
};

export const rejectGym = async (gymId, reason) => {
  return { data: { message: 'Gym rejected' } };
};

// PAYMENTS
export const getTransactionHistory = async (params) => {
  return axiosInstance.get('/admins/transactions', { params });
};

export const getPendingPayouts = async () => {
  return axiosInstance.get('/admins/payouts/pending');
};

export const getRevenueReports = async (params) => {
  return axiosInstance.get('/admins/revenue/reports', { params });
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

// GYM OWNERS
export const getAllGymOwners = async () => {
  return axiosInstance.get('/superadmin/gym-owners');
};

export const updateGymOwnerStatus = async (ownerId, status) => {
  return axiosInstance.patch(`/superadmin/gym-owners/${ownerId}/status`, { status });
};

// TRAINERS
export const getAllTrainers = async () => {
  return axiosInstance.get('/superadmin/trainers');
};

export const updateTrainerStatus = async (trainerId, status) => {
  return axiosInstance.patch(`/superadmin/trainers/${trainerId}/status`, { status });
};
