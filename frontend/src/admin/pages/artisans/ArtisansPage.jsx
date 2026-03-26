import React, { useState, useEffect } from 'react';
import { getArtisans, updateUserStatus } from '../../services/userService';
import Table from '../../components/ui/Table';
import { Ban, CheckCircle, Info } from 'lucide-react';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getArtisans();
      setArtisans(data.artisans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await updateUserStatus(id, newStatus);
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const headers = ["Name", "Email", "Verification", "Status", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>
        <span className={`status-pill ${item.profile?.isVerified ? 'status-active' : 'status-pending'}`}>
          {item.profile?.isVerified ? 'Verified' : 'Unverified'}
        </span>
      </td>
      <td>
        <span className={`status-pill ${item.status === 'active' ? 'status-active' : 'status-blocked'}`}>
          {item.status}
        </span>
      </td>
      <td>
        <div className="action-btns">
          <button className="icon-btn view"><Info size={18} /></button>
          <button 
            className={`icon-btn ${item.status === 'active' ? 'delete' : 'edit'}`}
            onClick={() => toggleStatus(item._id, item.status)}
            title={item.status === 'active' ? 'Block' : 'Unblock'}
          >
            {item.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Artisan Management</h2>
        <p>Manage artisan accounts and statuses</p>
      </div>
      <Table headers={headers} data={artisans} renderRow={renderRow} loading={loading} />
    </div>
  );
};

export default ArtisansPage;
