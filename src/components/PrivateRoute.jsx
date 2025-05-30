import { Navigate } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';

const PrivateRoute = ({ children }) => {
  const { loading, authenticated } = useAuthStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-600 text-lg font-medium animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;