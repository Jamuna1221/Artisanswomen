import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './pages/Home/Home';
import SignIn from "./pages/SignIn/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from './admin/context/AuthContext';
import { AuthProvider as SellerAuthProvider } from './context/AuthContext';
import AppRoutes from './admin/routes/AppRoutes';
import './admin/admin.css';


// This App component is the main entry point for both Admin and User-side (Home)
function App() {
  return (
    <BrowserRouter>
      {/* We nest both providers so both sections work */}
      <AuthProvider>
        <SellerAuthProvider>
          <AppRoutes />
        </SellerAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/account" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
