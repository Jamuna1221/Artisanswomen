import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import { fetchProductsByByCategoryName } from "../../services/productService";
import { CATEGORIES as CATEGORIES_DATA, getCategoryBySlug } from "../../constants/categories";
import { useCart } from "../../context/CartContext";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryInfo = getCategoryBySlug(categoryName);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realCategory, setRealCategory] = useState(categoryInfo?.label || categoryName);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const currentSort = searchParams.get("sort") || "newest";
  const currentRating = searchParams.get("rating") || "";

  useEffect(() => {
    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [categoryName, currentSort, currentRating]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProductsByByCategoryName(categoryName, { 
        sort: currentSort, 
        rating: currentRating 
      });
      
      if (data.categoryFound) {
        setProducts(data.products);
        setRealCategory(data.category);
      } else {
        setProducts([]);
        setRealCategory(categoryName);
      }
    } catch (err) {
      console.error("Failed to fetch category products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);
  };

  const handleRatingFilter = (val) => {
    if (currentRating === val) {
      searchParams.delete("rating");
    } else {
      searchParams.set("rating", val);
    }
    setSearchParams(searchParams);
  };

  const handleProductClick = (id) => navigate(`/product/${id}`);

  return (
    <div className="category-page-root">
      <Navbar />
      <CategoryBar activeId={CATEGORIES_DATA.find(c => c.slug === categoryName)?.id} />

      <main className="category-container">
        <nav className="breadcrumb">
          <Link to="/home">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{realCategory}</span>
        </nav>

        <header className="category-header">
          <h1 className="category-title">{realCategory}</h1>
          <p className="category-subtitle">Explore our authentic {realCategory.toLowerCase()} collection handcrafted by talented women.</p>
        </header>

        <div className="category-content">
          <aside className="category-sidebar">
            <div className="filter-group">
              <h4>Sort By</h4>
              <select className="filter-select" value={currentSort} onChange={handleSortChange}>
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-options">
                {[4, 3, 2, 1].map((star) => (
                  <button 
                    key={star} 
                    className={`rating-pill ${currentRating === String(star) ? "active" : ""}`}
                    onClick={() => handleRatingFilter(String(star))}
                  >
                    {star}★ & up
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="category-products">
            {loading ? (
              <div className="category-loader">
                <div className="spin-ring"></div>
                <p>Finding artisan treasures...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="no-res">
                <span className="no-res-icon">
                  {CATEGORIES_DATA.find(c => c.slug === categoryName)?.icon || "🏺"}
                </span>
                <h3>No products found in this category.</h3>
                <p>We're working with our artisans to bring new items to this collection soon.</p>
                <button onClick={() => window.history.back()} className="back-btn">Go Back</button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p) => (
                  <div className="product-item-card" key={p._id}>
                    <div className="pd-img-wrap" onClick={() => handleProductClick(p._id)}>
                        <img src={p.image || "/placeholder.png"} alt={p.name} />
                        <button 
                          className={`pd-wish-btn ${isInWishlist(p._id) ? "active" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                        >
                          {isInWishlist(p._id) ? "♥" : "♡"}
                        </button>
                    </div>
                    <div className="pd-details" onClick={() => handleProductClick(p._id)}>
                      <p className="pd-artisan">{p.artisanName}</p>
                      <h3 className="pd-name">{p.name}</h3>
                      <div className="pd-bottom">
                        <span className="pd-price">₹{p.price.toLocaleString()}</span>
                        <div className="pd-rating">
                          <span>★</span> {p.rating}
                        </div>
                      </div>
                      <button 
                        className="pd-add-btn" 
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
