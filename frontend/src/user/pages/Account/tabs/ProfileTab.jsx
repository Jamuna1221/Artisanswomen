import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../../services/userApi";

const ProfileTab = ({ user, setUser }) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        bio: "",
        city: "",
        state: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || user.name?.split(" ")[0] || "",
                lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "",
                bio: user.bio || "",
                city: user.city || "",
                state: user.state || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await updateUserProfile(form);
            if (res.user) {
                localStorage.setItem("user", JSON.stringify(res.user));
                setUser(res.user);
                setMessage({ type: "success", text: "Profile updated successfully!" });
            }
        } catch (err) {
            console.error(err.response?.data);
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-container profile-tab fade-in">
            <h2 className="tab-title">Personal Information</h2>
            <p className="tab-subtitle">Manage your profile details and account settings.</p>

            {message && <div className={`alert-box ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className="account-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name</label>
                        <input className="form-input" type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input className="form-input" type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required disabled />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input className="form-input" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select className="form-input" name="gender" value={form.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Woman">Woman</option>
                            <option value="Transwoman">Transwoman</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input className="form-input" type="text" name="city" value={form.city} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input className="form-input" type="text" name="state" value={form.state} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Bio / About You</label>
                    <textarea className="form-input" name="bio" value={form.bio} onChange={handleChange} rows="4"></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="q-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Profile Details"}
                    </button>
                    <button type="button" className="q-btn btn-outline" onClick={() => window.location.reload()}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
