"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './book-event.css';

export default function BookEventPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const apiUrl = getApiUrl();
      const requestUrl = `${apiUrl}/api/forms/book-event`;
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
      setSubmitError(error.message || 'Unable to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-event-page">
      {/* Header Overlay */}
      <Header />

      {/* Hero */}
      <section className="be-hero">
        <div className="be-hero-bg">
          <Image src="/img/book-event/top_image.png" alt="Hero" fill style={{ objectFit: 'cover' }} priority />
          <div className="be-hero-gradient"></div>
        </div>
        <div className="be-hero-content">
          <p className="be-pre-title">CREATE MOMENTS. INSPIRE CONNECTIONS.</p>
          <h1>BOOK<br />AN<br /><span className="be-text-gold">EVENT</span></h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px', marginBottom: '40px' }}>
            The Connplex is more than a venue – it&apos;s a canvas for unforgettable cinematic experiences. From premieres to private screenings, bring your vision to life.
          </p>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#D4AF37' }}>41</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>ICONIC<br />VENUES</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#D4AF37' }}>115+</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>PREMIUM<br />SPACES</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#D4AF37' }}>∞</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>UNLIMITED<br />POSSIBILITIES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="be-spaces-section">
        <div className="be-section-header">
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit' }}>OUR CINEMATIC SPACES</h2>
          <Link href="#" style={{ color: '#D4AF37', fontSize: '0.8rem' }}>VIEW ALL SPACES +</Link>
        </div>
        <div className="be-spaces-grid">
          {[
            { title: "THE GRAND THEATRE", desc: "Our flagship auditorium with state-of-the-art projection and immersive sound.", img: "space_1.png" },
            { title: "THE PRIVATE SCREENING ROOM", desc: "Intimate, exclusive screenings for private audiences and special guests.", img: "space_2.png", popular: true },
            { title: "THE IMAX EXPERIENCE", desc: "Breathtaking scale. Unmatched immersion. Next-level storytelling.", img: "space_3.png" },
            { title: "THE OUTDOOR CINEMA", desc: "Open-air screenings under the stars. Magic, redefined.", img: "space_6.png" },
            { title: "THE EVENT LOUNGE", desc: "Sophisticated spaces for receptions, mixers and celebrations.", img: "space_5.png" },
            { title: "THE DIRECTOR'S SUITE", desc: "Private hospitality with premium comfort and complete privacy.", img: "space_4.png" }
          ].map((s, i) => (
            <div className="be-space-card" key={i}>
              <div className="be-space-img">
                {s.popular && <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#000', border: '1px solid #D4AF37', color: '#D4AF37', padding: '4px 10px', fontSize: '0.6rem', borderRadius: '4px', zIndex: 5 }}>MOST POPULAR</span>}
                <Image src={`/img/book-event/${s.img}`} alt={s.title} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="be-space-content">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>{s.desc}</p>
                <button style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '4px' }}>→</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="be-exp-section">
        <div className="be-section-header">
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'Outfit', color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#d4af37">
              <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 11.77L6.22 7.72l1.06-1.06 11.05 11.05-1.06 1.06z" />
            </svg>
            EVENT EXPERIENCES
          </h2>
        </div>
        <div className="be-exp-grid">
          {[
            {
              title: "FILM PREMIERES",
              desc: "Make your premiere an unforgettable red carpet moment.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" /><path d="M2 11h20" /><path d="M7 3l3 8" /><path d="M12 3l3 8" /><path d="M17 3l3 8" /><path d="M2 11l3 10" /><path d="M7 11l3 10" /><path d="M12 11l3 10" /><path d="M17 11l3 10" /></svg>
            },
            {
              title: "PRIVATE SCREENINGS",
              desc: "Host exclusive screenings for your guests in privacy.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            },
            {
              title: "PRESS JUNKETS",
              desc: "Impress the media with a seamless, professional cinematic experience.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
            },
            {
              title: "FILM FESTIVALS",
              desc: "Curate, celebrate and showcase stories that inspire.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
            },
            {
              title: "BRAND COLLABORATIONS",
              desc: "Align your brand with the power of film and experience.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            },
            {
              title: "SPECIAL OCCASIONS",
              desc: "Celebrate milestones with cinematic elegance.",
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            }
          ].map((exp, i) => (
            <div className="be-exp-card" key={i}>
              <div className="be-exp-icon">{exp.icon}</div>
              <h3 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '15px', letterSpacing: '1px' }}>{exp.title}</h3>
              <p style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: '1.6' }}>{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section className="be-booking-section" id="booking">
        <div className="be-form-container">
          <h2 className="be-form-title"><span style={{ color: '#D4AF37' }}>✨</span> LET&apos;S PLAN YOUR EVENT</h2>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#D4AF37',
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
              <h3 style={{ color: '#D4AF37', fontSize: '1.6rem', marginBottom: '15px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>SUCCESSFULLY RESERVED!</h3>
              <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', maxWidth: '420px', margin: '0 auto 25px auto' }}>
                Thank you. Your event booking request has been successfully recorded. Our events team will review your details and contact you shortly.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="be-btn-submit" style={{ padding: '12px 30px', fontSize: '12px', width: 'auto', display: 'inline-block' }}>Submit another request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Event Details */}
              <div className="be-form-section">
                <h3 className="be-form-section-title">EVENT DETAILS</h3>
                <div className="be-form-group">
                  <label className="be-label">EVENT TYPE</label>
                  <div className="be-input-wrap">
                    <select name="eventType" className="be-input" required defaultValue="">
                      <option value="" disabled>Select Event Type</option>
                      <option value="premiere">Film Premiere</option>
                      <option value="private">Private Screening</option>
                      <option value="corporate">Corporate Event</option>
                    </select>
                    <span className="be-input-icon">▼</span>
                  </div>
                </div>
                <div className="be-form-group">
                  <label className="be-label">EVENT NAME</label>
                  <input name="eventName" type="text" className="be-input" placeholder="e.g. Film Premiere, Private Screening" required />
                </div>
                <div className="be-form-group">
                  <label className="be-label">SELECT DATE</label>
                  <div className="be-input-wrap">
                    <input name="eventDate" type="text" className="be-input" placeholder="Select Date" onFocus={(e) => (e.target.type = "date")} required />
                    <span className="be-input-icon">📅</span>
                  </div>
                </div>
                <div className="be-form-row">
                  <div className="be-form-group">
                    <label className="be-label">START TIME</label>
                    <input name="startTime" type="text" className="be-input" placeholder="Select Time" onFocus={(e) => (e.target.type = "time")} required />
                  </div>
                  <div className="be-form-group">
                    <label className="be-label">END TIME</label>
                    <input name="endTime" type="text" className="be-input" placeholder="Select Time" onFocus={(e) => (e.target.type = "time")} required />
                  </div>
                </div>
                <div className="be-form-group">
                  <label className="be-label">EXPECTED GUESTS</label>
                  <div className="be-input-wrap">
                    <select name="expectedGuests" className="be-input" required defaultValue="">
                      <option value="" disabled>Number of Guests</option>
                      <option value="1-50">1 - 50</option>
                      <option value="51-100">51 - 100</option>
                      <option value="100+">100+</option>
                    </select>
                    <span className="be-input-icon">▼</span>
                  </div>
                </div>
              </div>

              {/* Your Details */}
              <div className="be-form-section" style={{ marginTop: '40px' }}>
                <h3 className="be-form-section-title">YOUR DETAILS</h3>
                <div className="be-form-group">
                  <label className="be-label">FULL NAME</label>
                  <input name="fullName" type="text" className="be-input" placeholder="Enter your full name" required />
                </div>
                <div className="be-form-group">
                  <label className="be-label">EMAIL ADDRESS</label>
                  <input name="email" type="email" className="be-input" placeholder="Enter your email" required />
                </div>
                <div className="be-form-group">
                  <label className="be-label">PHONE NUMBER</label>
                  <input name="phone" type="tel" className="be-input" placeholder="Enter your phone number" required />
                </div>
                <div className="be-form-group">
                  <label className="be-label">COMPANY / ORGANIZATION (OPTIONAL)</label>
                  <input name="company" type="text" className="be-input" placeholder="Enter company name" />
                </div>
              </div>

              {/* Additional Info */}
              <div className="be-form-section" style={{ marginTop: '40px' }}>
                <h3 className="be-form-section-title">ADDITIONAL INFORMATION</h3>
                <div className="be-form-group">
                  <label className="be-label">TELL US ABOUT YOUR EVENT</label>
                  <textarea name="message" className="be-input" placeholder="Share your vision, special requests, technical needs..." rows={4}></textarea>
                </div>
              </div>

              {submitError && (
                <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                  ⚠️ {submitError}
                </div>
              )}

              <button type="submit" className="be-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT REQUEST →'}
              </button>
            </form>
          )}

          <div className="be-form-footer">
            <div className="be-footer-text">
              <p><strong>Need help planning your event?</strong></p>
              <p>Our team is here for you.</p>
            </div>
            <div className="be-footer-contact">
              <a href="mailto:events@theconnplex.com">events@theconnplex.com</a>
              <a href="tel:+971501234567">+971 50 123 4567 🎧</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}