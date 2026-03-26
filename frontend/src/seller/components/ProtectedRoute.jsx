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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05641] border-t-transparent" />
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
