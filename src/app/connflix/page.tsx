"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './connflix.css';

export default function Connflix() {
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
            const response = await fetch(`${apiUrl}/api/forms/connflix-subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
        } catch (error: any) {
            setSubmitError(error.message || 'Unable to register subscription. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [timeLeft, setTimeLeft] = useState({
        days: 25,
        hours: 14,
        minutes: 42,
        seconds: 7
    });

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

    const posters = [
        { src: '/beyond_the_echo.png', title: 'BEYOND', subtitle: 'THE SIGNAL', red: true, col: 1 },
        { src: '/the_silent_orbit.png', title: 'ASHES OF', subtitle: 'TOMORROW', red: false, col: 1 },
        { src: '/the_silent_orbit.png', title: 'THE', subtitle: 'SILENT ORBIT', red: false, col: 2 },
        { src: '/echoes_of_the_abyss.png', title: 'ECHOES OF', subtitle: 'THE ABYSS', red: true, active: true, col: 2 },
        { src: '/mind_paradox.png', title: 'MIND', subtitle: 'PARADOX', red: false, col: 3 },
        { src: '/the_last_horizon.png', title: 'THE LAST', subtitle: 'HORIZON', red: false, col: 3 },
    ];

    return (
        <div className="connflix-page">
            <div className="connflix-app-container">
                <Header />

                <main className="connflix-main-content">
                    <div className="connflix-vertical-watermark">CONNFLIX</div>

                    <div className="connflix-content-grid">
                        <div className="connflix-posters-section">
                            <div className="connflix-posters-perspective">
                                {[1, 2, 3].map(col => (
                                    <div key={col} className={`connflix-poster-col col-${col}`}>
                                        {posters.filter(p => p.col === col).map((poster, i) => (
                                            <div key={i} className={`connflix-poster-card ${poster.active ? 'connflix-active-poster' : ''}`}>
                                                <Image src={poster.src} alt={poster.title} fill style={{ objectFit: 'cover' }} />
                                                <div className="connflix-poster-overlay">
                                                    <h3 className={`connflix-poster-title ${poster.red ? 'connflix-red-title' : ''}`}>{poster.title}</h3>
                                                    <p className={`connflix-poster-subtitle ${poster.red ? 'connflix-red-title' : ''}`}>{poster.subtitle}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="connflix-floor-reflection"></div>
                        </div>

                        <div className="connflix-info-section">
                            <h2 className="connflix-sub-brand">C O N N F L I X</h2>
                            <h1 className="connflix-main-title">COMING<br />SOON</h1>
                            <div className="connflix-red-divider"></div>
                            <p className="connflix-tagline">New stories. New worlds. New era.</p>

                            <div className="connflix-countdown-container">
                                <div className="connflix-countdown-item">
                                    <span className="connflix-countdown-value">{timeLeft.days}</span>
                                    <span className="connflix-countdown-label">DAYS</span>
                                </div>
                                <div className="connflix-countdown-item">
                                    <span className="connflix-countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="connflix-countdown-label">HOURS</span>
                                </div>
                                <div className="connflix-countdown-item">
                                    <span className="connflix-countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="connflix-countdown-label">MINUTES</span>
                                </div>
                                <div className="connflix-countdown-item">
                                    <span className="connflix-countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="connflix-countdown-label">SECONDS</span>
                                </div>
                            </div>

                            <p className="connflix-description">
                                We&apos;re crafting a premium streaming<br />
                                experience like never before.<br />
                                Stay tuned.
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="connflix-footer">
                    <div className="connflix-footer-gradient"></div>
                    <div className="connflix-footer-content">
                        <div className="connflix-bell-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                        <h3 className="connflix-notify-title">BE THE FIRST TO KNOW</h3>
                        {isSubmitted ? (
                            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #d32f2f', borderRadius: '8px', background: 'rgba(211, 47, 47, 0.05)', maxWidth: '480px', margin: '20px auto 0 auto' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#d32f2f',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 12px'
                                }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 style={{ color: '#d32f2f', fontSize: '1.1rem', marginBottom: '8px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>NOTIFICATIONS ACTIVATED!</h3>
                                <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: '1.5', margin: '0 auto 12px auto', maxWidth: '320px' }}>
                                    You will be the absolute first to know when CONNFLIX launches. Get ready for premium streaming!
                                </p>
                                <button onClick={() => setIsSubmitted(false)} style={{ background: 'transparent', border: '1px solid rgba(211, 47, 47, 0.3)', color: '#d32f2f', padding: '5px 12px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Subscribe again</button>
                            </div>
                        ) : (
                            <form className="connflix-notify-form" onSubmit={handleSubmit}>
                                <input name="email" type="email" placeholder="Enter your email address" required className="connflix-notify-input" />
                                <button type="submit" className="connflix-notify-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Registering...' : 'Notify Me'} <span className="connflix-arrow">→</span>
                                </button>
                            </form>
                        )}
                        {submitError && (
                            <p style={{ color: '#ff5252', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>
                                ⚠️ {submitError}
                            </p>
                        )}
                        <p className="connflix-spam-notice">No spam. Just exclusive updates.</p>
                    </div>
                </footer>
            </div>
            <Footer />
        </div>
    );
}
