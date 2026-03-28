import React, { useState } from 'react'
import { categories } from '../../data'
import './Categories.css'

export default function Categories() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section className="categories-section">
      <div className="categories-bg" />

      <div className="container">
        <div className="section-header">
          <p className="section-label">Explore by Craft</p>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            From ancient Kanchipuram silks to hand-thrown terracotta — discover the finest
            artisan crafts, curated with love from across Tamil Nadu.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className={`cat-card ${hoveredId === cat.id ? 'cat-card--hovered' : ''}`}
              style={{ '--delay': `${i * 0.07}s` }}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="cat-card__img-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="cat-card__img"
                  loading="lazy"
                />
                <div className="cat-card__overlay" />
              </div>

              <div className="cat-card__body">
                <span className="cat-card__count">{cat.count}</span>
                <h3 className="cat-card__name">{cat.name}</h3>
                <p className="cat-card__desc">{cat.description}</p>
                <a href={`/category/${cat.slug}`} className="cat-card__link">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="categories-footer">
          <a href="/categories" className="btn-outline-clay">View All Categories</a>
        </div>
      </div>
    </section>
  )
}
