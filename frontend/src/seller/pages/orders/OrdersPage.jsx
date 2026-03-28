import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Truck, Package, Clock, XCircle } from 'lucide-react';
import './OrdersPage.css';

const ORDERS = [
  { id: '#ORD001', product: 'Handwoven Madhubani Saree',  buyer: 'Priya Sharma',   date: '28 Mar 2026', amount: '₹2,400', status: 'Pending',   city: 'Mumbai' },
  { id: '#ORD002', product: 'Terracotta Pottery Vase',    buyer: 'Kavya Mehta',    date: '27 Mar 2026', amount: '₹850',   status: 'Shipped',   city: 'Bengaluru' },
  { id: '#ORD003', product: 'Block Print Cotton Dupatta', buyer: 'Ananya Reddy',   date: '26 Mar 2026', amount: '₹1,200', status: 'Delivered', city: 'Chennai' },
  { id: '#ORD004', product: 'Bamboo Weave Basket',        buyer: 'Rekha Nair',     date: '25 Mar 2026', amount: '₹550',   status: 'Pending',   city: 'Kochi' },
  { id: '#ORD005', product: 'Brass Dhokra Figurine',      buyer: 'Sunita Patel',   date: '24 Mar 2026', amount: '₹3,100', status: 'Cancelled', city: 'Ahmedabad' },
];

const STATUS_ICONS = {
  Pending:   <Clock size={13} />,
  Shipped:   <Truck size={13} />,
  Delivered: <CheckCircle size={13} />,
  Cancelled: <XCircle size={13} />,
};

const STATUS_CSS = {
  Pending:   'orders-pill--pending',
  Shipped:   'orders-pill--shipped',
  Delivered: 'orders-pill--delivered',
  Cancelled: 'orders-pill--cancelled',
};

const OrdersPage = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.id.includes(search) || o.buyer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="orders-page fade-in">

      <div className="orders-header">
        <div>
          <h2 className="orders-title">Order Management</h2>
          <p className="orders-sub">Track, update, and manage your customer orders</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="orders-summary">
        {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button
            key={s}
            className={`orders-filter-tab ${filterStatus === s ? 'orders-filter-tab--active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'All' ? <Package size={14} /> : STATUS_ICONS[s]}
            {s} {s === 'All' ? `(${ORDERS.length})` : `(${ORDERS.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="orders-search-bar">
        <Search size={15} className="orders-search-icon" />
        <input
          type="text"
          className="orders-search-input"
          placeholder="Search by order ID, buyer, or product…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Buyer</th>
              <th>City</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="orders-id">{o.id}</td>
                <td className="orders-product">{o.product}</td>
                <td>{o.buyer}</td>
                <td className="orders-city">{o.city}</td>
                <td className="orders-date">{o.date}</td>
                <td className="orders-amount">{o.amount}</td>
                <td>
                  <span className={`orders-pill ${STATUS_CSS[o.status]}`}>
                    {STATUS_ICONS[o.status]} {o.status}
                  </span>
                </td>
                <td>
                  {o.status === 'Pending' && (
                    <button className="orders-ship-btn">
                      <Truck size={13} /> Mark Shipped
                    </button>
                  )}
                  {o.status === 'Shipped' && (
                    <button className="orders-deliver-btn">
                      <CheckCircle size={13} /> Delivered
                    </button>
                  )}
                  {(o.status === 'Delivered' || o.status === 'Cancelled') && (
                    <span className="orders-done-label">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="orders-empty">No orders found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
