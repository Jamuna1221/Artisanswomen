import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Footer from "../../components/Footer/Footer";

// ── Dummy Data ────────────────────────────────────────────────────────────────
// CATEGORIES shifted to CategoryBar component for reusability.

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


// Products are now fetched from the API instead of using dummy data.
const FEATURED_PRODUCTS_DUMMY = [
  { id: 1, name: "Block Print Kurta Set", price: 1299, mrp: 2199, rating: 4.5, reviews: 328, img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80", badge: "Bestseller" },
  { id: 2, name: "Brass Oxidised Earrings", price: 499, mrp: 899, rating: 4.7, reviews: 512, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", badge: "New" },
  { id: 3, name: "Handwoven Jute Tote", price: 799, mrp: 1299, rating: 4.3, reviews: 194, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", badge: "" },
  { id: 4, name: "Madhubani Art Cushion", price: 649, mrp: 999, rating: 4.6, reviews: 87, img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80", badge: "Artisan Pick" },
];

const RECOMMENDED = [
  { id: 9, name: "Warli Art Frame", price: 749, mrp: 1299, rating: 4.4, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80" },
  { id: 10, name: "Handmade Leather Wallet", price: 599, mrp: 999, rating: 4.6, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
  { id: 11, name: "Beaded Kolhapuri Heels", price: 1199, mrp: 1899, rating: 4.3, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" },
  { id: 12, name: "Embroidered Clutch", price: 849, mrp: 1399, rating: 4.7, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
  { id: 13, name: "Ajrakh Print Stole", price: 699, mrp: 1199, rating: 4.5, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
];

const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home";
};

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
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner">
        {/* Logo */}
          <Link to="/home" className="header__logo">
            <span className="logo-icon">♡</span>
            <div className="logo-text">
              <span className="logo-brand">Handora</span>
              <span className="logo-tagline">by artisans</span>
            </div>
          </Link>

        {/* Search */}
        <form className="header__search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for sarees, jewelry, pottery…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* Right */}
        <div className="header__right">
          {user ? (
            <div className="header__user" onClick={() => setDropdown((d) => !d)}>
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
              <div className="user-info">
                <span className="user-greeting">Hello,</span>
                <span className="user-name">{user?.name?.split(" ")[0]} ▾</span>
              </div>
              {dropdown && (
                <div className="user-dropdown">
                  <Link to="/account/overview">My Account</Link>
                  <Link to="/account/orders">My Orders</Link>
                  <Link to="/account/wishlist">Wishlist</Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-link" style={{background:'none', border:'none', cursor:'pointer', padding:'10px 15px', color:'#d32f2f', textAlign:'left'}}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="header__auth">
               <Link to="/login" className="login-link">Login</Link>
               <Link to="/create" className="register-btn">Create Account</Link>
            </div>
          )}

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

import CategoryBar from "../../components/CategoryBar/CategoryBar";

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
  const prodImg = product.image || product.img;
  const off = product.mrp ? discount(product.price, product.mrp) : 25; // Default 25% if mrp missing

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={prodImg} alt={product.name} className="product-card__image" />
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
          {product.mrp && <span className="mrp">₹{product.mrp.toLocaleString()}</span>}
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

import { fetchMarketplaceProducts } from "../../services/productService";

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [activeCategory, setActive] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartCount = 0; // replace with real cart logic later

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { setUser(null); }
    } else {
      setUser(null); 
    }

    const loadProducts = async () => {
      try {
        setLoading(true);
        const { products: fetched } = await fetchMarketplaceProducts();
        setProducts(fetched);
      } catch (err) {
        console.error("Home: fetchMarketplaceProducts failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Nunito:wght@300;400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="home-page">
      <Header user={user} cartCount={cartCount} />
      <CategoryBar activeId={activeCategory} />
      <main className="home-main">
        {/* Premium Triple Hero Section */}
        <section className="triple-hero-grid">
           <div className="hero-card hero-large">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200" alt="Fashion" />
              <div className="hero-overlay">
                 <span className="hero-tag">New Season</span>
                 <h2>Elegant Ethnic Wear</h2>
                 <Link to="/category/fashion" className="hero-link">Explore Collection →</Link>
              </div>
           </div>
           <div className="hero-side-wrap">
              <div className="hero-card hero-small">
                 <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800" alt="Jewellery" />
                 <div className="hero-overlay">
                    <h2>Artisan Jewelry</h2>
                    <Link to="/category/jewelry" className="hero-link">Shop Gold & Art →</Link>
                 </div>
              </div>
              <div className="hero-card hero-small">
                 <img src="https://images.unsplash.com/photo-1544413647-b510491893e1?auto=format&fit=crop&q=80&w=800" alt="Handmade" />
                 <div className="hero-overlay">
                    <h2>Handmade Decor</h2>
                    <Link to="/category/home-decor" className="hero-link">Art for Home →</Link>
                 </div>
              </div>
           </div>
        </section>

        <BannerStrip />

        {loading ? (
          <div className="loading-state">
            <p>Curating artisan treasures...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <ProductGrid 
              title="✧ Latest Artisan Creations" 
              products={products.slice(0, 8)} 
              cols={4} 
            />
            {user && (
              <section className="personalised-section">
                <div className="personalised-header">
                  <h2 className="personalised-title">Recommended For You, {user.name.split(' ')[0]}</h2>
                </div>
                <div className="personalised-scroll">
                  {products.slice(0, 6).map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="empty-home">
             <h2>No products listed yet</h2>
             <p>Our artisans are currently crafting new pieces. Check back soon!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
