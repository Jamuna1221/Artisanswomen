import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerNavbar from './SellerNavbar';
import './SellerLayout.css';

const SellerLayout = () => {
  return (
    <div className="s-layout">
      <SellerSidebar />
      <div className="s-layout__content">
        <SellerNavbar />
        <main className="s-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
