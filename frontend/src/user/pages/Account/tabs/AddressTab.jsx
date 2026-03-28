import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressTab = () => {
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        fullName: "", phone: "", street: "", landmark: "", city: "", state: "", pincode: "", country: "India", addressType: "Home", isDefault: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/account/addresses", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAddresses(res.data.addresses || []);
            } catch (err) {
                setError("Could not load addresses. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setAddresses([...addresses, { ...form, _id: Date.now() }]);
        setIsEditing(false);
        setForm({ fullName: "", phone: "", street: "", landmark: "", city: "", state: "", pincode: "", country: "India", addressType: "Home", isDefault: false });
    };

    const deleteAddress = (id) => {
        setAddresses(addresses.filter(a => a._id !== id));
    };

    return (
        <div className="tab-container address-tab fade-in">
            <div className="tab-header">
                <div>
                    <h1 className="tab-title">Address Book</h1>
                    <p className="tab-subtitle">Manage your preferred shipping and billing locations.</p>
                </div>
                {!isEditing && (
                    <button className="q-btn" onClick={() => setIsEditing(true)}>+ Add New Address</button>
                )}
            </div>

            {isEditing ? (
                <div className="address-form-box fade-in">
                    <h3 className="form-sub">New Address</h3>
                    <form onSubmit={handleSave} className="account-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="form-input" type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Street / Area</label>
                                <input className="form-input" type="text" name="street" value={form.street} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input className="form-input" type="text" name="city" value={form.city} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input className="form-input" type="text" name="state" value={form.state} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input className="form-input" type="text" name="pincode" value={form.pincode} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select className="form-input" name="addressType" value={form.addressType} onChange={handleChange}>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group checkbox-row">
                            <input type="checkbox" id="isDefault" name="isDefault" checked={form.isDefault} onChange={handleChange} />
                            <label htmlFor="isDefault">Make this my default address</label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="q-btn">Save Address</button>
                            <button type="button" className="q-btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="address-grid">
                    {addresses.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">📍</span>
                            <p>No addresses found. Add one to speed up checkout!</p>
                        </div>
                    ) : (
                        addresses.map(addr => (
                            <div className="address-card" key={addr._id}>
                                <div className="card-tag-row">
                                    <span className="address-type-tag">{addr.addressType}</span>
                                    {addr.isDefault && <span className="default-tag">Default</span>}
                                </div>
                                <div className="addr-content">
                                    <strong>{addr.fullName}</strong>
                                    <p>{addr.street}, {addr.landmark ? addr.landmark + ', ' : ''} {addr.city}, {addr.state} - {addr.pincode}</p>
                                    <span className="addr-phone">Phone: {addr.phone}</span>
                                </div>
                                <div className="addr-actions">
                                    <button className="addr-icon-btn">Edit</button>
                                    <button className="addr-icon-btn del-clr" onClick={() => deleteAddress(addr._id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressTab;
