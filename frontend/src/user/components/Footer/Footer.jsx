import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="handora-footer">
            <div className="footer-main">
                <div className="footer-container">
                    {/* Left Branding Section */}
                    <div className="footer-brand-column">
                        <div className="brand-logo-wrap">
                            <div className="brand-icon-circle">
                                <span className="handora-icon">🧵</span>
                            </div>
                            <div className="brand-text">
                                <h2 className="brand-name">Handora</h2>
                                <span className="brand-tagline">HAND MADE HAVEN</span>
                            </div>
                        </div>
                        
                        <p className="footer-mission-text">
                            A Ministry of Textiles initiative — connecting Tamil Nadu's
                            women artisans directly with conscious buyers across India
                            and the world.
                        </p>

                        <div className="social-links-row">
                            <a href="#" className="social-circle-btn"><FaInstagram /></a>
                            <a href="#" className="social-circle-btn"><FaFacebookF /></a>
                            <a href="#" className="social-circle-btn"><FaYoutube /></a>
                            <a href="#" className="social-circle-btn"><FaPinterestP /></a>
                        </div>

                        <div className="govt-badge">
                            <div className="govt-logo-box">
                                <span className="govt-in">IN</span>
                            </div>
                            <div className="govt-text">
                                <span className="govt-name">Government of Tamil Nadu</span>
                                <span className="govt-dept">Department of Handlooms & Textiles</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer-links-grid">
                        <div className="footer-col">
                            <h4>SHOP</h4>
                            <ul>
                                <li><Link to="/">Silk Sarees</Link></li>
                                <li><Link to="/">Handloom</Link></li>
                                <li><Link to="/">Pottery & Terracotta</Link></li>
                                <li><Link to="/">Tanjore Paintings</Link></li>
                                <li><Link to="/">Jewellery</Link></li>
                                <li><Link to="/">Brass Crafts</Link></li>
                                <li><Link to="/">GI Tagged Products</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>ARTISANS</h4>
                            <ul>
                                <li><Link to="/">Join as Artisan</Link></li>
                                <li><Link to="/">Artisan Stories</Link></li>
                                <li><Link to="/">Craft Training</Link></li>
                                <li><Link to="/">Government Schemes</Link></li>
                                <li><Link to="/">SHG Support</Link></li>
                                <li><Link to="/">Export Program</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>COMPANY</h4>
                            <ul>
                                <li><Link to="/">About Handora</Link></li>
                                <li><Link to="/">Our Mission</Link></li>
                                <li><Link to="/">Press & Media</Link></li>
                                <li><Link to="/">Careers</Link></li>
                                <li><Link to="/">Impact Report</Link></li>
                                <li><Link to="/">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4>HELP</h4>
                            <ul>
                                <li><Link to="/faqs" target="_blank" rel="noopener noreferrer">FAQs</Link></li>
                                <li><Link to="/track-order" target="_blank" rel="noopener noreferrer">Track My Order</Link></li>
                                <li><Link to="/returns" target="_blank" rel="noopener noreferrer">Returns & Refunds</Link></li>
                                <li><Link to="/shipping-policy" target="_blank" rel="noopener noreferrer">Shipping Policy</Link></li>
                                <li><Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link></li>
                                <li><Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar Section */}
            <div className="footer-bottom-bar">
                <div className="footer-container bottom-flex">
                    <div className="bottom-copyright">
                        © {currentYear} Handora — Hand Made Haven. All rights reserved.
                    </div>

                    <div className="payment-badges-row">
                        <span className="pay-badge">UPI</span>
                        <span className="pay-badge">VISA</span>
                        <span className="pay-badge">MASTERCARD</span>
                        <span className="pay-badge">RUPAY</span>
                        <span className="pay-badge">NETBANKING</span>
                    </div>

                    <div className="bottom-credit">
                        Made with <span className="heart">❤️</span> for Tamil Nadu Artisans
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
