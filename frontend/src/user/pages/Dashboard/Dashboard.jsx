import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";

// ── Dummy Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, label: "For You", icon: "✨" },
  { id: 2, label: "Fashion", icon: "👗" },
  { id: 3, label: "Jewelry", icon: "💍" },
  { id: 4, label: "Handmade", icon: "🧶" },
  { id: 5, label: "Home Decor", icon: "🏺" },
  { id: 6, label: "Crafts", icon: "🎨" },
  { id: 7, label: "Textiles", icon: "🧵" },
  { id: 8, label: "Pottery", icon: "🪔" },
  { id: 9, label: "Paintings", icon: "🖼️" },
  { id: 10, label: "Bags", icon: "👜" },
  { id: 11, label: "Footwear", icon: "👡" },
  { id: 12, label: "Wellness", icon: "🌿" },
];

const BANNERS = [
  {
    id: 1,
    title: "Handcrafted with Love",
    subtitle: "Discover exclusive pieces by India's finest women artisans",
    cta: "Shop Now",
    bg: "linear-gradient(135deg, #8b3a2b 0%, #c8a27c 60%, #f5e9dc 100%)",
    accent: "#fff8f0",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
  },
  {
    id: 2,
    title: "Festival Collection",
    subtitle: "Celebrate with authentic ethnic wear & jewelry",
    cta: "Explore",
    bg: "linear-gradient(135deg, #3d1c0e 0%, #8b3a2b 55%, #c8a27c 100%)",
    accent: "#fdf3e8",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
  },
  {
    id: 3,
    title: "Home & Soul",
    subtitle: "Transform your space with handmade decor",
    cta: "Discover",
    bg: "linear-gradient(135deg, #5a3020 0%, #a0622e 55%, #e8c89a 100%)",
    accent: "#fff5ec",
    img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80",
  },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: "Block Print Kurta Set", price: 1299, mrp: 2199, rating: 4.5, reviews: 328, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80", badge: "Bestseller" },
  { id: 2, name: "Brass Oxidised Earrings", price: 499, mrp: 899, rating: 4.7, reviews: 512, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", badge: "New" },
  { id: 3, name: "Handwoven Jute Tote", price: 799, mrp: 1299, rating: 4.3, reviews: 194, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", badge: "" },
  { id: 4, name: "Madhubani Art Cushion", price: 649, mrp: 999, rating: 4.6, reviews: 87, img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80", badge: "Artisan Pick" },
  { id: 5, name: "Phulkari Dupatta", price: 1599, mrp: 2599, rating: 4.8, reviews: 421, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", badge: "Trending" },
  { id: 6, name: "Terracotta Diyas Set", price: 349, mrp: 599, rating: 4.4, reviews: 263, img: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=400&q=80", badge: "" },
  { id: 7, name: "Kalamkari Saree", price: 2499, mrp: 3999, rating: 4.9, reviews: 178, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80", badge: "Premium" },
  { id: 8, name: "Hand-painted Pottery", price: 899, mrp: 1499, rating: 4.5, reviews: 305, img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80", badge: "" },
];

const RECOMMENDED = [
  { id: 9, name: "Warli Art Frame", price: 749, mrp: 1299, rating: 4.4, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80" },
  { id: 10, name: "Handmade Leather Wallet", price: 599, mrp: 999, rating: 4.6, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
  { id: 11, name: "Beaded Kolhapuri Heels", price: 1199, mrp: 1899, rating: 4.3, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
  { id: 12, name: "Embroidered Clutch", price: 849, mrp: 1399, rating: 4.7, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
  { id: 13, name: "Ajrakh Print Stole", price: 699, mrp: 1199, rating: 4.5, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "star filled" : i === full && half ? "star half" : "star"}>★</span>
      ))}
    </span>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Header({ user, cartCount }) {
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner">
        {/* Logo */}
        <div className="header__logo">
          <span className="logo-icon">♡</span>
          <div className="logo-text">
            <span className="logo-brand">Handora</span>
            <span className="logo-tagline">by artisans</span>
          </div>
        </div>

        {/* Search */}
        <div className="header__search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for sarees, jewelry, pottery…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        {/* Right */}
        <div className="header__right">
          <div className="header__user" onClick={() => setDropdown((d) => !d)}>
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div className="user-info">
              <span className="user-greeting">Hello,</span>
              <span className="user-name">{user?.name?.split(" ")[0] || "Guest"} ▾</span>
            </div>
            {dropdown && (
              <div className="user-dropdown">
                <a href="/account">My Account</a>
                <a href="/orders">My Orders</a>
                <a href="/wishlist">Wishlist</a>
                <hr />
                <a href="/logout" className="logout-link">Logout</a>
              </div>
            )}
          </div>

          <a href="/cart" className="header__cart">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </a>
        </div>
      </div>
    </header>
  );
}

function CategoryBar({ active, onSelect }) {
  return (
    <nav className="category-bar">
      <div className="category-bar__inner">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-item${active === cat.id ? " category-item--active" : ""}`}
            onClick={() => onSelect(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (i) => {
    setCurrent((i + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 4500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const banner = BANNERS[current];

  return (
    <section className="hero-banner">
      <div className="hero-banner__slide" style={{ background: banner.bg }}>
        <div className="hero-banner__content">
          <p className="hero-eyebrow">✦ New Arrivals</p>
          <h2 className="hero-title">{banner.title}</h2>
          <p className="hero-subtitle">{banner.subtitle}</p>
          <button className="hero-cta">{banner.cta} →</button>
        </div>
        <div className="hero-banner__image">
          <img src={banner.img} alt={banner.title} />
        </div>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " hero-dot--active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Arrows */}
      <button className="hero-arrow hero-arrow--prev" onClick={() => goTo(current - 1)}>‹</button>
      <button className="hero-arrow hero-arrow--next" onClick={() => goTo(current + 1)}>›</button>
    </section>
  );
}

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const off = discount(product.price, product.mrp);

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.img} alt={product.name} className="product-card__image" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wishlist-btn${wishlisted ? " wishlisted" : ""}`}
          onClick={() => setWishlisted((w) => !w)}
          title="Wishlist"
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-card__body">
        <p className="product-name">{product.name}</p>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-val">{product.rating}</span>
          {product.reviews && <span className="rating-count">({product.reviews})</span>}
        </div>
        <div className="product-pricing">
          <span className="price">₹{product.price.toLocaleString()}</span>
          <span className="mrp">₹{product.mrp.toLocaleString()}</span>
          <span className="off">{off}% off</span>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ title, products, cols }) {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="/products" className="see-all">See All →</a>
      </div>
      <div className={`product-grid product-grid--${cols || 4}`}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function PersonalisedSection({ user }) {
  return (
    <section className="personalised-section">
      <div className="personalised-header">
        <div>
          <p className="personalised-eyebrow">✦ Curated just for you</p>
          <h2 className="personalised-title">
            Hi {user?.name?.split(" ")[0] || "there"}, recommended for you
          </h2>
        </div>
        <a href="/products" className="see-all">Browse All →</a>
      </div>
      <div className="personalised-scroll">
        {RECOMMENDED.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function BannerStrip() {
  return (
    <div className="banner-strip">
      {[
        { icon: "🚚", label: "Free Delivery", sub: "On orders above ₹499" },
        { icon: "🔄", label: "Easy Returns", sub: "7-day hassle-free returns" },
        { icon: "🔒", label: "Secure Payments", sub: "100% safe & encrypted" },
        { icon: "🤝", label: "Artisan Support", sub: "Every buy empowers women" },
      ].map((item) => (
        <div className="strip-item" key={item.label}>
          <span className="strip-icon">{item.icon}</span>
          <div>
            <p className="strip-label">{item.label}</p>
            <p className="strip-sub">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActive] = useState(1);
  const cartCount = 3; // replace with real cart state

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { setUser({ name: "Harini Manikandan" }); }
    } else {
      setUser({ name: "Harini Manikandan" }); // fallback for demo
    }
    // Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="home-page">
      <Header user={user} cartCount={cartCount} />
      <CategoryBar active={activeCategory} onSelect={setActive} />
      <main className="home-main">
        <HeroBanner />
        <BannerStrip />
        <ProductGrid title="✦ Featured Artisan Picks" products={FEATURED_PRODUCTS} cols={4} />
        <PersonalisedSection user={user} />
      </main>

      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">♡</span>
            <span className="footer-brand-name">Handora</span>
            <p>Empowering women artisans across India</p>
          </div>
          <div className="footer-links">
            <h4>Shop</h4>
            <a href="#">Fashion</a><a href="#">Jewelry</a><a href="#">Home Decor</a>
          </div>
          <div className="footer-links">
            <h4>Help</h4>
            <a href="#">Contact Us</a><a href="#">Track Order</a><a href="#">Returns</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a><a href="#">Artisans</a><a href="#">Blog</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Handora. Made with ♥ for women artisans.</div>
      </footer>
    </div>
  );
}
