import api from './api';

export const getVerifications = async (params) => {
  const { data } = await api.get('/verifications', { params });
  return data;
};

export const getVerificationById = async (id) => {
  const { data } = await api.get(`/verifications/${id}`);
  return data;
};

export const updateVerificationStatus = async (id, statusData) => {
  const { data } = await api.put(`/verifications/${id}`, statusData);
  return data;
};
