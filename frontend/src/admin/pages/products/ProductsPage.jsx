import React, { useState, useEffect } from 'react';
import { getProducts, updateProductStatus } from '../../services/productService';
import Table from '../../components/ui/Table';
import { Check, X, Trash2 } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateProductStatus(id, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update product status");
    }
  };

  const headers = ["Image", "Title", "Artisan", "Price", "Status", "Actions"];

  const renderRow = (item) => (
    <tr key={item._id}>
      <td><img src={item.images[0] || 'https://via.placeholder.com/40'} alt="p" style={{ width: 40, height: 40, borderRadius: 4 }} /></td>
      <td>{item.title}</td>
      <td>{item.artisanId?.name}</td>
      <td>₹{item.price}</td>
      <td>
        <span className={`status-pill ${item.status === 'Active' ? 'status-active' : 'status-pending'}`}>
          {item.status}
        </span>
      </td>
      <td>
        <div className="action-btns">
          {item.status === 'Pending Approval' && (
            <>
              <button className="icon-btn view" onClick={() => handleStatus(item._id, 'Active')} title="Approve"><Check size={18} /></button>
              <button className="icon-btn delete" onClick={() => handleStatus(item._id, 'Rejected')} title="Reject"><X size={18} /></button>
            </>
          )}
          <button className="icon-btn delete" title="Remove"><Trash2 size={18} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Product Management</h2>
        <p>Review and moderate artisan products</p>
      </div>
      <Table headers={headers} data={products} renderRow={renderRow} loading={loading} />
    </div>
  );
};

export default ProductsPage;
