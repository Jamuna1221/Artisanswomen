import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Navbar.css'

const navLinks = [
  { label: 'Shop Now', href: '/products' },
  { label: 'Our Artisans', href: '#' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { cartCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    
    // Check for logged in user
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) }
      catch { setUser(null) }
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/home'
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="nav-announcement">
        <p>✦ Free shipping on orders above ₹999 &nbsp;|&nbsp; Authentic Tamil Nadu Handmade ✦</p>
      </div>

      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="logo-mark">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4C20 4 8 12 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 12 20 4 20 4Z" fill="currentColor" opacity="0.15"/>
                <path d="M20 8C20 8 10 16 10 24C10 29.523 14.477 34 20 34C25.523 34 30 29.523 30 24C30 16 20 8 20 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="24" r="4" fill="currentColor"/>
                <path d="M16 20L20 16L24 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">Handora</span>
              <span className="logo-slogan">Hand Made Haven</span>
            </div>
          </Link>

          {/* Desktop Nav Removed as requested to prioritize Icon Category Bar */}

          {/* Actions */}
          <div className="navbar__actions">
            <form className="nav-search-form" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="nav-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="nav-icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7"/>
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                </svg>
              </button>
            </form>
            <Link to="/account/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round"/>
              </svg>
            </Link>
            
            <Link to="/cart" className="nav-icon-btn nav-cart-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </Link>
            
            {user ? (
              <div className="nav-profile-dropdown">
                <button className="nav-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="user-initial">{user.name?.charAt(0).toUpperCase()}</div>
                  <span className="user-fname">{user.name?.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="nav-dropdown-content">
                    <Link to="/account/overview" onClick={() => setDropdownOpen(false)}>My Account</Link>
                    <Link to="/account/orders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                    <Link to="/account/wishlist" onClick={() => setDropdownOpen(false)}>Wishlist</Link>
                    <hr />
                    <button onClick={handleLogout} className="drop-logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-cta">Sign In</Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        {navLinks.map(link => (
          <Link key={link.label} to={link.href} className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link to="/login" className="mobile-menu__cta" onClick={() => setMenuOpen(false)}>Sign In</Link>
      </div>
    </>
  )
}
