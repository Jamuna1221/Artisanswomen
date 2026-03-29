import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { fetchMarketplaceProducts } from "../../services/productService";
import "./ProductsPage.css";

import { CATEGORIES } from "../../constants/categories";

export default function UserProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { products: fetched } = await fetchMarketplaceProducts(categoryParam, searchParam);
        setProducts(fetched);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryParam, searchParam]);

  const handleCategoryClick = (cat) => {
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="user-products-root">
      <Navbar />
      
      <main className="user-products-container container">
        {/* Header Section */}
        <div className="products-hero">
          <h1 className="hero-title">
            {searchParam ? `Search: "${searchParam}"` : categoryParam || "Artisan Marketplace"}
          </h1>
          <p className="hero-subtitle">
            {searchParam 
              ? `Found ${products.length} unique treasures matching your search.`
              : "Authentic, handcrafted treasures directly from women artisans across India."}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <button 
            className={`filter-btn ${!categoryParam ? "active" : ""}`}
            onClick={() => handleCategoryClick("All")}
          >
            All Products
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              className={`filter-btn ${categoryParam === cat.slug ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>{loading ? "Searching for items..." : `${products.length} products found`}</p>
        </div>

        {/* Main Content Area */}
        {loading ? (
            <div className="products-loader">
                <div className="spinner"></div>
                <p>Curating your collection...</p>
            </div>
        ) : error ? (
            <div className="products-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
            </div>
        ) : products.length === 0 ? (
            <div className="no-products">
               <span className="no-icon">🏺</span>
               <h3>No products found in this category yet.</h3>
               <p>Check back soon for new artisan creations or try another category.</p>
               <button onClick={() => handleCategoryClick("All")} className="back-btn">Browse All Products</button>
            </div>
        ) : (
            <div className="user-product-grid">
              {products.map(p => (
                <div key={p._id} className="user-product-card">
                  <div className="card-image-wrap">
                    <img src={p.image || "/placeholder-product.png"} alt={p.name} />
                    {p.rating > 4.5 && <span className="premium-badge">Handpicked</span>}
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                       <span className="card-category">{p.category}</span>
                       <div className="card-rating">
                          <span>★</span> {p.rating.toFixed(1)}
                       </div>
                    </div>
                    <h3 className="card-title">{p.name}</h3>
                    <p className="card-seller">by {p.artisanName}</p>
                    <div className="card-footer">
                       <span className="card-price">₹{p.price.toLocaleString()}</span>
                       <button className="add-to-cart">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
