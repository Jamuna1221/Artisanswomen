import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Heart, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { fetchUserDashboard } from "../../../services/userApi";

const OverviewTab = ({ user }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const dash = await fetchUserDashboard();
        if (!cancelled) setData(dash);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (!cancelled) {
          setError(err.response?.data?.message || "Could not load dashboard.");
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", { replace: true });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!user || loading) {
    return (
      <div className="tab-loading-skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  const displayName =
    user.firstName ||
    user.name?.split(" ").filter(Boolean)[0] ||
    user.name ||
    "there";

  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  const stats = [
    {
      id: 1,
      label: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: <Package size={22} />,
      color: "#8b3a2b",
    },
    {
      id: 2,
      label: "Wishlist Items",
      value: data?.wishlistCount ?? 0,
      icon: <Heart size={22} />,
      color: "#d32f2f",
    },
    {
      id: 3,
      label: "In Transit",
      value: data?.inTransitOrders ?? 0,
      icon: <Truck size={22} />,
      color: "#997c65",
    },
    {
      id: 4,
      label: "Saved Locations",
      value: data?.savedAddresses ?? 0,
      icon: <MapPin size={22} />,
      color: "#3d1c0e",
    },
  ];

  const lastOrder = data?.lastOrder;
  const orderIdStr = lastOrder?._id != null ? String(lastOrder._id) : "";

  return (
    <div className="tab-container overview-tab fade-in">
      {error && (
        <div className="account-inline-error" role="alert">
          {error}
        </div>
      )}

      <header className="overview-header">
        <div className="header-text">
          <span className="greeting-label">{greeting},</span>
          <h1 className="tab-title">{displayName}!</h1>
          <p className="tab-subtitle">You&apos;ve been a part of Handora since {memberSince}.</p>
        </div>
        <div className="header-decoration">
          <div className="blob-1" />
        </div>
      </header>

      <div className="overview-stats-grid">
        {stats.map((s) => (
          <div className="premium-stat-card" key={s.id} style={{ "--stat-accent": s.color }}>
            <div className="stat-icon-wrapper">{s.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{String(s.value)}</span>
            </div>
            <div className="stat-progress-line" />
          </div>
        ))}
      </div>

      <div className="account-summary-grid">
        <div className="premium-summary-card status-card">
          <div className="card-top">
            <div className="icon-circle success">
              <CheckCircle2 size={24} />
            </div>
            <div className="title-stack">
              <h3>Account Identity</h3>
              <span className="badge-verified">Premium Buyer</span>
            </div>
          </div>
          <div className="card-body">
            <p>
              Your account is verified and secure. You&apos;re eligible for exclusive artisan launches and faster priority
              shipping.
            </p>
            <div className="trust-badges">
              <span className="trust-tag">SSL Secured</span>
              <span className="trust-tag">Identity Verified</span>
            </div>
          </div>
        </div>

        <div className="premium-summary-card last-order-card">
          <div className="card-top">
            <div className="icon-circle secondary">
              <Package size={24} />
            </div>
            <div className="title-stack">
              <h3>Latest Activity</h3>
              <span className="subtitle">Real-time update</span>
            </div>
          </div>
          <div className="card-body">
            {lastOrder ? (
              <div className="order-snapshot">
                <div className="order-id-track">
                  <span className="label">Order ID</span>
                  <span className="val">#{orderIdStr.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="order-status-timeline">
                  <span className={`status-pill ${String(lastOrder.orderStatus || "").toLowerCase()}`}>
                    {lastOrder.orderStatus}
                  </span>
                  <span className="date">Placed on {new Date(lastOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <button type="button" className="track-link-btn" onClick={() => navigate("/account/track")}>
                  View Tracking Details →
                </button>
              </div>
            ) : (
              <div className="empty-order-state">
                <p>You haven&apos;t placed an order yet. Start exploring now!</p>
                <button type="button" className="shop-link-btn" onClick={() => navigate("/shop")}>
                  Shop Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="quick-access-section">
        <h3 className="section-heading">Quick Access</h3>
        <div className="action-grid-buttons">
          <button type="button" className="premium-action-btn primary" onClick={() => navigate("/account/orders")}>
            <Package size={18} />
            <span>My Orders</span>
          </button>
          <button type="button" className="premium-action-btn" onClick={() => navigate("/account/addresses")}>
            <MapPin size={18} />
            <span>Manage Addressing</span>
          </button>
          <button type="button" className="premium-action-btn" onClick={() => navigate("/account/security")}>
            <CheckCircle2 size={18} />
            <span>Account Privacy</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;
