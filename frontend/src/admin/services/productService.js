import api from './api';

export const getProducts = async (params) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const updateProductStatus = async (id, statusData) => {
  const { data } = await api.put(`/products/${id}/status`, statusData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
