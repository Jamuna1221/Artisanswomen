import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Clock, CheckCircle, Download } from 'lucide-react';
import './EarningsPage.css';

const HISTORY = [
  { date: '28 Mar 2026', order: '#ORD003', product: 'Block Print Dupatta', amount: '₹1,200', type: 'Credit',  status: 'Paid' },
  { date: '27 Mar 2026', order: '#ORD002', product: 'Pottery Vase',         amount: '₹850',   type: 'Credit',  status: 'Paid' },
  { date: '24 Mar 2026', order: '#ORD001', product: 'Madhubani Saree',       amount: '₹2,400', type: 'Credit',  status: 'Pending' },
  { date: '20 Mar 2026', order: 'Withdrawal',  product: '—',                 amount: '₹1,500', type: 'Debit',   status: 'Processed' },
];

const EarningsPage = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState('');

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      setWithdrawMsg('Please enter a valid amount.');
      return;
    }
    setWithdrawMsg('✅ Withdrawal request submitted! Usually processed within 2–3 business days.');
    setWithdrawAmount('');
  };

  return (
    <div className="earnings-page fade-in">

      <div className="earnings-header">
        <h2 className="earnings-title">Earnings & Payments</h2>
        <p className="earnings-sub">Track your income, pending payments, and withdrawals</p>
      </div>

      {/* Summary cards */}
      <div className="earnings-cards">
        <div className="earnings-card earnings-card--primary">
          <div className="earnings-card__icon"><IndianRupee size={22} /></div>
          <div>
            <div className="earnings-card__value">₹4,450</div>
            <div className="earnings-card__label">Total Earnings</div>
          </div>
        </div>
        <div className="earnings-card earnings-card--pending">
          <div className="earnings-card__icon"><Clock size={22} /></div>
          <div>
            <div className="earnings-card__value">₹2,400</div>
            <div className="earnings-card__label">Pending Payments</div>
          </div>
        </div>
        <div className="earnings-card earnings-card--available">
          <div className="earnings-card__icon"><CheckCircle size={22} /></div>
          <div>
            <div className="earnings-card__value">₹2,050</div>
            <div className="earnings-card__label">Available to Withdraw</div>
          </div>
        </div>
        <div className="earnings-card earnings-card--growth">
          <div className="earnings-card__icon"><TrendingUp size={22} /></div>
          <div>
            <div className="earnings-card__value">+18%</div>
            <div className="earnings-card__label">This Week vs Last</div>
          </div>
        </div>
      </div>

      {/* Weekly summary insight */}
      <div className="earnings-insight">
        <span className="earnings-insight__emoji">💡</span>
        <div>
          <strong>Weekly Earnings Summary:</strong> You earned ₹2,050 this week — your best week yet! 
          Keep it up by adding more products or offering festival discounts.
        </div>
      </div>

      <div className="earnings-grid-2">

        {/* Withdraw */}
        <div className="earnings-withdraw-card">
          <h3 className="earnings-section-title">💸 Request Withdrawal</h3>
          <p className="earnings-section-sub">Funds are transferred to your registered bank account.</p>
          <div className="earnings-withdraw-form">
            <div className="earnings-withdraw-available">
              Available: <strong>₹2,050</strong>
            </div>
            <input
              type="number"
              className="earnings-withdraw-input"
              placeholder="Enter amount (₹)"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />
            <button className="earnings-withdraw-btn" onClick={handleWithdraw}>
              <IndianRupee size={15} /> Request Withdrawal
            </button>
            {withdrawMsg && <p className="earnings-withdraw-msg">{withdrawMsg}</p>}
          </div>
        </div>

        {/* Monthly chart placeholder */}
        <div className="earnings-chart-card">
          <h3 className="earnings-section-title">📈 Monthly Performance</h3>
          <div className="earnings-chart">
            {[20, 45, 30, 60, 55, 80, 65, 90, 70, 40, 55, 75].map((h, i) => (
              <div key={i} className="earnings-bar-wrap">
                <div className="earnings-bar" style={{ height: `${h}%` }} />
                <span className="earnings-bar-label">
                  {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="earnings-history-card">
        <div className="earnings-history-head">
          <h3 className="earnings-section-title">📋 Payment History</h3>
          <button className="earnings-download-btn"><Download size={14} /> Export</button>
        </div>
        <div className="earnings-table-wrap">
          <table className="earnings-table">
            <thead>
              <tr><th>Date</th><th>Order</th><th>Product</th><th>Amount</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {HISTORY.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td className="earnings-order-id">{h.order}</td>
                  <td>{h.product}</td>
                  <td className={`earnings-amount ${h.type === 'Debit' ? 'earnings-amount--debit' : 'earnings-amount--credit'}`}>
                    {h.type === 'Debit' ? '−' : '+'}{h.amount}
                  </td>
                  <td>
                    <span className={`earnings-type-pill ${h.type === 'Debit' ? 'earnings-type-pill--debit' : 'earnings-type-pill--credit'}`}>
                      {h.type}
                    </span>
                  </td>
                  <td>
                    <span className={`earnings-status-pill ${h.status === 'Paid' || h.status === 'Processed' ? 'earnings-status-pill--done' : 'earnings-status-pill--pending'}`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
