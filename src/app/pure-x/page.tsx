"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

const PureXPage = () => {
  const [email, setEmail] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setFormStatus({ type: 'error', message: 'PLEASE ENTER A VALID EMAIL ADDRESS.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      const apiUrl = getApiUrl();
      const requestUrl = `${apiUrl}/api/forms/purex-subscribers`;
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

      setFormStatus({ type: 'success', message: 'SUCCESS! YOU ARE NOW ON THE VIP NOTIFICATION LIST.' });
      setEmail('');
      
      setTimeout(() => {
        setFormStatus({ type: null, message: '' });
      }, 5000);
    } catch (error: any) {
      console.error('Submission Error:', error);
      setFormStatus({ type: 'error', message: error.message || 'Unable to join waitlist. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-[#050505] text-white font-inter overflow-x-hidden relative min-h-screen">
        {/* Background atmospheric glows */}
        <div className="absolute rounded-full pointer-events-none z-1 filter blur-[120px] w-[400px] h-[400px] bg-gold-primary/5 top-[20%] left-[-100px] hidden md:block"></div>
        <div className="absolute rounded-full pointer-events-none z-1 filter blur-[120px] w-[500px] h-[500px] bg-gold-primary/3 bottom-[10%] right-[-150px] hidden md:block"></div>

        {/* Section 1: Hero Section */}
        <section className="relative w-full min-h-screen flex flex-col justify-center z-10 overflow-hidden bg-[#050505] lg:bg-[url('/purex/hero_bg.png')] bg-no-repeat bg-[position:right_center] bg-cover lg:before:content-[''] lg:before:absolute lg:before:inset-0 lg:before:bg-gradient-to-r lg:before:from-[#050505] lg:before:via-[#050505]/85 lg:before:to-transparent lg:before:z-1 lg:after:content-[''] lg:after:absolute lg:after:inset-0 lg:after:bg-gradient-to-b lg:after:from-[#050505] lg:after:via-transparent lg:after:to-[#050505] lg:after:z-1">
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-10 md:px-20 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center w-full">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-3.5 mb-4.5">
                  <span className="font-outfit text-gold-primary text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">BREATHE DIFFERENT.</span>
                  <div className="w-7 h-[1px] bg-gold-primary"></div>
                </div>
                
                <h1 className="font-outfit font-extralight text-5xl sm:text-6xl md:text-8xl lg:text-[96px] leading-[0.95] tracking-wide text-white mb-1.5 uppercase">
                  PURE<span className="text-gold-primary font-normal bg-gradient-to-br from-[#c99f4a] via-[#ffd885] to-[#b3852d] bg-clip-text text-transparent">X</span>
                </h1>
                <div className="font-outfit font-normal text-sm sm:text-lg text-[#e2c07d] tracking-[0.45em] uppercase mb-6">A I R &nbsp; P U R I F I E R</div>
                <div className="font-outfit text-xl sm:text-2xl font-bold text-gold-primary tracking-[0.35em] border-y border-gold-primary/45 py-2 px-3 inline-block mb-6">COMING SOON</div>
                
                <p className="font-inter text-sm sm:text-base font-light leading-relaxed text-zinc-400 max-w-[500px] mb-8">
                  Pure X is Connplex&apos;s advanced air purification system, engineered to deliver cleaner, fresher, and healthier air in every theatre.
                </p>
                
                <div className="flex">
                  <a href="#stay-updated" className="group inline-flex items-center gap-2.5 px-7 py-3 border border-[#c99f4a]/30 bg-[#c99f4a]/3 hover:border-gold-primary hover:text-black text-gold-primary font-outfit text-xs font-semibold tracking-wider uppercase rounded-sm relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(201,159,74,0.35)] cursor-pointer h-12 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-[#c99f4a] before:via-[#ffd885] before:to-[#b3852d] before:transition-all before:duration-500 before:z-0 hover:before:left-0">
                    <span className="relative z-10 transition-colors duration-500 group-hover:text-black">NOTIFY ME</span>
                    <svg className="relative z-10 stroke-gold-primary group-hover:stroke-black group-hover:translate-x-1 transition-all duration-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end items-center relative opacity-100 lg:opacity-0 lg:pointer-events-none transition-opacity duration-400 order-first lg:order-none mb-10 lg:mb-0">
                <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-white/5 shadow-[0_25px_65px_rgba(0,0,0,0.7)]">
                  <Image 
                    src="/purex/purex_purifier.png" 
                    alt="PureX Advanced Air Purifier System" 
                    width={480} 
                    height={600} 
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features Section */}
        <section className="relative py-24 md:py-36 bg-[#050505] z-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-10 md:px-20 w-full">
            <div className="text-center max-w-[800px] mx-auto mb-16 md:mb-20">
              <span className="font-outfit text-gold-primary text-xs sm:text-sm font-semibold tracking-[0.22em] mb-4.5 display: inline-block uppercase">CLEAN AIR. ELEVATED EXPERIENCE.</span>
              <h2 className="font-outfit font-light text-3xl sm:text-4xl md:text-[42px] tracking-wide text-white uppercase mb-5">ENGINEERED FOR <span className="text-gold-primary font-normal bg-gradient-to-br from-[#c99f4a] via-[#ffd885] to-[#b3852d] bg-clip-text text-transparent">PREMIUM SPACES</span></h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-400 font-light max-w-[650px] mx-auto">
                Pure X combines cutting-edge filtration technology with intelligent air quality management to create healthier environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              <div className="group/feat flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gold-primary/3 border border-gold-primary/15 rounded-full text-gold-primary mb-6 transition-all duration-500 group-hover/feat:bg-gradient-to-r group-hover/feat:from-[#c99f4a] group-hover/feat:via-[#ffd885] group-hover/feat:to-[#b3852d] group-hover/feat:text-black group-hover/feat:border-gold-primary">
                  <svg className="w-6 h-6 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                    <circle cx="9" cy="6" r="2" fill="currentColor"></circle>
                    <circle cx="15" cy="12" r="2" fill="currentColor"></circle>
                    <circle cx="8" cy="18" r="2" fill="currentColor"></circle>
                  </svg>
                </div>
                <h3 className="font-outfit font-medium text-sm sm:text-base tracking-wider text-white mb-3.5 uppercase">ADVANCED FILTRATION</h3>
                <p className="font-inter text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
                  Captures 99.97% of airborne particles, allergens, and pollutants.
                </p>
              </div>

              <div className="group/feat flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gold-primary/3 border border-gold-primary/15 rounded-full text-gold-primary mb-6 transition-all duration-500 group-hover/feat:bg-gradient-to-r group-hover/feat:from-[#c99f4a] group-hover/feat:via-[#ffd885] group-hover/feat:to-[#b3852d] group-hover/feat:text-black group-hover/feat:border-gold-primary">
                  <svg className="w-6 h-6 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                    <path d="M12.8 5.15a4 4 0 0 0-3.3 2.1c-.2.4-.4.8-.4 1.25H12a2 2 0 1 1-1.5 3.3"></path>
                    <path d="M4 12h11.5a2.5 2.5 0 1 0 0-5"></path>
                    <path d="M6 16h11.5a3 3 0 1 0 0-6"></path>
                  </svg>
                </div>
                <h3 className="font-outfit font-medium text-sm sm:text-base tracking-wider text-white mb-3.5 uppercase">SMART AIR QUALITY</h3>
                <p className="font-inter text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
                  Real-time monitoring with intelligent sensors for optimal air quality.
                </p>
              </div>

              <div className="group/feat flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gold-primary/3 border border-gold-primary/15 rounded-full text-gold-primary mb-6 transition-all duration-500 group-hover/feat:bg-gradient-to-r group-hover/feat:from-[#c99f4a] group-hover/feat:via-[#ffd885] group-hover/feat:to-[#b3852d] group-hover/feat:text-black group-hover/feat:border-gold-primary">
                  <svg className="w-6 h-6 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <line x1="22" y1="9" x2="22" y2="15"></line>
                  </svg>
                </div>
                <h3 className="font-outfit font-medium text-sm sm:text-base tracking-wider text-white mb-3.5 uppercase">ULTRA QUIET OPERATION</h3>
                <p className="font-inter text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
                  Whisper-quiet performance that ensures zero disturbance to cinematic experiences.
                </p>
              </div>

              <div className="group/feat flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gold-primary/3 border border-gold-primary/15 rounded-full text-gold-primary mb-6 transition-all duration-500 group-hover/feat:bg-gradient-to-r group-hover/feat:from-[#c99f4a] group-hover/feat:via-[#ffd885] group-hover/feat:to-[#b3852d] group-hover/feat:text-black group-hover/feat:border-gold-primary">
                  <svg className="w-6 h-6 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 2 3 5.5-1.5 6.5-6.5 11.5-11 12.5z"></path>
                    <path d="M19 2c-2.5 6.5-7.5 9-11 11"></path>
                  </svg>
                </div>
                <h3 className="font-outfit font-medium text-sm sm:text-base tracking-wider text-white mb-3.5 uppercase">ENERGY EFFICIENT</h3>
                <p className="font-inter text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
                  Built for sustainability with low power consumption and high efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Subscription CTA */}
        <section className="relative py-24 md:py-36 z-10 overflow-hidden bg-cover bg-[center_center] bg-no-repeat lg:bg-[url('/purex/bottom%20image.png')] bg-none bg-[#050505] lg:before:content-[''] lg:before:absolute lg:before:inset-0 lg:before:bg-gradient-to-l lg:before:from-[#050505] lg:before:via-[#050505]/85 lg:before:to-transparent lg:before:z-1 lg:after:content-[''] lg:after:absolute lg:after:inset-0 lg:after:bg-gradient-to-b lg:after:from-[#050505] lg:after:via-transparent lg:after:to-[#050505] lg:after:z-1" id="stay-updated">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-10 md:px-20 w-full relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
              <div className="hidden lg:block"></div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-outfit text-gold-primary text-xs sm:text-sm font-semibold tracking-[0.22em] mb-4.5 uppercase">BE THE FIRST TO KNOW</span>
                <h2 className="font-outfit font-light text-3xl sm:text-4xl md:text-[42px] leading-tight tracking-wide text-white mb-6 uppercase">
                  STAY <span className="text-gold-primary font-normal bg-gradient-to-br from-[#c99f4a] via-[#ffd885] to-[#b3852d] bg-clip-text text-transparent">UPDATED</span>
                </h2>
                
                <p className="text-sm sm:text-base leading-relaxed text-zinc-400 font-light max-w-[520px] mb-8">
                  Register your interest and be the first to experience the future of clean air in cinemas.
                </p>
                
                <form className="w-full max-w-[500px]" onSubmit={handleSubscribe}>
                  <div className="flex flex-col sm:flex-row w-full bg-black/50 border border-white/15 min-h-[56px] transition-all duration-300 focus-within:border-gold-primary/50">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      required 
                      className="flex-grow bg-transparent border-0 outline-none text-white px-6 py-4 sm:py-0 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button type="submit" className="px-8 py-4 sm:py-0 bg-gold-primary hover:bg-[#ebd59b] text-black font-outfit text-xs font-semibold tracking-wider uppercase transition-colors duration-300 min-h-[56px] flex items-center justify-center gap-2" disabled={isSubmitting}>
                      {isSubmitting ? 'SAVING...' : 'NOTIFY ME'}
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 stroke-current stroke-[2] fill-none" viewBox="0 0 24 24">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </button>
                  </div>
                  {formStatus.type && (
                    <div className={`font-outfit text-xs mt-3.5 ${formStatus.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
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

