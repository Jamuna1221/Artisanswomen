import { useState } from "react";
import "./ProductCard.css";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="480" viewBox="0 0 400 480">
      <rect fill="#E8DDD0" width="400" height="480"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#7C3A2D" font-family="Georgia,serif" font-size="20">Handora</text>
    </svg>`
  );

function StarRating({ rating }) {
  const r = typeof rating === "number" && !Number.isNaN(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`star ${s <= Math.floor(r) ? "star--full" : s - 0.5 <= r ? "star--half" : ""}`}
        >
          ★
        </span>
      ))}
      <span className="rating-val">{r.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const imgSrc = product.image || PLACEHOLDER_IMAGE;
  const reviews = product.ratingCount ?? 0;

  return (
    <div className="product-card" style={{ "--delay": `${index * 0.08}s` }}>
      <div className="product-card__img-wrap">
        <img src={imgSrc} alt={product.name} className="product-card__img" loading="lazy" />

        {product.category && (
          <span className="product-card__category-pill">{product.category}</span>
        )}

        <button
          type="button"
          className={`product-card__wishlist ${wishlisted ? "product-card__wishlist--active" : ""}`}
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Toggle wishlist"
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="product-card__quick-add">
          <button type="button" className="quick-add-btn">
            Quick Add to Cart
          </button>
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__artisan">
          <span className="artisan-dot" />
          <span>{product.artisanName || "Artisan"}</span>
        </div>

        <h3 className="product-card__name">{product.name}</h3>

        <StarRating rating={product.rating} />
        <span className="product-card__reviews">({reviews} reviews)</span>

        <div className="product-card__price-row">
          <span className="product-card__price">₹{Number(product.price).toLocaleString("en-IN")}</span>
        </div>

        <button type="button" className="product-card__cta">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
