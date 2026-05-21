"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './contact.css';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const apiUrl = getApiUrl();
      const requestUrl = `${apiUrl}/api/forms/contact-messages`;
      console.log('API URL:', requestUrl);
      console.log('Request Payload:', data);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      setSubmitError(error.message || 'Unable to submit enquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Atmospheric Glows */}
      <div className="ct-glow ct-glow-left"></div>
      <div className="ct-glow ct-glow-right"></div>

      {/* Header Overlay */}
      <Header />

      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-hero-content">
          <span className="ct-category-tag">CONTACT US</span>
          <h1 className="ct-main-heading">
            LET&apos;S CREATE<br />
            <span className="ct-gold-text">CINEMA IMPACT.</span>
          </h1>
          <div className="ct-hero-divider"></div>
          <p className="ct-hero-tagline">
            Whether you&apos;re a brand, agency, or business looking to advertise with us or explore partnership opportunities, we&apos;d love to hear from you. Our team is here to help you connect with the right audiences, in the right way.
          </p>
        </div>

      </section>

      {/* Main Grid */}
      <section className="ct-grid-section">
        <div className="ct-layout-grid">
          {/* Info Column */}
          <div className="ct-info-column">
            <h2 className="ct-section-heading">GET <span className="ct-gold-text">IN TOUCH</span></h2>
            <div className="ct-info-cards-stack">
              {[
                {
                  sub: "FRANCHISE ENQUIRIES",
                  link: "reports@theconnplex.com",
                  type: "email",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                },
                {
                  sub: "PARTNERSHIP & COLLABORATION",
                  link: "marketing@theconnplex.com",
                  type: "email",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                },
                {
                  sub: "Capex Inquiries",
                  link: "reports@theconnplex.com",
                  type: "email",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="1"></rect><path d="M4 14h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z"></path><line x1="12" y1="10" x2="12" y2="14"></line><circle cx="6" cy="18" r="1.5"></circle><circle cx="18" cy="18" r="1.5"></circle></svg>
                },
                {
                  sub: "HEAD OFFICE",
                  link: "Krish Cubical, Block C: (1001 to 1008), 10th Floor, Opp. Avalon Hotel Road, SBR - Sindhu Bhavan Marg, Thaltej, Ahmedabad, Gujarat - 380059",
                  type: "address",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                },
                {
                  sub: "CALL US",
                  link: "+91 9924577556",
                  type: "tel",
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                }
              ].map((item, i) => (
                <div className="ct-info-card" key={i}>
                  <div className="ct-card-icon-container">
                    {item.icon}
                  </div>
                  <div className="ct-card-text">
                    <span className="ct-card-subtitle">{item.sub}</span>
                    {item.type === 'email' ? <a href={`mailto:${item.link}`} className="ct-card-link">{item.link}</a> :
                      item.type === 'tel' ? <a href={`tel:${item.link.replace(/\s/g, '')}`} className="ct-card-link">{item.link}</a> :
                        <p className="ct-card-address" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0, fontWeight: 300 }}>{item.link}</p>}
                  </div>
                </div>
              ))}
              <div className="ct-info-card ct-glow-card">
                <div className="ct-card-icon-container">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-subtitle" style={{ color: 'var(--ct-gold-hover)' }}>LOOKING FOR CINEMA LOCATIONS?</span>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Call us or drop a message, our team will get back to you shortly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="ct-form-column">
            <h2 className="ct-section-heading">SEND US <span className="ct-gold-text">A MESSAGE</span></h2>
            <div className="ct-form-panel">
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--ct-gold-primary)',
                    color: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ color: 'var(--ct-gold-primary)', fontSize: '1.6rem', marginBottom: '15px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>SUCCESSFULLY SUBMITTED!</h3>
                  <p style={{ color: 'var(--ct-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', maxWidth: '420px', margin: '0 auto 25px auto' }}>
                    Thank you for your interest in Connplex Cinemas. Our team will review your details and get in touch with you shortly.
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="ct-submit-btn" style={{ padding: '12px 30px', fontSize: '12px' }}>Send another enquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="ct-form-row">
                    <input name="fullName" type="text" className="ct-input" placeholder="Full Name" required />
                    <input name="email" type="email" className="ct-input" placeholder="Email Address" required />
                  </div>
                  <div className="ct-form-row">
                    <input name="phone" type="tel" className="ct-input" placeholder="Phone Number" required />
                    <input name="state" type="text" className="ct-input" placeholder="State" required />
                  </div>
                  <div className="ct-form-row">
                    <input name="city" type="text" className="ct-input" placeholder="City" required />
                    <select name="preferredInvestment" className="ct-input" required defaultValue="">
                      <option value="" disabled>Preferred investment range?</option>
                      <option value="1.5-2cr">1.5 to 2 cr</option>
                      <option value="2-2.5cr">2cr to 2.5 cr</option>
                      <option value="2.5-3cr">2.5 to 3cr</option>
                      <option value="3cr+">3cr and above</option>
                    </select>
                  </div>
                  <div className="ct-form-row">
                    <input name="preferredCity" type="text" className="ct-input" placeholder="Which city do you prefer for Connplex Cinema?" required />
                    <input name="hasProperty" type="text" className="ct-input" placeholder="Do you have a property or location for cinema?" required />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <select name="timeframe" className="ct-input" required defaultValue="">
                      <option value="" disabled>How soon do you plan to start this investment?</option>
                      <option value="immediately">Immediately</option>
                      <option value="1-month">1 month</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3plus-months">3+ months</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <textarea name="message" className="ct-input" style={{ minHeight: '120px', resize: 'none' }} placeholder="Message" rows={4} required></textarea>
                  </div>
                  {submitError && (
                    <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                      ⚠️ {submitError}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    <button type="submit" className="ct-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ENQUIRY →'}
                    </button>
                    <p style={{ fontSize: '12.5px', color: 'var(--ct-text-secondary)' }}>We usually respond within 24 hours.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
