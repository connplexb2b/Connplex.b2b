"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const firstName = (rawData.firstName as string || '').trim();
    const lastName = (rawData.lastName as string || '').trim() || 'Unknown';
    const fullName = `${firstName} ${lastName}`.trim();

    // Map fields for local database (sending N/A for removed fields to bypass mongoose validations)
    const localPayload = {
      fullName,
      email: rawData.email,
      phone: rawData.phone,
      city: rawData.city,
      state: rawData.state,
      message: rawData.message,
      preferredInvestment: 'N/A',
      preferredCity: 'N/A',
      hasProperty: 'N/A',
      timeframe: 'N/A',
    };

    try {
      const apiUrl = getApiUrl();
      const requestUrl = `${apiUrl}/api/forms/contact-messages`;
      console.log('API URL:', requestUrl);
      console.log('Request Payload:', localPayload);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localPayload),
      });

      console.log('Response Status:', response.status);

      const result = await response.json();
      console.log('Response Payload:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      // Submit to Zoho CRM in the background (Web-to-Lead)
      try {
        const zohoParams = new URLSearchParams();
        zohoParams.append('xnQsjsdp', '3d8388912022a70a4029253d07486d1ffcfe4ac161a0313f4f2263853f1f61e4');
        zohoParams.append('xmIwtLD', 'fa0831cb6229dfc2fe636c6098821758d7233025034a14aacedaa09587a1c5e596dd8d7ef23e7813d687918333b84921');
        zohoParams.append('actionType', 'TGVhZHM=');
        zohoParams.append('returnURL', 'null');
        zohoParams.append('First Name', firstName);
        zohoParams.append('Last Name', lastName);
        zohoParams.append('Email', rawData.email as string || '');
        zohoParams.append('Phone', rawData.phone as string || '');
        zohoParams.append('LEADCF130', rawData.city as string || '');
        zohoParams.append('LEADCF151', rawData.state as string || '');
        zohoParams.append('Lead Source', 'Contact us Webite');
        zohoParams.append('Description', rawData.message as string || '');
        zohoParams.append('aG9uZXlwb3Q', '');

        console.log('Submitting to Zoho CRM...');
        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: zohoParams.toString(),
        })
          .then(() => console.log('Zoho CRM submission request dispatched successfully'))
          .catch(err => console.error('Zoho CRM dispatch failed:', err));
      } catch (zohoErr) {
        console.error('Failed to prepare Zoho CRM payload:', zohoErr);
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
    <div className="bg-[#050505] text-white font-inter overflow-x-hidden min-h-screen relative">
      {/* Atmospheric Glows */}
      <div className="absolute rounded-full pointer-events-none z-1 filter blur-[140px] w-[500px] h-[500px] bg-gold-primary/5 top-[15%] -left-[150px] hidden lg:block"></div>
      <div className="absolute rounded-full pointer-events-none z-1 filter blur-[140px] w-[600px] h-[600px] bg-gold-primary/3 bottom-[25%] -right-[200px] hidden lg:block"></div>

      {/* Header Overlay */}
      <Header />

      {/* Hero */}
      <section 
        className="relative w-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-28 md:py-36 flex flex-col lg:flex-row lg:items-center justify-between z-2 bg-[#050505] gap-10"
        style={{
          backgroundImage: `linear-gradient(to right, #050505 0%, #050505 25%, rgba(5, 5, 5, 0.9) 35%, rgba(5, 5, 5, 0.0) 45%, rgba(5, 5, 5, 0.0) 85%, rgba(5, 5, 5, 0.4) 100%), url('/img/contact/hero_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-[550px] w-full z-10">
          <span className="font-outfit text-gold-primary text-xs sm:text-sm font-semibold tracking-[0.25em] mb-6 inline-block uppercase">CONTACT US</span>
          <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-light leading-[1.15] tracking-[0.03em] mb-6 uppercase text-white">
            LET&apos;S CREATE<br />
            <span className="text-gold-primary font-normal text-shadow-[0_0_15px_rgba(201,159,74,0.25)]">CINEMA IMPACT.</span>
          </h1>
          <div className="w-[45px] h-[2px] bg-gold-primary mb-8"></div>
          <p className="font-inter text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-[500px]">
            Whether you&apos;re a brand, agency, or business looking to advertise with us or explore partnership opportunities, we&apos;d love to hear from you. Our team is here to help you connect with the right audiences, in the right way.
          </p>
        </div>


      </section>

      {/* Main Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 lg:gap-20">
          {/* Info Column */}
          <div className="flex flex-col">
            <h2 className="font-outfit text-2xl sm:text-3xl font-light tracking-wide uppercase mb-10 text-white">
              GET <span className="text-gold-primary font-normal">IN TOUCH</span>
            </h2>
            
            <div className="flex flex-col gap-4">
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
                <div 
                  className="flex gap-5 py-4 border-b border-white/5 last:border-0 hover:translate-x-1 transition-transform duration-300 group" 
                  key={i}
                >
                  <div className="flex items-center justify-center w-14 h-14 shrink-0 rounded border border-gold-primary/30 text-gold-primary transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:text-black group-hover:border-gold-primary group-hover:shadow-[0_0_15px_rgba(201,159,74,0.35)]">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-outfit text-[10px] md:text-[11px] font-semibold tracking-widest text-text-secondary uppercase mb-1.5">{item.sub}</span>
                    {item.type === 'email' ? (
                      <a href={`mailto:${item.link}`} className="text-sm sm:text-base text-white hover:text-gold-bright transition-colors font-medium break-all min-h-[44px] flex items-center">{item.link}</a>
                    ) : item.type === 'tel' ? (
                      <a href={`tel:${item.link.replace(/\s/g, '')}`} className="text-sm sm:text-base text-white hover:text-gold-bright transition-colors font-medium break-all min-h-[44px] flex items-center">{item.link}</a>
                    ) : (
                      <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed m-0">{item.link}</p>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex gap-5 border border-gold-primary/30 bg-gold-primary/[0.02] p-6 rounded-lg mt-6 hover:border-gold-primary hover:bg-gold-primary/[0.04] transition-all duration-300">
                <div className="flex items-center justify-center w-14 h-14 shrink-0 rounded border border-gold-primary/30 text-gold-primary">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-outfit text-[10px] md:text-[11px] font-semibold tracking-widest text-gold-bright uppercase mb-1.5">LOOKING FOR CINEMA LOCATIONS?</span>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed m-0">Call us or drop a message, our team will get back to you shortly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="flex flex-col">
            <h2 className="font-outfit text-2xl sm:text-3xl font-light tracking-wide uppercase mb-10 text-white">
              SEND US <span className="text-gold-primary font-normal">A MESSAGE</span>
            </h2>
            
            <div className="border border-gold-primary/20 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 bg-black/40 backdrop-blur-md">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gold-primary text-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-gold-primary text-xl sm:text-2xl font-semibold mb-4 tracking-wide font-outfit uppercase">
                    SUCCESSFULLY SUBMITTED!
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-[420px] mx-auto font-light">
                    Thank you for your interest in Connplex Cinemas. Our team will review your details and get in touch with you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="px-8 py-3 bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] text-black font-outfit text-xs font-bold tracking-widest rounded uppercase hover:shadow-[0_8px_30px_rgba(201,159,74,0.35)] transition-all duration-300 cursor-pointer min-h-[44px]"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input name="firstName" type="text" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="First Name" required />
                    <input name="lastName" type="text" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="Last Name" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input name="email" type="email" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="Email Address" required />
                    <input name="phone" type="tel" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="Phone Number" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input name="city" type="text" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="City" required />
                    <input name="state" type="text" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[48px]" placeholder="State" required />
                  </div>
                  <div>
                    <textarea name="message" className="bg-black/50 border border-white/10 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-gold-primary focus:bg-black/70 focus:shadow-[0_0_15px_rgba(201,159,74,0.12)] min-h-[120px] resize-none" placeholder="Message" rows={4} required></textarea>
                  </div>
                  
                  {submitError && (
                    <div className="text-[#ff5252] text-xs font-semibold">
                      ⚠️ {submitError}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                    <button 
                      type="submit" 
                      className="inline-flex items-center justify-center gap-3.5 px-10 py-4 bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] text-black font-outfit text-xs font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_8px_30px_rgba(201,159,74,0.35)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 min-h-[48px] w-full sm:w-auto cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ENQUIRY →'}
                    </button>
                    <p className="text-[12.5px] text-text-secondary m-0">We usually respond within 24 hours.</p>
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
