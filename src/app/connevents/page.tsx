"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

export default function ConnEvents() {
    const containerRef = useRef<HTMLDivElement>(null);
    const ticketRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
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
            const requestUrl = `${apiUrl}/api/forms/connevents-waitlist`;
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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !ticketRef.current || !glareRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate rotations
        const rotateY = x * 30;
        const rotateX = -y * 30;

        ticketRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        ticketRef.current.style.animation = 'none';

        const glareX = x * 200 + 50;
        glareRef.current.style.transform = `translateX(${glareX}%)`;
    };

    const handleMouseLeave = () => {
        if (!ticketRef.current || !glareRef.current) return;
        
        ticketRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
        glareRef.current.style.transform = `translateX(-100%)`;
        
        // Restore floating animation
        setTimeout(() => {
            if (ticketRef.current) {
                ticketRef.current.style.animation = 'floatTicket 8s ease-in-out infinite';
            }
        }, 100);
    };

    return (
        <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden font-outfit leading-relaxed">
            <Header />

            <main className="pt-[140px] text-center relative before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(201,159,74,0.08)_0%,rgba(5,5,5,0)_60%)] before:-z-10 pb-20">
                <div className="flex flex-col items-center justify-center text-center px-4 mb-12">
                    <span className="text-[#c99f4a] text-[0.9rem] tracking-[5px] uppercase font-semibold block mb-2">Conn Events</span>
                    <h1 className="text-5xl md:text-[5.5rem] font-extrabold leading-[1.1] mb-4 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">COMING SOON</h1>
                    <p className="text-[1.1rem] md:text-[1.3rem] text-[#a0a0a0] max-w-xl mx-auto font-normal">Live events, ticketed in seconds.</p>
                </div>

                <div 
                    className="relative w-full max-w-[290px] md:max-w-[380px] h-[520px] md:h-[650px] mx-auto mb-8 cursor-grab active:cursor-grabbing z-5" 
                    style={{ perspective: '1500px' }}
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="w-full h-full relative animate-float-ticket transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }} ref={ticketRef}>
                        <div className="absolute w-full h-full rounded-[20px] bg-gradient-to-br from-[#151515] to-[#080808] border border-[rgba(201,159,74,0.4)] shadow-[0_0_40px_rgba(201,159,74,0.15)] overflow-hidden flex flex-col" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
                            <div className="p-6 md:p-8 flex justify-between items-center border-b-2 border-dashed border-[rgba(201,159,74,0.3)] relative">
                                <span className="text-[#c99f4a] font-bold tracking-[2px] text-sm md:text-base">CONNPLEX EVENTS</span>
                                <span className="bg-[#c99f4a] text-black px-3 py-1 rounded text-[0.7rem] font-extrabold tracking-[1px]">VIP ADMIT ONE</span>
                            </div>
                            <div className="absolute top-[82px] md:top-[92px] left-[-15px] w-[30px] h-[30px] bg-[#050505] rounded-full z-10 border-r border-[rgba(201,159,74,0.4)]"></div>
                            <div className="absolute top-[82px] md:top-[92px] right-[-15px] w-[30px] h-[30px] bg-[#050505] rounded-full z-10 border-l border-[rgba(201,159,74,0.4)]"></div>
                            
                            <div className="grow p-6 md:p-8 flex flex-col justify-center">
                                <h2 className="text-3xl md:text-[2.8rem] font-extrabold leading-none mb-2 bg-gradient-to-r from-white to-[#aaa] bg-clip-text text-transparent">ARCTIC MONKEYS</h2>
                                <p className="text-[#c99f4a] text-sm md:text-base tracking-[4px] mb-8 md:mb-12">LIVE IN CONCERT</p>
                                <div className="flex justify-between bg-white/[0.03] p-4 md:p-6 rounded-xl border border-white/[0.05]">
                                    <div className="text-left">
                                        <span className="text-[0.7rem] text-[#a0a0a0] tracking-[2px] block mb-1">DATE</span>
                                        <p className="text-base md:text-xl font-bold text-white">OCT 21</p>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[0.7rem] text-[#a0a0a0] tracking-[2px] block mb-1">TIME</span>
                                        <p className="text-base md:text-xl font-bold text-white">8:00 PM</p>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[0.7rem] text-[#a0a0a0] tracking-[2px] block mb-1">SEAT</span>
                                        <p className="text-base md:text-xl font-bold text-white">VIP-1</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8 border-t-2 border-dashed border-[rgba(201,159,74,0.3)] flex flex-col items-center bg-black/30">
                                <div className="flex h-[40px] md:h-[50px] gap-[3px] mb-4 w-full justify-center">
                                    <div className="w-[2px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[1px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[4px] h-full bg-white/80"></div><div className="w-[1px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[4px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[1px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[1px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[4px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div><div className="w-[1px] h-full bg-white/80"></div><div className="w-[2px] h-full bg-white/80"></div>
                                </div>
                                <span className="font-mono text-[#a0a0a0] tracking-[5px] text-[0.8rem] md:text-[0.9rem]">EV-192837465</span>
                            </div>
                            <div className="absolute inset-0 w-[200%] h-full bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.15)_25%,transparent_30%)] pointer-events-none mix-blend-overlay -translate-x-full transition-transform duration-100" ref={glareRef}></div>
                        </div>
                        
                        <div className="absolute w-full h-full rounded-[20px] bg-gradient-to-br from-[#111] to-[#050505] border border-[rgba(201,159,74,0.4)] shadow-[0_0_40px_rgba(201,159,74,0.15)] flex flex-col" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <div className="w-full h-[60px] bg-black mt-12"></div>
                            <div className="w-[80px] h-[80px] rounded-full bg-[radial-gradient(circle,rgba(201,159,74,0.8),rgba(0,0,0,0.5))] mx-auto mt-12 shadow-[0_0_20px_rgba(201,159,74,0.4)]"></div>
                            <p className="text-[#a0a0a0] text-[0.75rem] px-8 text-center mt-auto mb-8">Non-transferable. Valid only for the specified event date and time. Scanning required for entry.</p>
                        </div>
                    </div>
                    <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 w-[80%] h-[20px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)] blur-[5px] rounded-full"></div>
                </div>

                <div className="max-w-[850px] mx-4 md:mx-auto mt-16 md:mt-24 p-6 md:p-14 bg-[rgba(20,20,20,0.4)] border border-[rgba(201,159,74,0.15)] rounded-xl relative z-10 shadow-[0_25px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                    <div className="mb-6">
                        <svg className="mx-auto" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <span className="text-[#c99f4a] text-xs md:text-sm tracking-[3px] uppercase font-semibold block mb-2">Be the first to know</span>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">Exclusive access. Unmissable moments.</h2>
                    <p className="text-[#a0a0a0] mb-8 text-sm md:text-base">Join the waitlist and be the first to experience CONN EVENTS.</p>
                    
                    {isSubmitted ? (
                        <div className="text-center p-6 md:p-8 border border-[#c99f4a] rounded-lg bg-[#c99f4a]/[0.05] max-w-[480px] mx-auto mt-5">
                            <div className="w-10 h-10 bg-[#c99f4a] text-black rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-[#c99f4a] text-lg font-bold mb-2 font-outfit">VIP WAITLIST JOINED!</h3>
                            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4 max-w-[320px] mx-auto">
                                Thank you! Your email has been added to the exclusive VIP waitlist for CONN EVENTS. We will contact you soon.
                            </p>
                            <button onClick={() => setIsSubmitted(false)} className="bg-transparent border border-[#c99f4a]/30 text-[#c99f4a] px-4 py-2 rounded text-xs cursor-pointer hover:border-[#c99f4a] transition-all">Join again</button>
                        </div>
                    ) : (
                        <form className="flex flex-col md:flex-row gap-4 max-w-[600px] mx-auto mb-6" onSubmit={handleSubmit}>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="Enter your email address" 
                                required 
                                className="flex-1 px-6 py-4 bg-black/60 border border-white/[0.08] rounded-lg text-white text-base outline-none focus:border-[#c99f4a] focus:shadow-[0_0_10px_rgba(201,159,74,0.2)] transition-all"
                            />
                            <button type="submit" className="px-8 py-4 bg-[#c99f4a] text-black rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#e0b45a] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(201,159,74,0.3)] transition-all" disabled={isSubmitting}>
                                {isSubmitting ? 'Adding...' : 'Notify Me'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6"/>
                                </svg>
                            </button>
                        </form>
                    )}
                    {submitError && (
                        <p className="text-[#ff5252] text-sm mt-4 text-center font-medium">
                            ⚠️ {submitError}
                        </p>
                    )}
                    <p className="text-xs text-white/40 mt-4">No spam. Just exclusive updates.</p>
                </div>
            </main>

            <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-[5%] py-16 md:py-20 bg-black/90 border-t border-white/[0.03]">
                <div className="text-center p-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="mb-4 flex justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                            <path d="M13 5v2"></path>
                            <path d="M13 17v2"></path>
                            <path d="M13 11v2"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Instant Tickets</h3>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">Get access to live events<br />in seconds.</p>
                </div>
                <div className="text-center p-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="mb-4 flex justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                            <circle cx="12" cy="15" r="1"></circle>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Live Experiences</h3>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">Concerts, sports, festivals<br />and more.</p>
                </div>
                <div className="text-center p-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="mb-4 flex justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <path d="m9 12 2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Secure & Trusted</h3>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">Safe payments and<br />verified events.</p>
                </div>
                <div className="text-center p-4 hover:-translate-y-1 transition-transform duration-300">
                    <div className="mb-4 flex justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c99f4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Never Miss Out</h3>
                    <p className="text-[#a0a0a0] text-sm leading-relaxed">Stay updated on events<br />that matter.</p>
                </div>
            </footer>
            <Footer />
        </div>
    );
}
