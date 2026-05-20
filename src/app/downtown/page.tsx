"use client";

import { useState } from 'react';
import './downtown.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function DowntownPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const handleNotifyClick = () => {
        setIsModalOpen(true);
        setSubmitError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const name = e.currentTarget.elements.namedItem('name') ? (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value : '';
        const email = e.currentTarget.elements.namedItem('email') ? (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value : '';
        const consent = e.currentTarget.elements.namedItem('consent') ? (e.currentTarget.elements.namedItem('consent') as HTMLInputElement).checked : true;

        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/forms/downtown-invitations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, consent }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsModalOpen(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            setSubmitError(error.message || 'Unable to submit invite request. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
            <Header />

            {/* Ambient Backdrops */}
            <div className="dt-ambient-glow dt-glow-1"></div>
            <div className="dt-ambient-glow dt-glow-2"></div>

            <main className="dt-main-layout">
                {/* Left Section (Content & Info) */}
                <section className="dt-hero-content">
                    <div className="dt-hero-content-inner">
                        <div className="dt-brand-eyebrow">THE LUXURY DESTINATION</div>
                        <h1 className="dt-hero-title" id="hero-main-title">DOWNTOWN</h1>
                        <div className="dt-gold-divider"></div>
                        <h2 className="dt-hero-subtitle">COMING SOON</h2>

                        <p className="dt-hero-description">
                            The premium cinema experience reimagined by Connplex. Prepare for unmatched luxury, state-of-the-art audiovisual technology, and bespoke hospitality.
                        </p>

                        {/* CTA Button */}
                        <div className="dt-cta-container">
                            <button className="dt-btn-notify" onClick={handleNotifyClick}>
                                <span className="dt-btn-text">NOTIFY ME</span>
                                <span className="dt-btn-arrow">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="dt-feature-highlights">
                            <span className="dt-feature-item">LUXURY SCREENS</span>
                            <span className="dt-bullet">•</span>
                            <span className="dt-feature-item">VIP LOUNGES</span>
                            <span className="dt-bullet">•</span>
                            <span className="dt-feature-item">CURATED EXPERIENCES</span>
                        </div>
                    </div>
                </section>

                {/* Right Section (Cinema Visual Showcase) */}
                <section className="dt-hero-visual">
                    {/* Smooth overlay that blends with the dark content column on left */}
                    <div className="dt-visual-overlay"></div>
                </section>
            </main>

            {/* Notify Me Modal (Interactive Popup) */}
            <div className={`dt-modal-overlay ${isModalOpen ? 'open' : ''}`} id="notify-modal">
                <div className="dt-modal-card">
                    <button className="dt-modal-close" onClick={handleCloseModal} aria-label="Close Modal">&times;</button>
                    <div className="dt-modal-header">
                        <div className="dt-logo-main">CONNPLEX</div>
                        <div className="dt-logo-tagline">DOWNTOWN CINEMA</div>
                    </div>
                    <div className="dt-modal-body">
                        <h3>VIP LAUNCH INVITATION</h3>
                        <p>Be the first to experience the absolute height of cinema luxury. Enter your details below to receive updates, exclusive previews, and priority booking access.</p>

                        <form id="notify-form" className="dt-modal-form" onSubmit={handleSubmit}>
                            <div className="dt-form-group">
                                <input name="name" type="text" id="user-name" placeholder="Full Name" required autoComplete="name" />
                                <label htmlFor="user-name">Full Name</label>
                            </div>
                            <div className="dt-form-group">
                                <input name="email" type="email" id="user-email" placeholder="Email Address" required autoComplete="email" />
                                <label htmlFor="user-email">Email Address</label>
                            </div>
                            <div className="dt-form-group dt-checkbox-group">
                                <input name="consent" type="checkbox" id="user-consent" required defaultChecked />
                                <label htmlFor="user-consent">I agree to receive VIP updates and exclusive invites from Connplex Downtown.</label>
                            </div>
                            {submitError && (
                                <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 500 }}>
                                    ⚠️ {submitError}
                                </div>
                            )}
                            <button type="submit" className="dt-btn-submit" disabled={isSubmitting}>
                                <span>{isSubmitting ? 'REQUESTING...' : 'REQUEST EXCLUSIVE INVITE'}</span>
                                {!isSubmitting && (
                                    <svg viewBox="0 0 24 24" width="18" height="18">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <div className={`dt-toast ${showToast ? 'show' : ''}`} id="toast-message">
                <div className="dt-toast-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="dt-toast-content">
                    <div className="dt-toast-title">Access Requested</div>
                    <div className="dt-toast-desc">Check your inbox soon for your exclusive preview.</div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Cinzel:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
            `}</style>
            <Footer />
        </div>
    );
}
