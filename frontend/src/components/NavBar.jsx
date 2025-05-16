// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="text-xl font-bold">TaskBoard Pro</Link>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/projects" className="hover:underline">Projects</Link>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
