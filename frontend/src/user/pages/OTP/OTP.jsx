import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OTP.css";

/* ── Utility: mask email ── */
const maskEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 3);
  const masked = "*".repeat(Math.max(user.length - 3, 3));
  return `${visible}${masked}@${domain}`;
};

/* ── OTP Illustration (same art style as SignIn) ── */
const OtpIllustration = () => (
  <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-illustration">
    {/* Background blobs */}
    <ellipse cx="240" cy="270" rx="200" ry="210" fill="#E8DDD0" fillOpacity="0.5" />
    <ellipse cx="180" cy="200" rx="130" ry="140" fill="#D4C4B0" fillOpacity="0.35" />
    <ellipse cx="310" cy="330" rx="110" ry="120" fill="#C9B99A" fillOpacity="0.25" />

    {/* Dashed orbit */}
    <circle cx="240" cy="260" r="170" stroke="#A07850" strokeWidth="1" strokeDasharray="6 8" fill="none" opacity="0.3" />

    {/* Floating dots */}
    <circle cx="80" cy="120" r="8" fill="#A07850" fillOpacity="0.3" />
    <circle cx="400" cy="160" r="5" fill="#7C3A2D" fillOpacity="0.25" />
    <circle cx="60" cy="350" r="6" fill="#C9A96E" fillOpacity="0.3" />
    <circle cx="420" cy="380" r="10" fill="#A07850" fillOpacity="0.2" />

    {/* Envelope body */}
    <rect x="145" y="200" width="190" height="140" rx="14" fill="#F5EDE3" stroke="#D4C4B0" strokeWidth="2" />
    <path d="M145 214 L240 278 L335 214" stroke="#C9A96E" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="145" y1="340" x2="205" y2="280" stroke="#D4C4B0" strokeWidth="1.5" />
    <line x1="335" y1="340" x2="275" y2="280" stroke="#D4C4B0" strokeWidth="1.5" />

    {/* Lock shield */}
    <path d="M220 160 Q240 148 260 160 L264 190 Q240 204 216 190 Z" fill="#7C3A2D" opacity="0.85" />
    <rect x="232" y="175" width="16" height="12" rx="3" fill="white" opacity="0.9" />
    <path d="M236 175 Q240 169 244 175" stroke="white" strokeWidth="2" fill="none" />

    {/* OTP digit boxes floating */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x={130 + i * 38} y="360" width="28" height="36" rx="7"
          fill={i < 3 ? "#7C3A2D" : "white"}
          stroke="#D4C4B0" strokeWidth="1.5" opacity="0.9" />
        <text x={130 + i * 38 + 14} y="383" textAnchor="middle"
          fill={i < 3 ? "white" : "#A07850"} fontSize="13" fontFamily="serif" fontWeight="bold">
          {i < 3 ? "•" : ""}
        </text>
      </g>
    ))}

    {/* Floating craft tags */}
    <rect x="88" y="220" width="70" height="28" rx="14" fill="white" stroke="#D4C4B0" strokeWidth="1.5" />
    <text x="123" y="239" textAnchor="middle" fill="#A07850" fontSize="9" fontFamily="serif">Verified ✓</text>

    <rect x="322" y="250" width="68" height="28" rx="14" fill="white" stroke="#D4C4B0" strokeWidth="1.5" />
    <text x="356" y="269" textAnchor="middle" fill="#7C3A2D" fontSize="9" fontFamily="serif">Secure</text>

    {/* Sparkles */}
    <text x="110" y="160" fill="#C9A96E" fontSize="14" opacity="0.6">✦</text>
    <text x="370" y="300" fill="#A07850" fontSize="10" opacity="0.5">✦</text>
    <text x="330" y="140" fill="#7C3A2D" fontSize="12" opacity="0.4">✦</text>
  </svg>
);

const OTP_LENGTH = 6;
const TIMER_SECONDS = 60;

