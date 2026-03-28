import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './SellerNavbar.css';

const PAGE_TITLES = {
  '/seller/dashboard':          { title: 'Overview',  emoji: '📊' },
  '/seller/dashboard/products': { title: 'Products',  emoji: '🛍️' },
  '/seller/dashboard/orders':   { title: 'Orders',    emoji: '📦' },
  '/seller/dashboard/earnings': { title: 'Earnings',  emoji: '💵' },
  '/seller/dashboard/reviews':  { title: 'Reviews',   emoji: '⭐' },
  '/seller/dashboard/messages': { title: 'Messages',  emoji: '💬' },
  '/seller/dashboard/settings': { title: 'Settings',  emoji: '⚙️' },
};

const SellerNavbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const page = PAGE_TITLES[pathname] || { title: 'Dashboard', emoji: '🧵' };

  return (
    <header className="s-navbar">
      <div className="s-navbar__page-title">
        <span className="s-navbar__page-emoji">{page.emoji}</span>
        <h2 className="s-navbar__page-name">{page.title}</h2>
      </div>

      <div className="s-navbar__actions">
        <button className="s-navbar__bell" aria-label="Notifications">
          <Bell size={18} />
          <span className="s-navbar__bell-dot" />
        </button>

        <div className="s-navbar__user">
          <div className="s-navbar__avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : '🎨'}
          </div>
          <div className="s-navbar__user-info">
            <span className="s-navbar__user-name">{user?.name || 'Artisan'}</span>
            <span className="s-navbar__user-label">Seller Account</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerNavbar;
