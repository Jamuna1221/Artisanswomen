import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const WishlistTab = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/account/wishlist", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWishlist(res.data.wishlist || []);
            } catch (err) {
                setError("Could not load your wishlist. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter(w => w._id !== id));
    };

    return (
        <div className="tab-container wishlist-tab fade-in">
            <h1 className="tab-title">My Wishlist</h1>
            <p className="tab-subtitle">Your favorite handcrafted treasures from various artisans across India.</p>

            {loading ? <div className="tab-loading">Fetching your collection...</div> : (
                <div className="wishlist-grid">
                    {wishlist.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">❤️</span>
                            <p>No favorites yet? Explore our unique collection!</p>
                            <button className="q-btn">Start Exploring</button>
                        </div>
                    ) : (
                        wishlist.map(item => (
                            <div className="wish-card" key={item._id}>
                                <div className="wish-img-container">
                                    <img src={item.img} alt={item.name} className="wish-img" />
                                    <button className="remove-wish-btn" onClick={() => removeFromWishlist(item._id)}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="wish-details">
                                    <span className="wish-artisan">By {item.artisan}</span>
                                    <h4 className="wish-name">{item.name}</h4>
                                    <div className="wish-price-row">
                                        <span className="wish-curr">₹{item.price}</span>
                                        <span className="wish-prev">₹{item.mrp}</span>
                                        <span className="wish-disc">{Math.round(((item.mrp - item.price) / item.mrp) * 100)}% Off</span>
                                    </div>
                                    <div className="form-actions" style={{paddingTop:0, borderTop:'none', gap:'10px'}}>
                                        <button className="q-btn" style={{flex:1, padding:'10px'}}>Move to Cart</button>
                                        <button className="q-btn btn-outline" style={{flex:1, padding:'10px'}}>Details</button>
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

export default WishlistTab;
