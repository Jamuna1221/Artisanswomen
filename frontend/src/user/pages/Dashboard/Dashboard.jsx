import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  fetchMarketplaceProducts,
} from "../../services/productService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import { useCart } from "../../context/CartContext";
import "./Dashboard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useCart();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="product-card__image-wrap">
        <img src={product.image || "/placeholder.png"} alt={product.name} className="product-card__image" />
        <button 
          className={`wishlist-btn ${isInWishlist(product._id) ? "wishlisted" : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
        >
          {isInWishlist(product._id) ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-card__body">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(product.rating || 0) ? "filled" : ""}`}>★</span>
            ))}
          </div>
          <span className="rating-val">{product.rating || 0}</span>
        </div>
        <div className="product-pricing">
          <span className="price">₹{product.price.toLocaleString()}</span>
          <span className="off">{Math.round(Math.random() * 20 + 5)}% off</span>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ title, products, cols = 4, slug }) => (
  <section className="product-section">
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {slug && <Link to={`/category/${slug}`} className="see-all">SEE ALL →</Link>}
    </div>
    <div className={`product-grid product-grid--${cols}`}>
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  </section>
);

const BannerStrip = () => (
  <section className="banner-strip">
    <div className="strip-item">
      <span className="strip-icon">🚚</span>
      <div>
        <div className="strip-label">Free Delivery</div>
        <div className="strip-sub">For orders above ₹499</div>
      </div>
    </div>
    <div className="strip-item">
      <span className="strip-icon">🔄</span>
      <div>
        <div className="strip-label">Easy Returns</div>
        <div className="strip-sub">7-day hassle-free returns</div>
      </div>
    </div>
    <div className="strip-item">
      <span className="strip-icon">🔒</span>
      <div>
        <div className="strip-label">Secure Payments</div>
        <div className="strip-sub">100% safe & encrypted</div>
      </div>
    </div>
    <div className="strip-item">
      <span className="strip-icon">🤝</span>
      <div>
        <div className="strip-label">Artisan Support</div>
        <div className="strip-sub">Empowering women artisans</div>
      </div>
    </div>
  </section>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { setUser(null); }
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

  // Filtering Logic
  const fashionProducts = products.filter(p => p.category?.toLowerCase() === "fashion").slice(0, 4);
  const jewelryProducts = products.filter(p => p.category?.toLowerCase() === "jewelry").slice(0, 4);
  const potteryProducts = products.filter(p => p.category?.toLowerCase() === "pottery").slice(0, 4);

  return (
    <div className="home-page">
      <Navbar />
      <CategoryBar activeId="foryou" />
      
      <main className="home-main">
        {/* Premium Triple Hero Grid */}
        <section className="triple-hero-grid container">
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
          <div className="loading-state container">
            <div className="spinner"></div>
            <p>Gathering authentic artisan pieces...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="container">
            <ProductGrid 
              title="✧ Latest Artisan Creations" 
              products={products.slice(0, 12)} 
              cols={4} 
            />

            {fashionProducts.length > 0 && (
              <ProductGrid 
                title="👗 Trending in Fashion" 
                products={fashionProducts} 
                cols={4}
                slug="fashion"
              />
            )}

            {jewelryProducts.length > 0 && (
              <ProductGrid 
                title="💍 Artisan Jewelry Highlights" 
                products={jewelryProducts} 
                cols={4}
                slug="jewelry"
              />
            )}

            {potteryProducts.length > 0 && (
              <ProductGrid 
                title="🏺 Hand-Thrown Pottery" 
                products={potteryProducts} 
                cols={4}
                slug="pottery"
              />
            )}

            {user && (
              <section className="personalised-section">
                <div className="personalised-header">
                  <h2 className="personalised-title">Made for You, {user.name.split(' ')[0]}</h2>
                </div>
                <div className="personalised-scroll">
                  {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="empty-home container">
             <div className="empty-icon">🏺</div>
             <h2>Starting our journey</h2>
             <p>Our artisans are currently listing their first treasures. Come back in a few hours!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
