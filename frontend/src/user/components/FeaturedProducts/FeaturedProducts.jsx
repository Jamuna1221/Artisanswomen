import { useEffect, useState, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { fetchMarketplaceProducts } from "../../services/productService";
import "./FeaturedProducts.css";

/** Must match Category.name in MongoDB (case-sensitive). Seed: npm run seed:categories */
export const MARKETPLACE_CATEGORIES = [
  "All",
  "For You",
  "Fashion",
  "Jewelry",
  "Handmade",
  "Home Decor",
  "Crafts",
  "Textiles",
  "Pottery",
  "Paintings",
  "Bags",
  "Footwear",
  "Wellness",
];

export default function FeaturedProducts() {
  const [filter, setFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (category) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMarketplaceProducts(category);
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  return (
    <section className="featured-products">
      <div className="fp-bg" />

      <div className="container">
        <div className="section-header">
          <p className="section-label">Curated for You</p>
          <h2 className="section-title">Featured Artisan Picks</h2>
          <p className="section-subtitle">
            Discover handcrafted pieces from verified women artisans — every listing is loaded from our live marketplace catalog.
          </p>
        </div>

        <div className="fp-filters" role="tablist" aria-label="Filter by category">
          {MARKETPLACE_CATEGORIES.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`fp-filter ${filter === f ? "fp-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="fp-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="fp-loading">
            <span className="fp-spinner" aria-hidden />
            <span>Loading products…</span>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="fp-empty">
            <p>No products found</p>
            <span className="fp-empty-hint">
              {filter === "All"
                ? "Check back soon — artisans are adding new pieces."
                : `No listings in “${filter}” yet. Try another category.`}
            </span>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="fp-grid">
            {products.map((product, i) => (
              <ProductCard key={product._id || i} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="fp-bottom">
          <a href="/categories" className="btn-outline-clay">
            View All Categories
          </a>
        </div>
      </div>
    </section>
  );
}
