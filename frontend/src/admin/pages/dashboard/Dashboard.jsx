import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  ClipboardCheck, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes, analyticsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent'),
          api.get('/analytics/overview')
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  const chartData = analytics?.labels.map((label, index) => ({
    name: label,
    reg: analytics.registrations[index],
    sales: analytics.revenue[index],
    orders: analytics.orders[index]
  })) || [];

  return (
    <div className="dashboard-container">
      <div className="db-header">
        <h1>Handora Administration</h1>
        <p>A safe haven for your artisans' marketplace today.</p>
      </div>

      <div className="stat-cards">
        <div className="s-card terracotta">
          <div className="s-icon"><Users /></div>
          <div className="s-info">
            <h3>Total Artisans</h3>
            <p>{stats?.totalArtisans}</p>
          </div>
        </div>
        <div className="s-card mustard">
          <div className="s-icon"><ClipboardCheck /></div>
          <div className="s-info">
            <h3>Pending Verification</h3>
            <p>{stats?.pendingVerifications}</p>
          </div>
        </div>
        <div className="s-card teal">
          <div className="s-icon"><ShoppingBag /></div>
          <div className="s-info">
            <h3>Total Products</h3>
            <p>{stats?.totalProducts}</p>
          </div>
        </div>
        <div className="s-card charcoal">
          <div className="s-icon"><ShoppingCart /></div>
          <div className="s-info">
            <h3>Total Orders</h3>
            <p>{stats?.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="db-grid">
        <div className="grid-item chart-container">
          <h3>Registration & Orders Trend</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reg" stroke="#C05641" name="Registrations" />
                <Line type="monotone" dataKey="orders" stroke="#2A9D8F" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid-item recent-activity">
          <h3>Recent Verification Requests</h3>
          <div className="activity-list">
            {recent?.recentVerifications.map((v) => (
              <div key={v._id} className="activity-item">
                <div className="act-avatar"><Users size={16} /></div>
                <div className="act-details">
                  <p><strong>{v.artisanId?.name}</strong> submitted documents</p>
                  <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`status-tag ${v.status.toLowerCase()}`}>{v.status}</div>
              </div>
            ))}
            {recent?.recentVerifications.length === 0 && <p className="empty-msg">No pending requests</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
