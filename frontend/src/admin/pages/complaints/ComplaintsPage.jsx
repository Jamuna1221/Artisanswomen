import React, { useState, useEffect } from 'react';
import { getComplaints, respondToComplaint, updateComplaintStatus } from '../../services/complaintService';
import Table from '../../components/ui/Table';
import { Search, Info, CheckCircle, Clock, XCircle, Mail, Send } from 'lucide-react';
import './ComplaintsPage.css';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // 'Open', 'In Progress', 'Resolved', 'Closed'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('seller'); // 'seller' or 'buyer'

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { fromRole: activeTab };
      if (filter) params.status = filter;
      if (searchTerm) params.search = searchTerm;

      const data = await getComplaints(params);
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delay);
  }, [filter, searchTerm, activeTab]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchData();
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return alert("Message cannot be empty");
    try {
      setSendingReply(true);
      await respondToComplaint(selectedComplaint._id, { adminReply: replyMessage, status: 'Resolved' });
      alert("Reply sent successfully and status marked as Resolved.");
      setReplyMessage('');
      fetchData();
      setSelectedComplaint(null);
    } catch (err) {
      alert("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const headers = [activeTab === 'seller' ? "Artisan" : "Buyer", "Subject", "Date Submitted", "Status", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td>
        <div><strong>{item.userId?.name || 'Unknown User'}</strong></div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.userId?.email || 'N/A'}</div>
      </td>
      <td>
        <div style={{ fontWeight: item.status === 'Open' ? '600' : '400' }}>
          {item.subject}
        </div>
      </td>
      <td>
        {new Date(item.createdAt).toLocaleDateString()}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </div>
      </td>
      <td>
        <span className={`status-pill status-${item.status?.replace(' ', '').toLowerCase() || 'open'}`}>
          {item.status || 'Open'}
        </span>
      </td>
      <td>
        <div className="action-btns">
          <button
            className="icon-btn view"
            onClick={() => setSelectedComplaint(item)}
            title="View Details"
          >
            <Info size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container complaints-page fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
          <div>
            <h2>Help & Support Tickets</h2>
            <p>Manage complaints and support requests from {activeTab === 'seller' ? 'Sellers (Artisans)' : 'Buyers (Customers)'}</p>
          </div>

          <div className="filters-container" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <Search size={16} color="#888" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search subjects or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent' }}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="admin-tabs" style={{ display: 'flex', gap: '20px', marginTop: '30px', borderBottom: '2px solid #eee' }}>
          <button 
            className={`tab-btn ${activeTab === 'seller' ? 'active' : ''}`} 
            onClick={() => setActiveTab('seller')}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'seller' ? '3px solid var(--primary-color)' : 'none', cursor: 'pointer', fontWeight: activeTab === 'seller' ? '700' : '500' }}
          >
            Seller Complaints
          </button>
          <button 
            className={`tab-btn ${activeTab === 'buyer' ? 'active' : ''}`} 
            onClick={() => setActiveTab('buyer')}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'buyer' ? '3px solid var(--primary-color)' : 'none', cursor: 'pointer', fontWeight: activeTab === 'buyer' ? '700' : '500' }}
          >
            Buyer Complaints
          </button>
        </div>
      </div>

      <Table headers={headers} data={complaints} renderRow={renderRow} loading={loading} />

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content complaints-modal" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="modal-close-btn"
            >
              <XCircle size={24} />
            </button>
            <h3 style={{ marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} color="var(--primary-color)" /> Ticket Details
            </h3>

            <div className="complaint-meta">
              <div>
                <strong>From:</strong> {selectedComplaint.userId?.name} ({selectedComplaint.userId?.email})
              </div>
              <div>
                <strong>Submitted:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <strong>Status:</strong>
                <select
                  value={selectedComplaint.status}
                  onChange={(e) => handleStatusChange(selectedComplaint._id, e.target.value)}
                  className={`status-select status-${selectedComplaint.status?.replace(' ', '').toLowerCase() || 'open'}`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="complaint-body">
              <h4 className="complaint-subject">{selectedComplaint.subject}</h4>
              <div className="complaint-message">{selectedComplaint.message}</div>
            </div>

            <div className="complaint-reply-section">
              <h4>Response / Notes</h4>
              {selectedComplaint.adminReply ? (
                <div className="existing-reply">
                  <strong>Previous Reply ({new Date(selectedComplaint.repliedAt).toLocaleDateString()}):</strong>
                  <p>{selectedComplaint.adminReply}</p>
                </div>
              ) : null}
              
              <div style={{ marginTop: '15px' }}>
                <textarea
                  placeholder="Type your response or internal note here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="reply-textarea"
                />
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="send-reply-btn"
                >
                  {sendingReply ? 'Sending...' : <><Send size={16} /> Mark Resolved & Send Reply</>}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
