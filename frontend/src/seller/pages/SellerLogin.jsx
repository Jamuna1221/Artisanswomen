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
      const { token, _id, name, email, verificationStatus } = res.data;
      login(token, { _id, name, email, verificationStatus });
      navigate(verificationStatus === 'Approved' ? '/seller/dashboard' : '/seller/pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-page">
      {/* ── Left decorative panel ── */}
      <div className="seller-panel-left">
        <div className="seller-panel-bg" />
        <div className="seller-panel-overlay" />
        <div className="seller-panel-content">
          <div className="seller-panel-logo">
            <div className="seller-panel-logo-mark">🧵</div>
            <div className="seller-panel-logo-text">
              <div className="seller-panel-logo-name">Handora</div>
              <div className="seller-panel-logo-sub">Hand Made Haven</div>
            </div>
          </div>

          <div className="seller-panel-mid">
            <div>
              <h1 className="seller-panel-headline">
                Crafting<br />
                <em>Tomorrow's</em><br />
                Traditions
              </h1>
              <p className="seller-panel-caption">
                Managing the world's most talented women artisans with precision and care.
              </p>
            </div>
          </div>

          <div className="seller-panel-badge">
            <span className="seller-panel-badge-dot" />
            Exclusively for Handora
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="seller-panel-right">
        <div className="seller-brand">
          <div className="seller-brand-icon">🧵</div>
          <h1 className="seller-brand-title">Handora</h1>
          <p className="seller-brand-sub">Hand Made Haven</p>
        </div>

        <div className="seller-card">
          <div className="seller-card-eyebrow">Seller Portal</div>
          <h2 className="seller-card-title">Welcome back</h2>
          <p className="seller-card-sub">Sign in to your artisan seller account</p>

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

            <button type="submit" disabled={loading} className="seller-btn-primary" style={{ marginTop: '1.5rem' }}>
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
