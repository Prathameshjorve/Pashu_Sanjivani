import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const predictAPI = {
  predictAnimal: (formData: FormData) =>
    api.post('/predict-animal', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  predictDisease: (data: any) =>
    api.post('/predict-disease', data),
  getReports: () => api.get('/reports'),
};

export const chatAPI = {
  chat: (data: { message: string; history: any[]; language: string }) =>
    api.post('/chat', data),
};

export default api;
