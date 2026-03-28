import React from 'react';
import { RefreshCcw, ShieldCheck, Clock, Contact } from 'lucide-react';
import './HelpPages.css';

const ReturnsPage = () => {
    return (
        <div className="help-page-container static-help-page">
            <header className="help-header">
                <RefreshCcw size={48} />
                <h1>Returns & Refunds Policy</h1>
                <p>Ensuring a fair and seamless experience for our customers and artisans.</p>
            </header>

            <main className="policy-content">
                <section className="policy-section">
                    <h3>Returns & Eligibility</h3>
                    <p>At MarketLink, we celebrate the unique imperfections of handmade products. However, if you are not completely satisfied, we offer a <strong>7-day return window</strong> from the date of delivery.</p>
                    <ul className="premium-list">
                        <li><strong>Artisanal Integrity:</strong> Items must be returned in their original, unused condition with all tags and packaging intact.</li>
                        <li><strong>Proof of Purchase:</strong> A valid order ID or digital receipt is required for all returns.</li>
                        <li><strong>Hygiene Standards:</strong> For hygiene reasons, jewelry and intimate wear are not eligible for returns unless defective.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h3>The Return Process</h3>
                    <div className="process-flow">
                        <div className="process-step">
                            <span className="step-num">01</span>
                            <h4>Request Return</h4>
                            <p>Contact us via the support portal within 7 days. Include photos if reporting damage.</p>
                        </div>
                        <div className="process-step">
                            <span className="step-num">02</span>
                            <h4>Artisan Pickup</h4>
                            <p>We'll arrange a free priority pickup from your location within 48 hours of approval.</p>
                        </div>
                        <div className="process-step">
                            <span className="step-num">03</span>
                            <h4>Quality Check</h4>
                            <p>Once back with the artisan, we'll verify the condition to finalize your refund.</p>
                        </div>
                    </div>
                </section>

                <section className="policy-section">
                    <h3>Refund Timelines</h3>
                    <div className="info-card timeline-card">
                        <Clock size={28} color="#8D6E63" />
                        <div>
                            <h4>Fast-Track Refunds</h4>
                            <p>Once approved, refunds reach your original payment method in 5–7 business days. For UPI payments, we often process them within 24 hours.</p>
                        </div>
                    </div>
                </section>

                <section className="contact-help-section">
                    <h3>Help with an existing return?</h3>
                    <p>Reference your Order ID for faster resolution.</p>
                    <div className="action-row">
                        <a href="mailto:returns.marketlink@gmail.com" className="email-link">returns.marketlink@gmail.com</a>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReturnsPage;
