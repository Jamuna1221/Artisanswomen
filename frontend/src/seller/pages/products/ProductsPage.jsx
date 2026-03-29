import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Star,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import * as productService from "../../services/sellerProductService";
import "./ProductsPage.css";

const CATEGORIES = [
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
  "Wellness"
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [search, filterStatus, filterCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getMyProducts({
        search,
        status: filterStatus,
        category: filterCategory,
      });
      setProducts(data.products);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Actions ──
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await productService.duplicateProduct(id);
      fetchProducts();
    } catch (err) {
      alert("Failed to duplicate");
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await productService.toggleVisibility(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Modal Form ──
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e, forceStatus) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      let normCat = formData.category;
      if (normCat === "For You") normCat = "foryou";
      else normCat = normCat.toLowerCase().replace(/\s+/g, "-");
      
      data.append("category", normCat);
      data.append("description", formData.description);
      data.append("status", forceStatus);

      // Append images
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      await productService.createProduct(data);
      setShowAddModal(false);
      setFormData({ title: "", price: "", stock: "", category: "", description: "" });
      setSelectedFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err);
      const backendMsg = err.response?.data?.message || err.message;
      alert("Failed to create product: " + backendMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div>
          <h2 className="products-title">Product Management</h2>
          <p className="products-sub">Add, edit, and manage your craft products</p>
        </div>
        <button className="products-add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="products-stats">
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "var(--ink)" }}>{stats.total}</span>
            <span className="products-stat__label">Total Products</span>
          </div>
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "#059669" }}>{stats.active}</span>
            <span className="products-stat__label">Active Listings</span>
          </div>
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "#D97706" }}>{stats.draft}</span>
            <span className="products-stat__label">Drafts</span>
          </div>
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "#DC2626" }}>{stats.outOfStock}</span>
            <span className="products-stat__label">Out of Stock</span>
          </div>
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "var(--gold-dark)" }}>⭐ {stats.avgRating}</span>
            <span className="products-stat__label">Avg Rating</span>
          </div>
          <div className="products-stat">
            <span className="products-stat__value" style={{ color: "var(--clay)" }}>₹{stats.totalRevenue?.toLocaleString()}</span>
            <span className="products-stat__label">Total Revenue</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="products-toolbar">
        <div className="products-search-bar">
          <Search size={16} className="products-search-icon" />
          <input
            type="text"
            className="products-search-input"
            placeholder="Search by name, SKU, or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="products-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <select
          className="products-filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="loading-overlay">
          <Loader2 size={32} className="lucide-spin" />
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--smoke)" }}>
          No products found.
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => {
            const isOOS = p.status === "Out of Stock";
            const isLowStock = p.stock > 0 && p.stock < 5;

            return (
              <div className={`product-card ${!p.isVisible ? "product-card--hidden" : ""}`} key={p._id}>
                
                {/* Image Cover */}
                <div className="product-card__header">
                  {p.images?.length > 0 ? (
                    <img src={p.images[0]} alt={p.title} className="product-card__img" />
                  ) : (
                    <div className="product-card__placeholder">🏺</div>
                  )}
                  <div className="product-card__badges">
                    {p.isFeatured ? <div className="badge-featured"><Star size={12} fill="currentColor"/> Featured</div> : <div />}
                    <button 
                      className="badge-visibility" 
                      onClick={() => handleToggleVisibility(p._id)}
                      title={p.isVisible ? "Visible to buyers" : "Hidden from buyers"}
                    >
                      {p.isVisible ? <Eye size={14}/> : <EyeOff size={14}/>}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="product-card__body">
                  <div className="product-card__top">
                    <span
                      className={`products-pill ${
                        p.status === "Active" ? "products-pill--active" :
                        isOOS ? "products-pill--oos" : "products-pill--draft"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="product-card__category">{p.category?.name || p.category || "Uncategorized"}</span>
                  </div>
                  
                  <Link to={`/seller/dashboard/products/${p._id}`} style={{ textDecoration: 'none' }}>
                    <h4 className="product-card__name" title={p.title}>{p.title}</h4>
                  </Link>

                  <div className="product-card__meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">Price</span>
                      <span className="meta-val meta-val--price">₹{p.price?.toLocaleString()}</span>
                    </div>
                    <div className="meta-item" style={{ alignItems: "flex-end" }}>
                      <span className="meta-label">Stock</span>
                      {isOOS ? (
                        <span className="meta-val meta-val--stock-out">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="meta-val meta-val--stock-low"><AlertTriangle size={12}/> {p.stock} Left</span>
                      ) : (
                        <span className="meta-val">{p.stock} Units</span>
                      )}
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Sold</span>
                      <span className="meta-val">{p.soldCount || 0}</span>
                    </div>
                    <div className="meta-item" style={{ alignItems: "flex-end" }}>
                      <span className="meta-label">Rating</span>
                      <span className="meta-val meta-val--rating">
                        {p.rating > 0 ? (
                          <>⭐ {p.rating} <span style={{fontSize: '0.7rem', color:'var(--smoke)'}}>({p.ratingCount})</span></>
                        ) : "No ratings yet"}
                      </span>
                    </div>
                  </div>

                  <div className="product-card__actions">
                    <button className="product-card__btn" onClick={() => navigate(`/seller/dashboard/products/${p._id}`)} title="View/Edit Details">
                      <Edit3 size={14} /> Details
                    </button>
                    <button className="product-card__btn" onClick={() => handleDuplicate(p._id)} title="Duplicate">
                      <Copy size={14} /> 
                    </button>
                    <button className="product-card__btn product-card__btn--red" onClick={() => handleDelete(p._id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="products-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="products-modal" onClick={(e) => e.stopPropagation()}>
            <div className="products-modal__head">
              <h3>Create New Product</h3>
              <button className="products-modal__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="products-modal__body">
              <div className="products-modal__field">
                <label>Product Title *</label>
                <input required type="text" placeholder="e.g. Handwoven Silk Saree" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="products-modal__row">
                <div className="products-modal__field">
                  <label>Price (₹) *</label>
                  <input required type="number" min="0" placeholder="0.00" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="products-modal__field">
                  <label>Initial Stock *</label>
                  <input required type="number" min="0" placeholder="0" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div className="products-modal__field">
                <label>Category</label>
                <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="products-modal__field">
                <label>Description</label>
                <textarea placeholder="Describe your handcrafted product…" rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="products-modal__upload-box">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                <ImageIcon size={32} color="var(--smoke)" />
                <span style={{ fontWeight: 600, color: "var(--bark)" }}>Click to browse or drag & drop</span>
                <span style={{ fontSize: '0.75rem' }}>Upload up to 5 images (JPG, PNG, WEBP)</span>
                
                {selectedFiles.length > 0 && (
                  <div className="image-preview-strip">
                    {selectedFiles.map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} alt="preview" className="image-preview-thumb" />
                    ))}
                  </div>
                )}
              </div>

              <div className="products-modal__foot">
                <button type="button" className="products-modal__btn products-modal__btn--cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="button" onClick={(e) => handleSubmit(e, "Draft")} disabled={isSubmitting} className="products-modal__btn products-modal__btn--draft">
                  Save as Draft
                </button>
                <button type="button" onClick={(e) => handleSubmit(e, "Active")} disabled={isSubmitting} className="products-modal__btn products-modal__btn--publish">
                  {isSubmitting ? "Uploading..." : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
