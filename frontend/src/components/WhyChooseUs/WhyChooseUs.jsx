import React from 'react'
import { whyUsPoints } from '../../data'
import './WhyChooseUs.css'

export default function WhyChooseUs() {
  return (
    <section className="why-us">
      <div className="why-us__bg" />

      <div className="container">
        <div className="section-header">
          <p className="section-label">The Handora Promise</p>
          <h2 className="section-title">Why Shop with Us</h2>
          <p className="section-subtitle">
            We built Handora on one belief: that authentic craft deserves an authentic platform.
          </p>
        </div>

        <div className="why-us__grid">
          {whyUsPoints.map((point, i) => (
            <div key={point.title} className="why-card" style={{ '--delay': `${i * 0.1}s` }}>
              <div className="why-card__icon">{point.icon}</div>
              <h3 className="why-card__title">{point.title}</h3>
              <p className="why-card__desc">{point.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Strip */}
        <div className="trust-strip">
          {[
            { icon: '🛡️', label: 'SSL Secured Payments' },
            { icon: '🏦', label: 'RBI Compliant Gateway' },
            { icon: '📜', label: 'GST Compliant Invoices' },
            { icon: '♻️', label: 'Zero Plastic Packaging' },
            { icon: '📞', label: '24/7 Artisan Support' },
          ].map(item => (
            <div key={item.label} className="trust-item">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
