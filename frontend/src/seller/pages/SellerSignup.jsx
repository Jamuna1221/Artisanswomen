import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/axios';
import './seller.css';

export default function SellerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', form);
      setSuccess(`OTP sent to ${form.email}. Check your inbox!`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp });
      localStorage.setItem('tempToken', res.data.tempToken);
      localStorage.setItem('pendingName', res.data.name);
      localStorage.setItem('pendingEmail', res.data.email);
      navigate('/seller/register');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
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
          <h1 className="seller-brand-title">MarketLink</h1>
          <p className="seller-brand-sub">for Women Artisans</p>
        </div>

        {/* Card */}
        <div className="seller-card">
          {/* Step bar */}
          <div className="seller-steps">
            <div className={`seller-step-dot ${step >= 1 ? 'active' : 'inactive'}`}>1</div>
            <div className={`seller-step-line ${step >= 2 ? 'active' : 'inactive'}`} />
            <div className={`seller-step-dot ${step >= 2 ? 'active' : 'inactive'}`}>2</div>
          </div>

          <h2 className="seller-card-title">
            {step === 1 ? 'Create Artisan Account' : 'Verify Your Email'}
          </h2>
          <p className="seller-card-sub">
            {step === 1
              ? 'Enter your name and email to get started'
              : `Enter the 6-digit OTP sent to ${form.email}`}
          </p>

          {error && <div className="seller-alert error">⚠ {error}</div>}
          {success && <div className="seller-alert success">✓ {success}</div>}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="seller-grid">
                <div className="seller-field">
                  <label className="seller-label">Full Name <span className="req">*</span></label>
                  <div className="seller-input-wrap">
                    <span className="seller-input-icon">👤</span>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Lakshmi Devi"
                      className="seller-input has-icon"
                    />
                  </div>
                </div>
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
              </div>
              <button type="submit" disabled={loading} className="seller-btn-primary" style={{ marginTop: '1.25rem' }}>
                {loading ? <><span className="spinner" /> Sending…</> : '✉ Send OTP →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="seller-field">
                <label className="seller-label">OTP Code <span className="req">*</span></label>
                <input
                  type="text" required maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="seller-input otp"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="seller-btn-primary"
                style={{ marginTop: '1.25rem' }}
              >
                {loading ? <><span className="spinner" /> Verifying…</> : 'Verify & Continue →'}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(''); }}
                className="seller-btn-ghost"
                style={{ marginTop: '0.5rem' }}
              >
                ← Change email / name
              </button>
            </form>
          )}

          <p className="seller-footer-text">
            Already have an account? <Link to="/seller/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
