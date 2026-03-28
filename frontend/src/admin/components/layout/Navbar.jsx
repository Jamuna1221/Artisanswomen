import React, { useState, useEffect } from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAdminNotifications } from '../../services/authService';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { admin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await getAdminNotifications();
        setUnreadCount(res.unreadCount);
        setNotifications(res.notifications || []);
      } catch (err) { }
    };
    fetchNotifs();
    // Refresh count every 2 minutes
    const interval = setInterval(fetchNotifs, 120000);
    return () => clearInterval(interval);
  }, []);

  const markNotifRead = async (id, e) => {
    e.stopPropagation();
    try {
      const api = (await import('../../services/api')).default;
      await api.patch(`/notifications/admin/${id}/read`, {}, { baseURL: 'http://localhost:5000/api' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { }
  };

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

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="nav-icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Bell size={22} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showDropdown && (
            <div className="notif-dropdown" style={{
              position: 'absolute', top: '100%', right: '0', width: '300px', background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 1000, marginTop: '10px',
              border: '1px solid #eee', overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Notifications</h4>
                <Link to="/admin/notifications" onClick={() => setShowDropdown(false)} style={{ fontSize: '0.8rem', color: '#10b981', textDecoration: 'none' }}>View All</Link>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#888', margin: 0 }}>No notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div key={n._id} onClick={() => setShowDropdown(false)} style={{
                      padding: '12px 15px', borderBottom: '1px solid #f5f5f5',
                      background: n.isRead ? '#fff' : '#f0fdf4', display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#333' }}>{n.title || n.type || "Alert"}</strong>
                        {!n.isRead && (
                          <span onClick={(e) => markNotifRead(n._id, e)} style={{ fontSize: '0.75rem', color: '#10b981', cursor: 'pointer' }}>Mark</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
