import api from './api';

export const getComplaints = async (params) => {
  const { data } = await api.get('/complaints', { params });
  return data;
};

export const respondToComplaint = async (id, replyData) => {
  const { data } = await api.post(`/complaints/${id}/reply`, replyData);
  return data;
};
