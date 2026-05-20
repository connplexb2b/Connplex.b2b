"use client";

import React, { useState, useEffect } from 'react';
import './connplex-studio.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ConnplexStudioPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalActive, setIsModalActive] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleNotifyClick = () => {
        setIsModalActive(true);
        document.body.style.overflow = "hidden";
    };

    const handleCloseModal = () => {
        setIsModalActive(false);
        document.body.style.overflow = "";
        // Reset state after animation
        setTimeout(() => {
            setFormSubmitted(false);
            setEmail('');
            setName('');
        }, 600);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setFormSubmitted(true);
        }, 1500);
    };

    return (
        <div className="studio-page-wrapper">
            {/* Ambient Glow */}
            <div className="studio-ambient-glow"></div>

            {/* Page Loader */}
            <div className={`studio-loader-wrapper ${!isLoading ? 'fade-out' : ''}`}>
                <div className="studio-loader-content">
                    <div className="studio-loader-logo">CONNPLEX</div>
                    <div className="studio-loader-bar"></div>
                </div>
            </div>

            <div className="studio-container">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="studio-main-content">
                    <div className="studio-text-group">
                        <h1 className="studio-main-title">
                            <span className="studio-title-connplex studio-animate-slide-up-1">CONNPLEX</span>
                            <span className="studio-title-studio studio-animate-slide-up-2">
                                STUDI<span className="studio-glowing-o">O</span>
                            </span>
                        </h1>
                        <div className="studio-subtitle studio-animate-slide-up-3">COMING SOON</div>
                        <p className="studio-tagline studio-animate-slide-up-4">Stories. Crafted to Perfection.</p>
                        
                        <button 
                            className="studio-cta-button studio-animate-slide-up-5" 
                            onClick={handleNotifyClick}
                        >
                            <span className="studio-btn-text">NOTIFY ME</span>
                            <span className="studio-btn-arrow">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </main>

                {/* Footer */}
                <footer className="studio-footer studio-animate-fade-in">
                    <div className="studio-social-section">
                        <span className="studio-follow-text">FOLLOW US</span>
                        <span className="studio-divider">|</span>
                        <div className="studio-social-icons">
                            <a href="#" className="studio-social-icon" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="studio-social-icon" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="#" className="studio-social-icon" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Notification Modal Overlay */}
            <div className={`studio-modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="studio-modal-card">
                    <button className="studio-modal-close" onClick={handleCloseModal} aria-label="Close modal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    
                    {!formSubmitted ? (
                        <div className="studio-modal-header-content">
                            <div className="studio-modal-badge">EXCLUSIVE ACCESS</div>
                            <h2 className="studio-modal-title">REQUEST INVITATION</h2>
                            <p className="studio-modal-desc">
                                Be the first to experience Connplex Studio. Subscribe for private screenings, executive previews, and launch event invitations.
                            </p>
                            
                            <form className="studio-modal-form" onSubmit={handleSubmit}>
                                <div className="studio-input-group">
                                    <input 
                                        type="text" 
                                        id="user-name" 
                                        required 
                                        placeholder=" " 
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <label htmlFor="user-name">Your Name</label>
                                    <span className="studio-bar"></span>
                                </div>
                                <div className="studio-input-group">
                                    <input 
                                        type="email" 
                                        id="user-email" 
                                        required 
                                        placeholder=" " 
                                        autoComplete="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label htmlFor="user-email">Email Address</label>
                                    <span className="studio-bar"></span>
                                </div>
                                <button type="submit" className="studio-submit-button" disabled={isSubmitting}>
                                    <span>{isSubmitting ? 'REQUESTING ACCESS...' : 'REQUEST ACCESS'}</span>
                                    {!isSubmitting && (
                                        <svg className="studio-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="studio-success-message">
                            <div className="studio-success-icon-wrapper">
                                <svg className="studio-success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3 className="studio-success-title">ACCESS REQUESTED</h3>
                            <p className="studio-success-desc">
                                Thank you. Your request is registered under the email address <strong>{email}</strong>. An exclusive curator will reach out to you shortly.
                            </p>
                            <button type="button" className="studio-close-success" onClick={handleCloseModal}>DISMISS</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ConnplexStudioPage;
