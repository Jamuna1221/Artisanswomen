import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // If no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Allow both buyers and sellers to see account overview if logged in
  if (user.role !== 'buyer' && user.role !== 'seller') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default UserProtectedRoute;
