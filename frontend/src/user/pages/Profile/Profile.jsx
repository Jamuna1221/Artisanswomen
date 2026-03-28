import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  console.log("Profile loaded");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Pre-fill from localStorage immediately
        if (localUser) {
          const nameParts = (localUser.name || "").split(" ");
          setForm({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            gender: localUser.gender || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
          });
          setUserData(localUser);
        }

        if (!token) {
          console.error("Profile fetch error: No token found. User is not authenticated.");
          setLoading(false);
          return;
        }

        console.log("Fetching profile using token:", token.slice(0, 10), "...");
        // Fetch from backend
        const res = await fetch("http://localhost:5000/api/buyer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        console.log("Profile fetch status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Profile data received:", data);
          const nameParts = (data.name || "").split(" ");
          setForm({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            gender: data.gender || "",
            email: data.email || "",
            phone: data.phone || "",
          });
          setUserData(data);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Profile API error:", res.status, errorData);
        }
      } catch (err) {
        console.error("Profile fetch exception:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Authentication error. No token found.", type: "error" });
        setSaving(false);
        return;
      }

      console.log("Saving user profile updates...");
      const res = await fetch("http://localhost:5000/api/buyer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          gender: form.gender,
          email: form.email,
          phone: form.phone,
        }),
      });

      console.log("Save profile status:", res.status);

      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify(updated));
        setUserData(updated);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setEditingEmail(false);
        setEditingPhone(false);
      } else {
        setMessage({ text: "Failed to update profile.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Something went wrong.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitial = () => {
    const name = userData?.name || form.firstName || "U";
    return name.charAt(0).toUpperCase();
  };

  const fullName = userData?.name || `${form.firstName} ${form.lastName}`.trim() || "User";
  const email = userData?.email || form.email || "";

  const faqs = [
    {
      q: "What happens when I update my email address (or mobile number)?",
      a: "Your login email id (or mobile number) changes accordingly. You'll receive all account-related communication on your updated email address (or mobile number).",
    },
    {
      q: "When will my account be updated with the new email address (or mobile number)?",
      a: "It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.",
    },
    {
      q: "What happens to my existing account when I update my email address (or mobile number)?",
      a: "Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your order history, saved information and personal details.",
    },
  ];

  return (
    <div className="profile-page">
      {/* LEFT SIDEBAR */}
      <aside className="profile-sidebar">
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">{getInitial()}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-name">{fullName}</span>
            <span className="sidebar-email">{email}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">MY ACCOUNT</div>
          <button className="nav-item" onClick={() => navigate("/account")}>
            <span className="nav-icon">★</span> Overview
          </button>
          <button className="nav-item" onClick={() => navigate("/account/orders")}>
            <span className="nav-icon">📦</span> My Orders &amp; Returns
          </button>
          <button className="nav-item" onClick={() => navigate("/account/wishlist")}>
            <span className="nav-icon">♡</span> Wishlist
          </button>
          <button className="nav-item" onClick={() => navigate("/account/addresses")}>
            <span className="nav-icon">📍</span> Address Book
          </button>
          <button className="nav-item active" onClick={() => navigate("/user/profile")}>
            <span className="nav-icon">👤</span> My Profile
            <span className="nav-arrow">›</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/contact")}>
            <span className="nav-icon">💬</span> Contact Us
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span>⎋</span> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="profile-main">
        <div className="profile-header">
          <div className="breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span className="breadcrumb-sep">›</span>
            <span onClick={() => navigate("/account")}>My Account</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">My Profile</span>
          </div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Your personal details and account preferences.</p>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>{message.text}</div>
        )}

        {loading ? (
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : (
          <>
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Personal Information</h2>
                <button className="btn-save" onClick={handleSavePersonal} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Gender</label>
                <div className="radio-group">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <span className="radio-custom"></span>
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: EMAIL ADDRESS */}
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Email Address</h2>
                {!editingEmail ? (
                  <button className="btn-edit" onClick={() => setEditingEmail(true)}>
                    Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSavePersonal} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingEmail(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  disabled={!editingEmail}
                />
              </div>
            </div>

            {/* SECTION 3: MOBILE NUMBER */}
            <div className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Mobile Number</h2>
                {!editingPhone ? (
                  <button className="btn-edit" onClick={() => setEditingPhone(true)}>
                    Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSavePersonal} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingPhone(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="form-group">
                <input
                  className="form-input"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  disabled={!editingPhone}
                />
              </div>
            </div>

            {/* SECTION 4: FAQ */}
            <div className="profile-card faq-card">
              <h2 className="card-title">FAQs</h2>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <p className="faq-question">{faq.q}</p>
                    <p className="faq-answer">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: ACCOUNT ACTIONS */}
            <div className="profile-card account-actions-card">
              <button
                className="btn-deactivate"
                onClick={() => {
                  if (window.confirm("Are you sure you want to deactivate your account?")) {
                    // handle deactivate
                  }
                }}
              >
                Deactivate Account
              </button>
              <button
                className="btn-delete"
                onClick={() => {
                  if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
                    // handle delete
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
