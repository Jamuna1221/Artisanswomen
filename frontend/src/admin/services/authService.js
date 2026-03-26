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