export default function EmailOtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ── Email + name come from signup via navigate("/verify-otp", { state: { ... } }) ── */
  const routedEmail = location.state?.email || "";
  const routedName  = location.state?.name  || "";
  const [email, setEmail] = useState(routedEmail);
  const [name]            = useState(routedName);

  /* ── Configurable endpoints (buyer flow passes its own; seller flow uses defaults) ── */
  const verifyEndpoint  = location.state?.verifyEndpoint  || "/api/auth/verify-otp";
  const resendEndpoint  = location.state?.resendEndpoint  || "/api/auth/send-otp";
  const successRedirect = location.state?.successRedirect || "/account";
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  /* ── Guard: if no email in state, bounce back to sign-in ── */
  useEffect(() => {
    if (!routedEmail) {
      navigate("/signin", { replace: true });
    }
  }, [routedEmail, navigate]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef([]);

  /* ── Timer countdown ── */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* ── Auto-submit when all 6 digits filled ── */
  const combined = otp.join("");
  useEffect(() => {
    if (combined.length === OTP_LENGTH && !loading) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combined]);

  const focusInput = (idx) => {
    if (inputRefs.current[idx]) inputRefs.current[idx].focus();
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < OTP_LENGTH - 1) focusInput(idx + 1);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        focusInput(idx - 1);
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) focusInput(idx - 1);
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) focusInput(idx + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    setError("");
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    focusInput(lastFilled);
  };

  const handleVerify = useCallback(async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      console.log('OTP Verify Response:', data); // Debugging

      if (res.ok) {
        // Seller specific partial-auth step
        if (data.tempToken) localStorage.setItem("tempToken", data.tempToken);
        
        // Buyer specific completion-auth step (PART 3)
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
           localStorage.setItem("token", data.token);
           localStorage.setItem("buyerToken", data.token); // Extra redundancy safely 
        }

        setSuccess(true);
        setTimeout(() => navigate(successRedirect), 900);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        focusInput(0);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, navigate, email, verifyEndpoint, successRedirect]);

  const handleResend = async () => {
    setTimer(TIMER_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    focusInput(0);
    try {
      await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleChangeEmail = () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) return;
    setEmail(newEmail);
    setShowChangeEmail(false);
    setNewEmail("");
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(TIMER_SECONDS);
    setError("");
    focusInput(0);
  };

  const timerDisplay = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;
  const allFilled = otp.every((d) => d !== "");

  return (
    <div className="auth-root">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-icon">✦</span>
            <span className="auth-brand-name">Handora</span>
          </div>
          <div className="auth-illustration-wrap">
            <OtpIllustration />
          </div>
          <div className="auth-left-text">
            <h2>Secure Email Verification</h2>
            <p>Your account is protected with a one-time passcode</p>
          </div>
          <div className="auth-left-dots">
            <span className="dot" />
            <span className="dot dot-active" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-card otp-card">

          {/* Header */}
          <div className="auth-header otp-header">
            <div className="otp-shield-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C17.5 22.15 21 17.25 21 12V6L12 2z"
                  fill="var(--brown)" opacity="0.15" />
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C17.5 22.15 21 17.25 21 12V6L12 2z"
                  stroke="var(--brown)" strokeWidth="1.5" fill="none" />
                <path d="M9 12l2 2 4-4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="auth-title otp-title">Verify Your Email</h1>
            <p className="auth-subtitle">
              We sent a 6-digit code to
            </p>
          </div>

          {/* Email display */}
          <div className="otp-email-row">
            <span className="otp-email-display">{maskEmail(email)}</span>
            <button className="otp-change-btn" onClick={() => setShowChangeEmail((v) => !v)}>
              Change
            </button>
          </div>

          {/* Change email inline */}
          {showChangeEmail && (
            <div className="otp-change-email-wrap">
              <input
                className="auth-input otp-email-input"
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChangeEmail()}
              />
              <button className="otp-change-email-save" onClick={handleChangeEmail}>
                Update
              </button>
            </div>
          )}

          {/* OTP inputs */}
          <div className="otp-inputs-label">Enter OTP</div>
          <div className="otp-inputs-row" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                id={`otp-input-${idx}`}
                className={`otp-input-box ${digit ? "filled" : ""} ${error ? "error" : ""} ${success ? "success" : ""}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onFocus={(e) => e.target.select()}
                autoComplete="one-time-code"
                disabled={loading || success}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="otp-error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="otp-success-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified! Redirecting…
            </div>
          )}

          {/* Timer / Resend */}
          <div className="otp-timer-row">
            {timer > 0 ? (
              <span className="otp-timer-text">
                Resend OTP in <span className="otp-timer-value">{timerDisplay}</span>
              </span>
            ) : (
              <button className="otp-resend-btn" onClick={handleResend}>
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify button */}
          <button
            id="otp-verify-btn"
            className={`auth-submit-btn otp-verify-btn ${loading ? "loading" : ""}`}
            onClick={handleVerify}
            disabled={!allFilled || loading || success}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : success ? (
              "✓ Verified"
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Back to signin */}
          <p className="auth-switch-text" style={{ marginTop: "1.25rem" }}>
            Wrong account?{" "}
            <button className="auth-switch-link" onClick={() => navigate("/signin")}>
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
