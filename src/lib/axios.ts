import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true,
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authTokens = localStorage.getItem('auth_tokens');
    if (authTokens) {
      const { accessToken } = JSON.parse(authTokens);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const authTokens = localStorage.getItem('auth_tokens');
        if (!authTokens) {
          throw new Error('No auth tokens found');
        }

        const { refreshToken } = JSON.parse(authTokens);
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem(
          'auth_tokens',
          JSON.stringify({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear auth tokens and redirect to login
        localStorage.removeItem('auth_tokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add retry logic for network errors and 5xx responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retry -= 1;
    const delayRetry = new Promise((resolve) => {
      setTimeout(resolve, config.retryDelay || 1000);
    });

    await delayRetry;
    return axiosInstance(config);
  }
); 