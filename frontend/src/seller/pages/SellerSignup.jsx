import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/axios';
import './seller.css';

export default function SellerSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const otpRefs = useRef([]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', form);
      setSuccess(`OTP sent to ${form.email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const otpString = otp.join('');
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp: otpString });
      localStorage.setItem('tempToken', res.data.tempToken);
      localStorage.setItem('pendingName', res.data.name);
      localStorage.setItem('pendingEmail', res.data.email);
      navigate('/seller/register');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otp.every(d => d !== '');

  return (
    <div className="seller-page">
      {/* Left panel */}
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
                Begin Your<br />
                <em>Artisan</em><br />
                Journey
              </h1>
              <p className="seller-panel-caption">
                Join thousands of talented women artisans selling their handcrafted work on Handora.
              </p>
            </div>
          </div>

          <div className="seller-panel-badge">
            <span className="seller-panel-badge-dot" />
            Exclusively for Handora
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="seller-panel-right">
        <div className="seller-brand">
          <div className="seller-brand-icon">🧵</div>
          <h1 className="seller-brand-title">Handora</h1>
          <p className="seller-brand-sub">Hand Made Haven</p>
        </div>

        <div className="seller-card">
          {/* Step bar */}
          <div className="seller-steps">
            <div className={`seller-step-dot ${step >= 1 ? 'active' : 'inactive'}`}>1</div>
            <div className={`seller-step-line ${step >= 2 ? 'active' : 'inactive'}`} />
            <div className={`seller-step-dot ${step >= 2 ? 'active' : 'inactive'}`}>2</div>
          </div>

          {step === 1 ? (
            <>
              <div className="seller-card-eyebrow">Create Account</div>
              <h2 className="seller-card-title">Join as Artisan</h2>
              <p className="seller-card-sub">Enter your name and email to get started</p>

              {error && <div className="seller-alert error">⚠ {error}</div>}

              <form onSubmit={handleSendOtp}>
                <div className="seller-grid" style={{ gap: '1rem' }}>
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

                <button type="submit" disabled={loading} className="seller-btn-primary" style={{ marginTop: '1.5rem' }}>
                  {loading ? <><span className="spinner" /> Sending OTP…</> : 'Send Verification Code →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="seller-card-eyebrow">Identity Verification</div>
              <h2 className="seller-card-title">Verify Email</h2>
              <p className="seller-card-sub">
                A 6-digit access code has been sent to <strong>{form.email}</strong>
              </p>

              {error && <div className="seller-alert error">⚠ {error}</div>}
              {success && <div className="seller-alert success">✓ {success}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="seller-field">
                  <label className="seller-label">Enter OTP <span className="req">*</span></label>
                  <div className="otp-boxes">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`otp-box ${digit ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpFilled}
                  className="seller-btn-teal"
                  style={{ marginTop: '1.5rem' }}
                >
                  {loading ? <><span className="spinner" /> Verifying…</> : 'Complete Authentication →'}
                </button>

                <div className="otp-resend">
                  No code received?{' '}
                  <button type="button" onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(['','','','','','']); }}>
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); setSuccess(''); setOtp(['','','','','','']); }}
                  className="seller-btn-ghost"
                  style={{ marginTop: '0.25rem' }}
                >
                  ← Change email
                </button>
              </form>
            </>
          )}

          <p className="seller-footer-text">
            Already have an account? <Link to="/seller/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
