import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ── Icons ──────────────────────────────────────────────────
const Icons = {
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  wishlist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  address: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
};

// ── Nav items ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "orders",   label: "My Orders & Returns", icon: Icons.orders },
  { id: "wishlist", label: "Wishlist",             icon: Icons.wishlist },
  { id: "address",  label: "Address Book",         icon: Icons.address },
  { id: "profile",  label: "My Profile",           icon: Icons.profile },
  { id: "contact",  label: "Contact Us",           icon: Icons.contact },
];

// ── Dashboard cards ────────────────────────────────────────
const CARDS = [
  {
    id: "orders",
    icon: Icons.orders,
    title: "My Orders & Returns",
    subtitle: "Track your orders, request returns, or reorder favourites",
    accent: "#7C3A2D",
    badge: "3 Active",
  },
  {
    id: "wishlist",
    icon: Icons.wishlist,
    title: "My Wishlist",
    subtitle: "Save and revisit pieces that caught your eye",
    accent: "#A07850",
    badge: "12 Items",
  },
  {
    id: "address",
    icon: Icons.address,
    title: "Address Book",
    subtitle: "Manage delivery addresses for a seamless checkout",
    accent: "#C9A96E",
    badge: null,
  },
  {
    id: "profile",
    icon: Icons.profile,
    title: "My Profile",
    subtitle: "Update your personal details and preferences",
    accent: "#7C3A2D",
    badge: null,
  },
  {
    id: "contact",
    icon: Icons.contact,
    title: "Contact Us",
    subtitle: "Reach our artisan concierge team anytime",
    accent: "#A07850",
    badge: null,
  },
];

// ── Mock user ───────────────────────────────────────────────
const USER = { name: "Priya Sharma", email: "priya@example.com", initials: "PS" };

export default function Account() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    // clear auth state here
    navigate("/signin");
  };

  return (
    <div className="acc-root">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="acc-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile topbar ── */}
      <div className="acc-mobile-bar">
        <button className="acc-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          {Icons.menu}
        </button>
        <span className="acc-mobile-logo">✦ Handora</span>
      </div>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`acc-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Close button (mobile) */}
        <button className="acc-sidebar-close" onClick={() => setSidebarOpen(false)}>
          {Icons.close}
        </button>

        {/* User avatar block */}
        <div className="acc-user-block">
          <div className="acc-avatar">
            <span>{USER.initials}</span>
            <span className="acc-avatar-ring" />
          </div>
          <div className="acc-user-info">
            <p className="acc-user-name">{USER.name}</p>
            <p className="acc-user-email">{USER.email}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="acc-sidebar-divider">
          <span>My Account</span>
        </div>

        {/* Nav */}
        <nav className="acc-nav">
          <button
            className={`acc-nav-item ${activeSection === "overview" ? "active" : ""}`}
            onClick={() => handleNav("overview")}
          >
            <span className="acc-nav-icon">{Icons.sparkle}</span>
            <span className="acc-nav-label">Overview</span>
            <span className="acc-nav-arrow">{Icons.chevron}</span>
          </button>

          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`acc-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="acc-nav-icon">{item.icon}</span>
              <span className="acc-nav-label">{item.label}</span>
              <span className="acc-nav-arrow">{Icons.chevron}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button className="acc-logout-btn" onClick={handleLogout}>
          <span className="acc-nav-icon">{Icons.logout}</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="acc-main">
        {/* Page header */}
        <div className="acc-page-header">
          <div className="acc-page-header-text">
            <p className="acc-greeting">Good to see you,</p>
            <h1 className="acc-page-title">My Account</h1>
          </div>
          <div className="acc-header-ornament">✦</div>
        </div>

        {/* Breadcrumb */}
        <div className="acc-breadcrumb">
          <span>Home</span>
          <span className="acc-bc-sep">›</span>
          <span className="acc-bc-active">My Account</span>
        </div>

        {/* ── Overview (default) ── */}
        {activeSection === "overview" && (
          <div className="acc-overview">
            {/* Summary strip */}
            <div className="acc-stats-strip">
              <div className="acc-stat">
                <span className="acc-stat-num">3</span>
                <span className="acc-stat-label">Active Orders</span>
              </div>
              <div className="acc-stat-divider" />
              <div className="acc-stat">
                <span className="acc-stat-num">12</span>
                <span className="acc-stat-label">Wishlist Items</span>
              </div>
              <div className="acc-stat-divider" />
              <div className="acc-stat">
                <span className="acc-stat-num">2</span>
                <span className="acc-stat-label">Saved Addresses</span>
              </div>
            </div>

            {/* Cards grid */}
            <div className="acc-cards-grid">
              {CARDS.map((card, i) => (
                <button
                  key={card.id}
                  className="acc-card"
                  style={{ "--card-accent": card.accent, animationDelay: `${i * 0.08}s` }}
                  onClick={() => handleNav(card.id)}
                >
                  {/* Decorative top bar */}
                  <span className="acc-card-bar" />

                  {/* Icon circle */}
                  <span className="acc-card-icon-wrap">
                    {card.icon}
                  </span>

                  {/* Badge */}
                  {card.badge && (
                    <span className="acc-card-badge">{card.badge}</span>
                  )}

                  {/* Text */}
                  <h3 className="acc-card-title">{card.title}</h3>
                  <p className="acc-card-sub">{card.subtitle}</p>

                  {/* Arrow */}
                  <span className="acc-card-arrow">{Icons.chevron}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Section placeholder views ── */}
        {activeSection !== "overview" && (
          <SectionPlaceholder
            id={activeSection}
            nav={NAV_ITEMS.find(n => n.id === activeSection)}
            onBack={() => setActiveSection("overview")}
          />
        )}
      </main>
    </div>
  );
}

// ── Placeholder for section pages ──────────────────────────
function SectionPlaceholder({ id, nav, onBack }) {
  const msgs = {
    orders:   { sub: "Your order history and return requests will appear here.", empty: "No orders yet — start exploring artisan collections." },
    wishlist: { sub: "All your saved pieces in one place.", empty: "Your wishlist is empty — save items you love." },
    address:  { sub: "Manage your delivery addresses.", empty: "No addresses saved yet." },
    profile:  { sub: "Your personal details and account preferences.", empty: "" },
    contact:  { sub: "Reach our team — we're here to help.", empty: "" },
  };
  const info = msgs[id] || {};

  return (
    <div className="acc-section-view">
      <button className="acc-back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
        Back to overview
      </button>

      <div className="acc-section-header">
        <span className="acc-section-icon">{nav?.icon}</span>
        <div>
          <h2 className="acc-section-title">{nav?.label}</h2>
          <p className="acc-section-sub">{info.sub}</p>
        </div>
      </div>

      <div className="acc-section-empty">
        <div className="acc-empty-ornament">✦</div>
        <p>{info.empty || "This section is coming soon."}</p>
        <button className="acc-explore-btn" onClick={onBack}>
          Explore Collections
        </button>
      </div>
    </div>
  );
}
