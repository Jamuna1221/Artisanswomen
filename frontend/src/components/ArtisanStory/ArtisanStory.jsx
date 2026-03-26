import React from 'react'
import './ArtisanStory.css'

export default function ArtisanStory() {
  return (
    <section className="artisan-story">
      <div className="as-texture" />

      <div className="container">
        <div className="as-inner">
          {/* Image Side */}
          <div className="as-images">
            <div className="as-img-primary-wrap">
              <img
                src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=700&q=80"
                alt="Artisan Meenakshi Devi weaving"
                className="as-img-primary"
                loading="lazy"
              />
              <div className="as-img-caption">
                <span>Kanchipuram, Tamil Nadu</span>
              </div>
            </div>

            <div className="as-img-secondary-wrap">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80"
                alt="Handcrafted pottery detail"
                className="as-img-secondary"
                loading="lazy"
              />
              <div className="as-img-float-stat">
                <span className="float-stat-num">32</span>
                <span className="float-stat-label">Years of<br/>craft mastery</span>
              </div>
            </div>

            {/* Decorative element */}
            <div className="as-decor">
              <svg viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="55" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 6"/>
                <circle cx="60" cy="60" r="40" stroke="var(--clay)" strokeWidth="0.5" opacity="0.4"/>
                <text x="60" y="57" textAnchor="middle" fontFamily="Playfair Display" fontSize="11" fill="var(--clay)" fontStyle="italic">Handora</text>
                <text x="60" y="70" textAnchor="middle" fontFamily="Jost" fontSize="6" fill="var(--gold)" letterSpacing="3">ARTISANS</text>
              </svg>
            </div>
          </div>

          {/* Text Side */}
          <div className="as-content">
            <p className="section-label">Behind the Craft</p>
            <h2 className="section-title as-title">
              Every Thread Carries<br />
              <em>a Century of Memory</em>
            </h2>

            <blockquote className="as-quote">
              <span className="as-quote-mark">"</span>
              My grandmother's hands taught mine. Her grandmother taught hers. When I sit at my loom at dawn, I am not alone — generations weave with me.
            </blockquote>

            <p className="as-bio">
              Meenakshi Devi has been weaving Kanchipuram silk since age eight, trained under her grandmother who learned directly from the temple weavers of old. Each saree she creates takes 15 to 30 days of patient work — counting threads, selecting zari, knotting the borders by memory.
            </p>

            <p className="as-bio">
              On Handora, she earns 3× what she made selling through middlemen. Today, she employs four women from her village and trains two younger weavers each year.
            </p>

            <div className="as-artisan-profile">
              <div className="as-avatar">
                <img
                  src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=200&q=80"
                  alt="Meenakshi Devi"
                />
              </div>
              <div>
                <p className="as-artisan-name">Meenakshi Devi</p>
                <p className="as-artisan-craft">Master Silk Weaver · Kanchipuram</p>
                <div className="as-artisan-badges">
                  <span className="as-badge">GI Certified</span>
                  <span className="as-badge">National Award</span>
                </div>
              </div>
            </div>

            <div className="as-actions">
              <a href="#" className="btn-primary">Shop Meenakshi's Work</a>
              <a href="#" className="btn-ghost-dark">Read All Stories →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Band */}
      <div className="as-band">
        <div className="container">
          <div className="as-band-inner">
            {[
              { num: '2,400+', label: 'Women Artisans Empowered' },
              { num: '₹4.2Cr', label: 'Direct Earnings This Year' },
              { num: '38', label: 'Craft Traditions Preserved' },
              { num: '96%', label: 'Artisan Satisfaction Rate' },
            ].map(item => (
              <div key={item.label} className="as-band-item">
                <span className="as-band-num">{item.num}</span>
                <span className="as-band-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
