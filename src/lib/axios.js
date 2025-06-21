"use client";

import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and specifically for token/session issues
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        (error.response?.data?.message === 'Session expired' || 
         error.response?.data?.message === 'Session not found' ||
         error.response?.data?.message === 'Authorization header is required' ||
         error.response?.data?.message === 'Invalid token')) {
      
      originalRequest._retry = true;

      // Clear token and redirect to login
      Cookies.remove('token');
      window.location.href = '/auth/login';
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;