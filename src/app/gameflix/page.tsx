"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

// Scroll Reveal Component using IntersectionObserver for smooth fade-up reveals
const RevealOnScroll = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        
        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`${className} transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
            {children}
        </div>
    );
};

export default function GameflixPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', platform: 'PC' });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);

    // Mouse tilt tracking state
    const heroCardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Scroll listener for dynamic zoom and depth parallax on the hero image
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse tilt handler for a 3D hover interaction
    const handleMouseMove = (e: React.MouseEvent) => {
        const card = heroCardRef.current;
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        
        const x = mouseX / (width / 2);
        const y = mouseY / (height / 2);
        
        // Dynamic rotation limit of 6 degrees
        setTilt({
            x: x * 6,
            y: -y * 6
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    // Interactive waitlist submission handler
    const handleNotifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/gameflix-waitlist`;
            console.log('Submitting Gameflix Waitlist:', requestUrl, formData);
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }
            setFormSubmitted(true);
        } catch (err: any) {
            console.error('Gameflix waitlist error:', err);
            setSubmitError(err.message || 'Unable to join waitlist. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({ name: '', email: '', platform: 'PC' });
            setSubmitError(null);
        }, 300);
    };

    // Calculate scroll zoom and parallax translation factors
    const heroZoom = 1 + Math.min(scrollY * 0.0003, 0.12);
    const heroParallaxY = Math.min(scrollY * 0.05, 35);

    // Unified transform style for mouse tilt + scroll zoom + scroll parallax
    const transformStyle = {
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${heroZoom}) translateY(${heroParallaxY}px)`,
        transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    };

    return (
        <div className="bg-[#000000] text-white font-outfit min-h-screen overflow-x-hidden relative selection:bg-[#C5A059]/30">
            {/* Custom Animations: Levitation loop and animated gradient borders */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(0.3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes gradientBorder {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-border:hover {
                    background-size: 200% 200%;
                    animation: gradientBorder 3s linear infinite;
                }
            `}} />

            {/* Glowing Ambient Background Orbs */}
            <div className="absolute top-[12%] right-[-12%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#C5A059]/8 blur-[130px] sm:blur-[180px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[25%] left-[-12%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#C5A059]/5 blur-[130px] sm:blur-[180px] pointer-events-none z-0"></div>

            {/* Navbar Component */}
            <Header />

            <main className="relative z-10">
                {/* HERO SECTION - Responsive flex: vertical stacking on mobile, side-by-side on desktop */}
                <section className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8 md:px-16 max-w-[1400px] mx-auto w-full relative">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 lg:gap-16 w-full">
                        
                        {/* Left Side: Product Details (40% width on desktop) */}
                        <div className="w-full md:w-[calc(40%-1rem)] lg:w-[calc(40%-2rem)] flex flex-col text-center md:text-left items-center md:items-start max-w-[550px] mx-auto md:mx-0 shrink-0">
                            <RevealOnScroll delay={100} className="w-full">
                                <span className="font-inter text-xs sm:text-sm font-semibold tracking-[8px] sm:tracking-[10px] text-[#C5A059] mb-4 sm:mb-6 block uppercase">
                                    GAMEFLIX
                                </span>
                            </RevealOnScroll>

                            <RevealOnScroll delay={200} className="w-full">
                                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold leading-[0.9] tracking-tight uppercase text-white mb-4 sm:mb-6">
                                    COMING<br />
                                    <span className="bg-gradient-to-r from-[#fdf1d6] via-[#C5A059] to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">SOON</span>
                                </h1>
                            </RevealOnScroll>

                            <RevealOnScroll delay={300} className="w-full">
                                <p className="font-inter text-sm sm:text-base font-bold tracking-[8px] sm:tracking-[10px] text-white/95 mb-6 uppercase">
                                    PLAY BEYOND LIMITS
                                </p>
                            </RevealOnScroll>

                            <RevealOnScroll delay={400} className="w-full">
                                <p className="text-sm sm:text-base leading-relaxed text-[#A0A0A0] font-light mb-10 max-w-[480px]">
                                    Gameflix is the next-generation gaming platform by Connplex. Stream, compete, connect, and experience immersive gaming like never before.
                                </p>
                            </RevealOnScroll>

                            <RevealOnScroll delay={500} className="w-full flex justify-center md:justify-start">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="group inline-flex items-center gap-4 px-8 py-3.5 border border-[#C5A059] hover:bg-[#C5A059] hover:text-black text-[#C5A059] hover:shadow-[0_0_30px_rgba(197,160,89,0.35)] font-inter text-xs font-semibold tracking-wider uppercase rounded-sm transition-all duration-500 cursor-pointer min-h-[48px]"
                                >
                                    <span>Notify Me</span>
                                    <svg className="stroke-[#C5A059] group-hover:stroke-black group-hover:translate-x-1 transition-all duration-500" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </RevealOnScroll>
                        </div>

                        {/* Right Side: Setup Image Column (60% width on desktop) */}
                        <div className="w-full md:w-[calc(60%-1rem)] lg:w-[calc(60%-2rem)] relative h-[320px] sm:h-[450px] md:h-[500px] lg:h-[650px] flex items-center justify-center overflow-visible z-20">
                            
                            {/* Ambient Gold Glow behind the setup container */}
                            <div className="absolute inset-[-30px] rounded-full bg-[#C5A059]/12 blur-[80px] pointer-events-none z-0"></div>

                            {/* Outer Transform Wrapper (Scroll Zoom + Parallax + 3D Mouse Tilt) */}
                            <div 
                                ref={heroCardRef}
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={handleMouseLeave}
                                style={transformStyle}
                                className="relative w-full h-full z-10 cursor-pointer"
                            >
                                {/* Inner Levitation Wrapper (Constant Floating Loop) */}
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C5A059]/20 bg-[#0a0a0a] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(197,160,89,0.1)]">

    <img
        src="/gameflix/hero.jpg"
        alt="Gameflix Gaming Setup"
        className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none"></div>

</div>
</div>
                        </div>

                    </div>
                </section>

                {/* SHOWCASE SECTION - Responsive flex: vertical stacking on mobile, showcase image on left, content on right on desktop */}
                <section className="py-24 border-t border-white/5 relative bg-[#020202] overflow-visible">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
                            
                            {/* Left: Showcase Console Image (explicit height) */}
                            <RevealOnScroll className="relative w-full lg:w-[55%] h-[320px] sm:h-[420px] lg:h-[500px] overflow-visible order-2 lg:order-1 shrink-0">
                                <div className="absolute inset-[-15px] rounded-full bg-[#C5A059]/6 blur-[60px] pointer-events-none z-0"></div>
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C5A059]/25 bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(197,160,89,0.08)] z-10">
                                    <Image
                                        src="/gameflix/other.jpg"
                                        alt="Gameflix Console and Controller Setup"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 45vw"
                                        style={{ objectFit: 'cover' }}
                                        className="brightness-95 hover:scale-102 transition-transform duration-[1.5s]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                </div>
                            </RevealOnScroll>
                            
                            {/* Right: Technical Details & Info (order-1 on mobile, order-2 on desktop) */}
                            <div className="w-full lg:w-[40%] flex flex-col text-left items-start max-w-[500px] mx-auto lg:mx-0 order-1 lg:order-2">
                                <RevealOnScroll delay={100}>
                                    <span className="font-inter text-xs font-semibold tracking-[4px] text-[#C5A059] mb-3.5 block uppercase">THE CONSOLE</span>
                                </RevealOnScroll>
                                <RevealOnScroll delay={200}>
                                    <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold leading-tight uppercase text-white mb-6">
                                        ENGINEERED FOR <span className="bg-gradient-to-r from-[#fdf1d6] via-[#C5A059] to-[#906c24] bg-clip-text text-transparent inline-block">PERFECTION</span>
                                    </h2>
                                </RevealOnScroll>
                                <RevealOnScroll delay={300}>
                                    <p className="text-sm sm:text-base leading-relaxed text-[#A0A0A0] font-light mb-8">
                                        Gameflix by Connplex represents the fusion of raw graphics power and luxury aesthetics. Featuring custom-tuned input controls, spatial audio acoustics integration, and direct low-latency streaming hubs built to deliver AAA gaming.
                                    </p>
                                </RevealOnScroll>
                                <RevealOnScroll delay={400}>
                                    <div className="flex flex-wrap gap-3 text-xs font-inter tracking-wider text-[#C5A059]">
                                        <span className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 font-semibold">CUSTOM D-PAD</span>
                                        <span className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 font-semibold">4K 120 FPS</span>
                                        <span className="px-3.5 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 font-semibold">SPATIAL SOUND</span>
                                    </div>
                                </RevealOnScroll>
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION - 5 Premium Feature Cards in One Row */}
                <section className="py-24 sm:py-32 border-t border-white/5 bg-[#000000] relative">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                        
                        {/* Section Header */}
                        <RevealOnScroll className="text-center mb-16 sm:mb-24">
                            <span className="font-inter text-xs font-semibold tracking-[4px] text-[#C5A059] mb-3.5 block uppercase">NEXT-GEN TECHNOLOGY</span>
                            <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold leading-tight uppercase tracking-tight text-white">
                                THE FUTURE OF <span className="bg-gradient-to-r from-[#fdf1d6] via-[#C5A059] to-[#906c24] bg-clip-text text-transparent inline-block">GAMING</span>
                            </h2>
                            <div className="w-10 h-[2px] bg-[#C5A059] mx-auto mt-4 shadow-[0_0_8px_#C5A059]"></div>
                        </RevealOnScroll>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                            {[
                                {
                                    title: "Cloud Gaming",
                                    desc: "Instantly stream next-generation games to any screen. No downloads, no installs, just pure play at 4K 120FPS.",
                                    icon: (
                                        <svg className="w-8 h-8 stroke-[#C5A059] fill-none stroke-[1.25] transition-colors duration-400 group-hover/card:stroke-[#fdf1d6]" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a5 5 0 0 0 5-5 5.5 5.5 0 0 0-5.5-5.5 6 6 0 0 0-5.9 4.9A4 4 0 0 0 2 16a3 3 0 0 0 3 3h7" />
                                            <rect x="13" y="12" width="6" height="4" rx="1" />
                                            <circle cx="15" cy="14" r="0.5" fill="#C5A059" />
                                            <circle cx="17" cy="14" r="0.5" fill="#C5A059" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Play Together",
                                    desc: "Connect with friends or match with rivals globally. Low-latency voice chat and seamless multiplayer integration.",
                                    icon: (
                                        <svg className="w-8 h-8 stroke-[#C5A059] fill-none stroke-[1.25] transition-colors duration-400 group-hover/card:stroke-[#fdf1d6]" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Ultra Immersive",
                                    desc: "Experience games in jaw-dropping 4K resolution, Dolby Atmos spatial sound, and immersive ray-traced lighting.",
                                    icon: (
                                        <svg className="w-8 h-8 stroke-[#C5A059] fill-none stroke-[1.25] transition-colors duration-400 group-hover/card:stroke-[#fdf1d6]" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 22h6M12 18v4" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h2M15 10h2" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 13c1 1 3 1 4 0" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Compete & Win",
                                    desc: "Enter exclusive tournaments, climb the leaderboards, and win real rewards, merchandise, and cinema tickets.",
                                    icon: (
                                        <svg className="w-8 h-8 stroke-[#C5A059] fill-none stroke-[1.25] transition-colors duration-400 group-hover/card:stroke-[#fdf1d6]" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                                        </svg>
                                    )
                                },
                                {
                                    title: "Built For All",
                                    desc: "From casual match-3 players to hardcore esports competitive gamers. Cross-play and cross-progression enabled.",
                                    icon: (
                                        <svg className="w-8 h-8 stroke-[#C5A059] fill-none stroke-[1.25] transition-colors duration-400 group-hover/card:stroke-[#fdf1d6]" viewBox="0 0 24 24">
                                            <rect x="2" y="6" width="20" height="12" rx="3" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4" />
                                            <circle cx="15" cy="12" r="1" fill="#C5A059" />
                                            <circle cx="18" cy="11" r="1" fill="#C5A059" />
                                            <circle cx="18" cy="13" r="1" fill="#C5A059" />
                                        </svg>
                                    )
                                }
                            ].map((card, i) => (
                                <RevealOnScroll key={i} delay={i * 80} className="h-full">
                                    {/* Gold Gradient Animated Border Box with Hover Lift */}
                                    <div className="animate-gradient-border p-[1px] rounded-xl bg-white/5 transition-all duration-500 hover:bg-gradient-to-r hover:from-[#C5A059]/20 hover:via-[#fdf1d6] hover:to-[#906c24]/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] h-full">
                                        {/* Card inner body */}
                                        <div className="group/card flex flex-col items-start bg-[#0a0a0a] rounded-[11px] p-8 h-full transition-transform duration-500 hover:-translate-y-2 relative overflow-hidden">
                                            <div className="mb-8 p-3 rounded-lg bg-[#C5A059]/5 border border-[#C5A059]/10 group-hover/card:bg-[#C5A059]/10 group-hover/card:border-[#C5A059]/20 transition-all duration-400">
                                                {card.icon}
                                            </div>
                                            <h3 className="font-outfit text-base font-bold text-white mb-4 tracking-wide uppercase transition-colors duration-300 group-hover/card:text-[#C5A059]">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs leading-relaxed text-[#A0A0A0] font-light">
                                                {card.desc}
                                            </p>
                                            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#C5A059] to-[#906c24] transition-all duration-500 group-hover/card:w-full"></div>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Component */}
            <Footer />

            {/* NOTIFY ME GLASSMORPHISM MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Dark Glass Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
                        onClick={closeModal}
                    ></div>
                    
                    {/* Modal Window Container */}
                    <div className="bg-[#050505] border border-[#C5A059]/25 shadow-[0_0_60px_rgba(197,160,89,0.2)] rounded-xl w-full max-w-[480px] p-8 sm:p-10 relative z-10 transition-transform duration-300 transform scale-100 max-h-[90vh] overflow-y-auto">
                        
                        {/* Close Button */}
                        <button 
                            className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {!formSubmitted ? (
                            <form onSubmit={handleNotifySubmit} className="flex flex-col gap-5">
                                <div className="text-center mb-4">
                                    <span className="text-[10px] tracking-[4px] text-[#C5A059] font-bold uppercase mb-2 block">BE THE FIRST TO PLAY</span>
                                    <h3 className="font-outfit text-2xl font-bold uppercase tracking-tight text-white">GAMEFLIX ACCESS</h3>
                                    <p className="text-xs text-[#A0A0A0] mt-2 font-light">Enter your details to join the priority player waitlist.</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="name" className="text-[10px] uppercase font-bold tracking-wider text-white/60">Full Name</label>
                                    <input 
                                        id="name"
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Gamer tag or Real name" 
                                        className="bg-black/60 border border-white/15 px-4 py-3 text-white rounded text-sm focus:outline-none focus:border-[#C5A059] transition-all min-h-[48px]"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-wider text-white/60">Email Address</label>
                                    <input 
                                        id="email"
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com" 
                                        className="bg-black/60 border border-white/15 px-4 py-3 text-white rounded text-sm focus:outline-none focus:border-[#C5A059] transition-all min-h-[48px]"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="platform" className="text-[10px] uppercase font-bold tracking-wider text-white/60">Preferred Platform</label>
                                    <div className="relative">
                                        <select 
                                            id="platform"
                                            value={formData.platform}
                                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                            className="w-full bg-black/90 border border-white/15 px-4 py-3 pr-10 text-white rounded text-sm focus:outline-none focus:border-[#C5A059] transition-all min-h-[48px] appearance-none cursor-pointer"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C5A059' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 18px center',
                                                backgroundSize: '14px',
                                            }}
                                        >
                                            <option value="PC">PC (Gamer Rig)</option>
                                            <option value="Console">Console (PlayStation / Xbox / Switch)</option>
                                            <option value="Mobile">Mobile (iOS / Android)</option>
                                            <option value="Cloud">Cloud Streaming TV / Web</option>
                                        </select>
                                    </div>
                                </div>

                                {submitError && (
                                    <div className="text-red-500 text-xs font-semibold text-center mt-2">
                                        ⚠️ {submitError}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full mt-4 py-3.5 bg-[#C5A059] hover:bg-[#ebd59b] text-black font-inter text-xs font-bold tracking-wider uppercase rounded shadow-[0_5px_15px_rgba(193,155,98,0.3)] hover:-translate-y-0.5 transition-all duration-300 min-h-[48px] flex items-center justify-center cursor-pointer"
                                >
                                    {isSubmitting ? 'ENROLLING WAITLIST...' : 'SECURE EARLY ACCESS'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/25 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-white text-2xl font-bold uppercase tracking-tight font-outfit mb-3">YOU&apos;RE ON THE LIST</h3>
                                <p className="text-sm text-[#C5A059] font-semibold mb-4 tracking-wide font-inter">WELCOME TO GAMEFLIX PLATINUM ACCESS</p>
                                <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-[320px] mx-auto mb-8 font-light">
                                    Thank you for your interest, <strong className="text-white font-medium">{formData.name}</strong>. We will notify you at <strong className="text-white font-medium">{formData.email}</strong> as soon as the Gameflix alpha trials open in your region.
                                </p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={closeModal}
                                        className="px-8 py-3 bg-transparent border border-[#C5A059] text-[#C5A059] rounded font-inter text-xs font-semibold tracking-wider hover:bg-[#C5A059]/10 transition-all duration-300 min-h-[44px] cursor-pointer"
                                    >
                                        Return to Page
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
