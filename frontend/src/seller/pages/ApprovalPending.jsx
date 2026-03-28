import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import { useAuth } from '../context/AuthContext';
import './seller.css';

const statusConfig = {
  Pending: {
    icon: '⏳',
    title: 'Application Under Review',
    pillClass: 'pending',
    message: 'Your application has been submitted successfully. Our team will review it and notify you by email.',
    sub: 'You can access your seller dashboard only after admin approval.',
  },
  Approved: {
    icon: '🎉',
    title: 'Application Approved!',
    pillClass: 'approved',
    message: 'Congratulations! Your artisan account has been approved. You now have full access to your Seller Dashboard.',
    sub: null,
  },
  Rejected: {
    icon: '❌',
    title: 'Application Rejected',
    pillClass: 'rejected',
    message: 'Unfortunately, your application was not approved at this time. Please review the reason below and re-apply with updated documents.',
    sub: null,
  },
};

export default function ApprovalPending() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [status, setStatus] = useState(user?.verificationStatus || 'Pending');
  const [userData, setUserData] = useState(user || {});
  const [rejectionReason, setRejectionReason] = useState('');
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchStatus = async () => {
    setChecking(true);
    try {
      const res = await api.get('/auth/status');
      const { verificationStatus, name, email, rejectionReason: reason, createdAt } = res.data;
      setStatus(verificationStatus);
      setUserData({ name, email, verificationStatus, createdAt });
      setRejectionReason(reason || '');
      login(localStorage.getItem('authToken'), { name, email, verificationStatus });
      setLastChecked(new Date());
      if (verificationStatus === 'Approved') {
        setTimeout(() => navigate('/seller/dashboard'), 1500);
      }
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const cfg = statusConfig[status] || statusConfig.Pending;

  return (
      <div style={{
    minHeight: '100vh',
    background: 'var(--cream)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem'
  }}>

    <div className="seller-page" style={{ background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '520px', padding: '2rem 1rem' }}>

        <div className="seller-brand">
          <div className="seller-brand-icon">🧵</div>
          <h1 className="seller-brand-title">Handora</h1>
          <p className="seller-brand-sub">Hand Made Haven</p>
        </div>
      
        <div className="pending-card">
          <div className={`pending-banner ${cfg.pillClass}`}>
            <div className="pending-icon">{cfg.icon}</div>
            <h2 className={`pending-title ${cfg.pillClass}`}>{cfg.title}</h2>
            <span className={`pending-pill ${cfg.pillClass}`}>{status}</span>
          </div>

          <div className="pending-body">
            {userData.name && (
              <div className="pending-user-box">
                <div className="pending-user-name">{userData.name}</div>
                <div className="pending-user-email">{userData.email}</div>
                {userData.createdAt && (
                  <div className="pending-user-date">
                    Registered on {new Date(userData.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            )}

            <p className="pending-message">{cfg.message}</p>

            {cfg.sub && (
              <div className="pending-email-note">
                <span>📧</span> <span>{cfg.sub}</span>
              </div>
            )}

            {rejectionReason && (
              <div className="pending-rejection-box">
                <div className="pending-rejection-title">Reason for Rejection:</div>
                <div className="pending-rejection-reason">{rejectionReason}</div>
              </div>
            )}

            {status === 'Pending' && (
              <div className="pending-steps">
                {['Registration submitted', 'Admin review in progress', 'Email notification on approval', 'Seller dashboard unlocked'].map((step, i) => (
                  <div key={i} className="pending-step">
                    <div className={`pending-step-dot ${i === 0 ? 'done' : i === 1 ? 'current' : 'future'}`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className={`pending-step-text ${i === 0 ? 'done' : i === 1 ? 'current' : 'future'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pending-actions">
              {status === 'Approved' ? (
                <button onClick={() => navigate('/seller/dashboard')} className="seller-btn-primary">
                  Go to Seller Dashboard →
                </button>
              ) : status === 'Rejected' ? (
                <button onClick={() => { logout(); navigate('/seller/signup'); }} className="seller-btn-primary">
                  Re-apply / Register Again
                </button>
              ) : (
                <button onClick={fetchStatus} disabled={checking} className="seller-btn-outline">
                  {checking ? <><span className="spinner dark" /> Checking status…</> : '↻ Refresh Status'}
                </button>
              )}

              <button onClick={() => { logout(); navigate('/seller/login'); }} className="seller-btn-ghost">
                ← Logout
              </button>
            </div>

            {lastChecked && (
              <div className="pending-last-checked">
                Last checked: {lastChecked.toLocaleTimeString('en-IN')}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
