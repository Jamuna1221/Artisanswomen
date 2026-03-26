import { useState } from "react";
import "./SignIn.css";

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const ArtisanIllustration = () => (
  <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-illustration">
    {/* Background blobs */}
    <ellipse cx="240" cy="270" rx="200" ry="210" fill="#E8DDD0" fillOpacity="0.5"/>
    <ellipse cx="180" cy="200" rx="130" ry="140" fill="#D4C4B0" fillOpacity="0.35"/>
    <ellipse cx="310" cy="330" rx="110" ry="120" fill="#C9B99A" fillOpacity="0.25"/>

    {/* Decorative floating elements */}
    <circle cx="80" cy="120" r="8" fill="#A07850" fillOpacity="0.3"/>
    <circle cx="400" cy="160" r="5" fill="#7C3A2D" fillOpacity="0.25"/>
    <circle cx="60" cy="350" r="6" fill="#C9A96E" fillOpacity="0.3"/>
    <circle cx="420" cy="380" r="10" fill="#A07850" fillOpacity="0.2"/>

    {/* Dashed orbit lines */}
    <circle cx="240" cy="260" r="170" stroke="#A07850" strokeWidth="1" strokeDasharray="6 8" fill="none" opacity="0.3"/>

    {/* Craft basket */}
    <rect x="165" y="310" width="150" height="100" rx="10" fill="#C9A96E" opacity="0.9"/>
    <rect x="155" y="300" width="170" height="22" rx="8" fill="#A07850"/>
    <line x1="195" y1="322" x2="185" y2="410" stroke="#8B6914" strokeWidth="1.5" opacity="0.5"/>
    <line x1="220" y1="322" x2="215" y2="410" stroke="#8B6914" strokeWidth="1.5" opacity="0.5"/>
    <line x1="245" y1="322" x2="245" y2="410" stroke="#8B6914" strokeWidth="1.5" opacity="0.5"/>
    <line x1="270" y1="322" x2="275" y2="410" stroke="#8B6914" strokeWidth="1.5" opacity="0.5"/>
    <line x1="295" y1="322" x2="305" y2="410" stroke="#8B6914" strokeWidth="1.5" opacity="0.5"/>

    {/* Items in basket */}
    <rect x="180" y="270" width="50" height="40" rx="4" fill="#E8C49A"/>
    <rect x="175" y="265" width="60" height="12" rx="4" fill="#D4A574"/>
    <rect x="255" y="275" width="45" height="35" rx="4" fill="#F0D5B0"/>
    <rect x="250" y="270" width="55" height="12" rx="4" fill="#C9A96E"/>

    {/* Phone mockup */}
    <rect x="195" y="130" width="110" height="180" rx="16" fill="white" stroke="#D4C4B0" strokeWidth="2"/>
    <rect x="195" y="130" width="110" height="180" rx="16" fill="#F5EDE3" opacity="0.6"/>
    <circle cx="250" cy="145" r="5" fill="#D4C4B0"/>
    <rect x="210" y="162" width="80" height="55" rx="8" fill="#E8C49A" opacity="0.7"/>
    {/* Bag icon on phone */}
    <path d="M238 178 Q250 168 262 178 L265 205 H235 Z" fill="#7C3A2D" opacity="0.8"/>
    <path d="M243 178 Q250 172 257 178" stroke="#7C3A2D" strokeWidth="2" fill="none"/>
    {/* Login button on phone */}
    <rect x="218" y="228" width="64" height="16" rx="6" fill="#A07850"/>
    <text x="250" y="240" textAnchor="middle" fill="white" fontSize="8" fontFamily="serif">LOGIN</text>
    {/* Phone dots */}
    <circle cx="241" cy="255" r="3" fill="#D4C4B0"/>
    <circle cx="250" cy="255" r="3" fill="#A07850"/>
    <circle cx="259" cy="255" r="3" fill="#D4C4B0"/>

    {/* Floating craft tags */}
    <rect x="90" y="190" width="70" height="28" rx="14" fill="white" stroke="#D4C4B0" strokeWidth="1.5"/>
    <text x="125" y="209" textAnchor="middle" fill="#A07850" fontSize="9" fontFamily="serif">Handcrafted</text>

    <rect x="320" y="220" width="65" height="28" rx="14" fill="white" stroke="#D4C4B0" strokeWidth="1.5"/>
    <text x="352" y="239" textAnchor="middle" fill="#7C3A2D" fontSize="9" fontFamily="serif">Artisan</text>

    <rect x="105" y="290" width="60" height="28" rx="14" fill="white" stroke="#D4C4B0" strokeWidth="1.5"/>
    <text x="135" y="309" textAnchor="middle" fill="#A07850" fontSize="9" fontFamily="serif">Organic</text>

    {/* Person silhouette */}
    <circle cx="150" cy="240" r="22" fill="#8B5A3C"/>
    <rect x="128" y="262" width="44" height="60" rx="10" fill="#5C3D2E"/>
    {/* Hair */}
    <ellipse cx="150" cy="228" rx="15" ry="12" fill="#3D2314"/>
    {/* Arm gesture */}
    <line x1="172" y1="275" x2="200" y2="255" stroke="#5C3D2E" strokeWidth="8" strokeLinecap="round"/>

    {/* Plant */}
    <rect x="345" y="370" width="18" height="40" rx="4" fill="#8B6914" opacity="0.7"/>
    <rect x="338" y="405" width="32" height="10" rx="3" fill="#A07850" opacity="0.8"/>
    <ellipse cx="354" cy="355" rx="20" ry="25" fill="#6B8E23" opacity="0.7"/>
    <ellipse cx="340" cy="365" rx="14" ry="18" fill="#556B2F" opacity="0.7"/>
    <ellipse cx="368" cy="360" rx="14" ry="20" fill="#6B8E23" opacity="0.6"/>

    {/* Small stars/sparkles */}
    <text x="110" y="160" fill="#C9A96E" fontSize="14" opacity="0.6">✦</text>
    <text x="370" y="300" fill="#A07850" fontSize="10" opacity="0.5">✦</text>
    <text x="330" y="140" fill="#7C3A2D" fontSize="12" opacity="0.4">✦</text>
  </svg>
);

