import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpectraXForm from '@/components/SpectraXForm';

export const metadata = {
    title: "Spectra X | Patented Active LED Cinema Technology | Connplex Cinemas",
    description: "A next-generation cinema display architecture combining Active LED technology with a Non-DCI server ecosystem. Built by Connplex Cinemas. Available for technology deployment and partnerships.",
};

const SpectraXPage = () => {
    return (
        <div className="font-outfit bg-black text-[#e0e0e0] antialiased overflow-x-hidden selection:bg-[#C9A84C]/30 selection:text-white">
            {/* Header Overlay */}
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="relative min-h-[640px] lg:min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden bg-black" id="heroSection">
                    {/* Left gold ambient overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_5%_50%,rgba(201,168,76,0.12)_0%,transparent_60%)] pointer-events-none z-10"></div>
                    
                    {/* Left text content */}
                    <div className="relative z-30 w-full lg:w-[46%] shrink-0 flex flex-col justify-center px-[20px] sm:px-[36px] lg:px-[5%] pt-[130px] lg:pt-[120px] pb-[48px] lg:pb-[60px]">
                        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-[0.68rem] tracking-[0.2em] font-semibold uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse"></span>
                            PATENTED ACTIVE LED CINEMA TECHNOLOGY
                        </div>

                        <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[6.8rem] xl:text-[8.5rem] font-black leading-[0.88] tracking-[-0.02em] mb-5">
                            <span className="bg-gradient-to-r from-[#00d4ff] via-[#6a1bff] to-[#ee00cc] bg-clip-text text-transparent">SPECTRA</span>
                            <span className="bg-gradient-to-r from-[#ff7700] via-[#cc00ff] to-[#00d4ff] bg-clip-text text-transparent"> X</span>
                        </h1>

                        <p className="text-[0.95rem] sm:text-lg lg:text-[1.12rem] font-bold text-white tracking-[0.04em] uppercase mb-4 leading-snug">
                            PATENTED ACTIVE LED CINEMA TECHNOLOGY
                        </p>

                        <p className="text-[0.85rem] sm:text-[0.95rem] text-[#aaa] leading-relaxed max-w-[520px] mb-3">
                            A next-generation cinema display architecture combining Active LED technology with a Non-DCI server ecosystem.
                        </p>

                        <p className="text-[0.8rem] sm:text-[0.88rem] text-[#888] leading-relaxed max-w-[520px] mb-8 font-medium">
                            Built by Connplex Cinemas. Available for technology deployment and partnerships.
                        </p>

                        <div className="flex gap-4 flex-wrap items-center">
                            <a 
                                href="#enquire-now" 
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C9A84C] hover:bg-[#b59239] text-black font-extrabold text-[0.75rem] tracking-[0.14em] rounded-[4px] shadow-[0_4px_24px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_30px_rgba(201,168,76,0.4)] transition-all duration-300 uppercase"
                            >
                                ENQUIRE NOW
                                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </a>
                            <a 
                                href="#technical-overview" 
                                className="inline-flex items-center justify-center px-6 py-3.5 border border-white/20 hover:border-[#C9A84C] text-white/80 hover:text-white text-[0.75rem] font-semibold tracking-[0.12em] rounded-[4px] transition-colors duration-300 uppercase"
                            >
                                Technical Overview
                            </a>
                        </div>
                    </div>
                    
                    {/* Right image — full bleed cinematic */}
                    <div className="relative w-full lg:flex-1 h-[60vw] sm:h-[48vw] lg:h-full min-h-[300px] overflow-hidden z-20">
                        <Image
                            src="/spectrax/TOP IMAGE.png"
                            alt="Spectra X Active LED Cinema Display"
                            fill
                            priority
                            className="w-full h-full object-cover block"
                            sizes="(max-width: 1024px) 100vw, 54vw"
                        />
                        
                        {/* Gradients to blend image seamlessly */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent w-[35%] z-20 pointer-events-none hidden lg:block"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black lg:hidden z-20 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_60%_50%,rgba(90,20,180,0.25)_0%,transparent_60%)] pointer-events-none z-30"></div>
                    </div>
                </section>

                {/* REDEFINING CINEMA TECHNOLOGY */}
                <section className="relative bg-[#050505] border-y border-[#C9A84C]/15 py-16 sm:py-20" id="redefining">
                    <div className="max-w-[1240px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="max-w-[880px] mx-auto text-center">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                THE CINEMA EVOLUTION
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-6">
                                REDEFINING CINEMA TECHNOLOGY
                            </h2>
                            <p className="text-[0.95rem] sm:text-[1.1rem] text-[#bbb] leading-relaxed mb-10">
                                Spectra X replaces conventional projection architecture with an Active LED-based cinema system designed for superior visual performance, operational flexibility, and broader content applications.
                            </p>

                            {/* 4 Feature Badges Strip */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
                                <div className="bg-black/70 border border-[#C9A84C]/25 rounded-lg py-4 px-3 sm:px-4 text-center hover:border-[#C9A84C]/60 hover:bg-[#0a0a0a] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mx-auto mb-2.5"></div>
                                    <span className="text-[0.75rem] sm:text-[0.82rem] font-extrabold tracking-[0.1em] text-white uppercase block">Active LED</span>
                                </div>
                                <div className="bg-black/70 border border-[#C9A84C]/25 rounded-lg py-4 px-3 sm:px-4 text-center hover:border-[#C9A84C]/60 hover:bg-[#0a0a0a] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mx-auto mb-2.5"></div>
                                    <span className="text-[0.75rem] sm:text-[0.82rem] font-extrabold tracking-[0.1em] text-white uppercase block">Non-DCI Architecture</span>
                                </div>
                                <div className="bg-black/70 border border-[#C9A84C]/25 rounded-lg py-4 px-3 sm:px-4 text-center hover:border-[#C9A84C]/60 hover:bg-[#0a0a0a] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mx-auto mb-2.5"></div>
                                    <span className="text-[0.75rem] sm:text-[0.82rem] font-extrabold tracking-[0.1em] text-white uppercase block">Flexible Deployment</span>
                                </div>
                                <div className="bg-black/70 border border-[#C9A84C]/25 rounded-lg py-4 px-3 sm:px-4 text-center hover:border-[#C9A84C]/60 hover:bg-[#0a0a0a] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mx-auto mb-2.5"></div>
                                    <span className="text-[0.75rem] sm:text-[0.82rem] font-extrabold tracking-[0.1em] text-white uppercase block">Multi-Content Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PATENTED. PROPRIETARY. DIFFERENTIATED. */}
                <section className="py-20 lg:py-24 bg-black relative" id="patented-proprietary">
                    <div className="max-w-[1240px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[840px] mx-auto mb-14">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                PROPRIETARY ARCHITECTURE
                            </span>
                            <h2 className="text-[1.9rem] sm:text-[2.6rem] lg:text-[3.2rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                PATENTED. PROPRIETARY. DIFFERENTIATED.
                            </h2>
                            <p className="text-[0.95rem] sm:text-[1.05rem] text-[#aaa] leading-relaxed">
                                Spectra X is built around Connplex Cinemas&apos; patented technology integrating:
                            </p>
                        </div>

                        {/* 4 Pillars Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                            {/* Pillar 1 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/25 hover:border-[#C9A84C] rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                            <rect x="2" y="3" width="20" height="14" rx="2" />
                                            <line x1="8" y1="21" x2="16" y2="21" />
                                            <line x1="12" y1="17" x2="12" y2="21" />
                                        </svg>
                                    </div>
                                    <span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#C9A84C] uppercase block mb-1">01 / DISPLAY</span>
                                    <h3 className="text-[1.05rem] font-extrabold text-white uppercase tracking-[0.05em] leading-snug">
                                        Active LED Display
                                    </h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-[0.72rem] text-[#777]">
                                    Self-emissive direct light module
                                </div>
                            </div>

                            {/* Pillar 2 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/25 hover:border-[#C9A84C] rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                            <rect x="2" y="2" width="20" height="8" rx="2" />
                                            <rect x="2" y="14" width="20" height="8" rx="2" />
                                            <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth={2.5} />
                                            <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth={2.5} />
                                        </svg>
                                    </div>
                                    <span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#C9A84C] uppercase block mb-1">02 / INFRASTRUCTURE</span>
                                    <h3 className="text-[1.05rem] font-extrabold text-white uppercase tracking-[0.05em] leading-snug">
                                        Non-DCI Media Server
                                    </h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-[0.72rem] text-[#777]">
                                    Agile, non-restrictive playback system
                                </div>
                            </div>

                            {/* Pillar 3 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/25 hover:border-[#C9A84C] rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#C9A84C] uppercase block mb-1">03 / SECURITY & PIPELINE</span>
                                    <h3 className="text-[1.05rem] font-extrabold text-white uppercase tracking-[0.05em] leading-snug">
                                        HDCP Processing
                                    </h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-[0.72rem] text-[#777]">
                                    Standardized digital content protection
                                </div>
                            </div>

                            {/* Pillar 4 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/25 hover:border-[#C9A84C] rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                                <div>
                                    <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="2" y1="12" x2="22" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                    </div>
                                    <span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#C9A84C] uppercase block mb-1">04 / PROTOCOL</span>
                                    <h3 className="text-[1.05rem] font-extrabold text-white uppercase tracking-[0.05em] leading-snug">
                                        Network-Based Connectivity
                                    </h3>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-[0.72rem] text-[#777]">
                                    High-bandwidth LAN/CAT6 distribution
                                </div>
                            </div>
                        </div>

                        {/* Proprietary statement banner */}
                        <div className="bg-gradient-to-r from-[#0a0a0a] via-[#121212] to-[#0a0a0a] border border-[#C9A84C]/20 rounded-xl p-6 text-center max-w-[880px] mx-auto">
                            <p className="text-[0.88rem] sm:text-[1rem] text-[#C9A84C] font-semibold tracking-[0.04em]">
                                A proprietary technology architecture engineered for modern cinema environments.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ENGINEERED FOR PERFORMANCE */}
                <section className="py-20 bg-[#060606] border-t border-[#C9A84C]/15" id="performance">
                    <div className="max-w-[1280px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[800px] mx-auto mb-14">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                DISPLAY CAPABILITIES
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                ENGINEERED FOR PERFORMANCE
                            </h2>
                            <p className="text-[0.95rem] text-[#999]">
                                Advanced direct-light emissive architecture providing uncompromising visual clarity and endurance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    HIGH BRIGHTNESS
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    Enhanced visual intensity for a premium viewing experience.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a10 10 0 0 1 0 20" />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    DEEPER BLACKS
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    Improved contrast for greater image depth.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 0-9-9z" fill="#C9A84C" fillOpacity="0.3" />
                                        <circle cx="12" cy="12" r="4" />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    RICHER COLOURS
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    Vivid, consistent colour reproduction.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <circle cx="12" cy="12" r="2" />
                                        <path d="M12 2v4" />
                                        <path d="M12 18v4" />
                                        <path d="M2 12h4" />
                                        <path d="M18 12h4" />
                                        <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    PIXEL-LEVEL PRECISION
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    Direct-light Active LED architecture.
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    CONSISTENT PERFORMANCE
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    Designed for reliable visual output across the auditorium.
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-[#0b0b0b] border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-7 transition-all duration-300 group hover:bg-[#0f0f0f]">
                                <div className="w-12 h-12 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-[#C9A84C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                                        <rect x="2" y="6" width="20" height="12" rx="2" />
                                        <line x1="2" y1="2" x2="22" y2="22" stroke="#ee3333" strokeWidth={2} />
                                    </svg>
                                </div>
                                <h3 className="text-[1.05rem] font-extrabold text-white tracking-[0.06em] uppercase mb-2">
                                    NO CONVENTIONAL PROJECTION
                                </h3>
                                <p className="text-[0.82rem] text-[#aaa] leading-relaxed">
                                    A fundamentally different cinema display architecture.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECHNOLOGY THAT CREATES BUSINESS VALUE */}
                <section className="py-20 lg:py-24 bg-black relative" id="business-value">
                    <div className="max-w-[1240px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[860px] mx-auto mb-16">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                COMMERCIAL ADVANTAGE
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                TECHNOLOGY THAT CREATES BUSINESS VALUE
                            </h2>
                            <p className="text-[0.95rem] text-[#999] leading-relaxed">
                                Engineered not just for exceptional fidelity, but to drive revenue and streamline operations for modern operators.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1">
                                <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#C9A84C] block mb-3 uppercase">01 / EFFICIENCY</span>
                                <h3 className="text-[1.15rem] font-black text-white uppercase tracking-[0.04em] mb-3">
                                    OPERATIONAL FLEXIBILITY
                                </h3>
                                <p className="text-[0.85rem] text-[#aaa] leading-relaxed">
                                    A modern architecture designed to simplify cinema technology infrastructure.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1">
                                <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#C9A84C] block mb-3 uppercase">02 / CONTENT</span>
                                <h3 className="text-[1.15rem] font-black text-white uppercase tracking-[0.04em] mb-3">
                                    CONTENT FLEXIBILITY
                                </h3>
                                <p className="text-[0.85rem] text-[#aaa] leading-relaxed">
                                    Supports cinema and broader content applications.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1">
                                <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#C9A84C] block mb-3 uppercase">03 / PROGRAMMING</span>
                                <h3 className="text-[1.15rem] font-black text-white uppercase tracking-[0.04em] mb-3">
                                    VENUE UTILISATION
                                </h3>
                                <p className="text-[0.85rem] text-[#aaa] leading-relaxed">
                                    Expand programming beyond conventional movie screenings.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1">
                                <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#C9A84C] block mb-3 uppercase">04 / BRAND</span>
                                <h3 className="text-[1.15rem] font-black text-white uppercase tracking-[0.04em] mb-3">
                                    DIFFERENTIATED POSITIONING
                                </h3>
                                <p className="text-[0.85rem] text-[#aaa] leading-relaxed">
                                    Offer audiences a distinctive technology-led experience.
                                </p>
                            </div>

                            {/* Card 5 */}
                            <div className="bg-[#090909] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                                <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#C9A84C] block mb-3 uppercase">05 / EXPANSION</span>
                                <h3 className="text-[1.15rem] font-black text-white uppercase tracking-[0.04em] mb-3">
                                    SCALABLE DEPLOYMENT
                                </h3>
                                <p className="text-[0.85rem] text-[#aaa] leading-relaxed">
                                    Suitable for diverse cinema and entertainment environments.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ONE TECHNOLOGY. MULTIPLE DESTINATIONS. */}
                <section className="py-20 lg:py-24 bg-[#050505] border-t border-[#C9A84C]/15 relative" id="destinations">
                    <div className="max-w-[1280px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[900px] mx-auto mb-16">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                VERSATILE APPLICATIONS
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                ONE TECHNOLOGY. MULTIPLE DESTINATIONS.
                            </h2>
                            <p className="text-[0.95rem] sm:text-[1.05rem] text-[#bbb] leading-relaxed max-w-[760px] mx-auto">
                                Spectra X can power more than movie exhibition - enabling venues to evolve into multi-purpose entertainment and experience destinations.
                            </p>
                        </div>

                        {/* 7 Destination Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
                            {/* Destination 1 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🎬</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    CINEMA
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Premium theatrical experiences and special screenings.
                                </p>
                            </div>

                            {/* Destination 2 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🏡</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    HOME THEATRE
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Premium private cinema experiences for residences, villas and luxury homes.
                                </p>
                            </div>

                            {/* Destination 3 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🎮</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    GAME ZONE
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Gaming, esports and immersive interactive experiences.
                                </p>
                            </div>

                            {/* Destination 4 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">⚽</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    SPORTS HUB
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Live matches, tournaments and fan-viewing experiences.
                                </p>
                            </div>

                            {/* Destination 5 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🎤</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    LIVE EVENT VENUE
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Concerts, stand-up, performances and special events.
                                </p>
                            </div>

                            {/* Destination 6 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🏢</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    CORPORATE EXPERIENCE CENTRE
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Product launches, conferences, presentations and brand experiences.
                                </p>
                            </div>

                            {/* Destination 7 */}
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C] rounded-xl p-6 transition-all duration-300 group hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                                <div className="text-[#C9A84C] text-[1.4rem] mb-3">🍸</div>
                                <h3 className="text-[1rem] font-extrabold text-white uppercase tracking-[0.06em] mb-2">
                                    PRIVATE ENTERTAINMENT LOUNGE
                                </h3>
                                <p className="text-[0.8rem] text-[#999] leading-relaxed">
                                    Celebrations, curated screenings and premium private experiences.
                                </p>
                            </div>
                        </div>

                        {/* Callout Banner */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-r from-[#141005] via-[#241a08] to-[#141005] py-10 px-8 text-center shadow-[0_10px_40px_rgba(201,168,76,0.08)]">
                            <h3 className="text-[1.8rem] sm:text-[2.5rem] lg:text-[3rem] font-black text-[#C9A84C] uppercase tracking-[-0.01em] leading-tight">
                                MORE THAN A CINEMA.
                            </h3>
                            <p className="text-[1.1rem] sm:text-[1.4rem] font-bold text-white uppercase tracking-[0.1em] mt-1">
                                A PLATFORM FOR EXPERIENCES.
                            </p>
                        </div>
                    </div>
                </section>

                {/* A NEW APPROACH TO CINEMA DISPLAY (Comparison) */}
                <section className="py-20 lg:py-24 bg-black border-t border-[#C9A84C]/15" id="comparison">
                    <div className="max-w-[1100px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[800px] mx-auto mb-14">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                ARCHITECTURAL SHIFT
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                A NEW APPROACH TO CINEMA DISPLAY
                            </h2>
                            <p className="text-[0.95rem] text-[#999]">
                                Comparing legacy projection methods against the next-generation Spectra X architecture.
                            </p>
                        </div>

                        {/* Comparison Matrix Table */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[620px] rounded-xl overflow-hidden border border-[#C9A84C]/25 bg-[#090909]">
                                {/* Header Row */}
                                <div className="grid grid-cols-2 text-center border-b border-[#C9A84C]/20 bg-black/60">
                                    <div className="py-5 px-6 border-r border-white/10">
                                        <span className="text-[0.7rem] font-bold tracking-[0.2em] text-[#777] uppercase block mb-1">TRADITIONAL</span>
                                        <h3 className="text-[1.05rem] sm:text-[1.2rem] font-black text-[#aaa] uppercase tracking-[0.05em]">
                                            Conventional Projection
                                        </h3>
                                    </div>
                                    <div className="py-5 px-6 bg-[#C9A84C]/10 border-l border-[#C9A84C]/40">
                                        <span className="text-[0.7rem] font-bold tracking-[0.2em] text-[#C9A84C] uppercase block mb-1">INNOVATION</span>
                                        <h3 className="text-[1.05rem] sm:text-[1.2rem] font-black text-[#C9A84C] uppercase tracking-[0.05em] flex items-center justify-center gap-2">
                                            Spectra X
                                            <span className="text-[0.62rem] bg-[#C9A84C] text-black font-extrabold px-2 py-0.5 rounded tracking-wider">ACTIVE LED</span>
                                        </h3>
                                    </div>
                                </div>

                                {/* Row 1 */}
                                <div className="grid grid-cols-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                                    <div className="py-4.5 px-6 text-center border-r border-white/10 text-[0.88rem] sm:text-[0.95rem] text-[#888]">
                                        Projector-based
                                    </div>
                                    <div className="py-4.5 px-6 text-center bg-[#C9A84C]/[0.03] text-[0.88rem] sm:text-[0.95rem] font-bold text-white">
                                        Active LED
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="grid grid-cols-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                                    <div className="py-4.5 px-6 text-center border-r border-white/10 text-[0.88rem] sm:text-[0.95rem] text-[#888]">
                                        Projected light
                                    </div>
                                    <div className="py-4.5 px-6 text-center bg-[#C9A84C]/[0.03] text-[0.88rem] sm:text-[0.95rem] font-bold text-white">
                                        Direct light emission
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="grid grid-cols-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                                    <div className="py-4.5 px-6 text-center border-r border-white/10 text-[0.88rem] sm:text-[0.95rem] text-[#888]">
                                        Projection infrastructure
                                    </div>
                                    <div className="py-4.5 px-6 text-center bg-[#C9A84C]/[0.03] text-[0.88rem] sm:text-[0.95rem] font-bold text-white">
                                        Integrated LED architecture
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="grid grid-cols-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                                    <div className="py-4.5 px-6 text-center border-r border-white/10 text-[0.88rem] sm:text-[0.95rem] text-[#888]">
                                        Conventional DCI ecosystem
                                    </div>
                                    <div className="py-4.5 px-6 text-center bg-[#C9A84C]/[0.03] text-[0.88rem] sm:text-[0.95rem] font-bold text-[#C9A84C]">
                                        Non-DCI architecture
                                    </div>
                                </div>

                                {/* Row 5 */}
                                <div className="grid grid-cols-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <div className="py-4.5 px-6 text-center border-r border-white/10 text-[0.88rem] sm:text-[0.95rem] text-[#888]">
                                        Primarily theatrical
                                    </div>
                                    <div className="py-4.5 px-6 text-center bg-[#C9A84C]/[0.03] text-[0.88rem] sm:text-[0.95rem] font-bold text-white">
                                        Multi-content capable
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DEVELOPED BY CINEMA OPERATORS & DEPLOYMENT */}
                <section className="py-20 lg:py-24 bg-[#060606] border-t border-[#C9A84C]/15" id="developed-by-operators">
                    <div className="max-w-[1240px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        {/* Section Header */}
                        <div className="max-w-[880px] mx-auto text-center mb-16">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                BUILT FROM EXPERIENCE
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-6">
                                DEVELOPED BY CINEMA OPERATORS
                            </h2>
                            <p className="text-[0.95rem] sm:text-[1.1rem] text-[#bbb] leading-relaxed mb-6">
                                Spectra X is developed by Connplex Cinemas, combining technology development with practical cinema operating experience.
                            </p>
                            <div className="inline-block px-5 py-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 text-[#C9A84C] text-[0.75rem] sm:text-[0.82rem] font-extrabold tracking-[0.16em] uppercase">
                                FROM CINEMA OPERATIONS TO TECHNOLOGY INNOVATION.
                            </div>
                        </div>

                        {/* 4 Pillars of Operator Development */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                            <div className="bg-black border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-6 text-center transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                                    01
                                </div>
                                <h3 className="text-[0.92rem] font-extrabold text-white uppercase tracking-[0.06em]">
                                    Proprietary Technology
                                </h3>
                            </div>

                            <div className="bg-black border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-6 text-center transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                                    02
                                </div>
                                <h3 className="text-[0.92rem] font-extrabold text-white uppercase tracking-[0.06em]">
                                    Patent-Led Innovation
                                </h3>
                            </div>

                            <div className="bg-black border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-6 text-center transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                                    03
                                </div>
                                <h3 className="text-[0.92rem] font-extrabold text-white uppercase tracking-[0.06em]">
                                    Operational Experience
                                </h3>
                            </div>

                            <div className="bg-black border border-white/8 hover:border-[#C9A84C]/50 rounded-xl p-6 text-center transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                                    04
                                </div>
                                <h3 className="text-[0.92rem] font-extrabold text-white uppercase tracking-[0.06em]">
                                    Scalable Deployment
                                </h3>
                            </div>
                        </div>

                        {/* FROM DEVELOPMENT TO DEPLOYMENT BOX */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-[#0c0c0c] via-black to-[#121212] p-8 sm:p-12 text-center shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
                            <span className="text-[0.68rem] font-bold tracking-[0.22em] text-[#C9A84C] uppercase block mb-3">
                                MARKET READY
                            </span>
                            <h3 className="text-[1.8rem] sm:text-[2.5rem] font-black text-white uppercase tracking-[-0.01em] mb-4">
                                FROM DEVELOPMENT TO DEPLOYMENT
                            </h3>
                            <p className="text-[1rem] sm:text-[1.12rem] text-[#ddd] font-semibold mb-8 max-w-[680px] mx-auto">
                                Spectra X is already deployed within the Connplex ecosystem.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto">
                                <div className="bg-black/60 border border-white/10 rounded-lg py-5 px-4 text-center">
                                    <div className="text-[#C9A84C] text-lg font-bold mb-1">✓</div>
                                    <h4 className="text-[0.9rem] font-black text-white uppercase tracking-wider">Proven technology.</h4>
                                </div>
                                <div className="bg-black/60 border border-white/10 rounded-lg py-5 px-4 text-center">
                                    <div className="text-[#C9A84C] text-lg font-bold mb-1">✓</div>
                                    <h4 className="text-[0.9rem] font-black text-white uppercase tracking-wider">Real cinema environments.</h4>
                                </div>
                                <div className="bg-black/60 border border-[#C9A84C]/40 rounded-lg py-5 px-4 text-center bg-[#C9A84C]/[0.04]">
                                    <div className="text-[#C9A84C] text-lg font-bold mb-1">✓</div>
                                    <h4 className="text-[0.9rem] font-black text-[#C9A84C] uppercase tracking-wider">Now available for wider deployment.</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TECHNICAL OVERVIEW */}
                <section className="py-20 lg:py-24 bg-black border-t border-[#C9A84C]/15" id="technical-overview">
                    <div className="max-w-[1000px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px]">
                        <div className="text-center max-w-[700px] mx-auto mb-14">
                            <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                                SPECIFICATIONS
                            </span>
                            <h2 className="text-[2rem] sm:text-[2.8rem] lg:text-[3.4rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-4">
                                TECHNICAL OVERVIEW
                            </h2>
                            <p className="text-[0.95rem] text-[#999]">
                                Precision engineered hardware and software parameters powering Spectra X.
                            </p>
                        </div>

                        {/* Specifications List Card */}
                        <div className="bg-[#080808] border border-[#C9A84C]/30 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
                            <div className="divide-y divide-white/8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 items-center gap-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <span className="text-[0.78rem] font-bold tracking-[0.15em] text-[#888] uppercase">
                                        Display Technology
                                    </span>
                                    <span className="text-[1rem] sm:text-[1.05rem] font-black text-white uppercase tracking-[0.05em]">
                                        Active LED
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 items-center gap-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <span className="text-[0.78rem] font-bold tracking-[0.15em] text-[#888] uppercase">
                                        Server Architecture
                                    </span>
                                    <span className="text-[1rem] sm:text-[1.05rem] font-black text-white uppercase tracking-[0.05em]">
                                        Non-DCI
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 items-center gap-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <span className="text-[0.78rem] font-bold tracking-[0.15em] text-[#888] uppercase">
                                        Content Processing
                                    </span>
                                    <span className="text-[1rem] sm:text-[1.05rem] font-black text-[#C9A84C] uppercase tracking-[0.05em]">
                                        HDCP 2.0
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 items-center gap-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <span className="text-[0.78rem] font-bold tracking-[0.15em] text-[#888] uppercase">
                                        Connectivity
                                    </span>
                                    <span className="text-[1rem] sm:text-[1.05rem] font-black text-white uppercase tracking-[0.05em]">
                                        LAN / CAT6
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 p-5 sm:p-6 items-center gap-2 hover:bg-white/[0.02] transition-colors duration-200">
                                    <span className="text-[0.78rem] font-bold tracking-[0.15em] text-[#888] uppercase">
                                        Applications
                                    </span>
                                    <span className="text-[1rem] sm:text-[1.05rem] font-black text-white uppercase tracking-[0.05em]">
                                        Cinema + Alternative Content
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BRING SPECTRA X TO YOUR SPACE & FORM */}
                <section className="py-20 lg:py-24 bg-[#050505] border-t border-[#C9A84C]/15 relative" id="enquire-now">
                    <div className="max-w-[1100px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px] text-center">
                        <span className="text-[0.7rem] font-bold tracking-[0.25em] text-[#C9A84C] uppercase block mb-3">
                            DEPLOYMENT & PARTNERSHIPS
                        </span>
                        <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem] font-black text-white tracking-[-0.02em] leading-tight uppercase mb-5">
                            BRING SPECTRA X TO YOUR SPACE
                        </h2>
                        <p className="text-[0.95rem] sm:text-[1.1rem] text-[#bbb] leading-relaxed max-w-[780px] mx-auto mb-5">
                            From cinemas and premium home theatres to gaming zones, sports destinations, live event venues and corporate spaces, Spectra X can be tailored to a range of entertainment and experience-led environments.
                        </p>
                        <p className="text-[0.9rem] sm:text-[1rem] font-black text-white uppercase tracking-[0.14em] mb-4">
                            EXPLORE SPECTRA X FOR YOUR PROJECT
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 text-[#C9A84C] text-[0.8rem] font-black tracking-[0.2em] uppercase">
                            [ ENQUIRE NOW ]
                        </div>

                        {/* Interactive Form Component */}
                        <div className="mt-2">
                            <SpectraXForm />
                        </div>
                    </div>
                </section>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default SpectraXPage;
