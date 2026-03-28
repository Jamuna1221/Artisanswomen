import React from 'react';
import {
  TrendingUp, ShoppingBag, ShoppingCart, IndianRupee, Star, Package, AlertTriangle
} from 'lucide-react';
import './OverviewPage.css';

const stats = [
  { icon: <IndianRupee size={20} />, label: 'Total Earnings', value: '₹0', color: '#C05641', bg: '#FFF0ED' },
  { icon: <ShoppingCart size={20} />, label: 'Total Orders', value: '0', color: '#2A9D8F', bg: '#E6F7F5' },
  { icon: <ShoppingBag size={20} />, label: 'Products Listed', value: '0', color: '#E9C46A', bg: '#FBF6E9' },
  { icon: <Star size={20} />, label: 'Avg. Rating', value: '—', color: '#7C5CBF', bg: '#F3EFFA' },
];

const recentOrders = [
  { id: '#ORD001', product: 'Handwoven Saree', buyer: 'Priya S.', amount: '₹2,400', status: 'Pending' },
  { id: '#ORD002', product: 'Pottery Vase', buyer: 'Kavya M.', amount: '₹850', status: 'Shipped' },
  { id: '#ORD003', product: 'Block Print Dupatta', buyer: 'Ananya R.', amount: '₹1,200', status: 'Delivered' },
];

const statusClass = { Pending: 'overview-pill--pending', Shipped: 'overview-pill--shipped', Delivered: 'overview-pill--delivered' };

const OverviewPage = () => {
  return (
    <div className="overview-page fade-in">

      {/* Welcome Banner */}
      <div className="overview-banner">
        <div className="overview-banner__emoji">🧵</div>
        <div className="overview-banner__text">
          <h1 className="overview-banner__title">Welcome back! 🎉</h1>
          <p className="overview-banner__sub">
            Your artisan store is active. Here's how you're performing this week.
          </p>
        </div>
        <div className="overview-banner__growth">
          <TrendingUp size={18} />
          <span>Growth Insights: Set up your first product to start selling!</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="overview-stats">
        {stats.map((s) => (
          <div className="overview-stat-card" key={s.label}>
            <div className="overview-stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="overview-stat-value">{s.value}</div>
              <div className="overview-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns: chart placeholder + quick actions */}
      <div className="overview-grid-2">

        {/* Revenue Chart Placeholder */}
        <div className="overview-card">
          <div className="overview-card__head">
            <h3>📈 Revenue Graph</h3>
            <span className="overview-time-pill">This Month</span>
          </div>
          <div className="overview-chart-placeholder">
            <div className="overview-chart-bars">
              {[30, 55, 40, 70, 45, 65, 80].map((h, i) => (
                <div key={i} className="overview-chart-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="overview-chart-days">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="overview-card">
          <div className="overview-card__head">
            <h3>⚡ Quick Actions</h3>
          </div>
          <div className="overview-actions">
            <a href="/seller/dashboard/products" className="overview-action-btn overview-action-btn--primary">
              <Package size={16} /> Add New Product
            </a>
            <a href="/seller/dashboard/orders" className="overview-action-btn">
              <ShoppingCart size={16} /> View Orders
            </a>
            <a href="/seller/dashboard/earnings" className="overview-action-btn">
              <IndianRupee size={16} /> Check Earnings
            </a>
            <div className="overview-low-stock">
              <AlertTriangle size={14} />
              <span>No low-stock alerts right now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="overview-card">
        <div className="overview-card__head">
          <h3>📦 Recent Orders</h3>
          <a href="/seller/dashboard/orders" className="overview-see-all">See All →</a>
        </div>
        <div className="overview-table-wrap">
          <table className="overview-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td className="overview-order-id">{o.id}</td>
                  <td>{o.product}</td>
                  <td>{o.buyer}</td>
                  <td className="overview-amount">{o.amount}</td>
                  <td>
                    <span className={`overview-pill ${statusClass[o.status]}`}>{o.status}</span>
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

export default OverviewPage;
