import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { 
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Trash2,
  ChevronRight
} from "lucide-react";
import "./AccountPage.css";

// Tab Components (Assuming they are styled well, but I will fix them too)
import ProfileTab from "./tabs/ProfileTab";
import OrdersTab from "./tabs/OrdersTab";
import WishlistTab from "./tabs/WishlistTab";
import AddressTab from "./tabs/AddressTab";
import OverviewTab from "./tabs/OverviewTab";
import TrackOrderTab from "./tabs/TrackOrderTab";
import SecurityTab from "./tabs/SecurityTab";
import SupportTab from "./tabs/SupportTab";

const AccountPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            navigate("/signin");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/home");
    };

    const sidebarItems = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/account/overview" },
        { id: "profile", label: "My Profile", icon: <User size={18} />, path: "/account/profile" },
        { id: "orders", label: "My Orders", icon: <ShoppingBag size={18} />, path: "/account/orders" },
        { id: "addresses", label: "Address Book", icon: <MapPin size={18} />, path: "/account/addresses" },
        { id: "wishlist", label: "Wishlist", icon: <Heart size={18} />, path: "/account/wishlist" },
        { id: "track", label: "Track Orders", icon: <Truck size={18} />, path: "/account/track" },
        { id: "security", label: "Security", icon: <ShieldCheck size={18} />, path: "/account/security" },
        { id: "support", label: "Help & Support", icon: <HelpCircle size={18} />, path: "/account/support" },
    ];

    const currentTab = location.pathname.split("/")[2] || "overview";

    return (
        <>
        <Navbar />
        <div className="account-page-container">
            <div className="account-layout container">
                {/* SIDEBAR */}
                <aside className="account-sidebar">
                    <div className="user-short-profile">
                        <div className="avatar-circle">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="user-details">
                            <span className="hello">Hello,</span>
                            <span className="name">{user?.name || "Member"}</span>
                        </div>
                    </div>

                    <nav className="account-nav">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                className={`nav-link ${currentTab === item.id ? "active" : ""}`}
                                onClick={() => navigate(item.path)}
                            >
                                <span className="nav-icon-wrapper">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {currentTab === item.id && <ChevronRight className="active-arrow" size={14} />}
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                        
                        <button className="deactivate-link" onClick={() => alert("Permanent delete coming soon!")}>
                           Delete Account
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="account-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="overview" />} />
                        <Route path="overview" element={<OverviewTab user={user} />} />
                        <Route path="profile" element={<ProfileTab user={user} setUser={setUser} />} />
                        <Route path="orders" element={<OrdersTab />} />
                        <Route path="addresses" element={<AddressTab />} />
                        <Route path="wishlist" element={<WishlistTab />} />
                        <Route path="track" element={<TrackOrderTab />} />
                        <Route path="security" element={<SecurityTab />} />
                        <Route path="support" element={<SupportTab />} />
                    </Routes>
                </main>
            </div>
        </div>
        </>
    );
};

export default AccountPage;
