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
  
  // Modal State
  const [selectedSeller, setSelectedSeller] = useState(null);

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
        <div style={{fontSize: '0.85rem', color: '#666'}}>{item.email}</div>
        <div style={{fontSize: '0.85rem', color: '#666'}}>{item.phone}</div>
      </td>
      <td>
         {item.craftType && item.craftType.length > 0 ? item.craftType.join(", ") : "N/A"}
      </td>
      <td>
        {new Date(item.createdAt).toLocaleDateString()}
        <div style={{fontSize: '0.8rem', color: '#888'}}>
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
            onClick={() => setSelectedSeller(item)}
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
                title="Approve Seller"
                style={{ color: 'green' }}
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
                <Search size={16} color="#888" style={{ marginRight: '8px' }}/>
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
                    <h4 style={{ marginBottom: '10px' }}><FileText size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Document Status</h4>
                    <p><strong>ID Proof:</strong> {selectedSeller.idProofFile ? `Uploaded (${selectedSeller.idProofFile.idProofType})` : "Not Uploaded"}</p>
                    <p><strong>Artisan/Pehchan Card:</strong> {selectedSeller.artisanCardFile && selectedSeller.artisanCardFile.hasPehchanCard ? "Has Card" : "No Card"}</p>
                    <p><strong>Profile Image:</strong> {selectedSeller.profileImage ? "Uploaded" : "Not Uploaded"}</p>
                </div>

                {selectedSeller.verificationStatus === 'Pending' && (
                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <button 
                            onClick={() => handleApprove(selectedSeller._id)}
                            style={{ flex: 1, padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Approve Seller
                        </button>
                        <button 
                            onClick={() => handleReject(selectedSeller._id)}
                            style={{ flex: 1, padding: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Reject Seller
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ArtisansPage;
