import React from 'react';
import { Truck, Map, Receipt, PackageCheck } from 'lucide-react';
import './HelpPages.css';

const ShippingPolicyPage = () => {
    return (
        <div className="help-page-container static-help-page">
            <header className="help-header">
                <Truck size={48} />
                <h1>Shipping Policy</h1>
                <p>Bringing authentic craftsmanship safely to your doorstep.</p>
            </header>

            <main className="policy-content">
                <section className="policy-section">
                    <h3>Delivery Timelines</h3>
                    <div className="shipping-timeline">
                        <div className="shipping-step">
                            <PackageCheck size={28} color="#8D6E63" />
                            <div>
                                <h4>Processing (1–2 Days)</h4>
                                <p>Every piece is carefully inspected and hand-packed by our artisans before dispatch.</p>
                            </div>
                        </div>
                        <div className="shipping-step">
                            <Map size={28} color="#8D6E63" />
                            <div>
                                <h4>Transit (5–7 Days)</h4>
                                <p>We partner with premium couriers to ensure your treasures reach you safely across India.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="policy-section">
                    <h3>Shipping Charges</h3>
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>Domestic Shipping</h4>
                            <p>Free delivery on all orders above ₹1,000. For smaller orders, a flat fee of ₹50 applies.</p>
                        </div>
                        <div className="info-card">
                            <h4>International Shipping</h4>
                            <p>We are expanding! Currently serving India, with global shipping arriving in late 2026.</p>
                        </div>
                    </div>
                </section>

                <section className="policy-section">
                    <h3>Tracking & Delivery</h3>
                    <p>
                        Once dispatched, you will receive a tracking ID via SMS and email. You can also use our 
                        <a href="/track-order" className="inline-link"> Tracking Portal</a> to see live updates.
                    </p>
                </section>

                <section className="policy-section info-callout">
                    <Receipt size={32} />
                    <div>
                        <h4>Safe Passage Guarantee</h4>
                        <p>If your artisanal item arrives damaged due to transit, we provide a no-questions-asked replacement within 48 hours of reporting.</p>
                    </div>
                </section>

                <section className="contact-help-section">
                    <h3>Need specific shipping info?</h3>
                    <a href="mailto:support.marketlink@gmail.com" className="contact-btn">
                        Direct Support Line
                    </a>
                </section>
            </main>
        </div>
    );
};

export default ShippingPolicyPage;
