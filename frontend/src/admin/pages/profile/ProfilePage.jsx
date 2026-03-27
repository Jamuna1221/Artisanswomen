import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminActivity, updateAdminProfile } from '../../services/authService';
import { Mail, Shield, Calendar, Clock, Edit3, Loader2, CheckCircle, Smartphone, Globe, ShieldAlert } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { admin, setAdmin } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getAdminActivity();
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
    if (admin) {
      setFormData({ name: admin.name, email: admin.email });
    }
  }, [admin]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updated = await updateAdminProfile(formData);
      // Update local context manually
      setAdmin(prev => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (err) {
      alert("Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (action) => {
    if (action.includes('Login')) return <Globe size={14} />;
    if (action.includes('Update')) return <Edit3 size={14} />;
    return <CheckCircle size={14} />;
  };

  if (loading && !admin) {
    return (
      <div className="p-loading-state">
        <Loader2 className="h-spin" size={40} />
        <p>Loading Admin Profile...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-banner"></div>
      
      <div className="profile-wrapper">
        <div className="profile-card h-card">
          <div className="p-header">
            <div className="p-avatar-large">
              {admin?.profileImage ? (
                <img src={admin.profileImage} alt="Profile" />
              ) : (
                <span>{admin?.name?.charAt(0) || 'A'}</span>
              )}
            </div>
            <div className="p-main-info">
              {isEditing ? (
                <div className="edit-form-mini">
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Admin Name"
                  />
                </div>
              ) : (
                <h2>{admin?.name || 'Super Admin'}</h2>
              )}
              <p className="p-title">Platform Administrator</p>
            </div>
            {isEditing ? (
              <div className="edit-actions">
                <button className="h-btn-text" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="h-btn h-btn-primary" onClick={handleUpdate} disabled={updateLoading}>
                  {updateLoading ? <Loader2 className="h-spin" size={16} /> : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button className="h-btn h-btn-primary" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
          </div>

          <div className="p-details-grid">
            <div className="p-det-item">
              <div className="p-det-icon"><Mail size={18} /></div>
              <div className="p-det-content">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                ) : (
                  <p>{admin?.email}</p>
                )}
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Shield size={18} /></div>
              <div className="p-det-content">
                <label>Admin Role</label>
                <p>{admin?.role?.toUpperCase() || 'ADMIN'}</p>
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Calendar size={18} /></div>
              <div className="p-det-content">
                <label>Member Since</label>
                <p>{formatDate(admin?.createdAt)}</p>
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Clock size={18} /></div>
              <div className="p-det-content">
                <label>Last Logged In</label>
                <p>{formatDateTime(admin?.lastLogin)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-card p-activity">
          <div className="p-sec-header">
            <h3>Recent Session Activity</h3>
            {loading && <Loader2 className="h-spin" size={16} />}
          </div>
          
          <div className="activity-timeline">
            {activities.length > 0 ? (
              activities.map((log) => (
                <div key={log._id} className="time-item">
                  <div className="time-dot">{getActivityIcon(log.action)}</div>
                  <div className="time-line"></div>
                  <div className="time-text">
                    <p>{log.details || log.action}</p>
                    <span>{formatDateTime(log.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activity">
                <p>No recent activity recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
