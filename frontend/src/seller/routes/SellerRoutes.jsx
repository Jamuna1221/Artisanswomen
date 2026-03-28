import { Routes, Route, Navigate } from 'react-router-dom';
import SellerSignup from '../pages/SellerSignup';
import SellerRegister from '../pages/SellerRegister';
import SellerLogin from '../pages/SellerLogin';
import ApprovalPending from '../pages/ApprovalPending';
import SellerProtectedRoute from '../components/ProtectedRoute';
import SellerLayout from '../components/layout/SellerLayout';
import OverviewPage from '../pages/dashboard/OverviewPage';
import ProductsPage from '../pages/products/ProductsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import EarningsPage from '../pages/earnings/EarningsPage';
import ReviewsPage from '../pages/reviews/ReviewsPage';
import MessagesPage from '../pages/messages/MessagesPage';
import SettingsPage from '../pages/settings/SettingsPage';

export default function SellerRoutes() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route path="signup" element={<SellerSignup />} />
      <Route path="login" element={<SellerLogin />} />
      <Route path="register" element={<SellerRegister />} />
      <Route path="pending" element={
        <SellerProtectedRoute>
          <ApprovalPending />
        </SellerProtectedRoute>
      } />

      {/* Protected dashboard with sidebar layout */}
      <Route path="dashboard" element={
        <SellerProtectedRoute requireApproved>
          <SellerLayout />
        </SellerProtectedRoute>
      }>
        {/* Index → Overview */}
        <Route index element={<OverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="earnings" element={<EarningsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
    </Routes>
  );
}
