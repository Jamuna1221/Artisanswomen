import React from 'react';
import { Shield, Eye, Database, Info } from 'lucide-react';
import './HelpPages.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="help-page-container static-help-page">
            <header className="help-header">
                <Shield size={48} />
                <h1>Privacy Policy</h1>
                <p>Ensuring your personal information is protected with transparency.</p>
            </header>

            <main className="policy-content">
                <section className="policy-section">
                    <h3>Data Protection Philosophy</h3>
                    <p>At MarketLink, your privacy is as precious as the crafts we sell. We adopt a "Privacy by Design" approach to ensure your data stays yours.</p>
                </section>

                <section className="policy-section">
                    <h3>What We Collect</h3>
                    <div className="info-grid">
                        <div className="info-card">
                            <Database size={24} color="#8D6E63" />
                            <h4>Identity & Auth</h4>
                            <p>Basic contact info (Name, Email, Phone) to manage your account and secure your login.</p>
                        </div>
                        <div className="info-card">
                            <Eye size={24} color="#8D6E63" />
                            <h4>Browsing Activity</h4>
                            <p>Anonymous usage data to improve our search filters and help you find the right artisans faster.</p>
                        </div>
                    </div>
                </section>

                <section className="policy-section">
                    <h3>Security Standards</h3>
                    <p>We use SSL encryption for all data in transit. Your payment information is never stored on our servers; it is handled entirely by industry-standard PCI-DSS compliant payment gateways.</p>
                </section>

                <section className="policy-section info-callout">
                    <Shield size={32} />
                    <div>
                        <h4>Your Data Rights</h4>
                        <p>Under India's DPDP Act, you have the right to access, rectify, or request deletion of your personal data at any time through your dashboard settings.</p>
                    </div>
                </section>

                <section className="contact-help-section">
                    <h3>Policy Questions?</h3>
                    <a href="mailto:privacy.marketlink@gmail.com" className="email-link">privacy.marketlink@gmail.com</a>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;
