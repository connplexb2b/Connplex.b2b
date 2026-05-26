"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, CheckCircle } from 'lucide-react';
import { getApiUrl } from '@/utils/api';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const openModal = () => { setModalOpen(true); setSubmitted(false); setSubmitError(null); };
    const closeModal = () => { setModalOpen(false); setTimeout(() => { setSubmitted(false); setSubmitError(null); }, 400); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/skyinn-reservations`;
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

            setSubmitted(true);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to join waitlist. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
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
        <div className="min-h-screen bg-[#020202] text-white font-outfit relative overflow-x-hidden h-screen lg:h-screen lg:overflow-hidden overflow-y-auto lg:overflow-y-hidden">
            <style>{`
                @keyframes skyStarTwinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50%       { opacity: 0.7; transform: scale(1); }
                }
                @keyframes accentGrow {
                    from { width: 0; opacity: 0; }
                    to   { width: 80px; opacity: 1; }
                }
                @keyframes soundBar {
                    from { transform: scaleY(0.3); }
                    to   { transform: scaleY(1); }
                }
            `}</style>

            {/* Full-bleed Background */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/sky-inn-hero.png"
                    alt="Sky Inn Drive-In Cinema"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <div 
                    className="absolute inset-0 z-10" 
                    style={{ 
                        background: 'linear-gradient(to right, rgba(2, 2, 2, 0.82) 0%, rgba(2, 2, 2, 0.45) 40%, rgba(2, 2, 2, 0.05) 100%)' 
                    }} 
                />
            </div>

            {/* Twinkling Stars */}
            <div className="fixed inset-0 z-[1] pointer-events-none">
                {STARS.map((s, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-[#d5b263] opacity-0"
                        style={{
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            animation: `skyStarTwinkle ${s.dur} ease-in-out ${s.delay} infinite`
                        }}
                    />
                ))}
            </div>

            {/* Screen Glow */}
            <div 
                className="fixed inset-0 z-[1] pointer-events-none" 
                style={{ 
                    background: 'radial-gradient(ellipse 60% 40% at 70% 50%, rgba(213, 178, 99, 0.06) 0%, transparent 70%)' 
                }}
            />

            {/* Header */}
            <header 
                className="fixed top-0 left-0 w-full px-[6%] py-[30px] flex justify-between items-center z-[100]"
                style={{ 
                    background: 'linear-gradient(to bottom, rgba(2,2,2,0.9) 0%, transparent 100%)' 
                }}
            >
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-[0.35em] text-[#d5b263] uppercase">CONNPLEX</span>
                    <span className="text-[8px] font-light tracking-[0.4em] text-white/30 uppercase mt-0.5">EXPERIENCE MORE</span>
                </div>
                <button
                    className={`inline-flex items-center gap-2.5 px-4.5 py-2 border border-[#d5b263]/20 bg-transparent text-white/65 text-[9px] font-medium tracking-[0.25em] uppercase cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-sm hover:border-[#d5b263] hover:text-[#d5b263] ${isPlaying ? 'border-[#d5b263] text-[#d5b263]' : ''}`}
                    onClick={toggleSound}
                    aria-label="Toggle ambient sound"
                >
                    <span>{isPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
                    <span className="flex items-end gap-[3px] h-3.5">
                        <span 
                            className="w-0.5 bg-current rounded-sm transition-all duration-300" 
                            style={{ 
                                animation: isPlaying ? 'soundBar 0.8s ease-in-out 0s infinite alternate' : 'none', 
                                height: isPlaying ? '6px' : '4px',
                                transformOrigin: 'bottom'
                            }} 
                        />
                        <span 
                            className="w-0.5 bg-current rounded-sm transition-all duration-300" 
                            style={{ 
                                animation: isPlaying ? 'soundBar 0.8s ease-in-out 0.15s infinite alternate' : 'none', 
                                height: isPlaying ? '10px' : '8px',
                                transformOrigin: 'bottom'
                            }} 
                        />
                        <span 
                            className="w-0.5 bg-current rounded-sm transition-all duration-300" 
                            style={{ 
                                animation: isPlaying ? 'soundBar 0.8s ease-in-out 0.3s infinite alternate' : 'none', 
                                height: isPlaying ? '14px' : '12px',
                                transformOrigin: 'bottom'
                            }} 
                        />
                        <span 
                            className="w-0.5 bg-current rounded-sm transition-all duration-300" 
                            style={{ 
                                animation: isPlaying ? 'soundBar 0.8s ease-in-out 0.45s infinite alternate' : 'none', 
                                height: isPlaying ? '8px' : '6px',
                                transformOrigin: 'bottom'
                            }} 
                        />
                    </span>
                </button>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-[6%] pt-[130px] lg:pt-[140px] pb-[60px] gap-[60px]">
                {/* Left Content */}
                <div className="flex flex-col gap-0">
                    <div className="mb-10">
                        <h1 className="flex flex-wrap gap-[0.2em] text-[3.5rem] sm:text-[5rem] lg:text-[7rem] font-extrabold leading-none tracking-[-0.01em] uppercase mb-3">
                            <span className="text-white">SKY</span>
                            <span 
                                className="text-[#d5b263]"
                                style={{ textShadow: '0 0 30px rgba(213, 178, 99, 0.35)' }}
                            >
                                INN
                            </span>
                        </h1>
                        <p className="text-[11px] font-normal tracking-[0.35em] text-white/30 uppercase">DRIVE-IN CINEMA BY CONNPLEX</p>
                    </div>

                    <div className="mb-[50px]">
                        <h2 className="text-[1.8rem] sm:text-[2.2rem] font-extralight tracking-[0.5em] text-white uppercase mb-5">COMING SOON</h2>
                        <div 
                            className="h-px bg-gradient-to-r from-[#d5b263] to-transparent mb-[25px]" 
                            style={{ animation: 'accentGrow 2s ease-out forwards' }}
                        />
                        <p className="text-[15px] font-light text-white/65 tracking-[0.05em] leading-[1.8] max-w-[400px]">A new era of outdoor cinema experiences.</p>
                    </div>

                    <div className="mb-[60px]">
                        <button 
                            className="group relative inline-flex items-center gap-5 px-[50px] py-[18px] bg-transparent border border-[#d5b263] text-white text-xs font-medium tracking-[0.25em] uppercase cursor-pointer rounded-sm overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-black hover:border-[#d5b263] z-10"
                            onClick={openModal}
                        >
                            <span className="absolute inset-y-0 left-[-100%] group-hover:left-0 w-full bg-[#d5b263] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] z-[-1]"></span>
                            <span>NOTIFY ME</span>
                            <svg className="w-[18px] h-2.5 stroke-current fill-none transition-transform duration-400 group-hover:translate-x-1.5" viewBox="0 0 18 10">
                                <path d="M1 5h16M12 1l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-5">
                        <span className="text-[9px] font-medium tracking-[0.3em] text-white/30 uppercase">FOLLOW US</span>
                        <span className="w-px h-4 bg-[#d5b263]/20" />
                        <div className="flex gap-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/30 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center hover:text-[#d5b263] hover:-translate-y-0.5" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/30 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center hover:text-[#d5b263] hover:-translate-y-0.5" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/30 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center hover:text-[#d5b263] hover:-translate-y-0.5" aria-label="YouTube">
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
                className={`${modalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 bg-black/85 backdrop-blur-[15px] z-[2000] flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
                <div 
                    className={`${modalOpen ? 'translate-y-0 scale-100' : 'translate-y-[40px] scale-95'} relative w-[90%] max-w-[580px] border border-[#d5b263]/20 p-6 sm:px-[50px] sm:py-[60px] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(213,178,99,0.05)] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                    style={{ background: 'linear-gradient(135deg, rgba(12,12,12,0.98) 0%, rgba(5,5,5,0.98) 100%)' }}
                >
                    <button className="absolute top-[25px] right-[25px] bg-transparent border-none text-white/30 cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] p-2 rounded-full hover:text-[#d5b263] hover:rotate-90" onClick={closeModal} aria-label="Close">
                        <X size={18} />
                    </button>

                    {!submitted ? (
                        <div>
                            <span className="text-[9px] font-semibold tracking-[0.32em] text-[#d5b263] block mb-[15px] uppercase">JOIN THE ELITE CLUB</span>
                            <h3 className="text-2xl font-light tracking-[0.22em] text-white mb-5 uppercase">STAY IN THE LOOP</h3>
                            <p className="text-[13px] font-light text-white/65 tracking-[0.05em] leading-[1.6] mb-10">
                                Be the first to secure prime parking slots and exclusive opening night invitations for Connplex&apos;s premium outdoor theater experience.
                            </p>
                            <form className="flex flex-col gap-[25px]" onSubmit={handleSubmit}>
                                <div className="relative w-full">
                                    <input
                                        className="peer w-full bg-transparent border-0 border-b border-[#d5b263]/20 py-4 px-1.25 text-white font-outfit text-[13px] font-light tracking-[0.1em] outline-none transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] focus:border-b-transparent placeholder:text-white/30"
                                        type="email"
                                        required
                                        placeholder="ENTER YOUR EMAIL ADDRESS"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-label="Email address"
                                    />
                                    <span className="absolute bottom-0 left-0 w-full h-px bg-[#d5b263] scale-x-0 origin-left transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_1px_10px_#d5b263] peer-focus:scale-x-100" />
                                </div>
                                {submitError && (
                                    <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 500 }}>
                                        ⚠️ {submitError}
                                    </div>
                                )}
                                <button type="submit" className="group self-start w-full sm:w-auto justify-center sm:justify-start bg-[#d5b263] border border-[#d5b263] text-[#020202] px-10 py-4 font-outfit text-[11px] font-semibold tracking-[0.2em] uppercase cursor-pointer inline-flex items-center gap-[15px] rounded-sm mt-3.75 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#f1d48f] hover:shadow-[0_0_25px_rgba(213,178,99,0.6)]" disabled={isSubmitting}>
                                    <span>{isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE NOW'}</span>
                                    {!isSubmitting && (
                                        <svg className="w-[18px] h-2.5 stroke-[#020202] fill-none transition-transform duration-400 group-hover:translate-x-1.5" viewBox="0 0 18 10">
                                            <path d="M1 5h16M12 1l5 4-5 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-[#d5b263]/5 border border-[#d5b263]/20 text-[#d5b263] flex items-center justify-center mb-[30px] drop-shadow-[0_0_15px_rgba(213,178,99,0.35)]">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-light tracking-[0.22em] text-[#d5b263] mb-5 uppercase">YOU&apos;RE ON THE LIST</h3>
                            <p className="text-[13px] font-light text-white/65 tracking-[0.05em] leading-[1.6] mb-10">
                                Thank you for subscribing! We will notify you with exclusive opening schedules, reservations, and luxury event updates.
                            </p>
                            <button 
                                className="group relative inline-flex items-center gap-5 px-[50px] py-[18px] bg-transparent border border-[#d5b263] text-white text-xs font-medium tracking-[0.25em] uppercase cursor-pointer rounded-sm overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-black hover:border-[#d5b263] z-10"
                                onClick={closeModal}
                            >
                                <span className="absolute inset-y-0 left-[-100%] group-hover:left-0 w-full bg-[#d5b263] transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] z-[-1]"></span>
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
