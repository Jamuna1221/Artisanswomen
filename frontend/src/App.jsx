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
            <Route path="/*" element={<AppRoutes />} />

            {/* Seller routes (mounted under /seller/*) */}
            <Route path="/seller/*" element={<SellerRoutes />} />

            {/* Buyer/Public Routes with Footer */}
            <Route path="/" element={<><Home /><Footer /></>} />
            <Route path="/signin" element={<><SignIn /><Footer /></>} />
            <Route path="/otp" element={<><EmailOtpVerification /><Footer /></>} />
            <Route path="/verify-otp" element={<><EmailOtpVerification /><Footer /></>} />
            <Route path="/account" element={<><Dashboard /><Footer /></>} />
            <Route path="/dashboard" element={<><Dashboard /><Footer /></>} />

            {/* Help Pages */}
            <Route path="/faqs" element={<><FAQsPage /><Footer /></>} />
            <Route path="/track-order" element={<><TrackOrderPage /><Footer /></>} />
            <Route path="/returns" element={<><ReturnsPage /><Footer /></>} />
            <Route path="/shipping-policy" element={<><ShippingPolicyPage /><Footer /></>} />
            <Route path="/privacy-policy" element={<><PrivacyPolicyPage /><Footer /></>} />
            <Route path="/terms" element={<><TermsOfServicePage /><Footer /></>} />
          </Routes>
        </SellerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
