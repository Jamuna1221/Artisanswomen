import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  IndianRupee,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './SellerSidebar.css';

const navItems = [
  { name: 'Dashboard',  path: '/seller/dashboard',          icon: <LayoutDashboard size={20} /> },
  { name: 'Products',   path: '/seller/dashboard/products', icon: <ShoppingBag size={20} /> },
  { name: 'Orders',     path: '/seller/dashboard/orders',   icon: <ShoppingCart size={20} /> },
  { name: 'Earnings',   path: '/seller/dashboard/earnings', icon: <IndianRupee size={20} /> },
  { name: 'Reviews',    path: '/seller/dashboard/reviews',  icon: <Star size={20} /> },
  { name: 'Messages',   path: '/seller/dashboard/messages', icon: <MessageSquare size={20} /> },
  { name: 'Settings',   path: '/seller/dashboard/settings', icon: <Settings size={20} /> },
];

const SellerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && <div className="s-sidebar-overlay" onClick={() => setCollapsed(true)} />}

      <aside className={`s-sidebar ${collapsed ? 's-sidebar--collapsed' : ''}`}>
        {/* Branding */}
        <div className="s-sidebar__brand">
          <div className="s-sidebar__brand-icon">🧵</div>
          {!collapsed && (
            <div className="s-sidebar__brand-text">
              <span className="s-sidebar__brand-name">Handora</span>
              <span className="s-sidebar__brand-sub">Seller Portal</span>
            </div>
          )}
          <button
            className="s-sidebar__toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Seller info */}
        {!collapsed && (
          <div className="s-sidebar__seller-info">
            <div className="s-sidebar__avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : '🎨'}
            </div>
            <div>
              <div className="s-sidebar__seller-name">{user?.name || 'Artisan'}</div>
              <div className="s-sidebar__seller-badge">✓ Approved Seller</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="s-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller/dashboard'}
              className={({ isActive }) =>
                `s-sidebar__nav-item ${isActive ? 's-sidebar__nav-item--active' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <span className="s-sidebar__nav-icon">{item.icon}</span>
              {!collapsed && <span className="s-sidebar__nav-label">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="s-sidebar__footer">
          <button className="s-sidebar__logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SellerSidebar;
