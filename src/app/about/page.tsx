"use client";

import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState, useRef } from "react";
import "./about.css";

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
    <div className="about-page-wrapper">
      <Header />

      {/* Background Ambient Glow Backdrop */}
      <div className="glow-backdrop glow-left"></div>
      <div className="glow-backdrop glow-right"></div>

      {/* ==========================================
          SECTION 1: HERO & STATS DASHBOARD
          ========================================== */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <Image
            src="/img/about/About us top image.png"
            alt="Theater Background"
            fill
            className="hero-bg-img"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="hero-bg-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content-wrapper">
          <div className="content-grid">
            <div className="hero-info">
              <div className="category-tag-container">
                <span className="category-tag">ABOUT US</span>
                <div className="category-line"></div>
              </div>

              <h1 className="main-heading">
                REDEFINING<br />
                THE FUTURE OF<br />
                <span className="gold-text">CINEMA.</span>
              </h1>

              <p className="tagline">
                Connplex Cinemas is India&apos;s fastest-growing luxurious cinema chain, redefining the way audiences experience movies.<br />
                Where innovation meets entertainment, and business meets blockbuster.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="dashboard-wrapper" ref={statsRef}>
          <div className="stats-dashboard">
            <div className="stats-grid">
              {/* Stat 1: Screens */}
              <div className="stat-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="icon-container">
                  <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5c4-1.5 16-1.5 20 0v10c-4-1.5-16-1.5-20 0V5z" fill="rgba(201, 159, 74, 0.05)" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="7" y1="21" x2="17" y2="21" />
                  </svg>
                </div>
                <div className="stat-number-wrapper">
                  <Counter target={115} isVisible={isStatsVisible} suffix="+" />
                </div>
                <div className="stat-label-container">
                  <span className="stat-label-gold">SCREENS</span>
                  <span className="stat-label-white">OPERATIONAL & UNDER PROCESS</span>
                </div>
              </div>

              {/* Stat 2: Locations */}
              <div className="stat-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="icon-container">
                  <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" fill="rgba(201, 159, 74, 0.05)" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="stat-number-wrapper">
                  <Counter target={40} isVisible={isStatsVisible} suffix="+" />
                </div>
                <div className="stat-label-container">
                  <span className="stat-label-white">FRANCHISE LOCATIONS</span>
                </div>
              </div>

              {/* Stat 3: Years */}
              <div className="stat-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="icon-container">
                  <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="rgba(201, 159, 74, 0.05)" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div className="stat-number-wrapper">
                  <Counter target={8} isVisible={isStatsVisible} suffix="+" />
                </div>
                <div className="stat-label-container">
                  <span className="stat-label-white">YEARS OF EXCELLENCE</span>
                </div>
              </div>

              {/* Stat 4: Vision */}
              <div className="stat-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="icon-container">
                  <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" fill="rgba(201, 159, 74, 0.05)" />
                  </svg>
                </div>
                <div className="stat-number-wrapper">
                  <Counter target={1} isVisible={isStatsVisible} />
                </div>
                <div className="stat-label-container">
                  <span className="stat-label-gold">VISION</span>
                  <span className="stat-label-white">India's Emerging cinema chain </span>
                </div>
              </div>

              {/* Stat 5: Moviegoers */}
              <div className="stat-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="icon-container">
                  <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="rgba(201, 159, 74, 0.05)" />
                  </svg>
                </div>
                <div className="stat-number-wrapper">
                  <span className="stat-number-text">10M</span><span className="stat-suffix">+</span>
                </div>
                <div className="stat-label-container">
                  <span className="stat-label-white">HAPPY MOVIEGOERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: OUR STORY
          ========================================== */}
      <section className="story-section section-container">
        <div className="section-grid">
          <div className="story-info">
            <div className="category-tag-container">
              <span className="section-tag-gold">OUR STORY</span>
            </div>
            <h2 className="section-heading">
              BUILT <span className="gold-text">ON PASSION.</span><br />
              DRIVEN <span className="gold-text">BY INNOVATION.</span>
            </h2>

            <div className="story-paragraphs">
              <p>We founded Connplex Cinemas with one shared vision: to democratize the luxury cinema experience and unlock untapped potential in every corner of India.</p>
              <p>From tier 1 cities to emerging markets, our mission is simple &mdash; bring world-class cinema to every audience, and unmatched opportunities to every partner.</p>
              <p>With over 15 years of experience in entertainment, we&apos;ve turned Connplex into more than just a cinema brand &mdash; it&apos;s a growth engine for developers, investors, and franchise partners across the country.</p>
              <p className="story-highlight">Because great cinema isn&apos;t just watched &mdash; it&apos;s built.</p>
            </div>
          </div>

          <div className="story-visual">
            <div className="visual-card">
              <Image
                src="/img/about/our story section image.png"
                alt="Our Story Building"
                width={800}
                height={600}
                className="visual-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: DIRECTOR'S CUT
          ========================================== */}
      <section className="directors-section section-container">
        {/* Frame 1: Anish Patel */}


        {/* Frame 2: Rahul Dhyani */}
        <div className="directors-box">
          <div className="section-grid" style={{ direction: 'rtl' }}>
            <div className="directors-info" style={{ direction: 'ltr' }}>
              <div className="category-tag-container">
                <span className="section-tag-gold">DIRECTOR&apos;S CUT</span>
              </div>
              <h2 className="section-heading" style={{ marginBottom: '10px' }}>
                FROM THE DESK OF<br />
                <span className="gold-text">RAHUL DHYANI</span>
              </h2>
              <h3 style={{ color: 'var(--gold-primary)', fontSize: '18px', fontWeight: 400, marginBottom: '25px', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                Building Experiences That Connect
              </h3>

              <div className="directors-quotes">
                <p>Rahul Dhyani believes great cinemas are built on emotion, connection, and unforgettable experiences. With years of expertise in entertainment and business strategy, his vision for Connplex has been centered around creating destinations that combine storytelling, hospitality, and community engagement.</p>
                <p>His approach focuses on understanding local markets while delivering global-standard cinema experiences through thoughtfully designed formats like Luxuriance, Signature, and Express. From concept to execution, he has played a key role in shaping Connplex into a modern entertainment brand built for India&apos;s evolving audiences.</p>
                <p>For him, Connplex is not just about screens &mdash; it&apos;s about creating spaces where memories are made, businesses grow, and communities come alive through cinema.</p>
              </div>

              <div className="directors-footer" style={{ marginTop: '20px' }}>
                <div className="directors-names">
                  <span className="names-gold">RAHUL DHYANI</span>
                  <span className="roles-white">FOUNDER & DIRECTOR, CONNPLEX CINEMAS</span>
                </div>
              </div>
            </div>

            <div className="directors-visual" style={{ direction: 'ltr', position: 'relative', backgroundColor: 'rgba(255,255,255,0.02)', minHeight: '500px', width: '100%' }}>
              <Image src="/img/rahul dhyani.jpeg" alt="Rahul Dhyani" fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          </div>
        </div>

        <div className="directors-box" style={{ marginBottom: '60px' }}>
          <div className="section-grid">
            <div className="directors-info">
              <div className="category-tag-container">
                <span className="section-tag-gold">DIRECTOR&apos;S CUT</span>
              </div>
              <h2 className="section-heading" style={{ marginBottom: '10px' }}>
                FROM THE DESK OF<br />
                <span className="gold-text">ANISH PATEL</span>
              </h2>
              <h3 style={{ color: 'var(--gold-primary)', fontSize: '18px', fontWeight: 400, marginBottom: '25px', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                The Vision Behind Connplex
              </h3>

              <div className="directors-quotes">
                <p>For Anish Patel, cinema has always been more than entertainment &mdash; it&apos;s an experience that brings people, culture, and communities together. With a strong entrepreneurial mindset and a passion for innovation, he envisioned a cinema brand that could redefine how India experiences movies across both metro cities and emerging markets.</p>
                <p>His focus has always been on creating scalable cinema ecosystems that combine luxury, technology, operational excellence, and long-term business value. Under his leadership, Connplex continues to expand with a clear mission &mdash; delivering premium entertainment experiences while creating profitable opportunities for developers, investors, and franchise partners.</p>
                <p>Driven by innovation and growth, he believes the future of cinema lies in accessibility, smart infrastructure, and experiences that audiences truly remember.</p>
              </div>

              <div className="directors-footer" style={{ marginTop: '20px' }}>
                <div className="directors-names">
                  <span className="names-gold">ANISH PATEL</span>
                  <span className="roles-white">FOUNDER & DIRECTOR, CONNPLEX CINEMAS</span>
                </div>
              </div>
            </div>

            <div className="directors-visual" style={{ position: 'relative', backgroundColor: 'rgba(255,255,255,0.02)', minHeight: '500px', width: '100%' }}>
              <Image src="/img/anish patel.jpeg" alt="Anish Patel" fill style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: OUR CINEMA FORMATS
          ========================================== */}
      <section className="formats-section section-container">
        <div className="center-header">
          <span className="center-tag">OUR BUSINESS VERTICALS</span>
          <h2 className="center-heading">ONE STANDARD OF EXCELLENCE.</h2>
        </div>

        <div className="formats-grid">
          {/* Format 1: Ticketing */}
          <div className="format-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="format-img-container">
              <Image src="/img/about/ticketing_service.png" alt="Ticketing" width={500} height={300} className="format-img" />
              <div className="format-overlay"></div>
            </div>
            <div className="format-content">
              <div className="format-title-row">
                <h3 className="format-title">TICKETING</h3>
              </div>
              <h4 className="format-subtitle">Seamless Booking. Modern Convenience.</h4>
              <p className="format-desc">Experience hassle-free ticket booking through our state-of-the-art platform.</p>
              <Link href="#" className="format-link">KNOW MORE</Link>
            </div>
          </div>

          {/* Format 2: Franchise */}
          <div className="format-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="format-img-container">
              <Image src="/img/about/franchise_service.png" alt="Franchise" width={500} height={300} className="format-img" />
              <div className="format-overlay"></div>
            </div>
            <div className="format-content">
              <div className="format-title-row">
                <h3 className="format-title gold-title">FRANCHISE</h3>
              </div>
              <h4 className="format-subtitle">Partner with India&apos;s Fastest Growing Chain.</h4>
              <p className="format-desc">Unlock massive growth opportunities and robust business models with our scalable solutions.</p>
              <Link href="#" className="format-link">KNOW MORE</Link>
            </div>
          </div>

          {/* Format 3: Advertise */}
          <div className="format-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="format-img-container">
              <Image src="/img/about/advertise_service.png" alt="Advertise" width={500} height={300} className="format-img" />
              <div className="format-overlay"></div>
            </div>
            <div className="format-content">
              <div className="format-title-row">
                <h3 className="format-title">ADVERTISE</h3>
              </div>
              <h4 className="format-subtitle">Your Brand. The Big Screen.</h4>
              <p className="format-desc">Maximize brand impact and reach high-intent premium audiences.</p>
              <Link href="#" className="format-link">KNOW MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: WHAT DRIVES US
          ========================================== */}
      <section className="drivers-section section-container">
        <div className="center-header">
          <span className="center-tag">WHAT DRIVES US</span>
        </div>

        <div className="drivers-grid">
          {[
            { label: "NEXT-GEN TECHNOLOGY", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            { label: "LUXURY REDEFINED", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12l5.25 5 2.625-5L12 17l2.125-5L16.75 17 22 12" /></svg> },
            { label: "UNMATCHED EXPERIENCES", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
            { label: "PEOPLE FIRST", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
            { label: "STRONG FRANCHISE ECOSYSTEM", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
            { label: "SCALABLE MODEL", icon: <svg className="driver-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> }
          ].map((item, idx) => (
            <div className="driver-item" key={idx}>
              <div className="driver-icon-wrap">{item.icon}</div>
              <span className="driver-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 6: LET'S BUILD THE FUTURE CTA
          ========================================== */}
      <section className="bottom-cta-section">
        <div className="hero-bg-container">
          <Image
            src="/img/about/let's connect last cta image.png"
            alt="Lobby Background"
            fill
            className="hero-bg-img"
            style={{ objectFit: 'cover' }}
          />
          <div className="cta-backdrop-overlay"></div>
        </div>

        <div className="section-container">
          <div className="cta-grid">
            <div className="cta-content">
              <h2 className="cta-heading">
                LET&apos;S BUILD THE FUTURE<br />
                OF CINEMA <span className="gold-text">TOGETHER.</span>
              </h2>
              <p className="cta-desc">
                Whether you are a passionate moviegoer or an investor exploring new opportunities, Connplex is shaping the future of cinema &mdash; through smarter spaces, stronger returns, and unforgettable storytelling moments.
              </p>
              <Link href="/contact" className="btn-primary-magnetic">
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
