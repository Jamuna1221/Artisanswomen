import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import './HelpPages.css';

const FAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/help/faqs');
                setFaqs(data);
            } catch (err) {
                console.error("Error fetching FAQs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="help-page-container faqs-page">
            <header className="help-header">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about MarketLink</p>
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="faq-list">
                {loading ? (
                    <div className="loading-spinner">Loading FAQs...</div>
                ) : filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No FAQs found matching your search.</div>
                )}
            </main>
        </div>
    );
};

export default FAQsPage;
