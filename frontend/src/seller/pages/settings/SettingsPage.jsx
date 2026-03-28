import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Bell, Lock, Store, HelpCircle } from 'lucide-react';
import api from '../../services/axios';
import './SettingsPage.css';

const TABS = [
  { id: 'store', label: 'Store Profile', icon: <Store size={16} /> },
  { id: 'account', label: 'Account', icon: <User size={16} /> },
  { id: 'notifs', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'security', label: 'Security', icon: <Lock size={16} /> },
  { id: 'support', label: 'Help & Support', icon: <HelpCircle size={16} /> },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Store Profile State
  const [storeProfile, setStoreProfile] = useState({ storeName: '', craftType: '', artisanStory: '' });
  const [bannerUrl, setBannerUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Account State
  const [account, setAccount] = useState({ fullName: '', email: '', phone: '', language: 'English', paymentDetails: '' });

  // Notifications State
  const [notifSettings, setNotifSettings] = useState({
    newOrderAlerts: true, paymentUpdates: true, newMessages: true, lowStockAlerts: true, newReviews: false,
  });

  // Security State
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Support State
  const [support, setSupport] = useState({ subject: '', category: 'General', message: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/settings');
      const data = res.data;
      if (data.storeProfile) {
        setStoreProfile({
          storeName: data.storeProfile.storeName || '',
          craftType: data.storeProfile.craftType || '',
          artisanStory: data.storeProfile.artisanStory || ''
        });
        if (data.storeProfile.bannerUrl) setBannerUrl(data.storeProfile.bannerUrl);
        if (data.storeProfile.logoUrl) setLogoUrl(data.storeProfile.logoUrl);
      }
      if (data.account) {
        setAccount({
          fullName: data.account.fullName || '',
          email: data.account.email || '',
          phone: data.account.phone || '',
          language: data.account.language || 'English',
          paymentDetails: data.account.paymentDetails || ''
        });
      }
      if (data.notifications) {
        setNotifSettings(data.notifications);
      }
    } catch (err) {
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStoreProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('storeName', storeProfile.storeName);
      formData.append('craftType', storeProfile.craftType);
      formData.append('artisanStory', storeProfile.artisanStory);
      if (bannerInputRef.current?.files[0]) formData.append('banner', bannerInputRef.current.files[0]);
      if (logoInputRef.current?.files[0]) formData.append('logo', logoInputRef.current.files[0]);

      const res = await api.put('/seller/settings/store-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.settings?.storeProfile?.bannerUrl) setBannerUrl(res.data.settings.storeProfile.bannerUrl);
      if (res.data.settings?.storeProfile?.logoUrl) setLogoUrl(res.data.settings.storeProfile.logoUrl);
      showToast('Store profile saved successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save store profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    try {
      setSaving(true);
      await api.put('/seller/settings/account', account);
      showToast('Account updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update account', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotif = async (key) => {
    const newSettings = { ...notifSettings, [key]: !notifSettings[key] };
    setNotifSettings(newSettings);
    try {
      await api.put('/seller/settings/notifications', { notifications: newSettings });
    } catch (err) {
      setNotifSettings(notifSettings); // revert on error
      showToast('Failed to update notification preferences', 'error');
    }
  };

  const handleSaveSecurity = async () => {
    if (security.newPassword !== security.confirmPassword) {
      return showToast('New passwords do not match', 'error');
    }
    try {
      setSaving(true);
      await api.put('/seller/settings/change-password', {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      });
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitSupport = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/seller/settings/support-ticket', support);
      setSupport({ subject: '', category: 'General', message: '' });
      showToast('Support ticket submitted successfully. We will contact you soon!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit ticket', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePreview = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <div className="settings-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--teal)' }}>Loading Settings...</div>;
  }

  return (
    <div className="settings-page fade-in">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-sub">Manage your store profile, notifications, and account preferences</p>
      </div>

      <div className="settings-shell">
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
        </div>

        <div className="settings-content">
          {message.text && (
            <div className="settings-saved-msg" style={{ marginBottom: '1rem', color: message.type === 'error' ? 'var(--coral)' : 'var(--teal)' }}>
              {message.type === 'error' ? '❌' : '✅'} {message.text}
            </div>
          )}

          {/* ── Store Profile ── */}
          {activeTab === 'store' && (
            <div className="settings-section">
              <h3 className="settings-section-title">🏪 Store Profile</h3>
              <p className="settings-section-sub">Customise your artisan store identity</p>

              <div
                className="settings-banner-upload"
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' } : {}}
                onClick={() => bannerInputRef.current?.click()}
              >
                {!bannerUrl && (
                  <div className="settings-banner-placeholder">
                    <span>📷</span>
                    <p>Upload Store Banner</p>
                    <small>Recommended: 1200×300px</small>
                  </div>
                )}
                <input type="file" hidden ref={bannerInputRef} onChange={(e) => handleImagePreview(e, setBannerUrl)} accept="image/*" />
              </div>

              <div className="settings-logo-row">
                <div
                  className="settings-logo-circle"
                  style={logoUrl ? { backgroundImage: `url(${logoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
                >
                  {!logoUrl && '🧵'}
                </div>
                <button className="settings-logo-change-btn" onClick={() => logoInputRef.current?.click()}>
                  Change Logo
                </button>
                <input type="file" hidden ref={logoInputRef} onChange={(e) => handleImagePreview(e, setLogoUrl)} accept="image/*" />
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Store Name</label>
                  <input type="text" value={storeProfile.storeName} onChange={(e) => setStoreProfile({ ...storeProfile, storeName: e.target.value })} placeholder="Your store name" />
                </div>
                <div className="settings-field">
                  <label>Craft Type / Specialty</label>
                  <select value={storeProfile.craftType} onChange={(e) => setStoreProfile({ ...storeProfile, craftType: e.target.value })}>
                    <option value="">Select Craft Type</option>
                    <option value="Weaving">Weaving</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Block Printing">Block Printing</option>
                    <option value="Bamboo Craft">Bamboo Craft</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="settings-field settings-field--full">
                  <label>Artisan Story ❤️</label>
                  <textarea
                    rows={4}
                    value={storeProfile.artisanStory} onChange={(e) => setStoreProfile({ ...storeProfile, artisanStory: e.target.value })}
                    placeholder="Tell your story — buyers love knowing the artisan behind the craft!"
                  />
                </div>
              </div>

              <div className="settings-actions" style={{ marginTop: '2rem' }}>
                <button className="settings-save-btn" onClick={handleSaveStoreProfile} disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={16} /> Save Store Profile</>}
                </button>
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
                  <input type="text" value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} />
                </div>
                <div className="settings-field">
                  <label>Email</label>
                  <input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
                </div>
                <div className="settings-field">
                  <label>Phone Number</label>
                  <input type="tel" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} />
                </div>
                <div className="settings-field">
                  <label>Language Preference</label>
                  <select value={account.language} onChange={(e) => setAccount({ ...account, language: e.target.value })}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>
                <div className="settings-field settings-field--full">
                  <label>UPI / Bank Account for Payments</label>
                  <input type="text" value={account.paymentDetails} onChange={(e) => setAccount({ ...account, paymentDetails: e.target.value })} placeholder="UPI ID or Bank Account number" />
                </div>
              </div>

              <div className="settings-actions" style={{ marginTop: '2rem' }}>
                <button className="settings-save-btn" onClick={handleSaveAccount} disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={16} /> Save Account</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifs' && (
            <div className="settings-section">
              <h3 className="settings-section-title">🔔 Notification Preferences</h3>
              <p className="settings-section-sub">Choose what notifications you want to receive. Changes auto-save.</p>
              <div className="settings-notif-list">
                {[
                  { key: 'newOrderAlerts', label: 'New Order Alerts', desc: 'Get notified when a buyer places an order' },
                  { key: 'paymentUpdates', label: 'Payment Updates', desc: 'Notifications for payments & withdrawals' },
                  { key: 'newMessages', label: 'New Messages', desc: 'When a buyer sends you a message' },
                  { key: 'lowStockAlerts', label: 'Low Stock Alerts 🚨', desc: 'When product stock falls below 3 units' },
                  { key: 'newReviews', label: 'New Reviews', desc: 'When a customer leaves a review' },
                ].map(n => (
                  <div className="settings-notif-row" key={n.key}>
                    <div>
                      <div className="settings-notif-label">{n.label}</div>
                      <div className="settings-notif-desc">{n.desc}</div>
                    </div>
                    <button
                      className={`settings-toggle ${notifSettings[n.key] ? 'settings-toggle--on' : ''}`}
                      onClick={() => handleToggleNotif(n.key)}
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
                  <input type="password" value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} placeholder="Enter current password" />
                </div>
                <div className="settings-field">
                  <label>New Password</label>
                  <input type="password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} placeholder="New password" />
                </div>
                <div className="settings-field">
                  <label>Confirm New Password</label>
                  <input type="password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} placeholder="Repeat new password" />
                </div>
              </div>
              <div className="settings-security-note" style={{ marginTop: '1rem' }}>
                🛡️ For your safety, use a password of at least 8 characters with numbers and symbols.
              </div>

              <div className="settings-actions" style={{ marginTop: '2rem' }}>
                <button className="settings-save-btn" onClick={handleSaveSecurity} disabled={saving || !security.currentPassword || !security.newPassword}>
                  {saving ? 'Verifying...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

          {/* ── Help & Support ── */}
          {activeTab === 'support' && (
            <div className="settings-section">
              <h3 className="settings-section-title">💬 Help & Support</h3>
              <p className="settings-section-sub">Need assistance? Contact our team directly.</p>

              <div className="settings-security-note" style={{ marginBottom: '1.5rem', background: 'var(--cream)' }}>
                <strong>Contact Info:</strong> artisanswomen@gmail.com | +91 800 123 4567 (Mon-Sat, 9AM-6PM)
              </div>

              <form onSubmit={handleSubmitSupport} className="settings-form-grid">
                <div className="settings-field">
                  <label>Subject</label>
                  <input required type="text" value={support.subject} onChange={(e) => setSupport({ ...support, subject: e.target.value })} placeholder="Brief title of your issue" />
                </div>
                <div className="settings-field">
                  <label>Category</label>
                  <select required value={support.category} onChange={(e) => setSupport({ ...support, category: e.target.value })}>
                    <option value="General">General Inquiry</option>
                    <option value="Payments">Payments & Settlements</option>
                    <option value="Orders">Order Management</option>
                    <option value="Technical">Technical Issue</option>
                    <option value="Account">Account Help</option>
                  </select>
                </div>
                <div className="settings-field settings-field--full">
                  <label>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={support.message} onChange={(e) => setSupport({ ...support, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <div className="settings-actions settings-field--full" style={{ marginTop: '1rem', justifyContent: 'flex-start' }}>
                  <button type="submit" className="settings-save-btn" disabled={saving}>
                    {saving ? 'Submitting...' : 'Submit Support Request'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
