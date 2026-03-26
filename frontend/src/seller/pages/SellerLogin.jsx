import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/axios';
import { useAuth } from '../context/AuthContext';
import './seller.css';

export default function SellerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const { token, name, email, verificationStatus } = res.data;
      login(token, { name, email, verificationStatus });
      navigate(verificationStatus === 'Approved' ? '/seller/dashboard' : '/seller/pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand */}
        <div className="seller-brand">
          <div className="seller-brand-icon">🧵</div>
          <h1 className="seller-brand-title">Artisan Login</h1>
          <p className="seller-brand-sub">MarketLink for Women Artisans</p>
        </div>

        {/* Card */}
        <div className="seller-card">
          <h2 className="seller-card-title">Welcome back! 👋</h2>
          <p className="seller-card-sub">Sign in to your seller account</p>

          {error && <div className="seller-alert error">⚠ {error}</div>}

          <form onSubmit={handleLogin}>
            <div className="seller-grid" style={{ gap: '1rem' }}>
              <div className="seller-field">
                <label className="seller-label">Email Address <span className="req">*</span></label>
                <div className="seller-input-wrap">
                  <span className="seller-input-icon">✉</span>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="seller-input has-icon"
                  />
                </div>
              </div>

              <div className="seller-field">
                <label className="seller-label">Password <span className="req">*</span></label>
                <div className="seller-input-wrap">
                  <span className="seller-input-icon">🔒</span>
                  <input
                    type="password" required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    className="seller-input has-icon"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="seller-btn-primary" style={{ marginTop: '1.25rem' }}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Login to Dashboard →'}
            </button>
          </form>

          <hr className="seller-divider" />

          <p className="seller-footer-text">
            Don't have an account? <Link to="/seller/signup">Sign up as Artisan</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
