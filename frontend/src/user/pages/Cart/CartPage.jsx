import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-root">
        <Navbar />
        <main className="cart-empty-container container">
           <div className="cart-empty-content">
             <div className="empty-cart-icon">🛒</div>
             <h2>Your cart is empty!</h2>
             <p>Add some handcrafted treasures from our artisans and bring them home.</p>
             <Link to="/home" className="shop-now-btn">Shop Now</Link>
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page-root">
      <Navbar />
      <main className="cart-container container">
        <h1 className="cart-title">Your Bag <span>({cartItems.length} items)</span></h1>
        
        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card">
                <div className="cart-item-img" onClick={() => navigate(`/product/${item._id}`)}>
                  <img src={item.image || "/placeholder.png"} alt={item.name} />
                </div>
                <div className="cart-item-details">
                   <div className="cart-item-header">
                      <h3 onClick={() => navigate(`/product/${item._id}`)}>{item.name}</h3>
                      <p className="cart-item-artisan">by {item.artisanName || "Artisan"}</p>
                   </div>
                   
                   <div className="cart-item-pricing">
                      <span className="cart-item-price">₹{item.price.toLocaleString()}</span>
                      {item.mrp && <span className="cart-item-mrp">₹{item.mrp.toLocaleString()}</span>}
                   </div>

                   <div className="cart-item-actions">
                      <div className="quantity-ctrl">
                        <button onClick={() => updateQuantity(item._id, -1)} disabled={item.quantity <= 1}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <aside className="cart-summary-aside">
            <div className="summary-box">
              <h3>Price Details</h3>
              <div className="summary-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">FREE</span>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <button 
                className="checkout-proceed-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
            
            <div className="safe-payments-badge">
               <span>🛡️</span> 100% Safe and Secure Payments.
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
