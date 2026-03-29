import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setSummary] = useState({ average: 0, count: 0, stars: {} });
  const [activeImg, setActiveImg] = useState(0);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProduct();
    fetchRelated();
    fetchReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/marketplace/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const res = await axios.get(`/api/marketplace/${id}/related`);
      setRelated(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${id}`);
      setReviews(res.data.reviews);
      setSummary(res.data.summary);
    } catch (err) { console.error(err); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/signin");
    try {
      setSubmitting(true);
      await axios.post("/api/reviews", { productId: id, rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment("");
      fetchReviews(); // Refresh
      alert("Review submitted! Thank you.");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="product-detail-loader"><div className="spin"></div><p>Searching for your treasure...</p></div>;
  if (!product) return <div className="product-detail-error">Product not found.</div>;

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const isOutOfStock = product.stock <= 0 || product.status === "Out of Stock";

  return (
    <div className="pd-detail-root">
      <Navbar />
      
      <main className="pd-detail-container container">
        <div className="pd-detail-layout">
          {/* Left: Images */}
          <div className="pd-media-section">
            <div className="pd-main-img-wrap">
              <img src={product.images?.[activeImg] || "/placeholder.png"} alt={product.title} />
              <button 
                className={`pd-wish-btn ${isInWishlist(product._id) ? "active" : ""}`}
                onClick={() => toggleWishlist(product)}
              >
                {isInWishlist(product._id) ? "♥" : "♡"}
              </button>
            </div>
            {product.images?.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt="thumbnail" />
                  </div>
                ))}
              </div>
            )}

            <div className="pd-trust-badges desktop-badges">
              <div className="trust-item"><span>🚚</span> Fast Delivery</div>
              <div className="trust-item"><span>🤝</span> Artisan Verified</div>
              <div className="trust-item"><span>🌿</span> 100% Authentic</div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="pd-info-section">
            <nav className="pd-breadcrumb">
              <Link to="/home">Home</Link> / <span>{product.category?.name || "Product"}</span>
            </nav>
            
            <h1 className="pd-title">{product.title}</h1>
            <p className="pd-artisan">Handcrafted by <span>{product.artisanId?.shopName || product.artisanId?.name || "Artisan"}</span></p>

            <div className="pd-rating-strip">
              <div className="pd-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 0) ? "filled" : ""}>★</span>
                ))}
              </div>
              <span className="pd-rating-count">{product.rating ? product.rating.toFixed(1) : "No rating"} | {product.ratingCount || "0"} Reviews</span>
            </div>

            <div className="pd-price-block">
              <span className="pd-price">₹{product.price.toLocaleString()}</span>
              {discount > 0 && (
                <>
                  <span className="pd-mrp">₹{product.mrp.toLocaleString()}</span>
                  <span className="pd-discount">{discount}% OFF</span>
                </>
              )}
            </div>

            {isOutOfStock ? (
                <div className="pd-oos-badge">Out of Stock</div>
            ) : (
                <div className="pd-stock-info">Only {product.stock} items left in stock</div>
            )}

            <div className="pd-actions">
              <button 
                className="pd-cart-btn" 
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
              >
                Add to Cart
              </button>
              <button 
                className="pd-buy-btn" 
                onClick={() => { addToCart(product); navigate("/checkout"); }}
                disabled={isOutOfStock}
              >
                Buy Now
              </button>
            </div>

            <div className="pd-description">
              <h3>Product Description</h3>
              <p>{product.description || "No description provided by the artisan."}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pd-specs">
                <h3>Technical Details</h3>
                <div className="specs-table">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="spec-row">
                      <span className="spec-key">{k}</span>
                      <span className="spec-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related-wrap">
            <h2>Similar Products You'll Love</h2>
            <div className="related-grid">
               {related.map(p => (
                 <div key={p._id} className="related-card" onClick={() => navigate(`/product/${p._id}`)}>
                    <img src={p.image} alt={p.name} />
                    <h4>{p.name}</h4>
                    <span className="r-price">₹{p.price.toLocaleString()}</span>
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="pd-reviews-section">
          <h2>Customer Ratings & Reviews</h2>
          <div className="reviews-layout">
            <div className="reviews-summary-aside">
               <div className="summary-left">
                  <div className="big-rating">{reviewSummary.average}<span>/5</span></div>
                  <div className="stars-stat">
                    {Object.entries(reviewSummary.stars).reverse().map(([star, count]) => (
                      <div key={star} className="star-stat-row">
                         <span>{star}★</span>
                         <div className="stat-bar"><div style={{ width: `${(count / reviewSummary.count) * 100}%` }}></div></div>
                         <span>{count}</span>
                      </div>
                    ))}
                  </div>
               </div>
               
               {token && (
                 <form className="review-form" onSubmit={submitReview}>
                    <h3>Post Your Review</h3>
                    <div className="rate-input">
                       <span>How would you rate it?</span>
                       <select value={rating} onChange={(e) => setRating(e.target.value)}>
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Terrible</option>
                       </select>
                    </div>
                    <textarea 
                       placeholder="Write about your experience with this artisan creation..." 
                       value={comment} 
                       onChange={(e) => setComment(e.target.value)}
                       required
                    />
                    <button type="submit" disabled={submitting}>
                       {submitting ? "Placing..." : "Post Review"}
                    </button>
                 </form>
               )}
            </div>

            <div className="reviews-list">
               {reviews.length > 0 ? reviews.map(r => (
                 <div key={r._id} className="review-card">
                    <div className="rev-header">
                       <span className="rev-star">{r.rating}★</span>
                       <p className="rev-comment">{r.comment}</p>
                    </div>
                    <div className="rev-footer">
                       <span className="rev-user">{r.buyerId?.name || "Verified Buyer"}</span>
                       {r.isVerifiedPurchase && <span className="verified-badge">✓ Verified Purchase</span>}
                       <span className="rev-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>
               )) : (
                 <div className="reviews-empty">No reviews yet. Be the first to share your thoughts!</div>
               )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
