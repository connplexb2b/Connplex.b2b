"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, CheckCircle } from 'lucide-react';
import './sky-inn.css';

const STARS = [
    { top: '8%', left: '12%', size: 3, dur: '3.2s', delay: '0s' },
    { top: '15%', left: '72%', size: 2, dur: '4.1s', delay: '1.1s' },
    { top: '22%', left: '45%', size: 2, dur: '2.8s', delay: '0.5s' },
    { top: '6%', left: '58%', size: 3, dur: '3.7s', delay: '2s' },
    { top: '32%', left: '88%', size: 2, dur: '4.5s', delay: '0.8s' },
    { top: '18%', left: '30%', size: 2, dur: '3s', delay: '1.5s' },
    { top: '10%', left: '82%', size: 3, dur: '2.5s', delay: '0.3s' },
    { top: '28%', left: '20%', size: 2, dur: '3.9s', delay: '1.8s' },
];

const SkyInnPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const openModal = () => { setModalOpen(true); setSubmitted(false); };
    const closeModal = () => { setModalOpen(false); setTimeout(() => setSubmitted(false), 400); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    const toggleSound = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.volume = 0.15;
            audio.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    return (
        <div className="sky-inn-page">
            {/* Full-bleed Background */}
            <div className="sky-inn-bg">
                <Image
                    src="/sky-inn-hero.png"
                    alt="Sky Inn Drive-In Cinema"
                    fill
                    priority
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>

            {/* Twinkling Stars */}
            <div className="sky-inn-stars">
                {STARS.map((s, i) => (
                    <div
                        key={i}
                        className="sky-inn-star"
                        style={{
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            '--dur': s.dur,
                            '--delay': s.delay,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Screen Glow */}
            <div className="sky-inn-glow" />

            {/* Header */}
            <header className="sky-inn-header">
                <div className="sky-inn-brand">
                    <span className="sky-inn-brand-name">CONNPLEX</span>
                    <span className="sky-inn-brand-tag">EXPERIENCE MORE</span>
                </div>
                <button
                    className={`sky-inn-sound-toggle ${isPlaying ? 'playing' : ''}`}
                    onClick={toggleSound}
                    aria-label="Toggle ambient sound"
                >
                    <span>{isPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
                    <span className="sky-inn-sound-bars">
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </span>
                </button>
            </header>

            {/* Hero Section */}
            <main className="sky-inn-hero">
                {/* Left Content */}
                <div className="sky-inn-content">
                    <div className="sky-inn-title-group">
                        <h1 className="sky-inn-main-title">
                            <span className="text-white">SKY</span>
                            <span className="text-gold">INN</span>
                        </h1>
                        <p className="sky-inn-subtitle">DRIVE-IN CINEMA BY CONNPLEX</p>
                    </div>

                    <div className="sky-inn-teaser">
                        <h2 className="sky-inn-coming-soon">COMING SOON</h2>
                        <div className="sky-inn-accent-line" />
                        <p className="sky-inn-description">A new era of outdoor cinema experiences.</p>
                    </div>

                    <div className="sky-inn-cta">
                        <button className="sky-inn-btn-notify" onClick={openModal}>
                            <span>NOTIFY ME</span>
                            <svg className="arrow-svg" viewBox="0 0 18 10">
                                <path d="M1 5h16M12 1l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="sky-inn-social">
                        <span className="sky-inn-follow-text">FOLLOW US</span>
                        <span className="sky-inn-divider" />
                        <div className="sky-inn-social-icons">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="sky-inn-social-link" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="sky-inn-social-link" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="sky-inn-social-link" aria-label="YouTube">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </main>

            {/* Newsletter Modal */}
            <div
                className={`sky-inn-modal-overlay ${modalOpen ? 'active' : ''}`}
                onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
                <div className="sky-inn-modal-card">
                    <button className="sky-inn-modal-close" onClick={closeModal} aria-label="Close">
                        <X size={18} />
                    </button>

                    {!submitted ? (
                        <div>
                            <span className="sky-inn-modal-pretitle">JOIN THE ELITE CLUB</span>
                            <h3 className="sky-inn-modal-title">STAY IN THE LOOP</h3>
                            <p className="sky-inn-modal-desc">
                                Be the first to secure prime parking slots and exclusive opening night invitations for Connplex&apos;s premium outdoor theater experience.
                            </p>
                            <form className="sky-inn-modal-form" onSubmit={handleSubmit}>
                                <div className="sky-inn-input-wrapper">
                                    <input
                                        type="email"
                                        required
                                        placeholder="ENTER YOUR EMAIL ADDRESS"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label="Email address"
                                    />
                                    <span className="sky-inn-input-line" />
                                </div>
                                <button type="submit" className="sky-inn-btn-submit">
                                    <span>SUBSCRIBE NOW</span>
                                    <svg className="sky-inn-submit-arrow" viewBox="0 0 18 10">
                                        <path d="M1 5h16M12 1l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="sky-inn-success">
                            <div className="sky-inn-success-icon">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="sky-inn-modal-title text-gold">YOU&apos;RE ON THE LIST</h3>
                            <p className="sky-inn-modal-desc">
                                Thank you for subscribing! We will notify you with exclusive opening schedules, reservations, and luxury event updates.
                            </p>
                            <button className="sky-inn-btn-notify" onClick={closeModal}>
                                <span>BACK TO PREVIEW</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden ambient audio */}
            <audio
                ref={audioRef}
                loop
                src="https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav"
                preload="none"
            />
        </div>
    );
};

export default SkyInnPage;
