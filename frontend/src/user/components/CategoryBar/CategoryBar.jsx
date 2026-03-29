import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryBar.css";

import { CATEGORIES as CATEGORIES_DATA } from "../../constants/categories";

export default function CategoryBar({ activeId }) {
  const navigate = useNavigate();

  return (
    <nav className="category-bar">
      <div className="category-bar__inner container">
        {CATEGORIES_DATA.map((cat) => (
          <button
            key={cat.id}
            className={`category-item${activeId === cat.id ? " category-item--active" : ""}`}
            onClick={() => navigate(`/category/${cat.slug}`)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
