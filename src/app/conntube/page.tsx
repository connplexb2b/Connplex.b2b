"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './conntube.css';


const Tube3DGallery = () => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const cards = [
        { src: '/echoes_of_the_abyss.png', alt: 'Echoes of the Abyss' },
        { src: '/beyond_the_signal.png', alt: 'Beyond The Signal' },
        { src: '/ashes_of_tomorrow.png', alt: 'Ashes of Tomorrow' },
        { src: '/mind_paradox.png', alt: 'Mind Paradox' }
    ];

    return (
        <div className="conntube-gallery-3d-container" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="conntube-gallery-3d-scene" style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s ease-out' : 'transform 0.1s linear'
            }}>
                {cards.map((card, i) => (
                    <div key={i} className={`conntube-vid-card conntube-card-${i + 1}`}>
                        <Image
                            src={card.src}
                            alt={card.alt}
                            fill
                            style={{ objectFit: 'cover', opacity: 0.6 }}
                            className="conntube-vid-img"
                        />
                        <div className="conntube-vid-card-inner">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="conntube-vid-play-icon">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <div className="conntube-vid-card-glow"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CountdownTimer = () => {
    return (
        <div className="conntube-countdown-container">
            <div className="conntube-count-box">
                <span className="conntube-count-num">25</span>
                <span className="conntube-count-label">DAYS</span>
            </div>
            <div className="conntube-count-sep"></div>
            <div className="conntube-count-box">
                <span className="conntube-count-num">14</span>
                <span className="conntube-count-label">HOURS</span>
            </div>
            <div className="conntube-count-sep"></div>
            <div className="conntube-count-box">
                <span className="conntube-count-num">16</span>
                <span className="conntube-count-label">MINS</span>
            </div>
            <div className="conntube-count-sep"></div>
            <div className="conntube-count-box">
                <span className="conntube-count-num">35</span>
                <span className="conntube-count-label">SECS</span>
            </div>
        </div>
    );
};



export default function ConnTube() {
    return (
        <div className="conntube-page">
            <div className="conntube-app-container">
                <Header />
                <main className="conntube-main-content-split">
                    <div className="conntube-bg-glow-red"></div>
                    <div className="conntube-split-hero-wrapper conntube-animate-fade-in conntube-delay-100">
                        <div className="conntube-split-hero-container">
                            <div className="conntube-split-left">
                                <Tube3DGallery />
                            </div>
                            <div className="conntube-split-right">
                                <div className="pre-title">
                                    <span style={{ color: '#dc2626', letterSpacing: '8px', fontWeight: 700, fontSize: '0.85rem' }}>C O N N T U B E</span>
                                </div>
                                <h1 className="conntube-title-coming-soon-split">
                                    COMING<br />SOON
                                </h1>
                                <div className="conntube-title-divider"></div>
                                <p className="conntube-subtitle-split">New stories. New creators. New era.</p>
                                <CountdownTimer />
                            </div>
                        </div>
                    </div>

                    <div className="conntube-features-container conntube-animate-fade-in conntube-delay-400">
                        <div className="conntube-feature-item">
                            <div className="conntube-feature-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M23 7l-7 5 7 5V7z"></path>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </div>
                            <h3 className="conntube-feature-title">Create without limits.</h3>
                            <p className="conntube-feature-desc">Powerful tools for modern creators.</p>
                        </div>
                        <div className="conntube-feature-item">
                            <div className="conntube-feature-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="conntube-feature-title">Build your audience.</h3>
                            <p className="conntube-feature-desc">Connect. Engage. Grow.</p>
                        </div>
                        <div className="conntube-feature-item">
                            <div className="conntube-feature-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h3 className="conntube-feature-title">Share everywhere.</h3>
                            <p className="conntube-feature-desc">Reach beyond boundaries.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
