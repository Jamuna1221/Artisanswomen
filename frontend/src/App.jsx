import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './admin/context/AuthContext';
import AppRoutes from './admin/routes/AppRoutes';
import './admin/admin.css';

// This App component is the main entry point for both Admin and User-side (Home)
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
