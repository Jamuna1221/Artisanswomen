import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';
import Table from '../../components/ui/Table';
import { Plus, Trash2 } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  const fetchData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {fetchData();}, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCat);
      setNewCat({ name: '', description: '' });
      fetchData();
    } catch (err) { alert("Failed to add category"); }
  };

  const headers = ["Category Name", "Description", "Status", "Actions"];
  const renderRow = (item) => (
    <tr key={item._id}>
      <td><strong>{item.name}</strong></td>
      <td>{item.description}</td>
      <td><span className="status-pill status-active">Active</span></td>
      <td>
        <button className="icon-btn delete" onClick={() => deleteCategory(item._id).then(fetchData)}><Trash2 size={18} /></button>
      </td>
    </tr>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Craft Categories</h2>
        <p>Manage product categories for artisans</p>
      </div>

      <div className="grid-item" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Category Name" 
            value={newCat.name}
            onChange={(e) => setNewCat({...newCat, name: e.target.value})}
            className="input-with-icon" 
            style={{ padding: '8px 15px' }}
            required
          />
          <input 
            type="text" 
            placeholder="Description" 
            value={newCat.description}
            onChange={(e) => setNewCat({...newCat, description: e.target.value})}
            className="input-with-icon"
            style={{ padding: '8px 15px' }}
          />
          <button type="submit" className="login-btn" style={{ margin: 0, padding: '8px 20px', width: 'auto' }}>
            <Plus size={18} /> Add
          </button>
        </form>
      </div>

      <Table headers={headers} data={categories} renderRow={renderRow} loading={loading} />
    </div>
  );
};

export default CategoriesPage;
