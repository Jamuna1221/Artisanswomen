import React, { useState, useEffect } from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=85',
    tag: 'New Collection · Summer 2025',
    title: ['Woven by', 'Kanchipuram', 'Master Weavers'],
    subtitle: 'Six yards of legacy. Every thread tells a story centuries old.',
    cta: 'Explore Silk Sarees',
    ctaSecondary: 'Meet the Artisans',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=1400&q=85',
    tag: 'Tanjore Heritage · GI Tagged Art',
    title: ['Gilded in', 'Gold. Painted', 'in Devotion.'],
    subtitle: 'Tanjore paintings that carry a thousand years of tradition into your home.',
    cta: 'Discover Paintings',
    ctaSecondary: 'View Collections',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=85',
    tag: 'Earth & Fire · Handcrafted Pottery',
    title: ['Shaped by', 'Hands. Fired', 'with Soul.'],
    subtitle: 'Tamil Nadu terracotta – where ancient earth meets contemporary form.',
    cta: 'Browse Pottery',
    ctaSecondary: 'Artisan Stories',
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  
  const goTo = (index) => {
    if (animating || index === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 600)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [active, animating])

  const slide = slides[active]

  return (
    <section className="hero">
      {/* Background frames for smooth crossfading */}
      {slides.map((s, i) => (
        <div key={s.id} className={`hero__bg ${i === active ? 'hero__bg--active' : ''}`}>
          <img src={s.image} alt="Hero Background" className="hero__bg-img" />
          <div className="hero__overlay" />
        </div>
      ))}

      {/* Decorative pattern */}
      <div className="hero__kolam">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="rgba(201,146,74,0.25)" strokeWidth="1"/>
          <circle cx="100" cy="100" r="70" stroke="rgba(201,146,74,0.2)" strokeWidth="1"/>
          <circle cx="100" cy="100" r="50" stroke="rgba(201,146,74,0.15)" strokeWidth="1"/>
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <line key={`l-${deg}`} x1="100" y1="10" x2="100" y2="190" stroke="rgba(201,146,74,0.12)" strokeWidth="1" transform={`rotate(${deg} 100 100)`}/>
          ))}
          {[0,45,90,135].map((deg) => (
            <ellipse key={`e-${deg}`} cx="100" cy="100" rx="40" ry="15" stroke="rgba(201,146,74,0.18)" strokeWidth="1" transform={`rotate(${deg} 100 100)`}/>
          ))}
        </svg>
      </div>

      <div className="hero__content">
        <div className="hero__text">
          <p className="hero__tag">
            <span className="hero__tag-dot" />
            <span key={`tag-${active}`} className="fade-text">{slide.tag}</span>
          </p>

          <h1 className="hero__title">
            {slide.title.map((line, i) => (
              <span key={`${active}-${i}`} className="hero__title-line" style={{ animationDelay: `${i * 0.1}s` }}>
                {line}
              </span>
            ))}
          </h1>

          <p key={`sub-${active}`} className="hero__subtitle fade-text">{slide.subtitle}</p>

          <div className="hero__btns">
            <Link to="/home" className="btn-primary">{slide.cta}</Link>
            <Link to="/home" className="btn-ghost">{slide.ctaSecondary}</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">2,400+</span>
            <span className="hero__stat-label">Artisans</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">12,000+</span>
            <span className="hero__stat-label">Products</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-num">38</span>
            <span className="hero__stat-label">Craft Forms</span>
          </div>
        </div>
      </div>

      <div className="hero__controls">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === active ? 'hero__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
