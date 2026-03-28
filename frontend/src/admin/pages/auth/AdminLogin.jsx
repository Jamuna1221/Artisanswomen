import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import logo from '../../../assets/logo.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const { login, verifyOtpLogin, resendAdminOtp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Frontend Login Handled:", { email, password });
    setError('');
    setLoading(true);

    try {
      const response = await login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      // If backend says OTP is required, move to OTP step
      if (response.requiresOTP) {
        setEmail(email.trim()); // Ensure email used for OTP verification is trimmed
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized Access. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;
    
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Autofocus next
    if (val && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const otpCode = otp.join('');
    
    try {
      // Use verifyAdminOtp or pass through auth context
      await verifyOtpLogin({ email, otp: otpCode });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or Expired Security Code.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await resendAdminOtp(email);
      alert("A new security code has been sent!");
    } catch (err) {
      alert("Failed to resend code.");
    }
  };

  return (
    <div className="handora-login-wrapper">
      {/* Left Panel: Artisinal Visuals */}
      <div className="visual-side">
        <div className="visual-overlay">
          <div className="visual-text">
            <span className="premium-label">Exclusively for Handora</span>
            <h1>Crafting Tomorrow's <br />Traditions</h1>
            <p>Managing the world's most talented women artisans with precision and care.</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Login Card */}
      <div className="login-side">
        <div className="auth-card-outer">
          <div className="brand-header">
            <div className="logo-outer-container">
              <div className="logo-inner-container">
                <img src={logo} alt="Handora Logo" className="handora-prime-logo" />
              </div>
            </div>
            <h1 className="handora-title">Handora</h1>
            <p className="handora-subtitle">Hand Made Haven</p>
          </div>

          <div className="auth-content-box">
            {step === 'login' ? (
              <div className="login-stage animate-fade-in">
                <div className="stage-intro">
                  <h2>Secure Administration</h2>
                  <p>Welcome back. Please sign in to your master account.</p>
                </div>

                {error && <div className="h-error-message">{error}</div>}

                <form onSubmit={handleLogin} className="handora-form">
                  <div className="h-group">
                    <label>Administrative Email</label>
                    <div className="h-input-wrapper">
                      <Mail size={18} className="h-icon" />
                      <input 
                        type="email" 
                        placeholder="artisanswomen@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="h-group">
                    <label>System Password</label>
                    <div className="h-input-wrapper">
                      <Lock size={18} className="h-icon" />
                      <input 
                        type={showPass ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                      <button 
                        type="button" 
                        className="h-toggle" 
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-utils">
                    <div className="h-check">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">Keep me verified</label>
                    </div>
                    <a href="#" className="forgot-link">Recover Access</a>
                  </div>

                  <button type="submit" className="handora-btn-submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-spin" size={20} />
                    ) : (
                      <>
                        <span>Secure Entrance</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="otp-stage animate-fade-in">
                <div className="stage-intro">
                  <div className="shield-icon-box">
                    <ShieldCheck size={32} />
                  </div>
                  <h2>Identity Verification</h2>
                  <p>A specialized 6-digit access code has been sent to your registered administrative email.</p>
                </div>

                <form onSubmit={verifyOtp} className="handora-form">
                  <div className="otp-digit-group">
                    {otp.map((digit, i) => (
                      <input 
                        key={i}
                        type="text"
                        maxLength="1"
                        className="digit-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, i)}
                        required
                      />
                    ))}
                  </div>

                  <button type="submit" className="handora-btn-submit verified-btn" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-spin" size={20} />
                    ) : (
                      <span>Complete Authentication</span>
                    )}
                  </button>

                  <div className="otp-footer">
                    <p>No code received? <button type="button" className="text-link" onClick={resendCode}>Resend Code</button></p>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          <div className="handora-login-footer">
            <p>&copy; 2026 Handora Artisans Platform &bull; Secure Protocol V2.1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
