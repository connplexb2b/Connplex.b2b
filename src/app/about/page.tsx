"use client";

import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState, useRef } from "react";
import { useStats } from "@/hooks/useStats";

const getNumeric = (val: string): number => {
  const match = val.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const getSuffix = (val: string): string => {
  const match = val.match(/[\d\.]+(.*)/);
  return match ? match[1] : "";
};


// --- Components ---

/**
 * Animated Counter Component
 */
const Counter = ({ target, isVisible, suffix = "", decimals = 0 }: { target: number, isVisible: boolean, suffix?: string, decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }
    let start = 0;
    const end = target;
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = end * progress;

      if (frame === totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

// --- Main Page ---

export default function AboutPage() {
  const { stats } = useStats();
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // 3D Tilt Effect Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
    const tiltY = ((x - centerX) / centerX) * 10;

    el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02) translateY(-8px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
  };

  return (
    <div className="bg-bg-dark text-white font-inter font-light leading-relaxed overflow-x-hidden min-h-screen relative">
      <Header />

      {/* Background Ambient Glow Backdrop */}
      <div className="glow-backdrop glow-left"></div>
      <div className="glow-backdrop glow-right"></div>

      {/* ==========================================
          SECTION 1: HERO & STATS DASHBOARD
          ========================================== */}
      <section className="relative w-full min-h-screen flex flex-col justify-between z-2 overflow-hidden">
        <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
          <Image
            src="/img/about/About us top image.png"
            alt="Theater Background"
            fill
            sizes="100vw"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0.45)_35%,rgba(5,5,5,0.05)_65%,rgba(5,5,5,0.5)_100%)] z-2"></div>
        </div>

        {/* Hero Content */}
        <div className="grow flex items-center px-4 sm:px-6 md:px-20 pt-[100px] sm:pt-[120px] pb-5 relative z-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 w-full text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-[15px] mb-6">
                <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.25em] uppercase">ABOUT US</span>
                <div className="w-7 h-[1px] bg-gold-primary"></div>
              </div>

              <h1 className="font-outfit font-extralight text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-[1.15] tracking-[0.04em] text-white mb-6 uppercase">
                REDEFINING<br />
                THE FUTURE OF<br />
                <span className="text-gold-primary font-light drop-shadow-[0_0_10px_rgba(201,159,74,0.25)]">CINEMA.</span>
              </h1>

              <p className="font-inter text-base font-light leading-[1.8] text-text-secondary max-w-[580px]">
                Connplex Cinemas is India&apos;s fastest-growing luxurious cinema chain, redefining the way audiences experience movies.<br />
                Where innovation meets entertainment, and business meets blockbuster.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="px-4 pb-5 sm:px-6 sm:pb-[30px] md:px-20 md:pb-10 w-full relative z-5" ref={statsRef}>
          <div className="relative bg-[rgba(5,5,5,0.8)] backdrop-blur-[15px] rounded-[12px] p-5 sm:p-6 md:px-[50px] md:py-10 border border-[rgba(201,159,74,0.3)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-[30px] items-start relative">
              {/* Stat 1: Screens */}
              <div className="group flex flex-col items-center text-center px-4 py-2.5 relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] [perspective:1000px] hover:-translate-y-2 hover:scale-[1.02] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-[1px] after:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),rgba(201,159,74,0.15),rgba(255,255,255,0.06),transparent)] after:hidden lg:after:block last:after:hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center justify-center w-12 h-12 mb-[18px] text-gold-primary bg-[rgba(201,159,74,0.03)] rounded-full border border-[rgba(201,159,74,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:text-black group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:border-gold-primary group-hover:shadow-[0_0_20px_rgba(201,159,74,0.35)] group-hover:[transform:translateZ(35px)_scale(1.1)]">
                  <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5c4-1.5 16-1.5 20 0v10c-4-1.5-16-1.5-20 0V5z" fill="rgba(201, 159, 74, 0.05)" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="7" y1="21" x2="17" y2="21" />
                  </svg>
                </div>
                <div className="font-outfit text-[42px] font-semibold leading-none text-white mb-3 flex items-baseline justify-center [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gold-bright group-hover:[transform:translateZ(25px)]">
                  <Counter target={getNumeric(stats.aboutPage.screens)} isVisible={isStatsVisible} suffix={getSuffix(stats.aboutPage.screens)} />
                </div>
                <div className="flex flex-col items-center gap-[3px] [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(15px)]">
                  <span className="font-outfit text-[11px] font-semibold tracking-[0.1em] text-gold-primary uppercase leading-[1.3] [text-shadow:0_0_6px_rgba(201,159,74,0.2)]">SCREENS</span>
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary uppercase leading-[1.4] max-w-[160px] transition-colors duration-200 group-hover:text-white">OPERATIONAL & UNDER PROCESS</span>
                </div>
              </div>

              {/* Stat 2: Locations */}
              <div className="group flex flex-col items-center text-center px-4 py-2.5 relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] [perspective:1000px] hover:-translate-y-2 hover:scale-[1.02] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-[1px] after:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),rgba(201,159,74,0.15),rgba(255,255,255,0.06),transparent)] after:hidden lg:after:block last:after:hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center justify-center w-12 h-12 mb-[18px] text-gold-primary bg-[rgba(201,159,74,0.03)] rounded-full border border-[rgba(201,159,74,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:text-black group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:border-gold-primary group-hover:shadow-[0_0_20px_rgba(201,159,74,0.35)] group-hover:[transform:translateZ(35px)_scale(1.1)]">
                  <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" fill="rgba(201, 159, 74, 0.05)" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="font-outfit text-[42px] font-semibold leading-none text-white mb-3 flex items-baseline justify-center [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gold-bright group-hover:[transform:translateZ(25px)]">
                  <Counter target={getNumeric(stats.aboutPage.franchiseLocations)} isVisible={isStatsVisible} suffix={getSuffix(stats.aboutPage.franchiseLocations)} />
                </div>
                <div className="flex flex-col items-center gap-[3px] [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(15px)]">
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary uppercase leading-[1.4] max-w-[160px] transition-colors duration-200 group-hover:text-white">FRANCHISE LOCATIONS</span>
                </div>
              </div>

              {/* Stat 3: Years */}
              <div className="group flex flex-col items-center text-center px-4 py-2.5 relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] [perspective:1000px] hover:-translate-y-2 hover:scale-[1.02] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-[1px] after:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),rgba(201,159,74,0.15),rgba(255,255,255,0.06),transparent)] after:hidden lg:after:block last:after:hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center justify-center w-12 h-12 mb-[18px] text-gold-primary bg-[rgba(201,159,74,0.03)] rounded-full border border-[rgba(201,159,74,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:text-black group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:border-gold-primary group-hover:shadow-[0_0_20px_rgba(201,159,74,0.35)] group-hover:[transform:translateZ(35px)_scale(1.1)]">
                  <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="rgba(201, 159, 74, 0.05)" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div className="font-outfit text-[42px] font-semibold leading-none text-white mb-3 flex items-baseline justify-center [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gold-bright group-hover:[transform:translateZ(25px)]">
                  <Counter target={getNumeric(stats.aboutPage.yearsOfExcellence)} isVisible={isStatsVisible} suffix={getSuffix(stats.aboutPage.yearsOfExcellence)} />
                </div>
                <div className="flex flex-col items-center gap-[3px] [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(15px)]">
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary uppercase leading-[1.4] max-w-[160px] transition-colors duration-200 group-hover:text-white">YEARS OF EXCELLENCE</span>
                </div>
              </div>

              {/* Stat 4: Vision */}
              <div className="group flex flex-col items-center text-center px-4 py-2.5 relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] [perspective:1000px] hover:-translate-y-2 hover:scale-[1.02] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-[1px] after:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),rgba(201,159,74,0.15),rgba(255,255,255,0.06),transparent)] after:hidden lg:after:block last:after:hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center justify-center w-12 h-12 mb-[18px] text-gold-primary bg-[rgba(201,159,74,0.03)] rounded-full border border-[rgba(201,159,74,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:text-black group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:border-gold-primary group-hover:shadow-[0_0_20px_rgba(201,159,74,0.35)] group-hover:[transform:translateZ(35px)_scale(1.1)]">
                  <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="rgba(201, 159, 74, 0.05)" />
                  </svg>
                </div>
                <div className="font-outfit text-[42px] font-semibold leading-none text-white mb-3 flex items-baseline justify-center [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gold-bright group-hover:[transform:translateZ(25px)]">
                  <Counter target={getNumeric(stats.aboutPage.vision)} isVisible={isStatsVisible} suffix={getSuffix(stats.aboutPage.vision)} />
                </div>
                <div className="flex flex-col items-center gap-[3px] [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(15px)]">
                  <span className="font-outfit text-[11px] font-semibold tracking-[0.1em] text-gold-primary uppercase leading-[1.3] [text-shadow:0_0_6px_rgba(201,159,74,0.2)]">VISION</span>
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary uppercase leading-[1.4] max-w-[160px] transition-colors duration-200 group-hover:text-white">India&apos;s Emerging cinema chain</span>
                </div>
              </div>

              {/* Stat 5: Moviegoers */}
              <div className="group flex flex-col items-center text-center px-4 py-2.5 relative cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] [perspective:1000px] hover:-translate-y-2 hover:scale-[1.02] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-[1px] after:bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),rgba(201,159,74,0.15),rgba(255,255,255,0.06),transparent)] after:hidden lg:after:block last:after:hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="flex items-center justify-center w-12 h-12 mb-[18px] text-gold-primary bg-[rgba(201,159,74,0.03)] rounded-full border border-[rgba(201,159,74,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:text-black group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:border-gold-primary group-hover:shadow-[0_0_20px_rgba(201,159,74,0.35)] group-hover:[transform:translateZ(35px)_scale(1.1)]">
                  <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="rgba(201, 159, 74, 0.05)" />
                  </svg>
                </div>
                <div className="font-outfit text-[42px] font-semibold leading-none text-white mb-3 flex items-baseline justify-center [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-gold-bright group-hover:[transform:translateZ(25px)]">
                  <span className="font-outfit">{stats.aboutPage.happyMoviegoers.replace(/[+]/g, '')}</span>
                  {stats.aboutPage.happyMoviegoers.includes('+') && (
                    <span className="text-gold-primary text-[28px] ml-0.5 font-semibold group-hover:text-gold-bright transition-colors">+</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-[3px] [transform-style:preserve-3d] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:translateZ(15px)]">
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary uppercase leading-[1.4] max-w-[160px] transition-colors duration-200 group-hover:text-white">HAPPY MOVIEGOERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: OUR STORY
          ========================================== */}
      <section className="relative py-16 md:py-[120px] z-2 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-5 inline-flex items-center">
              <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.2em] uppercase after:content-[''] after:inline-block after:w-[25px] after:h-[1px] after:bg-gold-primary after:ml-3">OUR STORY</span>
            </div>
            <h2 className="font-outfit font-light text-2xl sm:text-3xl md:text-[42px] leading-[1.25] tracking-[0.03em] text-white mb-[30px] uppercase">
              BUILDING <span className="text-gold-primary font-normal drop-shadow-[0_0_10px_rgba(201,159,74,0.2)]">THE FUTURE</span><br />
              OF <span className="text-gold-primary font-normal drop-shadow-[0_0_10px_rgba(201,159,74,0.2)]">CINEMA.</span>
            </h2>

            <div className="text-center lg:text-left">
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">At CONNPLEX Cinemas, we believe cinema is more than entertainment, it is culture, community, and a powerful economic engine.</p>
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">Founded with a vision to redefine movie-going experiences across India, CONNPLEX has evolved into one of the country&apos;s fastest-growing cinema networks, combining premium experiences, scalable infrastructure, and an asset-light franchise model designed for rapid expansion.</p>
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">From metropolitan cities to high-growth emerging markets, we are democratizing world-class cinema by making premium entertainment accessible to every audience and cinema ownership accessible to every aspiring entrepreneur and investor.</p>
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">Today, CONNPLEX is building a nationwide ecosystem that connects developers, landlords, investors, franchise partners, brands, filmmakers, and audiences through a single platform dedicated to entertainment excellence.</p>
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">With a strong foundation in innovation, operational excellence, and strategic partnerships, our mission extends beyond operating cinemas, we are creating the next generation of entertainment destinations.</p>
              <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">As India emerges as one of the world&apos;s largest consumer markets, CONNPLEX is positioned to become a leading force in the evolution of cinema, leisure, and community-driven entertainment experiences.</p>
              <p className="text-lg! font-normal! text-white! mt-2.5 border-l-2 border-gold-primary pl-[18px] text-left">Because the future of cinema won&apos;t be inherited. It will be built.</p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end items-center">
            <div className="relative w-full lg:[mask-image:linear-gradient(to_right,transparent_0%,black_15%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%)] mt-8 lg:mt-0 max-w-full">
              <Image
                src="/img/about/our story section image.png"
                alt="Our Story Building"
                width={800}
                height={600}
                className="w-full h-auto block rounded-lg lg:rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: DIRECTOR'S CUT
          ========================================== */}
      <section className="relative py-16 md:py-[120px] z-2 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20">
        {/* Frame 2: Rahul Dhyani */}
        <div className="border border-[rgba(201,159,74,0.3)] rounded-2xl bg-gradient-to-br from-[rgba(20,20,20,0.4)] to-[rgba(5,5,5,0.7)] overflow-hidden relative mb-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center text-center lg:text-left" style={{ direction: 'rtl' }}>
            <div className="p-6 sm:p-10 lg:p-[70px] flex flex-col justify-center text-center lg:text-left items-center lg:items-start" style={{ direction: 'ltr' }}>
              <div className="mb-5 inline-flex items-center">
                <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.2em] uppercase after:content-[''] after:inline-block after:w-[25px] after:h-[1px] after:bg-gold-primary after:ml-3">DIRECTOR&apos;S CUT</span>
              </div>
              <h2 className="font-outfit font-light text-2xl sm:text-3xl md:text-[42px] leading-[1.25] tracking-[0.03em] text-white mb-2.5 uppercase">
                FROM THE DESK OF<br />
                <span className="text-gold-primary font-normal drop-shadow-[0_0_10px_rgba(201,159,74,0.2)]">RAHUL DHYANI</span>
              </h2>
              <h3 className="text-gold-primary text-[18px] font-normal mb-[25px] font-outfit tracking-[0.04em]">
                Building Experiences That Connect
              </h3>

              <div className="text-center lg:text-left">
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">Rahul Dhyani believes great cinemas are built on emotion, connection, and unforgettable experiences. With years of expertise in entertainment and business strategy, his vision for Connplex has been centered around creating destinations that combine storytelling, hospitality, and community engagement.</p>
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">His approach focuses on understanding local markets while delivering global-standard cinema experiences through thoughtfully designed formats like Luxuriance, Signature, and Express. From concept to execution, he has played a key role in shaping Connplex into a modern entertainment brand built for India&apos;s evolving audiences.</p>
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">For him, Connplex is not just about screens, it&apos;s about creating spaces where memories are made, businesses grow, and communities come alive through cinema.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[30px] mt-8 sm:mt-10">
                <div className="flex flex-col gap-1 text-center lg:text-left">
                  <span className="font-outfit text-[13px] font-semibold tracking-[0.12em] text-gold-primary">RAHUL DHYANI</span>
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary">FOUNDER & DIRECTOR, CONNPLEX CINEMAS</span>
                </div>
              </div>
            </div>

            <div className="relative bg-white/2 w-full aspect-[4/5] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]" style={{ direction: 'ltr' }}>
              <Image src="/img/rahul dhyani.jpeg" alt="Rahul Dhyani" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'center center' }} />
            </div>
          </div>
        </div>

        <div className="border border-[rgba(201,159,74,0.3)] rounded-2xl bg-gradient-to-br from-[rgba(20,20,20,0.4)] to-[rgba(5,5,5,0.7)] overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center text-center lg:text-left">
            <div className="p-6 sm:p-10 lg:p-[70px] flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
              <div className="mb-5 inline-flex items-center">
                <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.2em] uppercase after:content-[''] after:inline-block after:w-[25px] after:h-[1px] after:bg-gold-primary after:ml-3">DIRECTOR&apos;S CUT</span>
              </div>
              <h2 className="font-outfit font-light text-2xl sm:text-3xl md:text-[42px] leading-[1.25] tracking-[0.03em] text-white mb-2.5 uppercase">
                FROM THE DESK OF<br />
                <span className="text-gold-primary font-normal drop-shadow-[0_0_10px_rgba(201,159,74,0.2)]">ANISH PATEL</span>
              </h2>
              <h3 className="text-gold-primary text-[18px] font-normal mb-[25px] font-outfit tracking-[0.04em]">
                The Vision Behind Connplex
              </h3>

              <div className="text-center lg:text-left">
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">For Anish Patel, cinema has always been more than entertainment, it&apos;s an experience that brings people, culture, and communities together. With a strong entrepreneurial mindset and a passion for innovation, he envisioned a cinema brand that could redefine how India experiences movies across both metro cities and emerging markets.</p>
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">His focus has always been on creating scalable cinema ecosystems that combine luxury, technology, operational excellence, and long-term business value. Under his leadership, Connplex continues to expand with a clear mission, delivering premium entertainment experiences while creating profitable opportunities for developers, investors, and franchise partners.</p>
                <p className="font-inter text-[15px] font-light leading-[1.8] text-text-secondary mb-5">Driven by innovation and growth, he believes the future of cinema lies in accessibility, smart infrastructure, and experiences that audiences truly remember.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[30px] mt-8 sm:mt-10">
                <div className="flex flex-col gap-1 text-center lg:text-left">
                  <span className="font-outfit text-[13px] font-semibold tracking-[0.12em] text-gold-primary">ANISH PATEL</span>
                  <span className="font-outfit text-[10px] font-medium tracking-[0.08em] text-text-secondary">FOUNDER & DIRECTOR, CONNPLEX CINEMAS</span>
                </div>
              </div>
            </div>

            <div className="relative bg-white/2 w-full aspect-[4/5] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_20%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%)]">
              <Image src="/img/anish patel.jpeg" alt="Anish Patel" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'center center' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: OUR CINEMA FORMATS
          ========================================== */}
      <section className="relative py-16 md:py-[120px] bg-[#030303] z-2 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="text-center mb-[60px]">
          <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.22em] mb-[18px] inline-block uppercase">OUR BUSINESS VERTICALS</span>
          <h2 className="font-outfit font-light text-2xl sm:text-3xl md:text-[38px] tracking-[0.04em] text-white uppercase">ONE STANDARD OF EXCELLENCE.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[35px]">
          {/* Format 1: Ticketing */}
          <div className="group bg-[rgba(10,10,10,0.65)] rounded-2xl overflow-hidden border border-white/3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:border-[rgba(201,159,74,0.25)] hover:shadow-[0_20px_45px_rgba(201,159,74,0.15)]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="relative w-full overflow-hidden">
              <Image src="/img/about/ticketing_service.png" alt="Ticketing" width={500} height={300} className="w-full h-auto block transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(5,5,5,0.6)] z-2 pointer-events-none"></div>
            </div>
            <div className="p-6 sm:p-[30px] flex flex-col grow">
              <div className="flex items-center gap-[15px] mb-3">
                <h3 className="font-outfit font-medium text-xl tracking-[0.05em] text-white">TICKETING</h3>
              </div>
              <h4 className="font-outfit text-[13px] font-medium text-white mb-[15px] tracking-[0.05em]">Seamless Booking. Modern Convenience.</h4>
              <p className="font-inter text-sm font-light leading-[1.6] text-text-secondary mb-[25px] grow">Experience hassle-free ticket booking through our state-of-the-art platform.</p>
              <a href="https://ticketing.theconnplex.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-outfit text-[11px] font-semibold tracking-[0.08em] text-white no-underline transition-all duration-200 opacity-75 hover:text-gold-primary hover:opacity-100 min-h-[44px]">KNOW MORE</a>
            </div>
          </div>

          {/* Format 2: Franchise */}
          <div className="group bg-[rgba(10,10,10,0.65)] rounded-2xl overflow-hidden border border-white/3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:border-[rgba(201,159,74,0.25)] hover:shadow-[0_20px_45px_rgba(201,159,74,0.15)]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="relative w-full overflow-hidden">
              <Image src="/img/about/franchise_service.png" alt="Franchise" width={500} height={300} className="w-full h-auto block transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(5,5,5,0.6)] z-2 pointer-events-none"></div>
            </div>
            <div className="p-6 sm:p-[30px] flex flex-col grow">
              <div className="flex items-center gap-[15px] mb-3">
                <h3 className="font-outfit font-medium text-xl tracking-[0.05em] text-gold-primary">FRANCHISE</h3>
              </div>
              <h4 className="font-outfit text-[13px] font-medium text-white mb-[15px] tracking-[0.05em]">Partner with India&apos;s Fastest Growing Chain.</h4>
              <p className="font-inter text-sm font-light leading-[1.6] text-text-secondary mb-[25px] grow">Unlock massive growth opportunities and robust business models with our scalable solutions.</p>
              <Link href="/franchise" className="inline-flex items-center gap-2 font-outfit text-[11px] font-semibold tracking-[0.08em] text-white no-underline transition-all duration-200 opacity-75 hover:text-gold-primary hover:opacity-100 min-h-[44px]">KNOW MORE</Link>
            </div>
          </div>

          {/* Format 3: Advertise */}
          <div className="group bg-[rgba(10,10,10,0.65)] rounded-2xl overflow-hidden border border-white/3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:border-[rgba(201,159,74,0.25)] hover:shadow-[0_20px_45px_rgba(201,159,74,0.15)]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="relative w-full overflow-hidden">
              <Image src="/img/about/advertise_service.png" alt="Advertise" width={500} height={300} className="w-full h-auto block transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(5,5,5,0.6)] z-2 pointer-events-none"></div>
            </div>
            <div className="p-6 sm:p-[30px] flex flex-col grow">
              <div className="flex items-center gap-[15px] mb-3">
                <h3 className="font-outfit font-medium text-xl tracking-[0.05em] text-white">ADVERTISE</h3>
              </div>
              <h4 className="font-outfit text-[13px] font-medium text-white mb-[15px] tracking-[0.05em]">Your Brand. The Big Screen.</h4>
              <p className="font-inter text-sm font-light leading-[1.6] text-text-secondary mb-[25px] grow">Maximize brand impact and reach high-intent premium audiences.</p>
              <Link href="/advertise" className="inline-flex items-center gap-2 font-outfit text-[11px] font-semibold tracking-[0.08em] text-white no-underline transition-all duration-200 opacity-75 hover:text-gold-primary hover:opacity-100 min-h-[44px]">KNOW MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: WHAT DRIVES US
          ========================================== */}
      <section className="relative py-12 md:py-20 bg-bg-dark z-2 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="text-center mb-[60px]">
          <span className="font-outfit text-gold-primary text-[13px] font-semibold tracking-[0.22em] mb-[18px] inline-block uppercase">WHAT DRIVES US</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-[15px] py-[30px] border-y border-white/4">
          {[
            { label: "NEXT-GEN TECHNOLOGY", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            { label: "LUXURY REDEFINED", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12l5.25 5 2.625-5L12 17l2.125-5L16.75 17 22 12" /></svg> },
            { label: "UNMATCHED EXPERIENCES", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
            { label: "CUSTOMER FIRST", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
            { label: "STRONG FRANCHISE ECOSYSTEM", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
            { label: "SCALABLE MODEL", icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> }
          ].map((item, idx) => (
            <div className="group flex flex-col items-center text-center gap-[15px] p-2.5 cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" key={idx}>
              <div className="flex items-center justify-center w-11 h-11 bg-[rgba(201,159,74,0.02)] border border-[rgba(201,159,74,0.08)] rounded-full text-gold-primary transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] group-hover:text-black group-hover:border-gold-primary group-hover:shadow-[0_0_15px_rgba(201,159,74,0.35)] group-hover:-translate-y-[3px]">
                {item.icon}
              </div>
              <span className="font-outfit text-[11px] font-medium tracking-[0.05em] text-text-secondary uppercase max-w-[140px] leading-[1.4] transition-colors duration-200 group-hover:text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 6: LET'S BUILD THE FUTURE CTA
          ========================================== */}
      <section className="relative w-full py-20 md:py-[140px] z-2 overflow-hidden">
        <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
          <Image
            src="/img/about/let's connect last cta image.png"
            alt="Lobby Background"
            fill
            sizes="100vw"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.82)_40%,rgba(5,5,5,0.15)_70%,rgba(5,5,5,0.8)_100%)] z-2"></div>
        </div>

        <div className="relative py-16 md:py-[120px] z-2 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] relative z-5">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="font-outfit font-light text-2xl sm:text-3xl md:text-4xl leading-[1.15] tracking-[0.04em] text-white mb-6 uppercase">
                LET&apos;S BUILD THE FUTURE<br />
                OF CINEMA <span className="text-gold-primary font-normal">TOGETHER.</span>
              </h2>
              <p className="font-inter text-[15px] font-light leading-[1.7] text-text-secondary max-w-[550px] mb-10">
                Whether you are a passionate moviegoer or an investor exploring new opportunities, Connplex is shaping the future of cinema, through smarter spaces, stronger returns, and unforgettable storytelling moments.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-[15px] px-9 py-4 bg-[linear-gradient(135deg,#c99f4a_0%,#ffd885_50%,#b3852d_100%)] text-black font-outfit text-xs font-semibold tracking-[0.12em] no-underline rounded transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_10px_30px_rgba(201,159,74,0.25)] hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(201,159,74,0.35)] min-h-[44px] min-w-[44px]">
                LET&apos;S CONNECT
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
