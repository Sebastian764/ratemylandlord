
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-none tracking-tight group-hover:text-blue-600 transition-colors">
              RateMyLandlord
            </span>
            <span className="text-xs font-medium text-gray-500 tracking-widest uppercase">Pittsburgh</span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors"
                >
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
                  Admin Portal
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</span>
                  <span className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Member'}</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-2 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
