"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function Connmusic() {
    const [timeLeft, setTimeLeft] = useState({
        days: 25,
        hours: 14,
        minutes: 42,
        seconds: 58
    });

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
            const requestUrl = `${apiUrl}/api/forms/connmusic-waitlist`;
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
            setSubmitError(error.message || 'Unable to join waitlist. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const systemRef = useRef<HTMLDivElement>(null);

    // Countdown logic
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

    // 3D Mouse tracking
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !systemRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateY = (x / rect.width) * 30;
        const rotateX = -(y / rect.height) * 30;

        systemRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        systemRef.current.style.transition = 'none';
    };

    const handleMouseLeave = () => {
        if (!systemRef.current) return;
        systemRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
        systemRef.current.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    };

    return (
        <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden font-sans">
            <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col min-h-screen">
                {/* Navigation */}
                <Header />

                {/* Main Content */}
                <main className="grow flex flex-col pt-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center my-10 lg:my-16 min-h-[500px] relative z-2">
                        {/* Left Side: 3D System */}
                        <div className="relative flex justify-center items-center">
                            <div
                                className="relative flex justify-center items-center h-[260px] sm:h-[400px] w-full max-w-[400px] mx-auto perspective-[1200px] group"
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div className="absolute w-[260px] sm:w-[600px] h-[260px] sm:h-[600px] rounded-full border border-[rgba(212,175,55,0.3)] shadow-[0_0_80px_rgba(212,175,55,0.1),_inset_0_0_80px_rgba(212,175,55,0.1)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] pointer-events-none"></div>
                                <div className="relative w-[160px] sm:w-[300px] h-[160px] sm:h-[300px] cursor-pointer z-10 transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }} ref={systemRef}>
                                    <div className="absolute inset-[5px] bg-[#0a0a0a] rounded-full z-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-[#1a1a1a] transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-[50px] sm:group-hover:translate-x-[120px] before:content-[''] before:absolute before:inset-[2%] before:rounded-full before:bg-[repeating-radial-gradient(#111_0px,#111_2px,#1a1a1a_3px,#0a0a0a_4px)] before:opacity-80 after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-[conic-gradient(from_0deg,rgba(255,255,255,0.05)_0deg,rgba(255,255,255,0)_45deg,rgba(255,255,255,0.05)_90deg,rgba(255,255,255,0)_135deg,rgba(255,255,255,0.05)_180deg,rgba(255,255,255,0)_225deg,rgba(255,255,255,0.05)_270deg,rgba(255,255,255,0)_315deg,rgba(255,255,255,0.05)_360deg)] after:pointer-events-none" style={{ transform: 'rotateY(10deg)' }}>
                                        <div className="absolute inset-0 rounded-full flex items-center justify-center transition-transform duration-[800ms] animate-[spinVinyl_4s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]">
                                            <div className="relative w-1/3 h-1/3 bg-gradient-to-br from-[#d4af37] to-[#cba258] rounded-full z-4 flex items-center justify-center border-3 border-[#111] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] after:content-[''] after:absolute after:w-3 after:h-3 after:bg-black after:rounded-full after:shadow-[inset_0_0_2px_rgba(255,255,255,0.3)]">
                                                <span className="text-[6px] sm:text-[8px] font-bold text-black tracking-wider -translate-y-[10px] sm:-translate-y-[15px]">CONNMUSIC</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#151515] to-[#050505] border border-[rgba(212,175,55,0.3)] shadow-[-10px_10px_30px_rgba(0,0,0,0.8),_inset_0_0_0_1px_rgba(255,255,255,0.05)] rounded-md z-5 transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-x-[15px] sm:group-hover:-translate-x-[40px] group-hover:shadow-[-20px_20px_40px_rgba(0,0,0,0.9),_inset_0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center overflow-hidden" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-10deg)' }}>
                                        <div className="absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-[-20deg] transition-all duration-[600ms] ease-out pointer-events-none group-hover:left-[150%] group-hover:duration-[1500ms]"></div>
                                        <svg className="w-[70%] h-auto filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 30" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 15 L10 15 L15 5 L20 25 L25 15 L30 15 L35 10 L40 20 L45 15 L50 15 L55 5 L60 25 L65 10 L70 20 L75 15 L80 15 L85 10 L90 20 L95 15"></path>
                                        </svg>
                                        <p className="mt-8 text-[#d4af37] tracking-[6px] text-xs sm:text-sm font-semibold">CONNMUSIC</p>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none z-1">
                                        <span className="absolute text-[#d4af37] text-2xl opacity-0 translate-0 text-shadow-[0_0_10px_rgba(212,175,55,0.5)] top-[20%] left-[60%] [animation-delay:0s] group-hover:animate-[floatNote_2s_ease-out_infinite]">♪</span>
                                        <span className="absolute text-[#d4af37] text-lg opacity-0 translate-0 text-shadow-[0_0_10px_rgba(212,175,55,0.5)] top-[40%] left-[70%] [animation-delay:0.6s] group-hover:animate-[floatNote_2s_ease-out_infinite]">♫</span>
                                        <span className="absolute text-[#d4af37] text-3xl opacity-0 translate-0 text-shadow-[0_0_10px_rgba(212,175,55,0.5)] top-[60%] left-[80%] [animation-delay:1.2s] group-hover:animate-[floatNote_2s_ease-out_infinite]">♬</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Info & Countdown */}
                        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                            <h2 className="text-[#10B981] text-lg tracking-[6px] font-semibold mb-4 uppercase">C O N N M U S I C</h2>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-wider leading-[0.9] text-white">COMING<br />SOON</h1>
                            <div className="w-[60px] h-[3px] bg-[#10B981] my-8"></div>
                            <p className="text-lg sm:text-xl text-[#a0a0a0] font-normal mb-8">Sound that moves you.</p>

                            <div className="flex flex-wrap md:flex-nowrap justify-center gap-0 my-6 border border-white/5 rounded-xl py-6 bg-gradient-to-b from-white/[0.03] to-black/50 backdrop-blur-md w-fit mx-auto lg:mx-0">
                                <div className="flex flex-col items-center px-6 md:px-8 border-r border-white/10">
                                    <span className="text-3xl md:text-4xl font-bold font-oswald mb-1">{timeLeft.days}</span>
                                    <span className="text-[10px] md:text-[11px] text-[#10B981] tracking-[2px] font-semibold uppercase">DAYS</span>
                                </div>
                                <div className="flex flex-col items-center px-6 md:px-8 border-r border-white/10">
                                    <span className="text-3xl md:text-4xl font-bold font-oswald mb-1">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="text-[10px] md:text-[11px] text-[#10B981] tracking-[2px] font-semibold uppercase">HOURS</span>
                                </div>
                                <div className="flex flex-col items-center px-6 md:px-8 border-r border-white/10">
                                    <span className="text-3xl md:text-4xl font-bold font-oswald mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="text-[10px] md:text-[11px] text-[#10B981] tracking-[2px] font-semibold uppercase">MINUTES</span>
                                </div>
                                <div className="flex flex-col items-center px-6 md:px-8">
                                    <span className="text-3xl md:text-4xl font-bold font-oswald mb-1">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="text-[10px] md:text-[11px] text-[#10B981] tracking-[2px] font-semibold uppercase">SECONDS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 mb-16 bg-gradient-to-b from-white/[0.03] to-black/50 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-8 md:p-10 text-center border-r border-b lg:border-b-0 border-white/5">
                            <div className="mb-6 flex justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18V5l12-2v13"></path>
                                    <circle cx="6" cy="18" r="3"></circle>
                                    <circle cx="18" cy="16" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-3 text-white">Immersive Sound</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed">Experience music like<br />never before.</p>
                        </div>
                        <div className="p-8 md:p-10 text-center border-r border-b lg:border-b-0 border-white/5">
                            <div className="mb-6 flex justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-3 text-white">Made for You</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed">Discover tracks that<br />match your mood.</p>
                        </div>
                        <div className="p-8 md:p-10 text-center border-r border-b sm:border-b-0 border-white/5">
                            <div className="mb-6 flex justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-3 text-white">All in One</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed">Your library, your artists,<br />your world.</p>
                        </div>
                        <div className="p-8 md:p-10 text-center">
                            <div className="mb-6 flex justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20"></path>
                                    <path d="M17 5v14"></path>
                                    <path d="M22 10v4"></path>
                                    <path d="M7 5v14"></path>
                                    <path d="M2 10v4"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-3 text-white">Beyond Streaming</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed">More than music.<br />It&apos;s an experience.</p>
                        </div>
                    </div>

                    {/* Notify Section */}
                    <div className="text-center p-10 md:p-16 border border-[#d4af37]/30 rounded-2xl mb-16 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.05)_0%,rgba(0,0,0,0)_70%)] relative shadow-[0_0_30px_rgba(212,175,55,0.02)]">
                        <div className="mb-4 flex justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                        <h3 className="text-xs text-[#d4af37] tracking-[4px] font-semibold mb-4 uppercase">BE THE FIRST TO KNOW</h3>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">Exclusive access. First listen. Only for you.</h2>
                        <p className="text-[#a0a0a0] text-base mb-10">Join the waitlist and be the first to experience CONNMUSIC.</p>

                        {isSubmitted ? (
                            <p className="text-[#d4af37] mt-5 text-lg font-semibold">
                                🎉 Thank you! You have been successfully added to the waitlist.
                            </p>
                        ) : (
                            <div className="max-w-[500px] mx-auto">
                                <form className="flex flex-col md:flex-row gap-4 mb-4" onSubmit={handleSubmit}>
                                    <input name="email" type="email" placeholder="Enter your email address" required className="flex-1 bg-transparent border border-white/10 py-4 px-6 rounded-lg text-white text-sm outline-none focus:border-[#d4af37]/50 transition-colors" />
                                    <button type="submit" className="bg-[#cba258] hover:bg-[#e6c56b] text-black py-4 px-8 rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending...' : <>Notify Me <span>&gt;</span></>}
                                    </button>
                                </form>
                                {submitError && (
                                    <p className="text-[#ff5252] mt-3 text-sm">
                                        ⚠️ {submitError}
                                    </p>
                                )}
                                <p className="text-xs text-white/30">No spam. Just exclusive updates.</p>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
