import api from './api';

export const getComplaints = async (params) => {
  const { data } = await api.get('/complaints', { params });
  return data;
};

export const respondToComplaint = async (id, replyData) => {
  const { data } = await api.post(`/complaints/${id}/reply`, replyData);
  return data;
};

export const updateComplaintStatus = async (id, status) => {
  const { data } = await api.put(`/complaints/${id}/status`, { status });
  return data;
};
