import api from './api';

export const getOrders = async (params) => {
  const { data } = await api.get('/orders', { params });
  return data;
};

export const updateOrderStatus = async (id, statusData) => {
  const { data } = await api.put(`/orders/${id}/status`, statusData);
  return data;
};
