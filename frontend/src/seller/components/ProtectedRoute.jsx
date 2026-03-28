import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * - requireApproved: also checks verificationStatus === 'Approved'
 */
const ProtectedRoute = ({ children, requireApproved = false }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner dark" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  if (requireApproved && user?.verificationStatus !== 'Approved') {
    return <Navigate to="/seller/pending" replace />;
  }

  return children;
};

export default ProtectedRoute;
