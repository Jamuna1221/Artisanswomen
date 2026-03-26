import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './seller.css';

export default function SellerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dash-root">
      
      {/* Topbar */}
      <header className="dash-topbar">
        <div className="dash-logo-wrap">
          <div className="dash-logo-icon">🧵</div>
          <div>
            <div className="dash-logo-name">MarketLink</div>
            <div className="dash-logo-label">Seller Dashboard</div>
          </div>
        </div>
        
        <div className="dash-user-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="dash-avatar">👤</div>
            <div>
              <div className="dash-user-name">{user?.name}</div>
              <div className="dash-user-status">✓ Approved Seller</div>
            </div>
          </div>
          <button onClick={logout} className="dash-logout-btn">
            Logout <span>→</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dash-main">
        
        {/* Welcome Banner */}
        <div className="dash-welcome-banner">
          <div className="dash-welcome-bg-emoji">🧵</div>
          <div className="dash-welcome-greeting">Welcome back,</div>
          <h2 className="dash-welcome-name">{user?.name} 🎉</h2>
          <p className="dash-welcome-desc">
            Your artisan account is active. Start adding products and connect with buyers across India!
          </p>
          <div className="dash-welcome-badge">
            <span className="dash-badge-dot" /> Account Approved & Active
          </div>
        </div>

        {/* Stats Row */}
        <div className="dash-stats">
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: '#fdf4f2', color: 'var(--clay)' }}>📦</div>
            <div>
              <div className="dash-stat-value">0</div>
              <div className="dash-stat-label">Products Listed</div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: '#f0fdf4', color: '#166534' }}>🛍</div>
            <div>
              <div className="dash-stat-value">0</div>
              <div className="dash-stat-label">Total Orders</div>
            </div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: '#fffbeb', color: '#b45309' }}>⭐</div>
            <div>
              <div className="dash-stat-value">—</div>
              <div className="dash-stat-label">Avg. Rating</div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="dash-coming-soon">
          <div className="dash-coming-emoji">🚀</div>
          <h3 className="dash-coming-title">Full Dashboard Coming Soon</h3>
          <p className="dash-coming-desc">
            Product listing, order management, earnings, and more features are currently being built. Stay tuned!
          </p>
          <Link to="/" className="dash-browse-link">
            Browse Marketplace →
          </Link>
        </div>
        
      </main>
    </div>
  );
}
