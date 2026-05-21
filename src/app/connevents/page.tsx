"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './connevents.css';

export default function ConnEvents() {
    const containerRef = useRef<HTMLDivElement>(null);
    const ticketRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const email = e.currentTarget.email.value;

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/connevents-waitlist`;
            console.log('API URL:', requestUrl);
            console.log('Request Payload:', { email });

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('Response Status:', response.status);

            const result = await response.json();
            console.log('Response Payload:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to join waitlist. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !ticketRef.current || !glareRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate rotations
        const rotateY = x * 30;
        const rotateX = -y * 30;

        ticketRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        ticketRef.current.style.animation = 'none';

        const glareX = x * 200 + 50;
        glareRef.current.style.transform = `translateX(${glareX}%)`;
    };

    const handleMouseLeave = () => {
        if (!ticketRef.current || !glareRef.current) return;
        
        ticketRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
        glareRef.current.style.transform = `translateX(-100%)`;
        
        // Restore floating animation
        setTimeout(() => {
            if (ticketRef.current) {
                ticketRef.current.style.animation = 'floatTicket 8s ease-in-out infinite';
            }
        }, 100);
    };

    return (
        <div className="connevents-page">
            <Header />

            <main className="connevents-hero">
                <div className="connevents-hero-content">
                    <span className="connevents-subtitle">Conn Events</span>
                    <h1>COMING SOON</h1>
                    <p>Live events, ticketed in seconds.</p>
                </div>

                <div 
                    className="connevents-ticket-container" 
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="connevents-ticket-3d" ref={ticketRef}>
                        <div className="connevents-ticket-face connevents-ticket-front">
                            <div className="connevents-ticket-top">
                                <span className="connevents-ticket-brand">CONNPLEX EVENTS</span>
                                <span className="connevents-ticket-vip">VIP ADMIT ONE</span>
                            </div>
                            <div className="connevents-ticket-cutout-left"></div>
                            <div className="connevents-ticket-cutout-right"></div>
                            <div className="connevents-ticket-middle">
                                <h2 className="connevents-ticket-event">ARCTIC MONKEYS</h2>
                                <p className="connevents-ticket-tour">LIVE IN CONCERT</p>
                                <div className="connevents-ticket-info">
                                    <div className="connevents-info-block">
                                        <span>DATE</span>
                                        <p>OCT 21</p>
                                    </div>
                                    <div className="connevents-info-block">
                                        <span>TIME</span>
                                        <p>8:00 PM</p>
                                    </div>
                                    <div className="connevents-info-block">
                                        <span>SEAT</span>
                                        <p>VIP-1</p>
                                    </div>
                                </div>
                            </div>
                            <div className="connevents-ticket-bottom">
                                <div className="connevents-barcode">
                                    <div className="connevents-bar"></div><div className="connevents-bar"></div><div className="connevents-bar thin"></div><div className="connevents-bar"></div><div className="connevents-bar thick"></div><div className="connevents-bar thin"></div><div className="connevents-bar"></div><div className="connevents-bar thick"></div><div className="connevents-bar"></div><div className="connevents-bar thin"></div><div className="connevents-bar"></div><div className="connevents-bar thin"></div><div className="connevents-bar"></div><div className="connevents-bar"></div><div className="connevents-bar thick"></div><div className="connevents-bar"></div><div className="connevents-bar thin"></div><div className="connevents-bar"></div>
                                </div>
                                <span className="connevents-ticket-serial">EV-192837465</span>
                            </div>
                            <div className="connevents-ticket-glare" ref={glareRef}></div>
                        </div>
                        
                        <div className="connevents-ticket-face connevents-ticket-back">
                            <div className="connevents-magnetic-stripe"></div>
                            <div className="connevents-ticket-hologram"></div>
                            <p className="connevents-terms">Non-transferable. Valid only for the specified event date and time. Scanning required for entry.</p>
                        </div>
                    </div>
                    <div className="connevents-ticket-shadow"></div>
                </div>

                <div className="connevents-waitlist-section">
                    <div className="connevents-icon-wrapper">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <span className="connevents-waitlist-subtitle">Be the first to know</span>
                    <h2>Exclusive access. Unmissable moments.</h2>
                    <p>Join the waitlist and be the first to experience CONN EVENTS.</p>
                    {isSubmitted ? (
                        <div style={{ textAlign: 'center', padding: '25px', border: '1px solid #c99f4a', borderRadius: '8px', background: 'rgba(201, 159, 74, 0.05)', maxWidth: '480px', margin: '20px auto 0 auto' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#c99f4a',
                                color: '#000',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 15px'
                            }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 style={{ color: '#c99f4a', fontSize: '1.2rem', marginBottom: '8px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>VIP WAITLIST JOINED!</h3>
                            <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: '1.5', margin: '0 auto 15px auto', maxWidth: '320px' }}>
                                Thank you! Your email has been added to the exclusive VIP waitlist for CONN EVENTS. We will contact you soon.
                            </p>
                            <button onClick={() => setIsSubmitted(false)} style={{ background: 'transparent', border: '1px solid rgba(201, 159, 74, 0.3)', color: '#c99f4a', padding: '6px 15px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Join again</button>
                        </div>
                    ) : (
                        <form className="connevents-waitlist-form" onSubmit={handleSubmit}>
                            <input name="email" type="email" placeholder="Enter your email address" required />
                            <button type="submit" className="connevents-btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Adding...' : 'Notify Me'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </form>
                    )}
                    {submitError && (
                        <p style={{ color: '#ff5252', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center', fontWeight: 500 }}>
                            ⚠️ {submitError}
                        </p>
                    )}
                    <p className="connevents-spam-notice">No spam. Just exclusive updates.</p>
                </div>
            </main>

            <footer className="connevents-features-grid">
                <div className="connevents-feature-item">
                    <div className="connevents-feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                            <path d="M13 5v2"></path>
                            <path d="M13 17v2"></path>
                            <path d="M13 11v2"></path>
                        </svg>
                    </div>
                    <h3>Instant Tickets</h3>
                    <p>Get access to live events<br />in seconds.</p>
                </div>
                <div className="connevents-feature-item">
                    <div className="connevents-feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <circle cx="12" cy="15" r="1"></circle>
                        </svg>
                    </div>
                    <h3>Live Experiences</h3>
                    <p>Concerts, sports, festivals<br />and more.</p>
                </div>
                <div className="connevents-feature-item">
                    <div className="connevents-feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <path d="m9 12 2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3>Secure & Trusted</h3>
                    <p>Safe payments and<br />verified events.</p>
                </div>
                <div className="connevents-feature-item">
                    <div className="connevents-feature-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <h3>Never Miss Out</h3>
                    <p>Stay updated on events<br />that matter.</p>
                </div>
            </footer>
            <Footer />
        </div>
    );
}
