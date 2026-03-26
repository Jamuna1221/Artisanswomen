import React from 'react'
import { categories } from '../../data'
import './Categories.css'

export default function Categories() {
  return (
    <section className="categories">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Explore Our World</p>
          <h2 className="section-title">Shop by Craft</h2>
          <p className="section-subtitle">
            From the looms of Kanchipuram to the kilns of Kumbakonam — discover every facet of Tamil Nadu's living heritage.
          </p>
        </div>

        <div className="categories__grid">
          {categories.map((cat, i) => (
            <a key={cat.id} href="#" className="cat-card" style={{ '--delay': `${i * 0.07}s` }}>
              <div className="cat-card__img-wrap">
                <img src={cat.image} alt={cat.name} className="cat-card__img" loading="lazy" />
                <div className="cat-card__overlay" />
                <div className="cat-card__badge">{cat.count}</div>
              </div>
              <div className="cat-card__body">
                <h3 className="cat-card__name">{cat.name}</h3>
                <p className="cat-card__desc">{cat.description}</p>
                <span className="cat-card__arrow">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="categories__cta-row">
          <a href="#" className="btn-outline-clay">View All Categories</a>
          <div className="categories__divider" />
          <p className="categories__note">38 traditional Tamil Nadu craft forms</p>
        </div>
      </div>
    </section>
  )
}
