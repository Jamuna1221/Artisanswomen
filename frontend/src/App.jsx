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


// This App component is the main entry point for both Admin and User-side (Home)
function App() {
  return (
    <BrowserRouter>
      {/* We nest both providers so both sections work */}
      <AuthProvider>
        <SellerAuthProvider>
          <Routes>
            {/* Admin routes (it uses absolute paths internally, so mounted at root wildcard) */}
            {/* Buyer/Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Dashboard />} />
            
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

            {/* Seller routes (mounted under /seller/*) */}
            <Route path="/seller/*" element={<SellerRoutes />} />

            {/* Admin routes (mounted last) */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </SellerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
