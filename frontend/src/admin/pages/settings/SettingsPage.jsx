import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Globe, 
  Key, 
  Smartphone, 
  History,
  Check
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: <User size={18} /> },
    { id: 'security', name: 'Security & Auth', icon: <Shield size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'system', name: 'System Settings', icon: <History size={18} /> }
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
              {t.icon}
              <span>{t.name}</span>
            </button>
          ))}
        </aside>

        <main className="settings-content">
          <div className="h-card">
            {activeTab === 'profile' && (
              <div className="s-section">
                <h3>Account Information</h3>
                <div className="s-form">
                  <div className="s-grid">
                    <div className="h-field">
                      <label>Full Name</label>
                      <input type="text" className="h-input" defaultValue="Super Admin" />
                    </div>
                    <div className="h-field">
                      <label>Email Address</label>
                      <input type="email" className="h-input" defaultValue="admin@handora.com" disabled />
                    </div>
                  </div>
                  <div className="h-field">
                    <label>Admin Role</label>
                    <input type="text" className="h-input" defaultValue="Manager / Platform Owner" disabled />
                  </div>
                  <button className="h-btn h-btn-primary">Update Profile</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="s-section">
                <h3>Security Settings</h3>
                <div className="security-item">
                  <div className="s-icon-box"><Key size={20} /></div>
                  <div className="s-info">
                    <h4>Change Password</h4>
                    <p>Last updated 3 months ago</p>
                  </div>
                  <button className="h-btn">Update</button>
                </div>
                
                <div className="security-item">
                  <div className="s-icon-box"><Smartphone size={20} /></div>
                  <div className="s-info">
                    <h4>2-Step Verification</h4>
                    <p>Currently enabled (OTP via Email)</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>

                <div className="security-item">
                  <div className="s-icon-box"><History size={20} /></div>
                  <div className="s-info">
                    <h4>Recent Login Activity</h4>
                    <p>Check your login history and active sessions</p>
                  </div>
                  <button className="h-btn">View Log</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
