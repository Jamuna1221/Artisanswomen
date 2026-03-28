import React, { useState, useEffect } from 'react';
import { getArtisans, updateUserStatus, approveSeller, rejectSeller } from '../../services/userService';
import Table from '../../components/ui/Table';
import { Ban, CheckCircle, Info, Check, X, Search, FileText } from 'lucide-react';
import './ArtisansPage.css';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // 'Pending', 'Approved', 'Rejected', ''
  const [searchTerm, setSearchTerm] = useState('');
  const [viewedDocs, setViewedDocs] = useState({}); // Keep track of whose docs have been viewed
  const [reviewConfirmed, setReviewConfirmed] = useState(false); // Checkbox state
  const [customNotifyBox, setCustomNotifyBox] = useState(false);
  const [notifyData, setNotifyData] = useState({ title: '', message: '', type: 'info' });

  // Modal State
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [docViewerUrl, setDocViewerUrl] = useState(null); // Used to display the iframe/pdf/img modal

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.verificationStatus = filter;
      if (searchTerm) params.search = searchTerm;

      const data = await getArtisans(params);
      setArtisans(data.artisans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add small delay to debounce search
    const delay = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delay);
  }, [filter, searchTerm]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await updateUserStatus(id, newStatus);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleApprove = async (id) => {
    if (!viewedDocs[id]) {
      alert("Important: You must view the seller's documents before approving them to verify their proofs.");
      return;
    }

    try {
      if (window.confirm("Approve this seller? An email will be sent.")) {
        await approveSeller(id);
        alert("Seller approved! An approval email containing login instructions has been sent.");
        fetchData();
        setSelectedSeller(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve seller");
    }
  };

  const handleViewDocument = (sellerId, docType, index = null) => {
    const typeStr = index !== null ? `${docType}_${index}` : docType;
    // Set viewed for this seller
    setViewedDocs(prev => ({ ...prev, [sellerId]: true }));
    // Base URL depends on backend start, dynamically construct the endpoint
    const url = `/api/auth/document/${sellerId}/${typeStr}`;
    // Easiest is to open a new tab/window for the doc, or load it in our custom iframe 
    setDocViewerUrl(`http://localhost:5000${url}`); // adjust port if needed based on env, simple open for now
  };

  const handleReject = async (id) => {
    try {
      const reason = window.prompt("Reason for rejection:");
      if (reason !== null) {
        await rejectSeller(id, reason);
        alert("Seller rejected and email sent successfully.");
        fetchData();
        setSelectedSeller(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject seller");
    }
  };

  const headers = ["Seller", "Craft / Category", "Submitted Date", "Verification", "Status", "Actions", "Approvals"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td>
        <div><strong>{item.name}</strong></div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.email}</div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.phone}</div>
      </td>
      <td>
        {item.craftType && item.craftType.length > 0 ? item.craftType.join(", ") : "N/A"}
      </td>
      <td>
        {new Date(item.createdAt).toLocaleDateString()}
        <div style={{ fontSize: '0.8rem', color: '#888' }}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </div>
      </td>
      <td>
        <span className={`status-pill ${item.verificationStatus === 'Approved' ? 'status-active' : item.verificationStatus === 'Rejected' ? 'status-blocked' : 'status-pending'}`}>
          {item.verificationStatus || 'Pending'}
        </span>
      </td>
      <td>
        <span className={`status-pill ${item.status === 'active' ? 'status-active' : 'status-blocked'}`}>
          {item.status}
        </span>
      </td>
      <td>
        <div className="action-btns">
          <button
            className="icon-btn view"
            onClick={() => { setSelectedSeller(item); setReviewConfirmed(false); setCustomNotifyBox(false); }}
            title="View Details"
          >
            <Info size={18} />
          </button>
          {item.verificationStatus === 'Approved' && (
            <button
              className={`icon-btn ${item.status === 'active' ? 'delete' : 'edit'}`}
              onClick={() => toggleStatus(item._id, item.status)}
              title={item.status === 'active' ? 'Block Account' : 'Unblock Account'}
            >
              {item.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
            </button>
          )}
        </div>
      </td>
      <td>
        <div className="action-btns">
          {item.verificationStatus === 'Pending' && (
            <>
              <button
                className="icon-btn edit"
                onClick={() => handleApprove(item._id)}
                title={viewedDocs[item._id] ? "Approve Seller" : "Must View Documents First"}
                style={{ color: viewedDocs[item._id] ? 'green' : '#ccc', cursor: viewedDocs[item._id] ? 'pointer' : 'not-allowed' }}
              >
                <Check size={18} />
              </button>
              <button
                className="icon-btn delete"
                onClick={() => handleReject(item._id)}
                title="Reject Seller"
                style={{ color: 'red' }}
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2>Seller Approvals & Artisans</h2>
          <p>Review and manage seller registrations and accounts</p>
        </div>

        <div className="filters-container" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}>
            <Search size={16} color="#888" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search by name, email, craft..."
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Table headers={headers} data={artisans} renderRow={renderRow} loading={loading} />

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="modal-content" style={{
            background: '#fff', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
            padding: '25px', borderRadius: '10px', position: 'relative'
          }}>
            <button
              onClick={() => setSelectedSeller(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Seller Registration Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <p><strong>Name:</strong> {selectedSeller.name}</p>
                <p><strong>Email:</strong> {selectedSeller.email}</p>
                <p><strong>Phone:</strong> {selectedSeller.phone}</p>
                <p><strong>Age:</strong> {selectedSeller.age || 'N/A'} | <strong>Gender:</strong> {selectedSeller.gender || 'N/A'}</p>
                <p><strong>Aadhaar:</strong> {selectedSeller.aadhaarNumber || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Location:</strong> {selectedSeller.city}, {selectedSeller.district}, {selectedSeller.state}</p>
                <p><strong>Craft Type:</strong> {selectedSeller.craftType ? selectedSeller.craftType.join(", ") : 'N/A'}</p>
                <p><strong>Experience:</strong> {selectedSeller.experience || 'N/A'} years</p>
                <p><strong>Bio:</strong> {selectedSeller.bio || 'N/A'}</p>
                <p><strong>Social:</strong> WA: {selectedSeller.socialLinks?.whatsapp || 'N/A'}</p>
              </div>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}><FileText size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Document Status & Preview</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Profile Image:</strong> {selectedSeller.profileImage ? <button onClick={() => handleViewDocument(selectedSeller._id, 'profileImage')} className="btn-link">View File</button> : "Not Uploaded"}
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>ID Proof ({selectedSeller.idProofFile?.idProofType || 'N/A'}):</strong> {selectedSeller.idProofFile ? <button onClick={() => handleViewDocument(selectedSeller._id, 'idProof')} className="btn-link">View File</button> : "Not Uploaded"}
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Artisan Card / Pehchan:</strong> {selectedSeller.artisanCardFile ? <button onClick={() => handleViewDocument(selectedSeller._id, 'artisanCard')} className="btn-link">View File</button> : (selectedSeller.artisanCardFile?.hasPehchanCard ? "Has Card (No File)" : "No Card")}
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Business Proof:</strong> {selectedSeller.businessProofFile ? <button onClick={() => handleViewDocument(selectedSeller._id, 'businessProof')} className="btn-link">View File</button> : "Not Uploaded"}
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Address Proof:</strong> {selectedSeller.addressProofFile ? <button onClick={() => handleViewDocument(selectedSeller._id, 'addressProof')} className="btn-link">View File</button> : "Not Uploaded"}
                </li>
                {selectedSeller.productImages && selectedSeller.productImages.length > 0 && (
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Product Images:</strong> {selectedSeller.productImages.map((img, idx) => (
                      <button key={idx} onClick={() => handleViewDocument(selectedSeller._id, 'productImage', idx)} className="btn-link" style={{ marginRight: '10px' }}>Image {idx + 1}</button>
                    ))}
                  </li>
                )}
              </ul>
            </div>

            {selectedSeller.verificationStatus === 'Pending' && (
              <>
                <div style={{ marginBottom: '15px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#856404' }}>
                    <input
                      type="checkbox"
                      checked={reviewConfirmed}
                      onChange={(e) => setReviewConfirmed(e.target.checked)}
                      style={{ marginRight: '10px', transform: 'scale(1.2)' }}
                    />
                    I confirm that I have reviewed the seller details and all uploaded documents.
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '15px' }}>
                  <button
                    onClick={() => handleApprove(selectedSeller._id)}
                    disabled={!reviewConfirmed}
                    style={{ flex: 1, padding: '10px', background: reviewConfirmed ? '#2e7d32' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: reviewConfirmed ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                  >
                    Approve Seller
                  </button>
                  <button
                    onClick={() => handleReject(selectedSeller._id)}
                    disabled={!reviewConfirmed}
                    style={{ flex: 1, padding: '10px', background: reviewConfirmed ? '#d32f2f' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: reviewConfirmed ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                  >
                    Reject Seller
                  </button>
                </div>
              </>
            )}

            {/* Direct Admin Notification Feature */}
            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: '#f5f5f5', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Send Direct Notification</h4>
                <button onClick={() => setCustomNotifyBox(!customNotifyBox)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  {customNotifyBox ? 'Cancel' : 'Compose'}
                </button>
              </div>
              {customNotifyBox && (
                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="Title (e.g. Document Missing)" value={notifyData.title} onChange={e => setNotifyData({ ...notifyData, title: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <textarea placeholder="Message content..." value={notifyData.message} onChange={e => setNotifyData({ ...notifyData, message: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}></textarea>
                  <select value={notifyData.type} onChange={e => setNotifyData({ ...notifyData, type: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="info">Info</option>
                    <option value="warning">Action Required / Warning</option>
                    <option value="reminder">Reminder</option>
                  </select>
                  <button onClick={async () => {
                    if (!notifyData.title || !notifyData.message) return alert("Title and Message required");
                    try {
                      const { sendNotificationToSeller } = await import('../../services/userService');
                      await sendNotificationToSeller(selectedSeller._id, notifyData);
                      alert("Notification dispatched to Seller!");
                      setCustomNotifyBox(false);
                      setNotifyData({ title: '', message: '', type: 'info' });
                    } catch (err) {
                      alert("Failed to send notification.");
                    }
                  }} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Send to Seller
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Document Viewer Modal Overlay */}
      {docViewerUrl && (
        <div className="modal-overlay doc-viewer-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '15px 30px' }}>
            <a href={docViewerUrl} target="_blank" rel="noreferrer" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none', background: '#333', padding: '8px 15px', borderRadius: '5px' }}>Open Full Screen / Download</a>
            <button onClick={() => setDocViewerUrl(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
          </div>
          <iframe src={docViewerUrl} style={{ width: '85%', height: '80vh', border: 'none', background: '#fff', borderRadius: '10px' }} title="Document Viewer" />
        </div>
      )}
    </div>
  );
};

export default ArtisansPage;