export default function SignIn() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: ""
  });

  const isSignUp = mode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (isSignUp) {
      if (!form.firstName) newErrors.firstName = "Required";
      if (!form.lastName) newErrors.lastName = "Required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  const switchMode = () => {
    setMode(prev => prev === "signin" ? "signup" : "signin");
    setErrors({});
    setForm({ email: "", password: "", firstName: "", lastName: "" });
  };

  return (
    <div className="auth-root">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-icon">✦</span>
            <span className="auth-brand-name">Handora</span>
          </div>
          <div className="auth-illustration-wrap">
            <ArtisanIllustration />
          </div>
          <div className="auth-left-text">
            <h2>Discover Artisan Excellence</h2>
            <p>Curated handcrafted treasures from master artisans across India</p>
          </div>
          <div className="auth-left-dots">
            <span className="dot dot-active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Mode toggle pills */}
          <div className="auth-toggle-wrap">
            <button
              className={`auth-toggle-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => mode !== "signin" && switchMode()}
            >Sign In</button>
            <button
              className={`auth-toggle-btn ${isSignUp ? "active" : ""}`}
              onClick={() => mode !== "signup" && switchMode()}
            >Create Account</button>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {isSignUp ? "Create an Account." : "Welcome Back."}
            </h1>
            <p className="auth-subtitle">
              {isSignUp
                ? "Join our community of artisan lovers"
                : "Sign in to explore your curated collection"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name fields — sign up only */}
            <div className={`auth-name-row ${isSignUp ? "visible" : ""}`}>
              <div className="auth-field">
                <label className="auth-label">First Name</label>
                <input
                  className={`auth-input ${errors.firstName ? "error" : ""}`}
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Priya"
                  autoComplete="given-name"
                />
                {errors.firstName && <span className="auth-error">{errors.firstName}</span>}
              </div>
              <div className="auth-field">
                <label className="auth-label">Last Name</label>
                <input
                  className={`auth-input ${errors.lastName ? "error" : ""}`}
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Sharma"
                  autoComplete="family-name"
                />
                {errors.lastName && <span className="auth-error">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className={`auth-input ${errors.email ? "error" : ""}`}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input ${errors.password ? "error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isSignUp ? "Min. 6 characters" : "Your password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            {!isSignUp && (
              <div className="auth-forgot-wrap">
                <a href="#" className="auth-forgot">Forgot password?</a>
              </div>
            )}

            <button type="submit" className={`auth-submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                isSignUp ? "Create My Account" : "Sign In"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="auth-social-row">
            <button className="auth-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="auth-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="auth-switch-text">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            {" "}
            <button className="auth-switch-link" onClick={switchMode}>
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
