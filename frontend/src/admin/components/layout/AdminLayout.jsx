import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-content">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
