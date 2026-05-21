"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './connmusic.css';

export default function Connmusic() {
    const [timeLeft, setTimeLeft] = useState({
        days: 25,
        hours: 14,
        minutes: 42,
        seconds: 58
    });

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
            const requestUrl = `${apiUrl}/api/forms/connmusic-waitlist`;
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

    const containerRef = useRef<HTMLDivElement>(null);
    const systemRef = useRef<HTMLDivElement>(null);

    // Countdown logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 3D Mouse tracking
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !systemRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateY = (x / rect.width) * 30;
        const rotateX = -(y / rect.height) * 30;

        systemRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        systemRef.current.style.transition = 'none';
    };

    const handleMouseLeave = () => {
        if (!systemRef.current) return;
        systemRef.current.style.transform = `rotateX(0) rotateY(0)`;
        systemRef.current.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    };

    return (
        <div className="connmusic-page">
            <div className="connmusic-app-container">
                {/* Navigation */}
                <Header />

                {/* Main Content */}
                <main className="connmusic-main-content">
                    <div className="connmusic-content-grid">
                        {/* Left Side: 3D System */}
                        <div className="connmusic-visual-section">
                            <div
                                className="connmusic-hero-image-wrapper"
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="connmusic-golden-ring"></div>
                                <div className="connmusic-music-system-3d" ref={systemRef}>
                                    <div className="connmusic-vinyl-record">
                                        <div className="connmusic-vinyl-spin-container">
                                            <div className="connmusic-vinyl-center">
                                                <span className="connmusic-center-text">CONNMUSIC</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="connmusic-album-sleeve">
                                        <div className="connmusic-sleeve-glare"></div>
                                        <svg className="connmusic-waveform" viewBox="0 0 100 30" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 15 L10 15 L15 5 L20 25 L25 15 L30 15 L35 10 L40 20 L45 15 L50 15 L55 5 L60 25 L65 10 L70 20 L75 15 L80 15 L85 10 L90 20 L95 15"></path>
                                        </svg>
                                        <p className="connmusic-sleeve-title">CONNMUSIC</p>
                                    </div>
                                    <div className="connmusic-music-notes">
                                        <span className="connmusic-note connmusic-note-1">♪</span>
                                        <span className="connmusic-note connmusic-note-2">♫</span>
                                        <span className="connmusic-note connmusic-note-3">♬</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Info & Countdown */}
                        <div className="connmusic-info-section">
                            <h2 className="connmusic-sub-brand connmusic-green-title">C O N N M U S I C</h2>
                            <h1 className="connmusic-main-title">COMING<br />SOON</h1>
                            <div className="connmusic-green-divider"></div>
                            <p className="connmusic-tagline">Sound that moves you.</p>

                            <div className="connmusic-countdown-container">
                                <div className="connmusic-countdown-item">
                                    <span className="connmusic-countdown-value">{timeLeft.days}</span>
                                    <span className="connmusic-countdown-label connmusic-green-title">DAYS</span>
                                </div>
                                <div className="connmusic-countdown-item">
                                    <span className="connmusic-countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="connmusic-countdown-label connmusic-green-title">HOURS</span>
                                </div>
                                <div className="connmusic-countdown-item">
                                    <span className="connmusic-countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="connmusic-countdown-label connmusic-green-title">MINUTES</span>
                                </div>
                                <div className="connmusic-countdown-item">
                                    <span className="connmusic-countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="connmusic-countdown-label connmusic-green-title">SECONDS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="connmusic-features-grid">
                        <div className="connmusic-feature-card">
                            <div className="connmusic-feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18V5l12-2v13"></path>
                                    <circle cx="6" cy="18" r="3"></circle>
                                    <circle cx="18" cy="16" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="connmusic-feature-title">Immersive Sound</h3>
                            <p className="connmusic-feature-desc">Experience music like<br />never before.</p>
                        </div>
                        <div className="connmusic-feature-card">
                            <div className="connmusic-feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <h3 className="connmusic-feature-title">Made for You</h3>
                            <p className="connmusic-feature-desc">Discover tracks that<br />match your mood.</p>
                        </div>
                        <div className="connmusic-feature-card">
                            <div className="connmusic-feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="connmusic-feature-title">All in One</h3>
                            <p className="connmusic-feature-desc">Your library, your artists,<br />your world.</p>
                        </div>
                        <div className="connmusic-feature-card">
                            <div className="connmusic-feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20"></path>
                                    <path d="M17 5v14"></path>
                                    <path d="M22 10v4"></path>
                                    <path d="M7 5v14"></path>
                                    <path d="M2 10v4"></path>
                                </svg>
                            </div>
                            <h3 className="connmusic-feature-title">Beyond Streaming</h3>
                            <p className="connmusic-feature-desc">More than music.<br />It&apos;s an experience.</p>
                        </div>
                    </div>

                    {/* Notify Section */}
                    <div className="connmusic-notify-section">
                        <div className="connmusic-bell-icon-wrapper">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                        <h3 className="connmusic-notify-subtitle">BE THE FIRST TO KNOW</h3>
                        <h2 className="connmusic-notify-main-title">Exclusive access. First listen. Only for you.</h2>
                        <p className="connmusic-notify-desc">Join the waitlist and be the first to experience CONNMUSIC.</p>

                        {isSubmitted ? (
                            <p className="connmusic-success-msg" style={{ color: '#d4af37', marginTop: '20px', fontSize: '1.1rem', fontWeight: 500 }}>
                                🎉 Thank you! You have been successfully added to the waitlist.
                            </p>
                        ) : (
                            <>
                                <form className="connmusic-notify-form" onSubmit={handleSubmit}>
                                    <input name="email" type="email" placeholder="Enter your email address" required className="connmusic-notify-input" />
                                    <button type="submit" className="connmusic-notify-btn" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : <>Notify Me <span className="arrow">&gt;</span></>}
                                    </button>
                                </form>
                                {submitError && (
                                    <p className="connmusic-error-notice" style={{ color: '#ff5252', marginTop: '10px', fontSize: '0.9rem' }}>
                                        ⚠️ {submitError}
                                    </p>
                                )}
                                <p className="connmusic-spam-notice">No spam. Just exclusive updates.</p>
                            </>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
