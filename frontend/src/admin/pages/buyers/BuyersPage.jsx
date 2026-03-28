import React, { useState, useEffect } from 'react';
import { getBuyers } from '../../services/buyerService';
import Table from '../../components/ui/Table';
import { Search, Info, Trash2, XCircle, ShoppingBag } from 'lucide-react';
import { io } from 'socket.io-client';
import './BuyersPage.css';

const BuyersPage = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const data = await getBuyers(params);
      setBuyers(data.buyers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBuyers();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Real-time Update Listener
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('new_buyer_registered', (data) => {
      if (data && data.buyer) {
        setBuyers(prev => {
          // Prevent duplicates if already fetched via interval/manual
          if (prev.find(b => b._id === data.buyer._id)) return prev;
          return [data.buyer, ...prev];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const headers = ["Full Name / Email", "Phone", "Location", "Gender", "Registered On", "Status", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id} className="buyer-row fade-in">
      <td>
        <div><strong>{item.fullName || item.name}</strong></div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.email}</div>
      </td>
      <td>{item.phone || 'N/A'}</td>
      <td>
        {item.city || item.state ? `${item.city || ''}${item.city && item.state ? ', ' : ''}${item.state || ''}` : 'N/A'}
      </td>
      <td>{item.gender || 'N/A'}</td>
      <td>
        {new Date(item.createdAt).toLocaleDateString()}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </div>
      </td>
      <td>
        <span className="status-pill status-active">Active</span>
      </td>
      <td>
        <div className="action-btns">
          <button
            className="icon-btn view"
            onClick={() => setSelectedBuyer(item)}
            title="View Details"
          >
            <Info size={18} />
          </button>
          <button
            className="icon-btn delete"
            onClick={() => alert('Delete logic coming soon!')}
            title="Delete Buyer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container buyers-page fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2>Platform Buyers</h2>
          <p>Manage all registered buyers currently exploring the platform</p>
        </div>

        <div className="filters-container" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
          <div className="search-bar">
            <Search size={16} color="#888" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search buyer by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <Table headers={headers} data={buyers} renderRow={renderRow} loading={loading} />

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <div className="modal-overlay" onClick={() => setSelectedBuyer(null)}>
          <div className="modal-content buyers-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedBuyer(null)} className="modal-close-btn">
              <XCircle size={24} />
            </button>
            <h3 className="modal-title">
              <ShoppingBag size={20} color="var(--primary-color)" /> Buyer Profile Data
            </h3>

            <div className="buyer-meta-grid">
              <div className="meta-block">
                <strong>Name:</strong> {selectedBuyer.fullName || selectedBuyer.name}
              </div>
              <div className="meta-block">
                <strong>Email:</strong> {selectedBuyer.email}
              </div>
              <div className="meta-block">
                <strong>Contact:</strong> {selectedBuyer.phone || 'Not Provided'}
              </div>
              <div className="meta-block">
                <strong>Gender:</strong> {selectedBuyer.gender || 'Not Provided'}
              </div>
              <div className="meta-block">
                <strong>Age:</strong> {selectedBuyer.age || 'Not Provided'}
              </div>
              <div className="meta-block">
                <strong>Location:</strong> {selectedBuyer.city || ''} {selectedBuyer.state || ''}
              </div>
              <div className="meta-block">
                <strong>Registered At:</strong> {new Date(selectedBuyer.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="buyer-bio-section">
              <h4>About the Buyer</h4>
              <p>{selectedBuyer.bio || 'No bio provided.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyersPage;
