import React, { useState, useEffect } from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAdminNotifications } from '../../services/authService';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { admin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { unreadCount } = await getAdminNotifications();
        setUnreadCount(unreadCount);
      } catch (err) {}
    };
    fetchNotifs();
    // Refresh count every 2 minutes
    const interval = setInterval(fetchNotifs, 120000);
    return () => clearInterval(interval);
  }, []);

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

        <Link to="/admin/notifications" className="nav-icon-btn">
          <Bell size={22} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </Link>

        <div className="admin-brief">
          <div className="admin-avatar">
            {admin?.profileImage ? (
              <img src={admin.profileImage} alt="Profile" className="nav-avatar-img" />
            ) : (
              admin?.name?.charAt(0) || 'A'
            )}
          </div>
          <div className="admin-info">
            <span>{admin?.name || 'Handora Admin'}</span>
            <span className="admin-role">{admin?.role?.toUpperCase() || 'SUPER ADMIN'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
