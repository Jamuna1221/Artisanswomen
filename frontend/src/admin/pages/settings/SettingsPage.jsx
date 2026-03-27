import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  updateAdminProfile, 
  getAdminActivity, 
  changeAdminPassword, 
  getAdminNotifications, 
  markNotificationAsRead, 
  markAllAdminNotificationsAsRead, 
  getPlatformSettings, 
  updatePlatformSettings 
} from '../../services/authService';
import { 
  User, 
  Shield, 
  Bell, 
  History, 
  Key, 
  Smartphone, 
  CheckCircle, 
  Globe, 
  Settings as SettingsIcon, 
  Edit3, 
  ArrowRight,
  ShieldCheck,
  Check,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const { admin, setAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sysSettings, setSysSettings] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profileData, setProfileData] = useState({ name: '', email: '' });

  // Load Data
  useEffect(() => {
    if (admin) setProfileData({ name: admin.name, email: admin.email });
    
    const loadSettings = async () => {
      try {
        const [activityRes, notifRes, sysRes] = await Promise.all([
          getAdminActivity(),
          getAdminNotifications(),
          getPlatformSettings()
        ]);
        setLogs(activityRes);
        setNotifications(notifRes.notifications);
        setUnreadCount(notifRes.unreadCount);
        setSysSettings(sysRes);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, [admin]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateAdminProfile(profileData);
      setAdmin(prev => ({ ...prev, ...data }));
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New passwords do not match!");
    }
    setLoading(true);
    try {
      await changeAdminPassword(passwordData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert("Password updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const handleSysUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updatePlatformSettings(sysSettings);
      setSysSettings(data);
      alert("System settings updated successfully!");
    } catch (err) {
      alert("System update failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: <User size={18} /> },
    { id: 'security', name: 'Security & Auth', icon: <Shield size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', name: 'System Settings', icon: <SettingsIcon size={18} /> }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Admin Settings</h2>
        <p>Manage your account, security, and application preferences</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav">
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`s-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <div className="tab-label-group">
                {t.icon}
                <span>{t.name}</span>
              </div>
              {t.id === 'notifications' && unreadCount > 0 && (
                <span className="tab-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </aside>

        <main className="settings-content">
          <div className="h-card">
            {activeTab === 'profile' && (
              <div className="s-section animate-fade-in">
                <h3>Account Information</h3>
                <form className="s-form" onSubmit={handleProfileUpdate}>
                  <div className="s-grid">
                    <div className="h-field">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        className="h-input" 
                        value={profileData.name} 
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="h-field">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        className="h-input" 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="h-field">
                    <label>Admin Role</label>
                    <input type="text" className="h-input" value={admin?.role?.toUpperCase()} disabled />
                  </div>
                  <button className="h-btn h-btn-primary" disabled={loading}>
                    {loading ? <Loader2 className="h-spin" size={18} /> : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="s-section animate-fade-in">
                <div className="s-sub-section">
                  <h3>Security Controls</h3>
                  <div className="security-item">
                    <div className="s-icon-box"><Key size={20} /></div>
                    <div className="s-info">
                      <h4>Account Password</h4>
                      <p>Ensure your account is protected with a strong, rotated password.</p>
                    </div>
                  </div>

                  <form className="s-pass-form" onSubmit={handlePasswordChange}>
                    <div className="h-field">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        className="h-input" 
                        value={passwordData.oldPassword}
                        onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
                        required
                      />
                    </div>
                    <div className="s-grid">
                      <div className="h-field">
                        <label>New Password</label>
                        <input 
                          type="password" 
                          className="h-input" 
                          value={passwordData.newPassword}
                          onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                          required
                        />
                      </div>
                      <div className="h-field">
                        <label>Confirm New Password</label>
                        <input 
                          type="password" 
                          className="h-input" 
                          value={passwordData.confirmPassword}
                          onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <button className="h-btn" disabled={loading}>Update Security Credentials</button>
                  </form>
                </div>

                <div className="s-divider"></div>

                <div className="s-sub-section">
                  <h3>Two-Step Verification</h3>
                  <div className="security-item">
                    <div className="s-icon-box blue"><Smartphone size={20} /></div>
                    <div className="s-info">
                      <h4>OTP Verification</h4>
                      <p>Secure login with one-time verification codes sent to {admin?.email}</p>
                    </div>
                    <div className="status-label verified">
                      <ShieldCheck size={14} /> Active
                    </div>
                  </div>
                </div>

                <div className="s-divider"></div>

                <div className="s-sub-section">
                  <h3>Recent Login Log</h3>
                  <div className="login-log-list">
                    {logs.filter(l => l.action.includes('Login')).slice(0, 5).map(log => (
                      <div key={log._id} className="log-row">
                        <div className="log-main">
                          <CheckCircle size={14} className="success-text" />
                          <span>{log.details}</span>
                        </div>
                        <span className="log-time">{formatDate(log.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="s-section animate-fade-in relative">
                <div className="s-header-action">
                  <h3>Real-time Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="h-btn-text" onClick={markAllRead}>Mark all as read</button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n._id} className={`n-item ${n.isRead ? 'read' : 'unread'}`}>
                        <div className={`n-type-dot ${n.type.toLowerCase()}`}></div>
                        <div className="n-content" onClick={() => !n.isRead && markRead(n._id)}>
                          <div className="n-top">
                            <span className="n-type">{n.type}</span>
                            <span className="n-time">{formatDate(n.timestamp)}</span>
                          </div>
                          <p>{n.message}</p>
                        </div>
                        {!n.isRead && <div className="unread-pulse"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <Bell size={40} className="muted-icon" />
                      <p>All caught up! No new notifications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="s-section animate-fade-in">
                <h3>Global Application Settings</h3>
                <form className="s-form" onSubmit={handleSysUpdate}>
                  <div className="s-grid">
                    <div className="h-field">
                      <label>Platform Name</label>
                      <input 
                        type="text" 
                        className="h-input" 
                        value={sysSettings.platformName || ''} 
                        onChange={e => setSysSettings({...sysSettings, platformName: e.target.value})}
                      />
                    </div>
                    <div className="h-field">
                      <label>Tagline</label>
                      <input 
                        type="text" 
                        className="h-input" 
                        value={sysSettings.tagline || ''}
                        onChange={e => setSysSettings({...sysSettings, tagline: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="s-grid">
                    <div className="h-field">
                      <label>Admin Support Email</label>
                      <input 
                        type="email" 
                        className="h-input" 
                        value={sysSettings.supportEmail || ''}
                        onChange={e => setSysSettings({...sysSettings, supportEmail: e.target.value})}
                      />
                    </div>
                    <div className="h-field">
                      <label>Session Duration (Minutes)</label>
                      <input 
                        type="number" 
                        className="h-input" 
                        value={sysSettings.sessionTimeout || 0}
                        onChange={e => setSysSettings({...sysSettings, sessionTimeout: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="s-divider"></div>

                  <div className="s-toggles">
                    <div className="s-toggle-item">
                      <div className="ti-info">
                        <strong>Maintenance Mode</strong>
                        <p>Disable frontend access during system technical updates</p>
                      </div>
                      <div 
                        className={`toggle-switch ${sysSettings.maintenanceMode ? 'active' : ''}`}
                        onClick={() => setSysSettings({...sysSettings, maintenanceMode: !sysSettings.maintenanceMode})}
                      ></div>
                    </div>

                    <div className="s-toggle-item">
                      <div className="ti-info">
                        <strong>Auto-Approve Sellers</strong>
                        <p>Allow artisans to join platform without manual admin review</p>
                      </div>
                      <div 
                        className={`toggle-switch ${sysSettings.autoApproval ? 'active' : ''}`}
                        onClick={() => setSysSettings({...sysSettings, autoApproval: !sysSettings.autoApproval})}
                      ></div>
                    </div>
                  </div>

                  <button className="h-btn h-btn-primary" disabled={loading}>
                     {loading ? <Loader2 className="h-spin" size={18} /> : 'Publish System Settings'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
