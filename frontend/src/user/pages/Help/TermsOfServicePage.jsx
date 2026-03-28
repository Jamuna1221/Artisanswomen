import React from 'react';
import { Gavel, Users, Info, Settings } from 'lucide-react';
import './HelpPages.css';

const TermsOfServicePage = () => {
    return (
        <div className="help-page-container static-help-page">
            <header className="help-header">
                <Gavel size={48} />
                <h1>Terms of Service</h1>
                <p>Establishing the rules for using the MarketLink platform.</p>
            </header>

            <main className="policy-content">
                <section className="policy-section">
                    <h3>Golden Rule of MarketLink</h3>
                    <p>By using this platform, you agree to respect the artisans, their heritage, and the effort behind every handmade creation. We foster a community built on trust and mutual respect.</p>
                </section>

                <section className="policy-section">
                    <h3>For Our Buyers</h3>
                    <ul className="premium-list">
                        <li><strong>Fair Feedback:</strong> Provided reviews should be honest and constructive.</li>
                        <li><strong>Payment Commitment:</strong> By placing an order, you commit to the purchase and payment of the handcrafted item.</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h3>For Our Artisans</h3>
                    <ul className="premium-list">
                        <li><strong>Authenticity:</strong> All items must be genuinely handmade or culturally significant crafts. No mass-produced resale is allowed.</li>
                        <li><strong>KYC Compliance:</strong> Sellers must maintain verified profiles to ensure secure payouts.</li>
                    </ul>
                </section>

                <section className="policy-section info-callout">
                    <Gavel size={32} />
                    <div>
                        <h4>Conflict Resolution</h4>
                        <p>In case of disputes between a buyer and seller, MarketLink acts as a neutral mediator to reach a fair resolution according to our community guidelines.</p>
                    </div>
                </section>

                <footer className="contact-help-section">
                    <h3>Reach out for clarifications.</h3>
                    <a href="mailto:artisanswomen@gmail.com" className="email-link">Email: artisanswomen@gmail.com</a>
                </footer>
            </main>
        </div>
    );
};

export default TermsOfServicePage;
