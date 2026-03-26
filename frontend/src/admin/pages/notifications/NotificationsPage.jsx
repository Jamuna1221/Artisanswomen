import React, { useState } from 'react';
import { 
  Bell, 
  UserPlus, 
  AlertCircle, 
  ShoppingBag, 
  FileText, 
  MessageSquare,
  CheckCircle2,
  Clock
} from 'lucide-react';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  
  const notifications = [
    {
      id: 1,
      type: 'registration',
      title: 'New Seller Registered',
      message: 'Amrita K. has registered as an Embroidery Artisan.',
      time: '5 mins ago',
      isRead: false,
      icon: <UserPlus size={20} />
    },
    {
      id: 2,
      type: 'verification',
      title: 'Verification Request',
      message: 'New Pehchan Card uploaded by "Sunita Potters".',
      time: '2 hours ago',
      isRead: false,
      icon: <FileText size={20} />
    },
    {
      id: 3,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #HN562 for "Handwoven Silk Scarf" is pending.',
      time: '4 hours ago',
      isRead: true,
      icon: <ShoppingBag size={20} />
    },
    {
      id: 4,
      type: 'complaint',
      title: 'Customer Complaint',
      message: 'Buyer reported delayed shipping for Order #HN490.',
      time: 'Yesterday',
      isRead: true,
      icon: <AlertCircle size={20} />
    }
  ];

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.isRead);

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
        {filtered.map(n => (
          <div key={n.id} className={`n-item ${!n.isRead ? 'unread' : ''}`}>
            <div className={`n-icon-box ${n.type}`}>
              {n.icon}
            </div>
            <div className="n-content">
              <div className="n-row">
                <h3>{n.title}</h3>
                <span className="n-time"><Clock size={12} /> {n.time}</span>
              </div>
              <p>{n.message}</p>
            </div>
            {!n.isRead && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
