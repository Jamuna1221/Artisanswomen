import api from './api';

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const verifyAdminOtp = async (otpData) => {
  const { data } = await api.post('/auth/verify-otp', otpData);
  return data;
};

export const resendAdminOtp = async (email) => {
  const { data } = await api.post('/auth/resend-otp', { email });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const updateAdminProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData);
  return data;
};

export const changeAdminPassword = async (passwordData) => {
  const { data } = await api.put('/auth/change-password', passwordData);
  return data;
};

export const getAdminActivity = async () => {
  const { data } = await api.get('/auth/activity');
  return data;
};

// Notifications
export const getAdminNotifications = async () => {
  const { data } = await api.get('/auth/notifications');
  return data;
};

export const markNotificationAsRead = async (id) => {
  const { data } = await api.put(`/auth/notifications/${id}/read`);
  return data;
};

export const markAllAdminNotificationsAsRead = async () => {
  const { data } = await api.put('/auth/notifications/read-all');
  return data;
};

// System Settings
export const getPlatformSettings = async () => {
  const { data } = await api.get('/auth/settings');
  return data;
};

export const updatePlatformSettings = async (settings) => {
  const { data } = await api.put('/auth/settings', settings);
  return data;
};
