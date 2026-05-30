"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

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
    <div className="bg-[#050505] text-white font-inter overflow-x-hidden min-h-screen">
      {/* Header Overlay */}
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-10 lg:px-20 py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-1">
          <Image 
            src="/img/book-event/top_image.png" 
            alt="Hero" 
            fill 
            sizes="100vw"
            className="object-cover opacity-60"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-[#050505]/20 z-2"></div>
        </div>
        
        <div className="relative z-10 max-w-[800px] w-full">
          <p className="text-gold-primary text-xs sm:text-sm font-semibold tracking-[3px] mb-5">
            CREATE MOMENTS. INSPIRE CONNECTIONS.
          </p>
          <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-none mb-8 uppercase">
            BOOK<br />AN<br /><span className="text-gold-primary font-normal">EVENT</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary font-light max-w-[600px] mb-10 leading-relaxed">
            The Connplex is more than a venue – it&apos;s a canvas for unforgettable cinematic experiences. From premieres to private screenings, bring your vision to life.
          </p>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-8 sm:gap-12 md:gap-16 pt-4">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gold-primary leading-none mb-2">41</div>
              <div className="text-[10px] tracking-wider leading-normal text-text-secondary uppercase">
                ICONIC<br />VENUES
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gold-primary leading-none mb-2">125+</div>
              <div className="text-[10px] tracking-wider leading-normal text-text-secondary uppercase">
                PREMIUM<br />SPACES
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gold-primary leading-none mb-2">∞</div>
              <div className="text-[10px] tracking-wider leading-normal text-text-secondary uppercase">
                UNLIMITED<br />POSSIBILITIES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 md:mb-12">
          <h2 className="font-outfit text-2xl md:text-3xl font-light tracking-wide">
            OUR CINEMATIC SPACES
          </h2>
          <Link 
            href="#" 
            className="text-gold-primary hover:text-gold-bright transition-colors text-xs md:text-sm font-semibold tracking-[0.1em] min-h-[44px] flex items-center"
          >
            VIEW ALL SPACES +
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "THE GRAND CINEMA", desc: "Our flagship auditorium with state-of-the-art projection and immersive sound.", img: "space_1.png" },
            { title: "THE PRIVATE SCREENING ROOM", desc: "Intimate, exclusive screenings for private audiences and special guests.", img: "space_2.png", popular: true },
            { title: "THE IMAX EXPERIENCE", desc: "Breathtaking scale. Unmatched immersion. Next-level storytelling.", img: "space_3.png" },
            { title: "THE OUTDOOR CINEMA", desc: "Open-air screenings under the stars. Magic, redefined.", img: "space_6.png" },
            { title: "THE EVENT LOUNGE", desc: "Sophisticated spaces for receptions, mixers and celebrations.", img: "space_5.png" },
            { title: "THE DIRECTOR'S SUITE", desc: "Private hospitality with premium comfort and complete privacy.", img: "space_4.png" }
          ].map((s, i) => (
            <div 
              className="relative bg-[#0f0f0f]/40 border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-gold-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 group" 
              key={i}
            >
              <div className="relative w-full aspect-video">
                {s.popular && (
                  <span className="absolute top-4 left-4 bg-black border border-gold-primary text-gold-primary px-2.5 py-1 text-[9px] tracking-wider rounded z-10 font-semibold">
                    MOST POPULAR
                  </span>
                )}
                <Image 
                  src={`/img/book-event/${s.img}`} 
                  alt={s.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
              <div className="p-6 md:p-8 pb-20">
                <h3 className="text-lg md:text-xl font-outfit font-medium mb-2.5 text-white">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm font-light text-text-secondary leading-relaxed">
                  {s.desc}
                </p>
                <button 
                  className="absolute bottom-6 right-6 bg-transparent border border-white/10 text-white p-3 rounded-lg hover:bg-gold-primary hover:text-black hover:border-gold-primary transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 bg-[#050505] max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <h2 className="font-outfit text-lg sm:text-xl md:text-2xl font-light text-gold-primary flex items-center gap-3.5 tracking-wider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#d4af37" className="w-5 h-5 md:w-6 md:h-6">
              <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7zm11.77 11.77L6.22 7.72l1.06-1.06 11.05 11.05-1.06 1.06z" />
            </svg>
            EVENT EXPERIENCES
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {[
            {
              title: "FILM PREMIERES",
              desc: "Make your premiere an unforgettable red carpet moment.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><path d="M22 11V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" /><path d="M2 11h20" /><path d="M7 3l3 8" /><path d="M12 3l3 8" /><path d="M17 3l3 8" /><path d="M2 11l3 10" /><path d="M7 11l3 10" /><path d="M12 11l3 10" /><path d="M17 11l3 10" /></svg>
            },
            {
              title: "PRIVATE SCREENINGS",
              desc: "Host exclusive screenings for your guests in privacy.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            },
            {
              title: "PRESS JUNKETS",
              desc: "Impress the media with a seamless, professional cinematic experience.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
            },
            {
              title: "FILM FESTIVALS",
              desc: "Curate, celebrate and showcase stories that inspire.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
            },
            {
              title: "BRAND COLLABORATIONS",
              desc: "Align your brand with the power of film and experience.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            },
            {
              title: "SPECIAL OCCASIONS",
              desc: "Celebrate milestones with cinematic elegance.",
              icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 md:w-8 md:h-8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            }
          ].map((exp, i) => (
            <div 
              className="p-8 md:p-6 text-center border border-white/5 bg-[#0a0a0a]/20 rounded-lg transition-all duration-300 hover:bg-white/[0.02] hover:border-gold-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col items-center min-h-[200px]" 
              key={i}
            >
              <div className="text-gold-primary mb-5 flex items-center justify-center w-12 h-12 bg-white/[0.01] border border-white/5 rounded-full">{exp.icon}</div>
              <h3 className="font-outfit text-xs md:text-[13px] font-semibold text-white mb-3 tracking-[1.5px] uppercase">{exp.title}</h3>
              <p className="font-inter text-[11px] md:text-xs text-text-secondary leading-relaxed">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section 
        className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 bg-gradient-to-b from-[#050505] to-[#0a0a0a] relative overflow-hidden" 
        id="booking"
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none z-1"></div>
        
        <div className="relative z-10 max-w-[800px] mx-auto bg-[#0a0a0a]/60 border border-white/5 p-6 sm:p-10 md:p-16 rounded-2xl backdrop-blur-md shadow-2xl shadow-black/80">
          <h2 className="font-outfit text-xl sm:text-2xl font-light text-white mb-8 sm:mb-10 flex items-center gap-3 tracking-wide uppercase">
            <span className="text-gold-primary">✨</span> LET&apos;S PLAN YOUR EVENT
          </h2>

          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gold-primary text-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-gold-primary text-2xl font-semibold mb-4 tracking-wide font-outfit uppercase">
                SUCCESSFULLY RESERVED!
              </h3>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-[420px] mx-auto font-light">
                Thank you. Your event booking request has been successfully recorded. Our events team will review your details and contact you shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="w-auto px-8 py-3 bg-transparent text-gold-primary border border-gold-primary rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-gold-primary hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer min-h-[44px]"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Event Details */}
              <div className="flex flex-col gap-6">
                <h3 className="text-gold-primary text-xs font-bold tracking-[2px] border-b border-white/5 pb-2 uppercase">
                  EVENT DETAILS
                </h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">EVENT TYPE</label>
                  <div className="relative">
                    <select name="eventType" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 pr-10 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px] appearance-none cursor-pointer" required defaultValue="">
                      <option value="" disabled>Select Event Type</option>
                      <option value="premiere">Film Premiere</option>
                      <option value="private">Private Screening</option>
                      <option value="corporate">Corporate Event</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">EVENT NAME</label>
                  <input name="eventName" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="e.g. Film Premiere, Private Screening" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">SELECT DATE</label>
                  <div className="relative">
                    <input name="eventDate" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 pr-10 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Select Date" onFocus={(e) => (e.target.type = "date")} required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary pointer-events-none text-[14px]">📅</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">START TIME</label>
                    <input name="startTime" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Select Time" onFocus={(e) => (e.target.type = "time")} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">END TIME</label>
                    <input name="endTime" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Select Time" onFocus={(e) => (e.target.type = "time")} required />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">EXPECTED GUESTS</label>
                  <div className="relative">
                    <select name="expectedGuests" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 pr-10 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px] appearance-none cursor-pointer" required defaultValue="">
                      <option value="" disabled>Number of Guests</option>
                      <option value="1-50">1 - 50</option>
                      <option value="51-100">51 - 100</option>
                      <option value="100+">100+</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              {/* Your Details */}
              <div className="flex flex-col gap-6 pt-4">
                <h3 className="text-gold-primary text-xs font-bold tracking-[2px] border-b border-white/5 pb-2 uppercase">
                  YOUR DETAILS
                </h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">FULL NAME</label>
                  <input name="fullName" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Enter your full name" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">EMAIL ADDRESS</label>
                  <input name="email" type="email" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Enter your email" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">PHONE NUMBER</label>
                  <input name="phone" type="tel" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Enter your phone number" required />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">COMPANY / ORGANIZATION (OPTIONAL)</label>
                  <input name="company" type="text" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Enter company name" />
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-col gap-6 pt-4">
                <h3 className="text-gold-primary text-xs font-bold tracking-[2px] border-b border-white/5 pb-2 uppercase">
                  ADDITIONAL INFORMATION
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-wider text-text-secondary uppercase font-semibold">TELL US ABOUT YOUR EVENT</label>
                  <textarea name="message" className="w-full bg-[#141414]/80 border border-white/10 px-4 py-3.5 text-white rounded-lg text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-[#1e1e1e]/90 min-h-[48px]" placeholder="Share your vision, special requests, technical needs..." rows={4}></textarea>
                </div>
              </div>

              {submitError && (
                <div className="text-[#ff5252] text-xs font-semibold mt-2">
                  ⚠️ {submitError}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-4 bg-transparent hover:bg-gold-primary hover:text-black border border-gold-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] text-gold-primary text-xs font-bold tracking-widest rounded-lg transition-all duration-300 uppercase min-h-[50px] cursor-pointer mt-4" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT REQUEST →'}
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-white/5">
            <div className="text-center sm:text-left">
              <p className="text-xs text-white font-semibold mb-1">Need help planning your event?</p>
              <p className="text-xs text-text-secondary">Our team is here for you.</p>
            </div>
            <div className="text-center sm:text-right flex flex-col sm:items-end gap-1.5">
              <a 
                href="mailto:events@theconnplex.com" 
                className="text-white hover:text-gold-primary text-xs transition-colors py-1.5 px-3 min-h-[44px] flex items-center justify-center"
              >
                events@theconnplex.com
              </a>
              <a 
                href="tel:+971501234567" 
                className="text-white hover:text-gold-primary text-xs transition-colors py-1.5 px-3 min-h-[44px] flex items-center justify-center"
              >
                +971 50 123 4567 🎧
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}