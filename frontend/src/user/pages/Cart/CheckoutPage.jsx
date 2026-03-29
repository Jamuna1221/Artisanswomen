import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", pincode: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) navigate("/signin?redirect=/checkout");
    if (cartItems.length === 0 && !placed) navigate("/home");
  }, [token, cartItems, placed]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/signin");
    
    try {
      setLoading(true);
      const items = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      const shippingAddress = {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        pincode: address.pincode
      };

      await axios.post("/api/orders", {
        buyerId: user._id || user.id,
        items,
        totalAmount: cartTotal,
        shippingAddress,
        paymentMethod: "PhonePe/UPI" // Simulation
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPlaced(true);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  if (placed) {
    return (
      <div className="checkout-root">
        <Navbar />
        <main className="checkout-success container">
           <div className="success-lottie-wrap">✨</div>
           <h2>Order Placed Successfully!</h2>
           <p>Your handcrafted treasures are being prepared by our artisans. An email confirmation has been sent.</p>
           <Link to="/home" className="home-btn" onClick={() => clearCart()}>Return Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-root">
      <Navbar />
      <main className="checkout-container container">
        <h1 className="checkout-title">Checkout</h1>
        
        <form className="checkout-layout" onSubmit={handlePlaceOrder}>
          {/* Form */}
          <div className="checkout-form">
            <section className="form-section">
              <h3>Shipping Address</h3>
              <div className="address-inputs">
                 <input name="name" type="text" placeholder="Full Name" required value={address.name} onChange={handleInputChange} />
                 <input name="phone" type="text" placeholder="Phone Number" required value={address.phone} onChange={handleInputChange} />
                 <input name="street" type="text" placeholder="Address (House No, Street Area)" required value={address.street} onChange={handleInputChange} />
                 <div className="city-state">
                    <input name="pincode" type="text" placeholder="Pincode" required value={address.pincode} onChange={handleInputChange} />
                    <input name="city" type="text" placeholder="City" required value={address.city} onChange={handleInputChange} />
                 </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Payment Options</h3>
              <div className="payment-options">
                 <label className="pay-option">
                   <input type="radio" name="pay" defaultChecked />
                   <span>PhonePe / Google Pay / UPI</span>
                 </label>
                 <label className="pay-option">
                   <input type="radio" name="pay" disabled />
                   <span>Credit / Debit / ATM Card</span>
                 </label>
                 <label className="pay-option">
                   <input type="radio" name="pay" value="COD" />
                   <span>Cash on Delivery</span>
                 </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="checkout-summary-aside">
            <div className="summary-box">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item._id} className="summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="summary-row total-row">
                 <span>Amount Payable</span>
                 <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <button className="confirm-order-btn" type="submit" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
