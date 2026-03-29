import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user && token) fetchBackendData();
    else {
      const savedCart = localStorage.getItem("cart");
      const savedWish = localStorage.getItem("wishlist");
      if (savedCart) setCartItems(JSON.parse(savedCart));
      if (savedWish) setWishlistItems(JSON.parse(savedWish));
      setLoading(false);
    }
  }, [token]);

  const fetchBackendData = async () => {
    try {
      setLoading(true);
      const [cartRes, wishRes] = await Promise.all([
        axios.get("/api/cart", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const normalizedCart = (cartRes.data.items || []).map(item => ({
        ...item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        _id: item.productId._id,
        image: item.productId.images?.[0] || item.productId.image
      }));
      setCartItems(normalizedCart);
      const normalizedWish = (wishRes.data || []).map(item => ({
        ...item.productId,
        image: item.productId.images?.[0] || item.productId.image
      }));
      setWishlistItems(normalizedWish);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!token) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [cartItems, wishlistItems, token]);

  const addToCart = async (product, qty = 1, size = null, color = null) => {
    if (token) {
      try {
        const res = await axios.post("/api/cart", { 
          productId: product._id, 
          quantity: qty,
          selectedSize: size,
          selectedColor: color
        }, { headers: { Authorization: `Bearer ${token}` } });
        const normalized = res.data.items.map(item => ({
          ...item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          _id: item.productId._id,
          image: item.productId.images?.[0] || item.productId.image
        }));
        setCartItems(normalized);
      } catch (err) { console.error(err); }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((i) => i._id === product._id && i.selectedSize === size && i.selectedColor === color);
        if (existing) {
          return prev.map((i) =>
            (i._id === product._id && i.selectedSize === size && i.selectedColor === color) 
            ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, { ...product, quantity: qty, selectedSize: size, selectedColor: color }];
      });
    }
  };

  const removeFromCart = async (id) => {
    if (token) {
        try {
            const res = await axios.delete(`/api/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchBackendData(); // Re-fetch for safety
        } catch (err) { console.error(err); }
    } else {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (token) {
        try {
            await axios.put(`/api/cart/${id}`, { quantity: newQty }, { headers: { Authorization: `Bearer ${token}` } });
            fetchBackendData();
        } catch (err) { console.error(err); }
    } else {
        setCartItems((prev) => prev.map((item) => item._id === id ? { ...item, quantity: Math.max(1, newQty) } : item));
    }
  };

  const clearCart = async () => {
    if (token) {
        try {
            await axios.delete("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
            setCartItems([]);
        } catch (err) { console.error(err); }
    } else { setCartItems([]); }
  };

  const toggleWishlist = async (product) => {
    if (token) {
        const existing = wishlistItems.find(item => item._id === product._id);
        try {
            if (existing) {
                await axios.delete(`/api/wishlist/${product._id}`, { headers: { Authorization: `Bearer ${token}` } });
                setWishlistItems(prev => prev.filter(i => i._id !== product._id));
            } else {
                const res = await axios.post("/api/wishlist", { productId: product._id }, { headers: { Authorization: `Bearer ${token}` } });
                const item = { ...res.data.productId, image: res.data.productId.images?.[0] || res.data.productId.image };
                setWishlistItems(prev => [...prev, item]);
            }
        } catch (err) { console.error(err); }
    } else {
        setWishlistItems((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) return prev.filter((i) => i._id !== product._id);
            return [...prev, product];
        });
    }
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item._id === id);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      wishlistItems, toggleWishlist, isInWishlist, loading,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};
