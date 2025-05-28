import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav data-testid="navbar" className="bg-white shadow-md mb-4">
      <div className="w-full mx-auto px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="md:text-2xl font-bold text-primary-dark cursor-pointer" data-testid="logo-link">
            COE App
          </Link>
          <div className="flex gap-4">
            <Link
              to="/tasks"
              data-testid="task-link"
              className="bg-primary-light hover:bg-primary-dark text-white font-semibold px-4 py-1.5 md:py-md-2 rounded-lg transition duration-300"
            >
              Task Manager
            </Link>
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="bg-danger-light hover:bg-danger-dark text-white font-semibold px-4 py-1.5 md:py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
