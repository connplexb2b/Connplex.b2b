'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface EcosystemCardProps {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  bgClass: string;
}

const cards: EcosystemCardProps[] = [
  {
    id: 'connflix',
    title: 'CONNFLIX',
    description: 'Stream cinema-grade originals & exclusives.',
    link: '/connflix',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/connflix-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    ),
  },
  {
    id: 'conntube',
    title: 'CONNTUBE',
    description: 'Your space to watch, create & share.',
    link: '/conntube',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/conntube-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
  },
  {
    id: 'purex',
    title: 'PUREX',
    description: 'Breathe different. Advanced air purification for premium spaces.',
    link: '/pure-x',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/purex-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
      </svg>
    ),
  },
  {
    id: 'spectrax',
    title: 'SPECTRAX',
    description: 'The future of smart screens.',
    link: '/spectra-x',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/spectrax-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    id: 'downtown',
    title: 'DOWNTOWN',
    description: 'Luxury cinemas. Redefined.',
    link: '/downtown',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/downtown-bg.png')]",
    icon: <span className="text-4xl font-bold text-[#d4af37]">D</span>,
  },
  {
    id: 'skyinn',
    title: 'SKY INN',
    description: 'Drive-in cinema. Under the stars.',
    link: '/sky-inn',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/skyinn-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
      </svg>
    ),
  },
  {
    id: 'connplex-studio',
    title: 'CONNPLEX STUDIO',
    description: 'Stories. Crafted to perfection.',
    link: '/connplex-studio',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/studio-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="15" height="12" rx="2" ry="2"></rect>
        <path d="M22 19l-5-5 5-5v10z"></path>
        <circle cx="9" cy="12" r="3"></circle>
      </svg>
    ),
  },
];

export default function EcosystemPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-init');
    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#000000] text-white font-outfit min-h-screen pt-20 selection:bg-[#d4af37]/30">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-auto py-16 md:py-0 md:h-[60vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/ecosystem-assets/hero-bg.png')] bg-cover bg-[position:center_bottom] opacity-40 z-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[100px] after:bg-gradient-to-t after:from-black after:to-transparent after:z-2"></div>
          <div className="max-w-[800px] relative z-5 px-5 mx-auto">
            <p className="text-[0.85rem] tracking-[4px] text-[#d4af37] mb-5 font-semibold">ONE UNIVERSE. ENDLESS EXPERIENCES.</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 tracking-[2px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] leading-tight">
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f7e08a] to-[#d4af37] bg-clip-text text-transparent">CONNPLEX</span> ECOSYSTEM
            </h1>
            <p className="text-lg text-white/70 max-w-[600px] mx-auto">
              Explore our interconnected apps and platforms.
              <br />
              Each one crafted to elevate the way you experience entertainment.
            </p>
          </div>
        </section>

        {/* Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] px-5 py-[60px] md:pb-[80px] relative z-10 max-w-[1200px] mx-auto">
          {cards.map((card) => (
            <Link key={card.id} href={card.link} className="block">
              <div className={`ecosystem-card reveal-init relative border border-[#d4af37]/20 rounded-[15px] p-10 text-center transition-all duration-300 ease-in-out overflow-hidden cursor-pointer flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] bg-cover bg-center bg-no-repeat hover:-translate-y-2.5 hover:border-[#d4af37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] group ${card.bgClass}`} id={card.id}>
                <div className="w-20 h-20 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl flex items-center justify-center mb-6.5 text-[#d4af37] transition-all duration-300 ease-in-out group-hover:bg-[#d4af37]/25 group-hover:scale-105">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-[1.5px] text-white">{card.title}</h3>
                <p className="text-[0.95rem] text-white/60 mb-6.5 leading-normal">{card.description}</p>
                <span className="text-[0.9rem] text-[#d4af37] font-semibold flex items-center gap-2 transition-all duration-300 ease-in-out group-hover:text-white">
                  Explore Now <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Banner Section */}
        <section className="max-w-[1200px] mx-auto px-5 pt-5 pb-[80px] relative z-10">
          <div className="bg-white/[0.03] border border-[#d4af37]/20 rounded-[20px] p-8 sm:p-10 md:p-[40px_60px] flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-8 md:gap-5 reveal-init">
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
              <div className="relative w-20 h-20 shrink-0">
                <span className="absolute w-11 h-11 border-[3px] border-[#d4af37] rounded-full bg-black/50 top-0 left-1/2 -translate-x-1/2"></span>
                <span className="absolute w-11 h-11 border-[3px] border-[#d4af37] rounded-full bg-black/50 bottom-0 left-0"></span>
                <span className="absolute w-11 h-11 border-[3px] border-[#d4af37] rounded-full bg-black/50 bottom-0 right-0"></span>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[0.75rem] text-[#d4af37] tracking-[2px] mb-2.5 font-semibold">CONNECTED BY INNOVATION</p>
                <h2 className="text-3xl font-bold mb-2.5 text-white">One ecosystem. Infinite possibilities.</h2>
                <p className="text-white/60">Seamless integration. Personalized experiences. All powered by CONNPLEX.</p>
              </div>
            </div>
            <Link href="/about" className="group inline-flex items-center gap-2.5 border border-[#d4af37] px-7 py-3 rounded-full text-[#d4af37] font-semibold bg-transparent cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#d4af37] hover:text-black shrink-0 w-full lg:w-auto justify-center">
              Learn More About Us <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
