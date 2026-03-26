import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  UserCircle, 
  ShoppingBag, 
  ShoppingCart, 
  MessageSquare, 
  Tags, 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="nav-item-icon" /> },
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="nav-item-icon" /> },
      ]
    },
    {
      label: 'Marketplace',
      items: [
        { name: 'Verification', path: '/admin/verifications', icon: <ClipboardCheck className="nav-item-icon" /> },
        { name: 'Artisans', path: '/admin/artisans', icon: <Users className="nav-item-icon" /> },
        { name: 'Buyers', path: '/admin/buyers', icon: <UserCircle className="nav-item-icon" /> },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag className="nav-item-icon" /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="nav-item-icon" /> },
      ]
    },
    {
      label: 'Management',
      items: [
        { name: 'Categories', path: '/admin/categories', icon: <Tags className="nav-item-icon" /> },
        { name: 'Complaints', path: '/admin/complaints', icon: <MessageSquare className="nav-item-icon" /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="nav-item-icon" /> },
      ]
    },
    {
      label: 'Account',
      items: [
        { name: 'Admin Profile', path: '/admin/profile', icon: <User className="nav-item-icon" /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings className="nav-item-icon" /> },
      ]
    }
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-branding">
        <img src={logo} alt="Handora" className="h-logo" />
        <h1 className="brand-name">Handora</h1>
        <p className="brand-tagline">Hand Made Haven</p>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <h4>{group.label}</h4>
            {group.items.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                end={item.path === '/admin'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
