import React, { useState } from 'react';
import { Save, User, Bell, Lock, Store, Globe, HelpCircle } from 'lucide-react';
import './SettingsPage.css';

const TABS = [
  { id: 'store',    label: 'Store Profile', icon: <Store size={16} /> },
  { id: 'account',  label: 'Account',       icon: <User size={16} /> },
  { id: 'notifs',   label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'security', label: 'Security',      icon: <Lock size={16} /> },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newOrder: true, payment: true, message: true, lowStock: true, review: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="settings-page fade-in">

      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-sub">Manage your store profile, notifications, and account preferences</p>
      </div>

      <div className="settings-shell">
        {/* Sidebar tabs */}
        <div className="settings-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`settings-tab ${activeTab === t.id ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <a
            href="mailto:support@handora.in"
            className="settings-tab settings-tab--help"
          >
            <HelpCircle size={16} /> Help & Support
          </a>
        </div>

        {/* Content */}
        <div className="settings-content">

          {/* ── Store Profile ── */}
          {activeTab === 'store' && (
            <div className="settings-section">
              <h3 className="settings-section-title">🏪 Store Profile</h3>
              <p className="settings-section-sub">Customise your artisan store identity</p>

              {/* Banner upload */}
              <div className="settings-banner-upload">
                <div className="settings-banner-placeholder">
                  <span>📷</span>
                  <p>Upload Store Banner</p>
                  <small>Recommended: 1200×300px</small>
                </div>
              </div>

              {/* Logo + name row */}
              <div className="settings-logo-row">
                <div className="settings-logo-circle">🧵</div>
                <button className="settings-logo-change-btn">Change Logo</button>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Store Name</label>
                  <input type="text" defaultValue="Lakshmi's Handcrafts" placeholder="Your store name" />
                </div>
                <div className="settings-field">
                  <label>Craft Type / Specialty</label>
                  <select defaultValue="Weaving">
                    <option>Weaving</option>
                    <option>Pottery</option>
                    <option>Jewellery</option>
                    <option>Block Printing</option>
                    <option>Bamboo Craft</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="settings-field settings-field--full">
                  <label>Artisan Story ❤️</label>
                  <textarea
                    rows={4}
                    defaultValue="I am a traditional weaver from Karnataka, carrying forward a 3-generation craft tradition. Each piece I create tells the story of my village."
                    placeholder="Tell your story — buyers love knowing the artisan behind the craft!"
                  />
                </div>
                <div className="settings-field">
                  <label>Village / City</label>
                  <input type="text" defaultValue="Channapatna, Karnataka" />
                </div>
                <div className="settings-field">
                  <label>State</label>
                  <select defaultValue="Karnataka">
                    <option>Tamil Nadu</option>
                    <option>Karnataka</option>
                    <option>Rajasthan</option>
                    <option>West Bengal</option>
                    <option>Gujarat</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Account ── */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h3 className="settings-section-title">👤 Account Settings</h3>
              <p className="settings-section-sub">Update your personal information and contact details</p>
              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input type="text" defaultValue="Lakshmi Devi" />
                </div>
                <div className="settings-field">
                  <label>Email</label>
                  <input type="email" defaultValue="lakshmi@example.com" />
                </div>
                <div className="settings-field">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" />
                </div>
                <div className="settings-field">
                  <label>Language Preference</label>
                  <select>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                    <option>Kannada</option>
                  </select>
                </div>
                <div className="settings-field settings-field--full">
                  <label>UPI / Bank Account for Payments</label>
                  <input type="text" defaultValue="lakshmi@upi" placeholder="UPI ID or Bank Account number" />
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifs' && (
            <div className="settings-section">
              <h3 className="settings-section-title">🔔 Notification Preferences</h3>
              <p className="settings-section-sub">Choose what notifications you want to receive</p>
              <div className="settings-notif-list">
                {[
                  { key: 'newOrder',  label: 'New Order Alerts',       desc: 'Get notified when a buyer places an order' },
                  { key: 'payment',   label: 'Payment Updates',         desc: 'Notifications for payments & withdrawals' },
                  { key: 'message',   label: 'New Messages',            desc: 'When a buyer sends you a message' },
                  { key: 'lowStock',  label: 'Low Stock Alerts 🚨',     desc: 'When product stock falls below 3 units' },
                  { key: 'review',    label: 'New Reviews',             desc: 'When a customer leaves a review' },
                ].map(n => (
                  <div className="settings-notif-row" key={n.key}>
                    <div>
                      <div className="settings-notif-label">{n.label}</div>
                      <div className="settings-notif-desc">{n.desc}</div>
                    </div>
                    <button
                      className={`settings-toggle ${notifSettings[n.key] ? 'settings-toggle--on' : ''}`}
                      onClick={() => setNotifSettings(s => ({ ...s, [n.key]: !s[n.key] }))}
                      aria-label={n.label}
                    >
                      <span className="settings-toggle-knob" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h3 className="settings-section-title">🔒 Security Settings</h3>
              <p className="settings-section-sub">Manage your password and account security</p>
              <div className="settings-form-grid">
                <div className="settings-field settings-field--full">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="settings-field">
                  <label>New Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <div className="settings-field">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Repeat new password" />
                </div>
              </div>
              <div className="settings-security-note">
                🛡️ For your safety, use a password of at least 8 characters with numbers and symbols.
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="settings-actions">
            {saved && <span className="settings-saved-msg">✅ Changes saved successfully!</span>}
            <button className="settings-save-btn" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
