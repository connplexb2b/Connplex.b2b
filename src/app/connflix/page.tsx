"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function Connflix() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const email = e.currentTarget.email.value;

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/connflix-subscribers`;
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

            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to register subscription. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [timeLeft, setTimeLeft] = useState({
        days: 25,
        hours: 14,
        minutes: 42,
        seconds: 7
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const posters = [
        { src: '/beyond_the_signal.jpg', title: 'BEYOND', subtitle: 'THE SIGNAL', red: true, col: 1 },
        { src: '/the_silent_orbit.png', title: 'ASHES OF', subtitle: 'TOMORROW', red: false, col: 1 },
        { src: '/the_silent_orbit.png', title: 'THE', subtitle: 'SILENT ORBIT', red: false, col: 2 },
        { src: '/echoes_of_the_abyss.png', title: 'ECHOES OF', subtitle: 'THE ABYSS', red: true, active: true, col: 2 },
        { src: '/mind_paradox.png', title: 'MIND', subtitle: 'PARADOX', red: false, col: 3 },
        { src: '/the_last_horizon.png', title: 'THE LAST', subtitle: 'HORIZON', red: false, col: 3 },
    ];

    return (
        <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden font-outfit">
            <div className="relative w-full min-h-screen flex flex-col bg-[radial-gradient(circle_at_30%_60%,rgba(20,5,5,1)_0%,#050505_70%)]">
                <Header />

                <main className="grow flex relative p-6 md:p-16 z-5">
                    <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right-center text-[15rem] font-black text-white/[0.02] tracking-[1rem] pointer-events-none whitespace-nowrap z-1">CONNFLIX</div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 w-full max-w-[1400px] mx-auto relative z-2">
                        {/* Posters Section (Left Side) */}
                        <div className="relative flex justify-center items-center pt-8 overflow-hidden xl:overflow-visible h-[360px] sm:h-[480px] xl:h-auto" style={{ perspective: '1500px' }}>
                            <div className="flex gap-2 sm:gap-6 origin-center scale-[0.6] sm:scale-75 md:scale-90 xl:scale-[0.85] 2xl:scale-100 transition-transform duration-300" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(25deg) rotateX(5deg)' }}>
                                {[1, 2, 3].map(col => (
                                    <div key={col} className={`flex flex-col gap-4 sm:gap-6 ${col === 1 ? '-translate-y-8' : col === 2 ? 'translate-y-6' : '-translate-y-3'}`}>
                                        {posters.filter(p => p.col === col).map((poster, i) => (
                                            <div key={i} className={`relative w-[130px] sm:w-[200px] h-[195px] sm:h-[300px] rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 border border-white/5 hover:scale-105 hover:translate-z-5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] group ${poster.active ? 'border-[#d32f2f] shadow-[0_0_30px_rgba(211,47,47,0.4)]' : ''}`}>
                                                <Image src={poster.src} alt={poster.title} fill style={{ objectFit: 'cover' }} className={`opacity-70 group-hover:opacity-100 transition-opacity duration-300 ${poster.active ? 'opacity-90' : ''}`} />
                                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent text-center">
                                                    <h3 className={`text-base sm:text-2xl font-extrabold tracking-wider leading-none mb-1 ${poster.red ? 'text-[#d32f2f]' : 'text-white'}`}>{poster.title}</h3>
                                                    <p className={`text-[0.55rem] sm:text-[0.65rem] tracking-[2px] ${poster.red ? 'text-[#d32f2f]' : 'text-[#a0a0a0]'}`}>{poster.subtitle}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-[-100px] left-0 w-full h-[200px] bg-gradient-to-b from-[#d32f2f]/15 to-transparent blur-2xl pointer-events-none" style={{ transform: 'perspective(1000px) rotateX(70deg)' }}></div>
                        </div>

                        {/* Info Section (Right Side) */}
                        <div className="flex flex-col justify-center items-center xl:items-start text-center xl:text-left xl:pl-8">
                            <h2 className="text-[#d32f2f] text-sm md:text-base tracking-[6px] font-semibold mb-4">C O N N F L I X</h2>
                            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-[0.9] tracking-wider mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">COMING<br />SOON</h1>
                            <div className="w-10 h-[3px] bg-[#d32f2f] mb-8 mx-auto xl:mx-0"></div>
                            <p className="text-lg md:text-xl text-[#a0a0a0] mb-8 md:mb-12 tracking-wide">New stories. New worlds. New era.</p>

                            <div className="flex gap-4 md:gap-8 mb-8 md:mb-12 p-4 md:p-6 border border-white/10 rounded-xl bg-black/30 backdrop-blur-md w-fit mx-auto xl:mx-0">
                                <div className="flex flex-col items-center relative pr-4 md:pr-8 after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[30px] after:bg-white/10">
                                    <span className="text-2xl md:text-4xl font-bold leading-none mb-1">{timeLeft.days}</span>
                                    <span className="text-[0.6rem] md:text-[0.65rem] text-[#d32f2f] tracking-wider font-semibold">DAYS</span>
                                </div>
                                <div className="flex flex-col items-center relative pr-4 md:pr-8 after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[30px] after:bg-white/10">
                                    <span className="text-2xl md:text-4xl font-bold leading-none mb-1">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="text-[0.6rem] md:text-[0.65rem] text-[#d32f2f] tracking-wider font-semibold">HOURS</span>
                                </div>
                                <div className="flex flex-col items-center relative pr-4 md:pr-8 after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-[1px] after:h-[30px] after:bg-white/10">
                                    <span className="text-2xl md:text-4xl font-bold leading-none mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="text-[0.6rem] md:text-[0.65rem] text-[#d32f2f] tracking-wider font-semibold">MINUTES</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl md:text-4xl font-bold leading-none mb-1">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="text-[0.6rem] md:text-[0.65rem] text-[#d32f2f] tracking-wider font-semibold">SECONDS</span>
                                </div>
                            </div>

                            <p className="text-[#a0a0a0] text-sm md:text-base leading-relaxed max-w-md mx-auto xl:mx-0">
                                We&apos;re crafting a premium streaming<br className="hidden sm:inline" />
                                experience like never before.<br className="hidden sm:inline" />
                                Stay tuned.
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="relative py-12 flex justify-center mt-auto">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-[radial-gradient(circle,rgba(211,47,47,0.8)_0%,rgba(211,47,47,0)_70%)] shadow-[0_-10px_40px_rgba(211,47,47,0.4)]"></div>
                    <div className="flex flex-col items-center text-center z-10 px-4">
                        <div className="mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                        <h3 className="text-xs tracking-[4px] uppercase mb-6 text-white font-semibold">BE THE FIRST TO KNOW</h3>
                        {isSubmitted ? (
                            <div className="text-center p-6 border border-[#d32f2f] rounded-lg bg-[#d32f2f]/[0.05] max-w-[480px] mx-auto mt-2">
                                <div className="w-10 h-10 bg-[#d32f2f] text-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-[#d32f2f] text-lg font-bold mb-2 font-outfit">NOTIFICATIONS ACTIVATED!</h3>
                                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4 max-w-[320px] mx-auto">
                                    You will be the absolute first to know when CONNFLIX launches. Get ready for premium streaming!
                                </p>
                                <button onClick={() => setIsSubmitted(false)} className="bg-transparent border border-[#d32f2f]/30 text-[#d32f2f] px-3 py-1.5 rounded text-[10px] cursor-pointer hover:border-[#d32f2f] transition-all">Subscribe again</button>
                            </div>
                        ) : (
                            <form className="flex border border-white/10 rounded-lg overflow-hidden w-[400px] max-w-[90vw] mb-4 bg-black/50 focus-within:border-white/30 transition-colors duration-300" onSubmit={handleSubmit}>
                                <input name="email" type="email" placeholder="Enter your email address" required className="flex-1 bg-transparent border-none py-4 px-6 text-white text-sm outline-none" />
                                <button type="submit" className="bg-transparent border-none border-l border-white/10 px-6 text-[#d32f2f] text-sm font-semibold cursor-pointer flex items-center gap-2 hover:bg-white/[0.05] transition-colors" disabled={isSubmitting}>
                                    {isSubmitting ? 'Registering...' : 'Notify Me'} <span>→</span>
                                </button>
                            </form>
                        )}
                        {submitError && (
                            <p className="text-[#ff5252] text-sm mt-3 text-center font-semibold">
                                ⚠️ {submitError}
                            </p>
                        )}
                        <p className="text-xs text-white/30 mt-2">No spam. Just exclusive updates.</p>
                    </div>
                </footer>
            </div>
            <Footer />
        </div>
    );
}
