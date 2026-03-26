import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { admin } = useAuth();

  return (
    <div className="navbar-container">
      <div className="nav-search">
        <Search size={18} color="#666" />
        <input type="text" placeholder="Quick search artisans or products..." />
      </div>

      <div className="nav-actions">
        <div className="status-badge">
          <ShieldCheck size={16} />
          <span>Secure Admin Access</span>
        </div>

        <button className="nav-icon-btn">
          <Bell size={22} />
          <span className="notif-dot"></span>
        </button>

        <div className="admin-brief">
          <div className="admin-avatar">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="admin-info">
            <span>{admin?.name || 'Handora Admin'}</span>
            <span className="admin-role">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
