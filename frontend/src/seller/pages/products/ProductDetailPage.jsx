import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Star, Eye, TrendingUp, AlertCircle, MessageSquare, IndianRupee } from "lucide-react";
import * as productService from "../../services/sellerProductService";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [questions, setQuestions] = useState(null);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodData, anData, revData, qData] = await Promise.all([
        productService.getProductById(id),
        productService.getProductAnalytics(id),
        productService.getProductReviews(id),
        productService.getProductQuestions(id)
      ]);
      setProduct(prodData);
      setAnalytics(anData);
      setReviews(revData);
      setQuestions(qData);
    } catch (err) {
      console.error(err);
      alert("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      const newStatus = e.target.value;
      await productService.updateStatus(id, newStatus);
      fetchData(); // reload
    } catch (err) {
      console.error(err);
    }
  };

  const handleInlineEdit = async (field, value) => {
    try {
      if (field === 'price') await productService.inlineEdit(id, { price: value });
      if (field === 'stock') await productService.inlineEdit(id, { stock: value });
      fetchData(); // reload to get new calculations
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerQuestion = async (qid, answer) => {
    if (!answer.trim()) return;
    try {
      await productService.answerQuestion(id, qid, answer);
      const qData = await productService.getProductQuestions(id); // reload Q&A
      setQuestions(qData);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-detail-loading"><Loader2 className="lucide-spin" size={40} /></div>;
  if (!product) return <div className="p-detail-loading">Product not found</div>;

  return (
    <div className="p-detail-page fade-in">
      {/* Top Header */}
      <div className="p-detail-header">
        <button className="p-detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Products
        </button>
        <div className="p-detail-head-actions">
          <select 
            className={`p-detail-status-select p-detail-status--${product.status.replace(/\s+/g, '-').toLowerCase()}`}
            value={product.status}
            onChange={handleStatusChange}
          >
            <option value="Active">🟢 Active Listings</option>
            <option value="Draft">🟡 Draft</option>
            <option value="Out of Stock">🔴 Out of Stock</option>
          </select>
          <button className="p-detail-btn-primary" onClick={() => navigate(`/seller/dashboard/products/${id}/edit`)}>
            Edit Product
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-detail-hero">
        <div className="p-detail-gallery">
          {product.images?.length > 0 ? (
            <img src={product.images[0]} alt={product.title} className="p-detail-main-img" />
          ) : (
            <div className="p-detail-no-img">No Image<br/><span style={{fontSize:'0.8rem'}}>Upload one in Edit Mode</span></div>
          )}
          {product.images?.length > 1 && (
            <div className="p-detail-thumbnails">
              {product.images.slice(1, 5).map((img, i) => (
                <img key={i} src={img} alt="thumb" className="p-detail-thumb-img" />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-detail-info">
          <div className="p-detail-sku">SKU: {product.sku}</div>
          <h1 className="p-detail-title">{product.title}</h1>
          <div className="p-detail-cat">{product.category?.name || product.category || "Uncategorized"}</div>
          
          <div className="p-detail-price-row">
            <div>
              <div className="p-detail-info-label">Price (₹)</div>
              <input 
                type="number" 
                className="p-detail-inline-input" 
                defaultValue={product.price}
                onBlur={(e) => handleInlineEdit('price', e.target.value)}
              />
            </div>
            <div>
              <div className="p-detail-info-label">Stock Units</div>
              <input 
                type="number" 
                className="p-detail-inline-input" 
                defaultValue={product.stock}
                onBlur={(e) => handleInlineEdit('stock', e.target.value)}
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-detail-quick-stats">
            <div className="p-q-stat">
              <Eye size={16} color="var(--smoke)" /> <span>{analytics?.views || 0} Views</span>
            </div>
            <div className="p-q-stat">
              <TrendingUp size={16} color="var(--teal)" /> <span>{analytics?.sold || 0} Sold</span>
            </div>
            <div className="p-q-stat">
              <IndianRupee size={16} color="var(--clay)" /> <span>₹{(analytics?.revenue || 0).toLocaleString()} Rev</span>
            </div>
            <div className="p-q-stat">
              <Star size={16} color="var(--gold-dark)" /> <span>{product.rating > 0 ? product.rating : 'N/A'} Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-detail-tabs">
        {['overview', 'analytics', 'reviews', 'questions'].map(tab => (
          <button 
            key={tab} 
            className={`p-detail-tab ${activeTab === tab ? 'p-detail-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'questions' && analytics?.unansweredQuestions > 0 && (
              <span className="p-detail-badge">{analytics.unansweredQuestions}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-detail-content">
        
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-tab-panel fade-up">
            <h3>Description</h3>
            <p style={{ whiteSpace: "pre-wrap", color: "var(--bark)", lineHeight: 1.6 }}>
              {product.description || "No description provided."}
            </p>
            {product.tags?.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3>Tags</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.tags.map(t => <span key={t} className="p-detail-tag">#{t}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-tab-panel fade-up">
            <div className="p-analytics-grid">
              <div className="p-an-card">
                <div className="p-an-icon"><TrendingUp size={24} /></div>
                <div className="p-an-val">{analytics?.conversionRate}%</div>
                <div className="p-an-lbl">Conversion Rate</div>
                <div className="p-an-desc">Orders / Views x 100</div>
              </div>
              <div className="p-an-card">
                <div className="p-an-icon" style={{background:'#fef3c7', color:'#b45309'}}><IndianRupee size={24} /></div>
                <div className="p-an-val">₹{(analytics?.revenue || 0).toLocaleString()}</div>
                <div className="p-an-lbl">Total Revenue Generated</div>
              </div>
              <div className="p-an-card">
                <div className="p-an-icon" style={{background:'#fee2e2', color:'#991b1b'}}><AlertCircle size={24} /></div>
                <div className="p-an-val">{analytics?.complaintCount || 0}</div>
                <div className="p-an-lbl">Active Complaints</div>
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="p-chart-placeholder">
              📊 Sales velocity chart will appear here after enough transactions occur.
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="p-tab-panel fade-up">
            {reviews?.total === 0 ? (
              <div className="p-empty-state">No reviews yet.</div>
            ) : (
              <div className="p-reviews-layout">
                {/* Breakdown */}
                <div className="p-review-breakdown">
                  <div className="p-rev-avg">{reviews?.avgRating} <Star size={24} fill="var(--gold)" color="var(--gold-dark)"/></div>
                  <div className="p-rev-count">Based on {reviews?.total} reviews</div>
                  
                  {[5,4,3,2,1].map(r => {
                    const count = reviews?.breakdown?.[r] || 0;
                    const pct = reviews?.total ? (count / reviews.total) * 100 : 0;
                    return (
                      <div key={r} className="p-rev-bar-row">
                        <span>{r} ⭐</span>
                        <div className="p-rev-bar"><div className="p-rev-bar-fill" style={{width: `${pct}%`}}></div></div>
                        <span>{count}</span>
                      </div>
                    )
                  })}
                </div>
                {/* List */}
                <div className="p-review-list">
                  {reviews?.reviews?.map(r => (
                    <div key={r._id} className="p-review-item">
                      <div className="p-rev-hdr">
                        <strong>{r.buyerId?.name || "Anonymous Buyer"}</strong>
                        <span style={{color: 'var(--gold-dark)', fontSize: '0.8rem'}}>{"⭐".repeat(r.rating)}</span>
                      </div>
                      <p className="p-rev-comment">{r.comment}</p>
                      <small style={{color:'var(--smoke)'}}>{new Date(r.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUESTIONS */}
        {activeTab === 'questions' && (
          <div className="p-tab-panel fade-up">
            {questions?.total === 0 ? (
              <div className="p-empty-state">No questions asked yet.</div>
            ) : (
              <div className="p-qa-list">
                {questions?.questions?.map(q => (
                  <div key={q._id} className="p-qa-item">
                    <div className="p-qa-q"><MessageSquare size={16} /> <strong>Q:</strong> {q.question} <small>— {q.askerId?.name}</small></div>
                    {q.answer ? (
                      <div className="p-qa-a"><strong>A:</strong> {q.answer}</div>
                    ) : (
                      <div className="p-qa-reply-box">
                        <textarea id={`reply-${q._id}`} placeholder="Type your answer here..." rows={2} className="p-qa-input"></textarea>
                        <button 
                          className="p-qa-btn" 
                          onClick={() => {
                            const val = document.getElementById(`reply-${q._id}`).value;
                            handleAnswerQuestion(q._id, val);
                          }}
                        >Post Answer</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
