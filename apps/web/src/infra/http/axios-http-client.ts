import axios from 'axios';

export const makeAxiosHttpClient = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
}