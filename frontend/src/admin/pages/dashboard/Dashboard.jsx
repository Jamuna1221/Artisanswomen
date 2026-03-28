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
import './Dashboard.css';

/* ─── Lightweight inline chart (no recharts dependency needed) ─── */
const MiniLineChart = ({ data = [], color = '#C05641', label }) => {
  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const W = 500, H = 200, PAD = 30;
  const pts = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1 || 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `${PAD},${H - PAD} ${polyline} ${PAD + (W - PAD * 2)},${H - PAD}`;

  return (
    <div style={{ width: '100%', height: 220 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0,1,2,3,4].map(i => (
          <line key={i} x1={PAD} y1={PAD + i * (H - PAD * 2) / 4}
            x2={W - PAD} y2={PAD + i * (H - PAD * 2) / 4}
            stroke="#eee" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {/* Area fill */}
        <polygon points={area} fill={color} opacity="0.08" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Dots + tooltip */}
        {values.map((v, i) => {
          const x = PAD + (i / (values.length - 1 || 1)) * (W - PAD * 2);
          const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={color} />
              <title>{data[i]?.name}: {v}</title>
            </g>
          );
        })}
        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = PAD + (i / (values.length - 1 || 1)) * (W - PAD * 2);
          return (
            <text key={i} x={x} y={H - 5} textAnchor="middle"
              fontSize="11" fill="#999">{d.name}</text>
          );
        })}
        {/* Y-axis labels */}
        {[0,1,2,3,4].map(i => {
          const val = Math.round(min + (range / 4) * (4 - i));
          return (
            <text key={i} x={PAD - 5} y={PAD + i * (H - PAD * 2) / 4 + 4}
              textAnchor="end" fontSize="10" fill="#bbb">{val}</text>
          );
        })}
      </svg>
    </div>
  );
};

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

  /* Build chart data from analytics API response */
  const regData = analytics?.labels?.map((label, i) => ({
    name: label,
    value: analytics.registrations?.[i] ?? 0,
  })) || [];

  const orderData = analytics?.labels?.map((label, i) => ({
    name: label,
    value: analytics.orders?.[i] ?? 0,
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
          <h3>Registration Trend</h3>
          <MiniLineChart data={regData} color="#C05641" />
        </div>

        <div className="grid-item chart-container">
          <h3>Orders Trend</h3>
          <MiniLineChart data={orderData} color="#2A9D8F" />
        </div>

        <div className="grid-item recent-activity">
          <h3>Recent Verification Requests</h3>
          <div className="activity-list">
            {recent?.recentVerifications?.map((v) => (
              <div key={v._id} className="activity-item">
                <div className="act-avatar"><Users size={16} /></div>
                <div className="act-details">
                  <p><strong>{v.artisanId?.name}</strong> submitted documents</p>
                  <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`status-tag ${v.status.toLowerCase()}`}>{v.status}</div>
              </div>
            ))}
            {recent?.recentVerifications?.length === 0 && <p className="empty-msg">No pending requests</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

