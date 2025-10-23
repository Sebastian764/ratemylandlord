
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const Header: React.FC = () => {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
          RateMyLandlord <span className="text-sm font-normal text-gray-500">PGH</span>
        </Link>
        <nav>
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
            >
              Admin Logout
            </button>
          ) : (
            <Link to="/admin" className="text-gray-600 hover:text-blue-600 transition">
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
