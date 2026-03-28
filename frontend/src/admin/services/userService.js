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

export const sendNotificationToSeller = async (sellerId, payload) => {
  // admin's `api` client relies on base "/api" or "/api/admin". Wait, api is base `/api/admin`.
  // Wait, if api is base `/api/admin`, my endpoint was `POST /api/notifications/admin/send-to-seller`.
  // The Admin API file might have different baseURL. 
  // Wait, in `server.js` I mounted `/api/notifications` globally. So I need to hit `/api/notifications/...`
  // If `api.js` has baseURL = `/api/admin`, I must do `await api.post('/../notifications/admin/send-to-seller')` or `api.post('/api/notifications...')` but better write the whole path.
  // Actually, I can just do `api.post('http://localhost:5000/api/notifications/admin/send-to-seller')` or `api.post('/notifications/admin/send-to-seller', payload, { baseURL: '/api' })`

  const { data } = await api.post('/api/notifications/admin/send-to-seller', { sellerId, ...payload }, { baseURL: '' });
  return data;
};
