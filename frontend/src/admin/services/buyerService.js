import api from './api';

export const getBuyers = async (params) => {
  const { data } = await api.get('/buyers', { params });
  return data;
};
