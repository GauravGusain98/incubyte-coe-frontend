import axiosInstance from './axiosInstance';

export const login = async (data) => {
  await axiosInstance.post('/user/login', data);
};

export const register = async (data) => {
  return await axiosInstance.post('/user/register', data);
};

export const logout = async () => {
  await axiosInstance.post('/user/logout');
  window.location.href = '/login';
};