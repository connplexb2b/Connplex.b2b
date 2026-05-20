"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './pure-x.css';

const PureXPage = () => {
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setFormStatus({ type: 'error', message: 'PLEASE ENTER A VALID EMAIL ADDRESS.' });
      return;
    }

    setIsSubmitting(true);
    // Fake network request
    setTimeout(() => {
      setFormStatus({ type: 'success', message: 'SUCCESS! YOU ARE NOW ON THE VIP NOTIFICATION LIST.' });
      setEmail('');
      setIsSubmitting(false);
      
      setTimeout(() => {
        setFormStatus({ type: null, message: '' });
      }, 5000);
    }, 1200);
  };

  return (
    <>
      <Header />
      <main className="pure-x-container">
        {/* Background atmospheric glows */}
        <div className="glow-backdrop glow-left"></div>
        <div className="glow-backdrop glow-right"></div>

        {/* Section 1: Hero Section */}
        <section className="hero-section">
          <div className="hero-content-wrapper">
            <div className="content-grid">
              <div className="hero-info">
                <div className="category-tag-container">
                  <span className="category-tag">BREATHE DIFFERENT.</span>
                  <div className="category-line"></div>
                </div>
                
                <h1 className="main-heading">
                  PURE<span className="gold-text">X</span>
                </h1>
                <div className="purex-subtitle">A I R &nbsp; P U R I F I E R</div>
                <div className="coming-soon-badge">COMING SOON</div>
                
                <p className="tagline">
                  Pure X is Connplex&apos;s advanced air purification system, engineered to deliver cleaner, fresher, and healthier air in every theatre.
                </p>
                
                <div className="hero-buttons">
                  <a href="#stay-updated" className="btn-outline-glow btn-hero-notify">
                    NOTIFY ME
                    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="hero-visual">
                <div className="purifier-image-container">
                  <Image 
                    src="/purex/purex_purifier.png" 
                    alt="PureX Advanced Air Purifier System" 
                    width={480} 
                    height={600} 
                    className="purifier-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features Section */}
        <section className="features-section">
          <div className="section-container">
            <div className="center-header">
              <span className="center-tag">CLEAN AIR. ELEVATED EXPERIENCE.</span>
              <h2 className="center-heading">ENGINEERED FOR <span className="gold-text">PREMIUM SPACES</span></h2>
              <p className="center-desc">
                Pure X combines cutting-edge filtration technology with intelligent air quality management to create healthier environments.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrap">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                    <circle cx="9" cy="6" r="2" fill="currentColor"></circle>
                    <circle cx="15" cy="12" r="2" fill="currentColor"></circle>
                    <circle cx="8" cy="18" r="2" fill="currentColor"></circle>
                  </svg>
                </div>
                <h3 className="feature-title">ADVANCED FILTRATION</h3>
                <p className="feature-desc">
                  Captures 99.97% of airborne particles, allergens, and pollutants.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.8 5.15a4 4 0 0 0-3.3 2.1c-.2.4-.4.8-.4 1.25H12a2 2 0 1 1-1.5 3.3"></path>
                    <path d="M4 12h11.5a2.5 2.5 0 1 0 0-5"></path>
                    <path d="M6 16h11.5a3 3 0 1 0 0-6"></path>
                  </svg>
                </div>
                <h3 className="feature-title">SMART AIR QUALITY</h3>
                <p className="feature-desc">
                  Real-time monitoring with intelligent sensors for optimal air quality.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <line x1="22" y1="9" x2="22" y2="15"></line>
                  </svg>
                </div>
                <h3 className="feature-title">ULTRA QUIET OPERATION</h3>
                <p className="feature-desc">
                  Whisper-quiet performance that ensures zero disturbance to cinematic experiences.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-wrap">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 2 3 5.5-1.5 6.5-6.5 11.5-11 12.5z"></path>
                    <path d="M19 2c-2.5 6.5-7.5 9-11 11"></path>
                  </svg>
                </div>
                <h3 className="feature-title">ENERGY EFFICIENT</h3>
                <p className="feature-desc">
                  Built for sustainability with low power consumption and high efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Subscription CTA */}
        <section className="cta-section" id="stay-updated">
          <div className="section-container">
            <div className="cta-grid">
              <div className="cta-spacer"></div>
              <div className="cta-content">
                <span className="section-tag-gold">BE THE FIRST TO KNOW</span>
                <h2 className="cta-heading">
                  STAY <span className="gold-text">UPDATED</span>
                </h2>
                
                <p className="cta-desc">
                  Register your interest and be the first to experience the future of clean air in cinemas.
                </p>
                
                <form className="subscribe-form" onSubmit={handleSubscribe}>
                  <div className="form-input-container">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      required 
                      className="subscribe-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button type="submit" className="btn-primary-magnetic btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'SAVING...' : 'NOTIFY ME'}
                      <span className="btn-icon-wrapper">
                        <svg className="arrow-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </button>
                  </div>
                  {formStatus.type && (
                    <div className={`form-response-msg ${formStatus.type}`}>
                      {formStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PureXPage;
