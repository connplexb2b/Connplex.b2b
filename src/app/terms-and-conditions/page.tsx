"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, User, FileText, ArrowUpRight } from 'lucide-react';
import './terms.css';
import Footer from '@/components/Footer';

const TermsAndConditionsPage = () => {
    return (
        <div className="terms-page">
            <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '20px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                    <Link href="/">
                        <Image src="/logo.png" alt="Connplex Logo" width={150} height={45} style={{ objectFit: 'contain' }} />
                    </Link>

                </div>
            </nav>

            <header className="terms-hero">
                <div className="terms-hero-content">
                    <div className="terms-label-container">
                        <div className="terms-label-line"></div>
                        <span className="terms-hero-label">Legal Framework</span>
                    </div>
                    <h1>Terms & <br />Conditions</h1>
                    <p>These terms govern your access, use of our platforms and services, and your experience with Connplex Cinemas.</p>
                </div>
            </header>

            <section className="terms-commitment-section">
                <div className="terms-container">
                    <div className="terms-cards-grid">
                        <div className="terms-commitment-card">
                            <div className="terms-icon-wrapper">
                                <Shield size={35} />
                            </div>
                            <h3>Our Commitment</h3>
                            <p>We are committed to clarity, fairness, and transparency in all our interactions.</p>
                        </div>
                        <div className="terms-commitment-card">
                            <div className="terms-icon-wrapper">
                                <User size={35} />
                            </div>
                            <h3>User Responsibility</h3>
                            <p>Users agree to use our platforms responsibly and in compliance with applicable laws.</p>
                        </div>
                        <div className="terms-commitment-card">
                            <div className="terms-icon-wrapper">
                                <FileText size={35} />
                            </div>
                            <h3>Agreements</h3>
                            <p>These terms create a binding agreement between you and Connplex Cinemas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="terms-help-section">
                <div className="terms-container">
                    <div className="terms-help-container">
                        <div className="terms-help-content">
                            <div className="terms-label-container">
                                <div className="terms-label-line"></div>
                                <span className="terms-hero-label">Need Clarification?</span>
                            </div>
                            <h2>We&apos;re here to help.</h2>
                            <p>For any questions or concerns regarding these Terms & Conditions, reach out to our team.</p>
                            <Link href="/contact" className="terms-btn-contact">
                                Contact Us
                                <ArrowUpRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsAndConditionsPage;
