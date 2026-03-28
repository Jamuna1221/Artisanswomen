import React, { useState } from "react";
import axios from "axios";

const SecurityTab = () => {
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "", newPassword: "", confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:5000/api/account/change-password", passwordForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: "success", text: "Password changed successfully!" });
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-container security-tab fade-in">
            <h1 className="tab-title">Security Settings</h1>
            <p className="tab-subtitle">Manage your account credentials and login security.</p>

            {message && <div className={`alert-box ${message.type}`}>{message.text}</div>}

            <div className="security-section">
                <h3 className="section-sub-title">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="account-form compact">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input className="form-input" type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input className="form-input" type="password" name="newPassword" value={passwordForm.newPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input className="form-input" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="q-btn" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="security-section danger-zone">
                <h3 className="section-sub-title">Account Control</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <div className="danger-btns">
                    <button className="q-btn btn-outline" onClick={() => alert("Deactivation coming soon!")}>Deactivate Account</button>
                    <button className="q-btn btn-danger" onClick={() => alert("Permanent delete coming soon!")}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;
