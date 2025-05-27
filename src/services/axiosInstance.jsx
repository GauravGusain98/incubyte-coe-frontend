import axios from 'axios';
import config from '../config';

const API_BASE = config.apiUrl;
const REFRESH_TOKEN_URL = config.refreshTokenUrl

// Create a reusable Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Includes cookies in cross-site requests
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    const excludedPaths = ['/user/login', REFRESH_TOKEN_URL];
    const isExcluded = excludedPaths.some(path =>
      originalRequest.url?.includes(path)
    );

    if (isExcluded) {
      return Promise.reject(error); // Skip retry logic
    }

    // Handle 401 Unauthorized errors with refresh flow
    const isUnauthorized = error.response?.status === 401;
    const hasRetried = originalRequest._retry;

    if (isUnauthorized && !hasRetried) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axios.post(REFRESH_TOKEN_URL, null, {
          withCredentials: true,
        });

        // Retry the original request with new credentials
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed — redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
