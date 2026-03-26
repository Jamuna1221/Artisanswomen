import React, { useState, useEffect } from 'react';
import { getVerifications, updateVerificationStatus } from '../../services/verificationService';
import Table from '../../components/ui/Table';
import { Check, X, Eye } from 'lucide-react';
import './PageStyles.css';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getVerifications({ status: 'Pending' });
      setRequests(data.verifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this as ${status}?`)) {
      try {
        await updateVerificationStatus(id, { status, adminRemarks: "Reviewed by Admin" });
        fetchRequests();
      } catch (err) {
        alert("Action failed");
      }
    }
  };

  const headers = ["Artisan", "Email", "Submitted On", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td><strong>{item.artisanId?.name}</strong></td>
      <td>{item.artisanId?.email}</td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>
        <div className="action-btns">
          <button className="icon-btn view" title="View Docs"><Eye size={18} /></button>
          <button className="icon-btn edit" onClick={() => handleAction(item._id, 'Verified')} title="Approve"><Check size={18} /></button>
          <button className="icon-btn delete" onClick={() => handleAction(item._id, 'Rejected')} title="Reject"><X size={18} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Verification Requests</h2>
        <p>Review and verify artisan profiles</p>
      </div>
      <Table headers={headers} data={requests} renderRow={renderRow} loading={loading} />
    </div>
  );
};

export default VerificationRequests;
