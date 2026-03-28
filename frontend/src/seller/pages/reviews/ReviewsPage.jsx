import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import './ReviewsPage.css';

const REVIEWS = [
  { id: 1, buyer: 'Priya S.', product: 'Handwoven Madhubani Saree', rating: 5, date: '27 Mar 2026', text: 'Absolutely beautiful! The colours are so vibrant and the weave quality is superb. Will definitely order again!', replied: false },
  { id: 2, buyer: 'Kavya M.', product: 'Pottery Vase', rating: 4, date: '25 Mar 2026', text: 'Lovely craftsmanship. Packaging was a bit damaged, but the product itself is perfect.', replied: true, reply: 'Thank you Kavya! Sorry for the packaging issue — we\'ll improve it.' },
  { id: 3, buyer: 'Ananya R.', product: 'Block Print Dupatta', rating: 5, date: '22 Mar 2026', text: 'Gorgeous piece. The block print is authentic and the fabric is soft. Great work!', replied: false },
  { id: 4, buyer: 'Rekha N.', product: 'Bamboo Basket', rating: 3, date: '18 Mar 2026', text: 'Good product but delivery took longer than expected.', replied: false },
];

const RatingBar = ({ value, max = 5 }) => (
  <div className="reviews-rating-bar">
    {Array.from({ length: max }).map((_, i) => (
      <Star key={i} size={14} fill={i < value ? '#E9C46A' : 'none'} stroke={i < value ? '#E9C46A' : '#D0C4B0'} />
    ))}
  </div>
);

const ReviewsPage = () => {
  const [replyDraft, setReplyDraft] = useState({});
  const [submitted, setSubmitted] = useState({});

  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  const handleReply = (id) => {
    if (replyDraft[id]?.trim()) {
      setSubmitted(s => ({ ...s, [id]: replyDraft[id] }));
      setReplyDraft(d => ({ ...d, [id]: '' }));
    }
  };

  return (
    <div className="reviews-page fade-in">

      <div className="reviews-header">
        <h2 className="reviews-title">Reviews & Ratings</h2>
        <p className="reviews-sub">See what your customers are saying about your products</p>
      </div>

      {/* Rating Summary */}
      <div className="reviews-summary">
        <div className="reviews-summary__avg">
          <span className="reviews-avg-number">{avgRating}</span>
          <div>
            <RatingBar value={Math.round(Number(avgRating))} />
            <p className="reviews-avg-label">Average across {REVIEWS.length} reviews</p>
          </div>
        </div>
        <div className="reviews-summary__breakdown">
          {[5, 4, 3, 2, 1].map(star => {
            const count = REVIEWS.filter(r => r.rating === star).length;
            const pct = Math.round((count / REVIEWS.length) * 100);
            return (
              <div className="reviews-breakdown-row" key={star}>
                <span className="reviews-breakdown-star">{star} ★</span>
                <div className="reviews-breakdown-track">
                  <div className="reviews-breakdown-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="reviews-breakdown-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="reviews-list">
        {REVIEWS.map(r => (
          <div className="review-card" key={r.id}>
            <div className="review-card__head">
              <div className="review-card__avatar">{r.buyer.charAt(0)}</div>
              <div>
                <div className="review-card__buyer">{r.buyer}</div>
                <div className="review-card__product">{r.product}</div>
              </div>
              <div className="review-card__meta">
                <RatingBar value={r.rating} />
                <span className="review-card__date">{r.date}</span>
              </div>
            </div>
            <p className="review-card__text">"{r.text}"</p>

            {/* Existing reply */}
            {(r.replied || submitted[r.id]) && (
              <div className="review-card__reply">
                <ThumbsUp size={13} />
                <div>
                  <strong>Your Reply:</strong>
                  <p>{submitted[r.id] || r.reply}</p>
                </div>
              </div>
            )}

            {/* Reply form */}
            {!r.replied && !submitted[r.id] && (
              <div className="review-card__reply-form">
                <textarea
                  className="review-card__reply-input"
                  placeholder="Write a reply to this customer…"
                  rows={2}
                  value={replyDraft[r.id] || ''}
                  onChange={e => setReplyDraft(d => ({ ...d, [r.id]: e.target.value }))}
                />
                <button className="review-card__reply-btn" onClick={() => handleReply(r.id)}>
                  <MessageSquare size={13} /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
