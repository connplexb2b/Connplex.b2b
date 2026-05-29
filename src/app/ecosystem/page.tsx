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
  brandColor: string;
  glowColor: string;
}

const cards: EcosystemCardProps[] = [
  {
    id: 'connevents',
    title: 'CONN EVENTS',
    description: 'Hosting and managing premier live screenings, community meetups, and experiential events.',
    link: '/connevents',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/card-bg-1.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    brandColor: '#e040fb',
    glowColor: 'rgba(156, 39, 176, 0.35)',
  },
  {
    id: 'connmusic',
    title: 'CONN MUSIC',
    description: 'Immerse in cinema-grade audio tracks, album releases, and seamless music streaming.',
    link: '/connmusic',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/card-bg-2.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    brandColor: '#00e5ff',
    glowColor: 'rgba(0, 229, 255, 0.35)',
  },
  {
    id: 'connflix',
    title: 'CONNFLIX',
    description: 'Stream premium cinematic originals, indie films, and exclusive entertainment.',
    link: '/connflix',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/connflix-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
    brandColor: '#ff5252',
    glowColor: 'rgba(229, 57, 53, 0.35)',
  },
  {
    id: 'connplex-studio',
    title: 'CONNPLEX STUDIO',
    description: 'Production powerhouse crafting high-impact movies, stories, and cinematic experiences.',
    link: '/connplex-studio',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/studio-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    brandColor: '#ffeb3b',
    glowColor: 'rgba(255, 235, 59, 0.35)',
  },
  {
    id: 'conntube',
    title: 'CONNTUBE',
    description: 'Share your voice and stream high-quality user-generated video content.',
    link: '/conntube',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/conntube-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M10 9l5 3-5 3V9z" fill="#111" />
      </svg>
    ),
    brandColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.25)',
  },
  {
    id: 'downtown',
    title: 'DOWNTOWN',
    description: 'Experience luxury movie theatres with ultra-premium reclining seats and gourmet food.',
    link: '/downtown',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/downtown-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <path d="M9 16h6M8 6h2M14 6h2M8 10h2M14 10h2" />
      </svg>
    ),
    brandColor: '#ff4081',
    glowColor: 'rgba(233, 30, 99, 0.35)',
  },
  {
    id: 'gameflix',
    title: 'GAMEFLIX',
    description: 'Stream, play, and compete in the ultimate cinema-screen gaming arena.',
    link: '/gameflix',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/card-bg-3.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
      </svg>
    ),
    brandColor: '#69f0ae',
    glowColor: 'rgba(76, 175, 80, 0.35)',
  },
  {
    id: 'purex',
    title: 'PUREX',
    description: 'Breathe clean. Advanced medical-grade air purification designed for luxury cinema halls.',
    link: '/pure-x',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/purex-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 12L2 9z" />
      </svg>
    ),
    brandColor: '#ffffff',
    glowColor: 'rgba(224, 224, 224, 0.35)',
  },
  {
    id: 'skyinn',
    title: 'SKY - INN',
    description: 'Fabulous open-air drive-in theatre experience under the beautiful night sky.',
    link: '/sky-inn',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/skyinn-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    brandColor: '#2196f3',
    glowColor: 'rgba(33, 150, 243, 0.35)',
  },
  {
    id: 'spectrax',
    title: 'SPECTRA X',
    description: 'Pioneering the future of smart interactive screen technologies and high-res projection.',
    link: '/spectra-x',
    bgClass: "bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85)),url('/ecosystem-assets/spectrax-bg.png')]",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    brandColor: '#ff6e40',
    glowColor: 'rgba(255, 110, 64, 0.35)',
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
          <style dangerouslySetInnerHTML={{ __html: `
            .ecosystem-card {
              transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }
            .ecosystem-card:hover {
              border-color: var(--brand-color) !important;
              box-shadow: 0 10px 30px var(--glow-color) !important;
              transform: translateY(-8px) !important;
            }
            .ecosystem-card-icon {
              transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }
            .ecosystem-card:hover .ecosystem-card-icon {
              background-color: var(--glow-color) !important;
              border-color: var(--brand-color) !important;
              color: var(--brand-color) !important;
              transform: scale(1.05) !important;
            }
            .ecosystem-card-arrow {
              transition: all 0.3s ease-in-out !important;
            }
            .ecosystem-card:hover .ecosystem-card-arrow {
              transform: translateX(4px) !important;
            }
            .ecosystem-card:hover .ecosystem-card-explore {
              color: var(--brand-color) !important;
            }
          `}} />
          {cards.map((card) => (
            <Link key={card.id} href={card.link} className="block">
              <div 
                className={`ecosystem-card reveal-init relative border border-[#d4af37]/20 rounded-[15px] p-10 text-center overflow-hidden cursor-pointer flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] bg-cover bg-center bg-no-repeat group ${card.bgClass}`} 
                id={card.id}
                style={{
                  ['--brand-color' as any]: card.brandColor,
                  ['--glow-color' as any]: card.glowColor,
                }}
              >
                <div className="ecosystem-card-icon w-20 h-20 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl flex items-center justify-center mb-6.5 text-[#d4af37]">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-[1.5px] text-white">{card.title}</h3>
                <p className="text-[0.95rem] text-white/60 mb-6.5 leading-normal">{card.description}</p>
                <span className="ecosystem-card-explore text-[0.9rem] text-[#d4af37] font-semibold flex items-center gap-2 transition-colors duration-300">
                  Explore Now <span className="ecosystem-card-arrow transition-transform duration-300">→</span>
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
