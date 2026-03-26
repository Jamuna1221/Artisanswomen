import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Shield, Calendar, Clock, MapPin, Edit3 } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { admin } = useAuth();

  return (
    <div className="page-container">
      <div className="profile-banner"></div>
      
      <div className="profile-wrapper">
        <div className="profile-card h-card">
          <div className="p-header">
            <div className="p-avatar-large">
              <span>{admin?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="p-main-info">
              <h2>{admin?.name}</h2>
              <p className="p-title">Platform Administrator</p>
            </div>
            <button className="h-btn h-btn-primary">
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>

          <div className="p-details-grid">
            <div className="p-det-item">
              <div className="p-det-icon"><Mail size={18} /></div>
              <div className="p-det-content">
                <label>Email Address</label>
                <p>{admin?.email}</p>
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Shield size={18} /></div>
              <div className="p-det-content">
                <label>Admin Role</label>
                <p>{admin?.role?.toUpperCase()}</p>
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Calendar size={18} /></div>
              <div className="p-det-content">
                <label>Member Since</label>
                <p>January 2026</p>
              </div>
            </div>
            <div className="p-det-item">
              <div className="p-det-icon"><Clock size={18} /></div>
              <div className="p-det-content">
                <label>Last Logged In</label>
                <p>March 26, 2026 - 1:45 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-card p-activity">
          <h3>Recent Session Activity</h3>
          <div className="activity-timeline">
            <div className="time-item">
              <div className="time-dot"></div>
              <div className="time-line"></div>
              <div className="time-text">
                <p>LoggedIn from Chrome on Windows</p>
                <span>Today, 2:30 PM</span>
              </div>
            </div>
            <div className="time-item">
              <div className="time-dot"></div>
              <div className="time-text">
                <p>Password changed successfully</p>
                <span>March 15, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
