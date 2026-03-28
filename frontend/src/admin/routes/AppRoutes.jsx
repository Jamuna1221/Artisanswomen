import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminLogin from '../pages/auth/AdminLogin';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from '../ProtectedRoute';
import VerificationRequests from '../pages/verification/VerificationRequests';
import ArtisansPage from '../pages/artisans/ArtisansPage';
import ProductsPage from '../pages/products/ProductsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ComplaintsPage from '../pages/complaints/ComplaintsPage';
import BuyersPage from '../pages/buyers/BuyersPage';
import Home from '../../user/pages/Home/Home';

// Remaining Placeholders
const AnalyticsPage = () => <div>Analytics Page</div>;
const NotFound = () => <div style={{padding: 50, textAlign: 'center'}}><h1>404</h1><p>Handora Page Not Found</p></div>;


const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Dashboard Protected Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="verifications" element={<VerificationRequests />} />
        <Route path="artisans" element={<ArtisansPage />} />
        <Route path="buyers" element={<BuyersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
