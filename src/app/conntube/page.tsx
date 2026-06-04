"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Tube3DGallery = () => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const cards = [
        { src: '/echoes_of_the_abyss.png', alt: 'Echoes of the Abyss' },
        { src: '/beyond_the_signal.png', alt: 'Beyond The Signal' },
        { src: '/ashes_of_tomorrow.png', alt: 'Ashes of Tomorrow' },
        { src: '/mind_paradox.png', alt: 'Mind Paradox' }
    ];

    return (
        <div className="w-full h-[280px] sm:h-[350px] md:h-[600px] relative cursor-pointer flex justify-center items-center" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="w-full h-full relative [transform-style:preserve-3d]" style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s ease-out' : 'transform 0.1s linear'
            }}>
                {cards.map((card, i) => {
                    let positionClass = "";
                    if (i === 0) {
                        positionClass = "top-[5%] left-0 [transform:translateZ(20px)_rotateY(15deg)_rotateX(5deg)_rotateZ(-5deg)]";
                    } else if (i === 1) {
                        positionClass = "top-[15%] left-[30%] sm:left-[35%] [transform:translateZ(80px)_rotateY(5deg)_rotateX(-5deg)_rotateZ(2deg)]";
                    } else if (i === 2) {
                        positionClass = "top-[25%] right-0 [transform:translateZ(-30px)_rotateY(-10deg)_rotateX(10deg)_rotateZ(5deg)]";
                    } else if (i === 3) {
                        positionClass = "bottom-[5%] left-[10%] sm:left-[15%] [transform:translateZ(120px)_rotateY(-5deg)_rotateX(5deg)_rotateZ(-2deg)]";
                    }

                    return (
                        <div key={i} className={`absolute w-[100px] sm:w-[140px] md:w-[240px] h-[150px] sm:h-[210px] md:h-[350px] rounded-lg sm:rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/5 shadow-2xl overflow-hidden flex justify-center items-center transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] [transform-style:preserve-3d] hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(220,38,38,0.3)] hover:border-red-500/50 hover:z-10 group before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_60%)] before:opacity-50 ${positionClass}`}>
                            <Image
                                src={card.src}
                                alt={card.alt}
                                fill
                                sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 240px"
                                style={{ objectFit: 'cover', opacity: 0.6 }}
                                className="transition-opacity duration-400 group-hover:opacity-90"
                            />
                            <div className="w-[45px] sm:w-[55px] md:w-[70px] h-[45px] sm:h-[55px] md:h-[70px] rounded-full bg-white/10 backdrop-blur-[5px] flex justify-center items-center border border-white/20 z-[2] transition-all duration-300 ease-out [transform:translateZ(20px)] group-hover:bg-white group-hover:[transform:translateZ(40px)_scale(1.1)] group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.4)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] sm:w-[24px] md:w-[28px] h-[18px] sm:h-[24px] md:h-[28px] text-white fill-white ml-1 sm:ml-1.5 transition-all duration-300 group-hover:text-red-600 group-hover:fill-red-600">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                <div className="absolute inset-0 bg-red-600/60 blur-[30px] opacity-0 transition-opacity duration-300 z-[-1] group-hover:opacity-100"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CountdownTimer = () => {
    return (
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 bg-white/2 p-4 md:p-6 lg:p-[1.5rem_2.5rem] rounded-2xl border border-white/5 w-full justify-center">
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[1.6rem] sm:text-2xl md:text-[2.25rem] font-bold text-white leading-none mb-2">25</span>
                <span className="text-[0.7rem] text-red-600 font-bold tracking-[2px]">DAYS</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[1.6rem] sm:text-2xl md:text-[2.25rem] font-bold text-white leading-none mb-2">14</span>
                <span className="text-[0.7rem] text-red-600 font-bold tracking-[2px]">HOURS</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[1.6rem] sm:text-2xl md:text-[2.25rem] font-bold text-white leading-none mb-2">16</span>
                <span className="text-[0.7rem] text-red-600 font-bold tracking-[2px]">MINS</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[1.6rem] sm:text-2xl md:text-[2.25rem] font-bold text-white leading-none mb-2">35</span>
                <span className="text-[0.7rem] text-red-600 font-bold tracking-[2px]">SECS</span>
            </div>
        </div>
    );
};

export default function ConnTube() {
    return (
        <div className="bg-[#050505] text-white font-outfit min-h-screen overflow-x-hidden">
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="mt-[100px] flex flex-col items-center px-4 sm:px-8 relative z-[1] w-full">
                    <div className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08)_0%,rgba(5,5,5,0)_60%)] z-[-1] pointer-events-none"></div>
                    <div className="w-full max-w-[1300px] mx-auto my-8 md:my-16 conntube-animate-fade-in conntube-delay-100">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
                            <div className="flex-1 flex justify-center perspective-[1200px] w-full">
                                <Tube3DGallery />
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full px-4 lg:pl-16">
                                <div className="mb-4">
                                    <span style={{ color: '#dc2626', letterSpacing: '8px', fontWeight: 700, fontSize: '0.85rem' }}>C O N N T U B E</span>
                                </div>
                                <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] lg:text-[7rem] font-black leading-[0.95] mb-6 tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                                    COMING<br />SOON
                                </h1>
                                <div className="w-60 h-[3px] bg-red-600 mb-8 mx-auto lg:mx-0"></div>
                                <p className="text-base sm:text-lg md:text-[1.25rem] text-[#a1a1aa] font-light mb-8 md:mb-14 max-w-[500px]">New stories. New creators. New era.</p>
                                <CountdownTimer />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#080808] border border-white/6 rounded-[1.5rem] w-full max-w-[900px] grid grid-cols-1 md:grid-cols-3 mb-20 mx-auto conntube-animate-fade-in conntube-delay-400">
                        <div className="p-8 sm:p-14 md:p-[3.5rem_2rem] text-center flex flex-col items-center relative transition-transform duration-300 border-b border-white/6 md:border-b-0 md:border-r border-white/6">
                            <div className="text-red-600 mb-6 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M23 7l-7 5 7 5V7z"></path>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-2 text-zinc-200">Create without limits.</h3>
                            <p className="text-[#71717a] text-[0.85rem] leading-relaxed">Powerful tools for modern creators.</p>
                        </div>
                        <div className="p-8 sm:p-14 md:p-[3.5rem_2rem] text-center flex flex-col items-center relative transition-transform duration-300 border-b border-white/6 md:border-b-0 md:border-r border-white/6">
                            <div className="text-red-600 mb-6 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-2 text-zinc-200">Build your audience.</h3>
                            <p className="text-[#71717a] text-[0.85rem] leading-relaxed">Connect. Engage. Grow.</p>
                        </div>
                        <div className="p-8 sm:p-14 md:p-[3.5rem_2rem] text-center flex flex-col items-center relative transition-transform duration-300">
                            <div className="text-red-600 mb-6 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold mb-2 text-zinc-200">Share everywhere.</h3>
                            <p className="text-[#71717a] text-[0.85rem] leading-relaxed">Reach beyond boundaries.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
