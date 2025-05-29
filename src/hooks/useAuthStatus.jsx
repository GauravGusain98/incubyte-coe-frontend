import { useEffect, useState } from 'react';
import axiosBasicInstance from '../services/axiosInstance';

const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosBasicInstance.get('/user/me');
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { loading, authenticated };
};

export default useAuthStatus;
