import React, { useState } from 'react'
import { products } from '../../data'
import './FeaturedProducts.css'

const badgeColors = {
  'Best Seller': { bg: '#7C3A2D', color: '#FFFDF9' },
  'New Arrival': { bg: '#C9924A', color: '#FFFDF9' },
  'Handpicked': { bg: '#4A3728', color: '#FFFDF9' },
  'Limited Edition': { bg: '#5A2820', color: '#FFFDF9' },
  'Artisan Pick': { bg: '#7A5C45', color: '#FFFDF9' },
}

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`star ${s <= Math.floor(rating) ? 'star--full' : s - 0.5 <= rating ? 'star--half' : 'star--empty'}`}>★</span>
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  )
}

function ProductCard({ product, index }) {
  const [wishlisted, setWishlisted] = useState(false)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="product-card" style={{ '--delay': `${index * 0.08}s` }}>
      <div className="product-card__img-wrap">
        <img src={product.image} alt={product.name} className="product-card__img" loading="lazy" />

        {product.badge && (
          <span
            className="product-card__badge"
            style={badgeColors[product.badge] ? { background: badgeColors[product.badge].bg, color: badgeColors[product.badge].color } : {}}
          >
            {product.badge}
          </span>
        )}

        {discount && (
          <span className="product-card__discount">−{discount}%</span>
        )}

        <button
          className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Toggle wishlist"
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="product-card__quick-add">
          <button className="quick-add-btn">Quick Add to Cart</button>
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__artisan">
          <span className="artisan-dot" />
          <span>{product.artisan} · {product.location}</span>
        </div>

        <h3 className="product-card__name">{product.name}</h3>

        <StarRating rating={product.rating} />
        <span className="product-card__reviews">({product.reviews} reviews)</span>

        <div className="product-card__price-row">
          <span className="product-card__price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="product-card__original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button className="product-card__cta">Add to Cart</button>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Silk Sarees', 'Tanjore Paintings', 'Terracotta Art', 'Jewellery']

  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter)

  return (
    <section className="featured-products">
      {/* Background texture */}
      <div className="fp-bg" />

      <div className="container">
        <div className="section-header">
          <p className="section-label">Curated for You</p>
          <h2 className="section-title">Featured Creations</h2>
          <p className="section-subtitle">
            Each piece handpicked from our artisan network — authentic, ethically sourced, and made with generations of skill.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="fp-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`fp-filter ${filter === f ? 'fp-filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="fp-grid">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="fp-bottom">
          <a href="#" className="btn-outline-clay">View All Products</a>
        </div>
      </div>
    </section>
  )
}
