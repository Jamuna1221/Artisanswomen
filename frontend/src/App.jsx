import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './admin/context/AuthContext';
import AppRoutes from './admin/routes/AppRoutes';
import './admin/admin.css';

// This App component will be the entry point for Admin (and potentially user side if merged)
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* User side routes could go here as well if merged */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
