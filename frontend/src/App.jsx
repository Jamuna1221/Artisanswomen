import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './user/pages/Home/Home';
import SignIn from "./user/pages/SignIn/SignIn";
import Dashboard from "./user/pages/Dashboard/Dashboard";
import EmailOtpVerification from "./user/pages/OTP/OTP";
import { AuthProvider } from './admin/context/AuthContext';
import { AuthProvider as SellerAuthProvider } from './seller/context/AuthContext';
import AppRoutes from './admin/routes/AppRoutes';
import SellerRoutes from './seller/routes/SellerRoutes';
import UserProtectedRoute from './user/ProtectedRoute';
import AccountPage from './user/pages/Account/AccountPage';
import UserProductsPage from './user/pages/Products/UserProductsPage';
import ProductDetailPage from './user/pages/Products/ProductDetailPage';
import CategoryPage from './user/pages/Category/CategoryPage';
import CartPage from './user/pages/Cart/CartPage';
import CheckoutPage from './user/pages/Cart/CheckoutPage';
import { CartProvider } from "./user/context/CartContext";
import { Navigate } from 'react-router-dom';
import './admin/admin.css';

// Help & Footer
import Footer from './user/components/Footer/Footer';
import FAQsPage from './user/pages/Help/FAQsPage';
import TrackOrderPage from './user/pages/Help/TrackOrderPage';
import ReturnsPage from './user/pages/Help/ReturnsPage';
import ShippingPolicyPage from './user/pages/Help/ShippingPolicyPage';
import PrivacyPolicyPage from './user/pages/Help/PrivacyPolicyPage';
import TermsOfServicePage from './user/pages/Help/TermsOfServicePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SellerAuthProvider>
          <CartProvider>
            <Routes>
              {/* Buyer/Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/products" element={<UserProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              {/* Auth Routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/create" element={<SignIn />} />
              <Route path="/register" element={<SignIn />} />
              
              {/* OTP & Verification */}
              <Route path="/otp" element={<><EmailOtpVerification /><Footer /></>} />
              <Route path="/verify-otp" element={<><EmailOtpVerification /><Footer /></>} />
              
              {/* Protected Account Routes */}
              <Route path="/account/*" element={
                <UserProtectedRoute>
                  <AccountPage />
                </UserProtectedRoute>
              } />

              {/* Help Pages */}
              <Route path="/faqs" element={<><FAQsPage /><Footer /></>} />
              <Route path="/track-order" element={<><TrackOrderPage /><Footer /></>} />
              <Route path="/returns" element={<><ReturnsPage /><Footer /></>} />
              <Route path="/shipping-policy" element={<><ShippingPolicyPage /><Footer /></>} />
              <Route path="/privacy-policy" element={<><PrivacyPolicyPage /><Footer /></>} />
              <Route path="/terms" element={<><TermsOfServicePage /><Footer /></>} />

              {/* Seller routes */}
              <Route path="/seller/*" element={<SellerRoutes />} />
              {/* Admin routes */}
              <Route path="/*" element={<AppRoutes />} />
            </Routes>
          </CartProvider>
        </SellerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
