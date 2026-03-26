import React, { useState } from 'react'
import './Footer.css'

const footerLinks = {
  'Shop': ['Silk Sarees', 'Handloom', 'Pottery & Terracotta', 'Tanjore Paintings', 'Jewellery', 'Brass Crafts', 'GI Tagged Products'],
  'Artisans': ['Join as Artisan', 'Artisan Stories', 'Craft Training', 'Government Schemes', 'SHG Support', 'Export Program'],
  'Company': ['About Handora', 'Our Mission', 'Press & Media', 'Careers', 'Impact Report', 'Contact Us'],
  'Help': ['FAQs', 'Track My Order', 'Returns & Refunds', 'Shipping Policy', 'Privacy Policy', 'Terms of Service'],
}

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="none" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.64 1.267 1.408 0 .858-.546 2.140-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.136-1.867 3.136-4.562 0-2.387-1.715-4.055-4.163-4.055-2.836 0-4.5 2.126-4.5 4.322 0 .856.329 1.773.74 2.274a.3.3 0 0 1 .069.285c-.075.312-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="footer">
      {/* Newsletter Banner */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <p className="section-label" style={{ color: 'var(--gold-light)' }}>Stay Connected</p>
              <h3 className="newsletter-title">Join the Handmade Movement</h3>
              <p className="newsletter-sub">
                New artisan collections, craft stories, and exclusive offers — delivered gently to your inbox.
              </p>
            </div>

            {subscribed ? (
              <div className="newsletter-success">
                <span>🌸</span>
                <p>Thank you! You're now part of the Handora family.</p>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <div className="footer-logo-mark">
                  <svg viewBox="0 0 40 40" fill="none">
                    <path d="M20 4C20 4 8 12 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 12 20 4 20 4Z" fill="currentColor" opacity="0.15"/>
                    <path d="M20 8C20 8 10 16 10 24C10 29.523 14.477 34 20 34C25.523 34 30 29.523 30 24C30 16 20 8 20 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="20" cy="24" r="4" fill="currentColor"/>
                    <path d="M16 20L20 16L24 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <span className="footer-logo-name">Handora</span>
                  <span className="footer-logo-slogan">Hand Made Haven</span>
                </div>
              </a>

              <p className="footer-brand-desc">
                A Ministry of Textiles initiative — connecting Tamil Nadu's women artisans directly with conscious buyers across India and the world.
              </p>

              <div className="footer-socials">
                {socialLinks.map(s => (
                  <a key={s.label} href={s.href} className="footer-social" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>

              <div className="footer-govt-badge">
                <span className="govt-flag">🇮🇳</span>
                <div>
                  <p className="govt-name">Government of Tamil Nadu</p>
                  <p className="govt-dept">Department of Handlooms & Textiles</p>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="footer-col">
                <h4 className="footer-col-heading">{heading}</h4>
                <ul className="footer-col-links">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="footer-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copy">
              © 2025 Handora – Hand Made Haven. All rights reserved.
            </p>
            <div className="footer-payment-icons">
              {['UPI', 'Visa', 'Mastercard', 'RuPay', 'NetBanking'].map(p => (
                <span key={p} className="payment-pill">{p}</span>
              ))}
            </div>
            <p className="footer-made">
              Made with ♥ for Tamil Nadu Artisans
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
