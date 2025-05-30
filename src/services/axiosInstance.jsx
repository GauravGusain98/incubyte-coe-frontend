import axios from 'axios';
import config from '../config';

const API_BASE = config.apiUrl;
const REFRESH_TOKEN_URL = config.refreshTokenUrl

const axiosBasicInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const excludedPaths = ['/user/login'];
    const isExcluded = excludedPaths.some(path =>
      originalRequest.url?.includes(path)
    );

    if (isExcluded) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const hasRetried = originalRequest._retry;

    if (isUnauthorized && !hasRetried) {
      originalRequest._retry = true;

      try {
        await axios.post(REFRESH_TOKEN_URL, null, {
          withCredentials: true,
        });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
