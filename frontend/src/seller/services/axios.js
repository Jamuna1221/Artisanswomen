import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('authToken') || localStorage.getItem('tempToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
