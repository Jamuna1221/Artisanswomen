import React, { useState } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, ExternalLink, AlertCircle, Loader } from 'lucide-react';
import './HelpPages.css';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        
        setLoading(true);
        setError("");
        setOrderData(null);
        
        try {
            const { data } = await axios.get(`http://localhost:5000/api/help/track/${orderId}`);
            setOrderData(data);
        } catch (err) {
            setError(err.response?.data?.message || "Order not found. Please verify the ID.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Package size={32} />;
            case 'Confirmed': return <CheckCircle size={32} />;
            case 'Shipped': return <Truck size={32} />;
            case 'Delivered': return <CheckCircle size={32} style={{ color: '#4CAF50' }} />;
            default: return <Package size={32} />;
        }
    };

    return (
        <div className="help-page-container tracking-page">
            <header className="help-header">
                <h1>Track Your Order</h1>
                <p>Enter your unique Order ID to check real-time status.</p>
                <form className="tracking-form" onSubmit={handleTrackOrder}>
                    <input 
                        type="text" 
                        placeholder="Enter Order ID" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? <Loader className="spin" size={18} /> : "Track Order"}
                    </button>
                </form>
            </header>

            <main className="tracking-results">
                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {orderData && (
                    <div className="order-details-card">
                        <div className="order-summary-header">
                            <div className="status-display">
                                <div className="status-icon-wrapper">
                                    {getStatusIcon(orderData.status)}
                                </div>
                                <div className="status-info">
                                    <span className="overline">CURRENT STATUS</span>
                                    <h2 className={`status-${orderData.status.toLowerCase()}`}>{orderData.status}</h2>
                                </div>
                            </div>
                            <div className="delivery-info">
                                <span className="overline">ESTIMATED DELIVERY</span>
                                <p>{orderData.estimatedDeliveryDate === "TBA" ? "Processing..." : new Date(orderData.estimatedDeliveryDate).toDateString()}</p>
                            </div>
                        </div>

                        <div className="product-list">
                            <h3>Items Summary</h3>
                            <div className="items-grid">
                                {orderData.products.map((item, idx) => (
                                    <div key={idx} className="item-row">
                                        <div className="item-meta">
                                            <span className="item-title">{item.title}</span>
                                            <span className="item-count">x {item.quantity}</span>
                                        </div>
                                        <span className="item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total-row">
                                <span>Total Amount</span>
                                <strong>₹{orderData.totalAmount}</strong>
                            </div>
                        </div>

                        <div className="order-meta-footer">
                            <p>Order Placed: {new Date(orderData.createdAt).toLocaleDateString()}</p>
                            <span className="order-id">ID: {orderData.orderId}</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrackOrderPage;
