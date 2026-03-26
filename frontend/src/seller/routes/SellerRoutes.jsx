import { Routes, Route } from 'react-router-dom';
import SellerSignup from '../pages/SellerSignup';
import SellerRegister from '../pages/SellerRegister';
import SellerLogin from '../pages/SellerLogin';
import ApprovalPending from '../pages/ApprovalPending';
import SellerDashboard from '../pages/SellerDashboard';
import SellerProtectedRoute from '../components/ProtectedRoute';

export default function SellerRoutes() {
  return (
    <Routes>
      <Route path="signup" element={<SellerSignup />} />
      <Route path="login" element={<SellerLogin />} />
      <Route path="register" element={<SellerRegister />} />
      <Route path="pending" element={
        <SellerProtectedRoute>
          <ApprovalPending />
        </SellerProtectedRoute>
      } />
      <Route path="dashboard" element={
        <SellerProtectedRoute requireApproved>
          <SellerDashboard />
        </SellerProtectedRoute>
      } />
    </Routes>
  );
}
