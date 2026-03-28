import api from './axios';

// ── GET Products ──
export const getMyProducts = async (params = {}) => {
  const { data } = await api.get('/seller/products', { params });
  return data;
};

// ── GET Single Product ──
export const getProductById = async (id) => {
  const { data } = await api.get(`/seller/products/${id}`);
  return data;
};

// ── CREATE Product ──
export const createProduct = async (formData) => {
  // formData expects a FormData object (for multipart/form-data)
  const { data } = await api.post('/seller/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ── UPDATE Product ──
export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/seller/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ── DELETE Product ──
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/seller/products/${id}`);
  return data;
};

// ── DUPLICATE Product ──
export const duplicateProduct = async (id) => {
  const { data } = await api.post(`/seller/products/${id}/duplicate`);
  return data;
};

// ── TOGGLE Visibility ──
export const toggleVisibility = async (id) => {
  const { data } = await api.patch(`/seller/products/${id}/visibility`);
  return data;
};

// ── TOGGLE Featured ──
export const toggleFeatured = async (id) => {
  const { data } = await api.patch(`/seller/products/${id}/featured`);
  return data;
};

// ── UPDATE Status ──
export const updateStatus = async (id, status) => {
  const { data } = await api.patch(`/seller/products/${id}/status`, { status });
  return data;
};

// ── INLINE Edit (Price/Stock) ──
export const inlineEdit = async (id, updates) => {
  const { data } = await api.patch(`/seller/products/${id}/inline`, updates);
  return data;
};

// ── DELETE Image ──
export const deleteImage = async (id, imgIndex) => {
  const { data } = await api.delete(`/seller/products/${id}/images/${imgIndex}`);
  return data;
};

// ── GET Reviews ──
export const getProductReviews = async (id) => {
  const { data } = await api.get(`/seller/products/${id}/reviews`);
  return data;
};

// ── GET Questions ──
export const getProductQuestions = async (id) => {
  const { data } = await api.get(`/seller/products/${id}/questions`);
  return data;
};

// ── ANSWER Question ──
export const answerQuestion = async (id, qid, answer) => {
  const { data } = await api.post(`/seller/products/${id}/questions/${qid}/answer`, { answer });
  return data;
};

// ── GET Analytics ──
export const getProductAnalytics = async (id) => {
  const { data } = await api.get(`/seller/products/${id}/analytics`);
  return data;
};
