import axios from 'react';
import axiosLib from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axiosLib.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('superAdminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
