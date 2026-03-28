import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  // Only use authToken for authenticated seller routes (not tempToken)
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login on 401 (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('tempToken');
      // Redirect to seller login
      window.location.href = '/seller/login';
    }
    return Promise.reject(error);
  }
);

export default api;
