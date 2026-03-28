import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import './ProductsPage.css';

const SAMPLE_PRODUCTS = [
  {
    id: 1, name: 'Handwoven Madhubani Saree', category: 'Sarees',
    price: '₹2,400', stock: 8, status: 'Published',
    img: '🥻',
  },
  {
    id: 2, name: 'Terracotta Pottery Vase', category: 'Pottery',
    price: '₹850', stock: 15, status: 'Published',
    img: '🏺',
  },
  {
    id: 3, name: 'Block Print Cotton Dupatta', category: 'Dupattas',
    price: '₹1,200', stock: 0, status: 'Out of Stock',
    img: '🧣',
  },
  {
    id: 4, name: 'Bamboo Weave Basket', category: 'Handicrafts',
    price: '₹550', stock: 22, status: 'Draft',
    img: '🧺',
  },
];

const ProductsPage = () => {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const statusClass = {
    Published: 'products-pill--published',
    'Out of Stock': 'products-pill--oos',
    Draft: 'products-pill--draft',
  };

  return (
    <div className="products-page fade-in">

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
      <div className="products-stats">
        {[
          { label: 'Total Products', value: products.length, color: '#C05641' },
          { label: 'Published', value: products.filter(p => p.status === 'Published').length, color: '#059669' },
          { label: 'Drafts', value: products.filter(p => p.status === 'Draft').length, color: '#D97706' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: '#DC2626' },
        ].map(s => (
          <div className="products-stat" key={s.label}>
            <span className="products-stat__value" style={{ color: s.color }}>{s.value}</span>
            <span className="products-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="products-search-bar">
        <Search size={16} className="products-search-icon" />
        <input
          type="text"
          className="products-search-input"
          placeholder="Search products by name or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="products-grid">
        {filtered.map(p => (
          <div className="product-card" key={p.id}>
            <div className="product-card__img">{p.img}</div>
            <div className="product-card__body">
              <div className="product-card__top">
                <span className={`products-pill ${statusClass[p.status]}`}>{p.status}</span>
                <span className="product-card__category">{p.category}</span>
              </div>
              <h4 className="product-card__name">{p.name}</h4>
              <div className="product-card__meta">
                <span className="product-card__price">{p.price}</span>
                <span className="product-card__stock">
                  {p.stock === 0 ? '🚨 Out of Stock' : `📦 ${p.stock} in stock`}
                </span>
              </div>
              <div className="product-card__actions">
                <button className="product-card__btn" title="Edit"><Edit3 size={14} /></button>
                <button className="product-card__btn" title="Preview"><Eye size={14} /></button>
                <button className="product-card__btn product-card__btn--danger" title="Delete">
                  <Trash2 size={14} />
                </button>
                <button className="product-card__btn" title="Toggle status">
                  {p.status === 'Published' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="products-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="products-modal" onClick={e => e.stopPropagation()}>
            <div className="products-modal__head">
              <h3>Add New Product</h3>
              <button className="products-modal__close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="products-modal__body">
              <div className="products-modal__field">
                <label>Product Name</label>
                <input type="text" placeholder="e.g. Handwoven Silk Saree" />
              </div>
              <div className="products-modal__row">
                <div className="products-modal__field">
                  <label>Price (₹)</label>
                  <input type="number" placeholder="0.00" />
                </div>
                <div className="products-modal__field">
                  <label>Stock Quantity</label>
                  <input type="number" placeholder="0" />
                </div>
              </div>
              <div className="products-modal__field">
                <label>Category</label>
                <select>
                  <option>Select category</option>
                  <option>Sarees</option>
                  <option>Pottery</option>
                  <option>Jewellery</option>
                  <option>Handicrafts</option>
                  <option>Textiles</option>
                </select>
              </div>
              <div className="products-modal__field">
                <label>Description</label>
                <textarea placeholder="Describe your handcrafted product…" rows={3} />
              </div>
              <div className="products-modal__upload">
                <div className="products-modal__upload-box">
                  📷 <span>Upload Product Images</span>
                  <small>JPG, PNG · Max 5MB</small>
                </div>
              </div>
              <div className="products-modal__ai-hint">
                ✨ <strong>AI Description Helper</strong> — click below to generate a description
                <button className="products-ai-btn">Generate with AI</button>
              </div>
            </div>
            <div className="products-modal__foot">
              <button className="products-modal__cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="products-modal__save">Save as Draft</button>
              <button className="products-modal__publish">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
