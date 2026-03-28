import React, { useState } from 'react'
import { artisans } from '../../data'
import './ArtisanStory.css'

export default function ArtisanStory() {
  const [activeIdx, setActiveIdx] = useState(0)
  const artisan = artisans[activeIdx]

  return (
    <section className="artisan-story">
      <div className="artisan-story__bg" />

      <div className="container">
        <div className="section-header">
          <p className="section-label">Behind the Craft</p>
          <h2 className="section-title">Meet Our Artisans</h2>
          <p className="section-subtitle">
            Every piece carries a story. Get to know the master craftswomen
            whose hands bring centuries of tradition to life.
          </p>
        </div>

        <div className="artisan-story__layout">
          {/* Image Side */}
          <div className="artisan-story__img-wrap">
            <img
              src={artisan.image}
              alt={artisan.name}
              className="artisan-story__img"
              loading="lazy"
            />
            <div className="artisan-story__img-badge">
              <span className="artisan-badge__icon">🏺</span>
              <div>
                <span className="artisan-badge__name">{artisan.name}</span>
                <span className="artisan-badge__craft">{artisan.craft}</span>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="artisan-story__content">
            <div className="artisan-story__meta">
              <span className="artisan-meta__tag">
                📍 {artisan.location}
              </span>
              <span className="artisan-meta__tag">
                ⏳ {artisan.experience} of experience
              </span>
            </div>

            <h3 className="artisan-story__name">{artisan.name}</h3>
            <p className="artisan-story__craft">{artisan.craft}</p>

            <blockquote className="artisan-story__quote">
              "{artisan.story}"
            </blockquote>

            <div className="artisan-story__stats">
              <div className="artisan-stat">
                <span className="artisan-stat__val">500+</span>
                <span className="artisan-stat__label">Pieces Sold</span>
              </div>
              <div className="artisan-stat">
                <span className="artisan-stat__val">4.9★</span>
                <span className="artisan-stat__label">Avg Rating</span>
              </div>
              <div className="artisan-stat">
                <span className="artisan-stat__val">{artisan.experience}</span>
                <span className="artisan-stat__label">Experience</span>
              </div>
            </div>

            <a href={`/artisan/${artisan.id}`} className="artisan-story__cta">
              View Full Story
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Artisan Selector Dots (for multiple artisans) */}
        {artisans.length > 1 && (
          <div className="artisan-story__dots">
            {artisans.map((_, i) => (
              <button
                key={i}
                className={`artisan-dot-btn ${i === activeIdx ? 'artisan-dot-btn--active' : ''}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`View artisan ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Decorative craft strip */}
        <div className="craft-strip">
          {['Silk Weaving', 'Terracotta', 'Tanjore Art', 'Brass Work', 'Handloom', 'Filigree Jewellery'].map(c => (
            <span key={c} className="craft-strip__item">✦ {c}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
