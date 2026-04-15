// src/services/api.js
import axios from 'axios';

const rawBaseURL = process.env.REACT_APP_API_URL || 'https://internal.mpzdt.my.id';
const normalizedBaseURL = rawBaseURL.replace(/^http:\/\//i, 'https://').replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 300000, // Tambah timeout untuk upload file besar
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor untuk debugging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor untuk debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config?.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;
