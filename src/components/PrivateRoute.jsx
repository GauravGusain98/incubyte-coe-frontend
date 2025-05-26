import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/user/me'); 
        setAuthenticated(true)
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-600 text-lg font-medium animate-pulse">Checking authentication...</div>
      </div>
    );
  }


  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
