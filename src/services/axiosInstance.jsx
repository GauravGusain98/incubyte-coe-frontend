import axios from 'axios';
import config from '../config';

const API_BASE = config.apiUrl;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Needed to send cookies with requests
});

// Request Interceptor (no token manually added for cookie-based auth)
axiosInstance.interceptors.request.use(
  (config) => {
    // No Authorization header is set
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Attempt to refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh access token using cookie
        await axios.post(`${API_BASE}/user/token/refresh`, null, {
          withCredentials: true,
        });

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Redirect to login on failure
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
