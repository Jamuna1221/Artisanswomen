import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBag } from "lucide-react";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/account/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data.orders || []);
            } catch (err) {
                setError("Could not load your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Shipped": return "status-shipped";
            case "Delivered": return "status-delivered";
            case "Cancelled": return "status-cancelled";
            default: return "status-pending";
        }
    };

    return (
        <div className="tab-container orders-tab fade-in">
            <h1 className="tab-title">Order History</h1>
            <p className="tab-subtitle">Track and manage your handcrafted purchases from various women artisans.</p>

            {loading ? <div className="tab-loading">Fetching your orders...</div> : (
                <div className="order-list">
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📦</span>
                            <p>No orders yet? Start your artisan journey today!</p>
                            <button className="q-btn">Start Shopping</button>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div className="order-card" key={order._id}>
                                <div className="order-header">
                                    <div className="order-meta-item">
                                        <span className="meta-label">ORDER ID</span>
                                        <span className="meta-val">#{order._id.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="order-meta-item">
                                        <span className="meta-label">DATE</span>
                                        <span className="meta-val">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-meta-item">
                                        <span className="meta-label">TOTAL</span>
                                        <span className="meta-val">₹{order.totalAmount}</span>
                                    </div>
                                    <span className={`status-badge status-${(order.orderStatus || "pending").toLowerCase()}`}>
                                        {order.orderStatus || "Pending"}
                                    </span>
                                </div>
                                <div className="order-body">
                                    <div className="order-item-list">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="order-item-row">
                                                <div className="item-img-box">
                                                    <ShoppingBag size={20} color="#8b3a2b" />
                                                </div>
                                                <div className="item-main-info">
                                                    <span className="item-name">{item.name}</span>
                                                    <span className="item-qty">Qty: {item.qty}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-actions" style={{marginTop:'25px'}}>
                                        <button className="q-btn">View Order Details</button>
                                        <button className="q-btn btn-outline" onClick={() => window.location.href='/account/track'}>Track Package</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
