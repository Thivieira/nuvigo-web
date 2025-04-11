import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';

// API base URL from environment variable or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Create Axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data?.token) {
          // Update tokens in cookies
          setCookie('authToken', response.data.token);
          setCookie('refreshToken', response.data.refreshToken);

          // Update the Authorization header
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        // You could implement a redirect to login page here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 