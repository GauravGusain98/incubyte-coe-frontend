import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-sm md:text-2xl font-bold text-primary-dark cursor-pointer">COE App</Link>
          <div className="flex gap-4">
            <Link to="/tasks" className="bg-primary-light hover:bg-primary-dark text-white text-xs md:text-base font-semibold px-4 py-1.5 md:py-md-2 rounded-lg transition duration-300">Task Manager</Link>
            <button
              onClick={handleLogout}
              className="bg-danger-light hover:bg-danger-dark text-white font-semibold text-xs md:text-base px-4 py-1.5 md:py-2 rounded-lg transition duration-300"
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
