import React, { useState } from "react";
import axios from "axios";
import { Mail, MessageSquare, ChevronRight, HelpCircle, Truck, RefreshCcw, ShieldCheck, FileText, Send } from "lucide-react";

const SupportTab = () => {
    const [complaint, setComplaint] = useState({ subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const supportLinks = [
        { label: "FAQs", href: "/faqs", icon: <HelpCircle size={18} /> },
        { label: "Order Tracking", href: "/track-order", icon: <Truck size={18} /> },
        { label: "Returns & Refunds", href: "/returns", icon: <RefreshCcw size={18} /> },
        { label: "Shipping Policy", href: "/shipping-policy", icon: <Truck size={18} /> },
        { label: "Privacy Policy", href: "/privacy-policy", icon: <ShieldCheck size={18} /> },
        { label: "Terms of Service", href: "/terms", icon: <FileText size={18} /> }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/account/complaint", { ...complaint, fromRole: "buyer" }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg({ type: "success", text: "Your message has been sent successfully!" });
            setComplaint({ subject: "", message: "" });
        } catch (err) {
            setMsg({ type: "error", text: `Failed: ${err.response?.data?.message || err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-container support-tab fade-in">
            <h1 className="tab-title">Help & Support</h1>
            <p className="tab-subtitle">Need assistance with your handcrafted purchases? We're here to help.</p>

            <div className="support-cards-grid">
                <div className="support-card">
                    <div className="sc-icon-box"><Mail size={24} /></div>
                    <h3>Email Support</h3>
                    <p>Expect a response within 24-48 hours from our artisan care team.</p>
                    <a href="mailto:artisanswomen@gmail.com" className="q-btn btn-outline" style={{marginTop:'auto'}}>Email Us</a>
                </div>

                <div className="support-card">
                    <div className="sc-icon-box"><MessageSquare size={24} /></div>
                    <h3>Support Shortcuts</h3>
                    <div className="support-links-box" style={{width:'100%', border:'none', padding:0}}>
                        {supportLinks.slice(0, 3).map(link => (
                            <a key={link.label} href={link.href} className="support-link-item" style={{padding:'8px 0'}}>
                                <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'0.9rem'}}>
                                    <span style={{color:'var(--acc-primary)'}}>{link.icon}</span>
                                    <span>{link.label}</span>
                                </div>
                                <ChevronRight size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="support-form-section" style={{marginTop:'40px', background:'#fff', padding:'30px', borderRadius:'12px', border:'1px solid #f2ede6'}}>
                <h3 className="section-sub-title">Send us a Message</h3>
                {msg && <div className={`alert-box ${msg.type}`} style={{marginBottom:'20px'}}>{msg.text}</div>}
                
                <form onSubmit={handleSubmit} className="account-form">
                    <div className="form-group">
                        <label>Subject</label>
                        <input className="form-input" type="text" placeholder="What can we help you with?" value={complaint.subject} onChange={e => setComplaint({...complaint, subject: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea className="form-input" rows={4} placeholder="Tell us more about your issue..." value={complaint.message} onChange={e => setComplaint({...complaint, message: e.target.value})} required />
                    </div>
                    <button type="submit" className="q-btn" disabled={loading}>
                        {loading ? "Sending..." : <><Send size={18} style={{marginRight:'8px'}}/> Submit Ticket</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportTab;
