import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
};

// Team API
export const teamAPI = {
  getAll: () => api.get('/team'),
  getById: (id) => api.get(`/team/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/team', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/team', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/team/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/team/${id}`, data);
  },
  delete: (id) => api.delete(`/team/${id}`),
  toggleActive: (id) => api.patch(`/team/${id}/toggle-active`),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getAllAdmin: () => api.get('/events/admin'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/events', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/events/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/events/${id}`, data);
  },
  delete: (id) => api.delete(`/events/${id}`),
  register: (id, data) => api.post(`/events/${id}/register`, data),
};

// News API
export const newsAPI = {
  getAll: (params = {}) => api.get('/news', { params }),
  getAllAdmin: () => api.get('/news/admin'),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/news', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/news', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/news/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/news/${id}`, data);
  },
  delete: (id) => api.delete(`/news/${id}`),
  like: (id) => api.patch(`/news/${id}/like`),
};

// Forms API
export const formsAPI = {
  submit: (data) => api.post('/forms/submit', data),
  getAll: (params = {}) => api.get('/forms', { params }),
  getById: (id) => api.get(`/forms/${id}`),
  updateStatus: (id, data) => api.patch(`/forms/${id}/status`, data),
  respond: (id, message) => api.post(`/forms/${id}/respond`, { message }),
  delete: (id) => api.delete(`/forms/${id}`),
  getStats: () => api.get('/forms/stats/overview'),
};

export default api;
