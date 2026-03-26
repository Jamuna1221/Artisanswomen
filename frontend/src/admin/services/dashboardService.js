import api from './api';

export const getStats = () => api.get('/dashboard/stats');
export const getRecent = () => api.get('/dashboard/recent');
