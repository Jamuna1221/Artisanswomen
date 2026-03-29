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
  const [reviewSummary, setSummary] = useState({ average: 0, count: 0, stars: {5:0,4:0,3:0,2:0,1:0} });
  const [activeImg, setActiveImg] = useState(0);

  // Variant selections
  const [selectedSize, setSize] = useState(null);
  const [selectedColor, setColor] = useState(null);

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
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      if (res.data.sizes?.length > 0) setSize(res.data.sizes[0]);
      if (res.data.colors?.length > 0) setColor(res.data.colors[0]);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchRelated = async () => {
    try {
      const res = await axios.get(`/api/products/${id}/related`);
      setRelated(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/products/${id}/reviews`);
      setReviews(res.data.reviews);
      setSummary(res.data.summary);
    } catch (err) { console.error(err); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return navigate(`/signin?redirect=/product/${id}`);
    try {
      setSubmitting(true);
      await axios.post(`/api/products/reviews`, { productId: id, rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment("");
      fetchReviews();
      alert("Review posted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
    } finally { setSubmitting(false); }
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    alert(`${product.title} added to your bag!`);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    navigate("/checkout");
  };

  if (loading) return <div className="pd-loader"><div className="spinner"></div></div>;
  if (!product) return <div className="pd-error">Product not found.</div>;

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pd-detail-wrapper">
      <Navbar />
      
      <main className="pd-main container">
        <div className="pd-layout">
          {/* Left: Photos */}
          <section className="pd-media">
             <div className="pd-main-photo">
                <img src={product.images?.[activeImg] || "/placeholder.png"} alt={product.title} />
                <button 
                  className={`pd-fav-btn ${isInWishlist(product._id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
                >
                  {isInWishlist(product._id) ? "♥" : "♡"}
                </button>
             </div>
             {product.images?.length > 1 && (
               <div className="pd-gallery">
                 {product.images.map((img, index) => (
                   <div 
                    key={index} 
                    className={`pd-thumb-wrap ${activeImg === index ? "active" : ""}`}
                    onClick={() => setActiveImg(index)}
                   >
                     <img src={img} alt="thumbnail" />
                   </div>
                 ))}
               </div>
             )}
          </section>

          {/* Right: Specs & Actions */}
          <section className="pd-content">
            <nav className="pd-nav-crumb">
               <Link to="/home">Home</Link> / <span>{product.category?.name || "Marketplace"}</span> / <span>{product.subcategory || "Item"}</span>
            </nav>

            <h1 className="pd-title-text">{product.title}</h1>
            <p className="pd-artisan-credit">By <span>{product.artisanId?.shopName || product.artisanId?.name || "Verified Artisan"}</span></p>

            <div className="pd-rating-badge-row">
               <div className="pd-rating-chip">
                  {product.rating ? product.rating.toFixed(1) : "0"} ★
               </div>
               <span className="pd-review-text">{product.ratingCount || 0} Ratings & {reviews.length} Reviews</span>
            </div>

            <div className="pd-price-row">
               <h2 className="pd-live-price">₹{product.price.toLocaleString()}</h2>
               {discount > 0 && (
                 <>
                   <span className="pd-old-price">₹{product.mrp.toLocaleString()}</span>
                   <span className="pd-off-percent">{discount}% OFF</span>
                 </>
               )}
            </div>

            <div className="pd-delivery-info">
               <p><span>🚚</span> Fast Delivery by <strong>{product.deliveryEstimate || "3-7 Days"}</strong></p>
               {isOutOfStock ? (
                 <span className="pd-oos-text">Out of Stock</span>
               ) : (
                 <span className="pd-stock-text">In Stock ({product.stock} available)</span>
               )}
            </div>

            {/* Variants */}
            {product.sizes?.length > 0 && (
              <div className="pd-variant-group">
                <h3>Select Size</h3>
                <div className="pd-variants">
                   {product.sizes.map(s => (
                     <button key={s} className={`pd-v-btn ${selectedSize === s ? "active" : ""}`} onClick={() => setSize(s)}>{s}</button>
                   ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="pd-variant-group">
                <h3>Select Color</h3>
                <div className="pd-variants">
                   {product.colors.map(c => (
                     <button 
                      key={c} 
                      className={`pd-v-btn pd-color-btn ${selectedColor === c ? "active" : ""}`} 
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c.toLowerCase() }}
                     >
                       {selectedColor === c && "✓"}
                     </button>
                   ))}
                </div>
              </div>
            )}

            {/* Sticky Actions Container */}
            <div className="pd-actions-sticky">
               <button className="pd-btn pd-add-cart" onClick={handleAddToCart} disabled={isOutOfStock}>
                 Add to Cart
               </button>
               <button className="pd-btn pd-buy-now" onClick={handleBuyNow} disabled={isOutOfStock}>
                 Buy Now
               </button>
            </div>

            <div className="pd-details-box">
               <h3>Product Description</h3>
               <p className="pd-short-desc">{product.description}</p>
               <div className="pd-full-desc">
                  {product.fullDescription}
               </div>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pd-specs-box">
                <h3>Specifications</h3>
                <div className="pd-specs-table">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="pd-spec-row">
                       <span className="pd-spec-key">{key}</span>
                       <span className="pd-spec-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Similar Items */}
        {related.length > 0 && (
          <section className="pd-related-section">
            <h2 className="pd-sec-title">Recommended Similar Products</h2>
            <div className="pd-related-grid">
               {related.map(r => (
                 <div key={r._id} className="pd-rel-card" onClick={() => navigate(`/product/${r._id}`)}>
                    <img src={r.image} alt={r.name} />
                    <h4>{r.name}</h4>
                    <div className="pd-rel-price">₹{r.price.toLocaleString()}</div>
                 </div>
               ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="pd-reviews-box" id="reviews">
           <h2 className="pd-sec-title">Ratings & Reviews</h2>
           <div className="pd-reviews-layout">
              <aside className="pd-reviews-aside">
                 <div className="pd-avg-block">
                    <span className="pd-big-score">{reviewSummary.average}</span>
                    <span className="pd-total-count">{reviewSummary.count} Ratings</span>
                 </div>
                 <div className="pd-stars-breakdown">
                    {[5, 4, 3, 2, 1].map(s => (
                      <div key={s} className="pd-star-row">
                         <span>{s} ★</span>
                         <div className="pd-progress"><div style={{ width: `${(reviewSummary.stars[s] / reviewSummary.count) * 100}%` }}></div></div>
                         <span>{reviewSummary.stars[s]}</span>
                      </div>
                    ))}
                 </div>

                 {token ? (
                   <form className="pd-review-form" onSubmit={submitReview}>
                      <h3>Write a Review</h3>
                      <div className="pd-rate-input">
                         <label>Rating:</label>
                         <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Terrible</option>
                         </select>
                      </div>
                      <textarea 
                        placeholder="Share your thoughts on this artisan masterwork..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                      <button type="submit" disabled={submitting}>
                        {submitting ? "Posting..." : "Submit Review"}
                      </button>
                   </form>
                 ) : (
                   <div className="pd-auth-prompt">
                      Please <Link to="/signin">Login</Link> to write a review.
                   </div>
                 )}
              </aside>

              <div className="pd-reviews-list">
                 {reviews.length > 0 ? (
                   reviews.map(rev => (
                     <div key={rev._id} className="pd-rev-item">
                        <div className="pd-rev-head">
                           <span className="pd-rev-score">{rev.rating} ★</span>
                           <span className="pd-rev-verified">{rev.isVerifiedPurchase ? "✓ Verified Purchase" : ""}</span>
                        </div>
                        <p className="pd-rev-comment">{rev.comment}</p>
                        <div className="pd-rev-foot">
                           <span className="pd-rev-user">{rev.buyerId?.name || "Customer"}</span>
                           <span className="pd-rev-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="pd-no-revs">No reviews yet. Be the first to share your experience!</div>
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
