import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { login as loginAPI, logout as logoutAPI } from '../services/authService';

export const useAuth = () => {
  const navigate = useNavigate();

  const login = useCallback(async (data) => {
    await loginAPI(data);
    navigate('/')
  }, [navigate]);

  const logout = useCallback(() => {
    logoutAPI();
    navigate('/login');
  }, [navigate]);

  return { login, logout };
};
