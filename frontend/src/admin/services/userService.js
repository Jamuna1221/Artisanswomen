import api from './api';

export const getArtisans = async (params) => {
  const { data } = await api.get('/users/artisans', { params });
  return data;
};

export const getBuyers = async (params) => {
  const { data } = await api.get('/users/buyers', { params });
  return data;
};

export const updateUserStatus = async (id, status) => {
  const { data } = await api.put(`/users/${id}/status`, { status });
  return data;
};

export const approveSeller = async (id) => {
  const { data } = await api.patch(`/users/artisans/${id}/approve`);
  return data;
};

export const rejectSeller = async (id, reason) => {
  const { data } = await api.patch(`/users/artisans/${id}/reject`, { reason });
  return data;
};
