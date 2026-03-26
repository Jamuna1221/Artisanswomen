import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './pages/Home/Home';
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from './admin/context/AuthContext';
import { AuthProvider as SellerAuthProvider } from './seller/context/AuthContext';
import AppRoutes from './admin/routes/AppRoutes';
import SellerRoutes from './seller/routes/SellerRoutes';
import './admin/admin.css';


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

            {/* Buyer routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/account" element={<Dashboard />} />
          </Routes>
        </SellerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
