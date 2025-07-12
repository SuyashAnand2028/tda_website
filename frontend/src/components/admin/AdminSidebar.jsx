import React from 'react';
import { FaUsers, FaCalendarAlt, FaNewspaper, FaWpforms, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin' },
    { label: 'Team Management', icon: <FaUsers />, path: '/admin/team' },
    { label: 'Event Management', icon: <FaCalendarAlt />, path: '/admin/events' },
    { label: 'News Management', icon: <FaNewspaper />, path: '/admin/news' },
    { label: 'Forms Management', icon: <FaWpforms />, path: '/admin/forms' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="TDA Logo" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-cyan-400">TDA Admin</h2>
            <p className="text-sm text-gray-400">Management Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-700">
          <p className="text-sm text-gray-400">Welcome back,</p>
          <p className="font-medium text-white">{user.name}</p>
          <p className="text-xs text-cyan-400">{user.role}</p>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
              location.pathname === item.path
                ? 'bg-cyan-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
