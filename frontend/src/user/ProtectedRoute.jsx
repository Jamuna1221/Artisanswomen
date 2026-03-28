import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // If no token or no user, redirect to signin
  if (!token || !user) {
    return <Navigate to="/signin" />;
  }

  // Optionally ensure only 'buyer' role can access these routes (if needed)
  if (user.role !== 'buyer') {
    // Maybe show an error or redirect elsewhere
    return <Navigate to="/signin" />;
  }

  return children;
};

export default UserProtectedRoute;
