import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

const TrackOrderTab = () => {
    const trackingSteps = [
        { label: "Order Placed", date: "26 Mar 2026", active: true },
        { label: "Confirmed", date: "27 Mar 2026", active: true },
        { label: "Packed", date: "27 Mar 2026", active: true },
        { label: "Shipped", date: "28 Mar 2026", active: true },
        { label: "Out for Delivery", date: "Pending", active: false },
        { label: "Delivered", date: "Expected by 30 Mar", active: false }
    ];

    return (
        <div className="tab-container track-tab fade-in">
            <h1 className="tab-title">Track Orders</h1>
            <p className="tab-subtitle">Real-time status of your active purchases from master artisans.</p>

            <div className="tracking-wrapper">
                <div className="tracking-header">
                    <div className="order-meta-item">
                        <span className="meta-label">TRACKING ID</span>
                        <span className="meta-val">8239BX-IND52</span>
                    </div>
                    <button className="q-btn btn-outline">View Digital Invoice</button>
                </div>

                <div className="tracking-timeline">
                    {trackingSteps.map((step, index) => (
                        <div key={index} className={`timeline-step ${step.active ? 'active' : ''}`}>
                            <div className="step-indicator">
                                {step.active ? <Check size={14} color="#fff" /> : null}
                            </div>
                            <div className="step-info">
                                <span className="step-title">{step.label}</span>
                                <span className="step-date">{step.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="courier-details" style={{padding:'20px', background:'#fcfaf7', borderRadius:'12px', border:'1px dashed #e0d5cb'}}>
                    <p style={{marginBottom:'10px'}}>Courier Service: <strong style={{color:'#3d1c0e'}}>Delhivery Express</strong></p>
                    <p>Latest Location: <strong style={{color:'#3d1c0e'}}>Bengaluru Sorting Facility</strong> <span style={{fontSize:'0.85rem', color:'#8c7662'}}>(28 Mar, 10:45 AM)</span></p>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderTab;
