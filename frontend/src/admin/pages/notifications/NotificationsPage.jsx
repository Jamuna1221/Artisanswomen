import React, { useState, useEffect } from 'react';
import {
  Bell, UserPlus, AlertCircle, ShoppingBag, FileText, CheckCircle2, Clock
} from 'lucide-react';
import api from '../../services/api';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // We override baseURL to hit the global api router
      const res = await api.get('/notifications/admin/all', { baseURL: 'http://localhost:5000/api' });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/admin/${id}/read`, {}, { baseURL: 'http://localhost:5000/api' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getIcon = (type) => {
    const lower = (type || '').toLowerCase();
    if (lower.includes('seller') || lower.includes('registration')) return <UserPlus size={20} />;
    if (lower.includes('verification') || lower.includes('document')) return <FileText size={20} />;
    if (lower.includes('order')) return <ShoppingBag size={20} />;
    if (lower.includes('complaint')) return <AlertCircle size={20} />;
    return <Bell size={20} />;
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.isRead);

  // Time formatter
  const timeAgo = (date) => {
    const min = Math.floor((new Date() - new Date(date)) / 60000);
    if (min < 60) return `${min} mins ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  };

  return (
    <div className="page-container">
      <div className="page-header n-header">
        <div>
          <h2>Notifications</h2>
          <p>Stay updated with Handora marketplace activity</p>
        </div>
        <div className="n-tabs">
          <button className={`n-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`n-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread</button>
        </div>
      </div>

      <div className="h-card notification-list">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No notifications found.</div>
        ) : (
          filtered.map(n => (
            <div key={n._id} className={`n-item ${!n.isRead ? 'unread' : ''}`} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                <div className={`n-icon-box ${n.type ? n.type.toLowerCase() : 'info'}`}>
                  {getIcon(n.title || n.type)}
                </div>
                <div className="n-content" style={{ flex: 1 }}>
                  <div className="n-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{n.title || n.type || "Notification"}</h3>
                    <span className="n-time" style={{ fontSize: '0.85rem', color: '#888', display: 'flex', alignItems: 'center' }}><Clock size={12} style={{ marginRight: '4px' }} /> {timeAgo(n.createdAt)}</span>
                  </div>
                  <p style={{ margin: 0, color: '#555', lineHeight: '1.4' }}>{n.message}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                {!n.isRead && <div className="unread-dot" style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%' }}></div>}
                {!n.isRead && (
                  <button onClick={() => markAsRead(n._id)} className="btn-link" style={{ fontSize: '0.85rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
