"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const apps = [
  { name: "Connflix", glow: "rgba(229, 57, 53, 0.35)", color: "#ff5252", icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> },
  { name: "Conntube", glow: "rgba(255, 255, 255, 0.25)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9l5 3-5 3V9z" fill="#111" /></svg> },

  { name: "Connplay", glow: "rgba(79, 195, 247, 0.35)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> },
  { name: "Connkids", glow: "rgba(129, 212, 250, 0.35)", color: "#81d4fa", icon: <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg> },
  { name: "Connsports", glow: "rgba(105, 240, 174, 0.35)", color: "#69f0ae", icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> },
  { name: "Connlive", glow: "rgba(255, 82, 82, 0.35)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48 0a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" /></svg> },
  { name: "Connnews", glow: "rgba(187, 222, 251, 0.35)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M4 6h16v12H4z" /><path d="M6 8h12v2H6zm0 4h8v2H6zm0 4h12v2H6z" /></svg> },
];

const movies = [
  {
    src: "/movie_poster_action_1778065539049.png",
    alt: "The Last Horizon",
    title: "THE LAST HORIZON",
    genre: "Action • Sci-Fi",
    rating: "8.9"
  },
  {
    src: "/movie_poster_scifi_1778065566530.png",
    alt: "Nebula Echoes",
    title: "NEBULA ECHOES",
    genre: "Sci-Fi • Adventure",
    rating: "9.2"
  },
  {
    src: "/movie_poster_fantasy_1778065585485.png",
    alt: "The Golden Kingdom",
    title: "THE GOLDEN KINGDOM",
    genre: "Fantasy • Epic",
    rating: "8.7"
  },
];

const slides = [
  {
    src: "/img/LUX.jpeg",
    alt: "Luxury Cinema Lounge",
    eyebrow: "Luxury Cinema Experience.",
    title: "Luxury Cinema\nExperience",
    tags: "Recliners · Gourmet F&B · VIP Service",
    desc: "Plush recliners, curated menus, and white-glove service. Every detail crafted for indulgence. Host premieres, VIP screenings, and private events in true luxury. This is cinema as an event - intimate, indulgent, unforgettable.",
  },
  {
    src: "/img/SIG.jpeg",
    alt: "Signature Screen",
    eyebrow: "Where Style Meets the Screen.",
    title: "Signature\nExperience",
    tags: "Technology · Design · Immersion",
    desc: "Sleek interiors, cutting-edge technology, and an atmosphere that pulls you in from the moment you walk through the door. Cinema elevated for the modern audience.",
  },
  {
    src: "/img/SMART.jpeg",
    alt: "Smart Cinema",
    eyebrow: "Strong Network of Cinemas for Every City.",
    title: "Smart Cinema\nNetwork",
    tags: "Comfort · Quality · Community",
    desc: "Thoughtfully designed spaces, quality screens, and a comfortable atmosphere. Smart makes every visit feel easy, enjoyable and just right.",
  },
];

const cases = [
  {
    tag: "EXPERIENTIAL",
    src: "/case_experiential.png",
    title: "Brand Activations",
    desc: "Bringing brands to life in premium cinema lobbies."
  },
  {
    tag: "CONFERENCE",
    src: "/case_conference.png",
    title: "Corporate Events",
    desc: "Professional conferences in a cinematic setting."
  },
  {
    tag: "ON-SCREEN MEDIA",
    src: "/case_onscreen.png",
    title: "On-Screen Media",
    desc: "Captivating audiences with high-impact visuals."
  }
];

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

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);
  const [caseAnimating, setCaseAnimating] = useState(false);
  const [isWhyVisible, setIsWhyVisible] = useState(false);
  const whyRef = useRef<HTMLElement>(null);
  
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const productsGridRef = useRef<HTMLDivElement>(null);

  const handleProductsScroll = () => {
    if (productsGridRef.current) {
      const scrollLeft = productsGridRef.current.scrollLeft;
      const width = productsGridRef.current.clientWidth;
      if (width > 0) {
        const index = Math.round(scrollLeft / width);
        setActiveProductIdx(index);
      }
    }
  };

  const scrollToProduct = (idx: number) => {
    if (productsGridRef.current) {
      const width = productsGridRef.current.clientWidth;
      productsGridRef.current.scrollTo({
        left: idx * width,
        behavior: "smooth"
      });
      setActiveProductIdx(idx);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWhyVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (whyRef.current) observer.observe(whyRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [current]);

  // Auto-advance case studies
  useEffect(() => {
    const timer = setInterval(() => {
      goToCase((currentCase + 1) % cases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentCase]);

  function goTo(idx: number) {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }

  function goToCase(idx: number) {
    if (caseAnimating || idx === currentCase) return;
    setCaseAnimating(true);
    setTimeout(() => {
      setCurrentCase(idx);
      setCaseAnimating(false);
    }, 500);
  }

  const slide = slides[current];

  return (
    <>
      <Header />
      {/* ── HERO ── */}
      <main className="hero">
        <div className="hero-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-bg-overlay"></div>
        </div>

        <h1 className="hero-title">
          Unbox your Own<br />
          <span className="text-gold">Cinema.</span>
        </h1>

        <p className="hero-subtitle">Luxury. Technology. Cinema.</p>

        <div className="hero-actions">
          <a href="https://theconnplex.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Franchise With Us <span>&rarr;</span>
          </a>
          <a href="https://ticketing.theconnplex.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Book tickets <span>&rarr;</span>
          </a>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <h3 className="feature-title">Pan-India Reach </h3>
            <p className="feature-desc">115+ screens operational</p>
          </div>
          <div className="feature-item">
            <h3 className="feature-title">High Cinema Footfall</h3>
            <p className="feature-desc">Connect with thousands of daily viewers</p>
          </div>
          <div className="feature-item">
            <h3 className="feature-title">Next-Generation Cinema Screens</h3>
            <p className="feature-desc">Luxury movie experiences across India</p>
          </div>
        </div>
      </main>

      {/* ── SECTION 1: THE CONNPLEX SUITE ── */}
      <section className="suite-section">
        <div className="suite-header">
          <div className="suite-left">
            <p className="suite-eyebrow">THE CONNPLEX SUITE</p>
            <h2 className="suite-title">
              One Ecosystem. <span>Infinite Experiences.</span>
            </h2>
          </div>
          <Link href="/ecosystem" className="suite-scroll-btn">Scroll →</Link>
        </div>

        <div className="apps-scroll-wrapper">
          <div className="apps-track">
            {apps.map((app) => (
              <div className="app-card" key={app.name}>
                <div className="app-icon-circle" style={{ backgroundColor: 'transparent' }}>
                  <div
                    className="app-icon-inner"
                    style={{
                      width: '65px',
                      height: '65px',
                      borderRadius: '22px',
                      background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                      boxShadow: `0 0 25px ${app.glow}, inset 0 0 15px ${app.glow}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: app.color,
                      border: `1px solid ${app.glow}`
                    }}
                  >
                    {app.icon}
                  </div>
                </div>
                <p className="app-name">{app.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PREMIUM LOUNGERS SLIDESHOW ── */}


      <section className="lounger-section">

        {/* Slide images stacked, crossfade */}
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="lounger-bg"
            style={{ opacity: i === current ? 1 : 0, transition: "opacity 0.7s ease" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
            <div className="lounger-overlay"></div>
          </div>
        ))}

        <div
          className="lounger-content"
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s ease" }}
        >
          <p className="lounger-eyebrow">{slide.eyebrow}</p>
          <h2 className="lounger-title">
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <p className="lounger-tags">{slide.tags}</p>
          <p className="lounger-desc">
            {slide.desc.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
        </div>

        <div className="lounger-nav">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`lounger-dot${i === current ? " lounger-dot-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className="lounger-dot-line"></span>
              <span className="lounger-dot-num">{i + 1}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="products-section">
        <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="products-eyebrow">OUR PRODUCTS</p>
            <h2 className="products-title">
              A platform built <span>for</span>
              <span className="products-title-muted">every screen</span>
            </h2>
          </div>
          <Link href="/products">
            <button
              className="product-btn-circle"
              style={{ marginBottom: '10px' }}
            >
              Explore More
            </button>
          </Link>
        </div>

        <div 
          className="products-grid"
          ref={productsGridRef}
          onScroll={handleProductsScroll}
        >
          <div className="product-card product-card-dark">
            <p className="product-name">Connflix</p>
            <p className="product-tagline">Stream cinema-grade originals.</p>
            <div className="product-actions">
              <Link href="/connflix">
                <button className="product-btn-circle">Explore</button>
              </Link>
            </div>
            <div className="product-image-wrap">
              <Image src="/connflix_hero_mockup.png" alt="Connflix" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="product-card product-card-dark">
            <p className="product-name">Conntube</p>
            <p className="product-tagline">Your channel. Your audience.</p>
            <div className="product-actions">

              <Link href="/conntube">
                <button className="product-btn-circle">Explore</button>
              </Link>
            </div>
            <div className="product-image-wrap">
              <Image src="/conntube_hero_mockup.png" alt="Conntube" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="product-card product-card-dark">
            <p className="product-name">SpectraX</p>
            <p className="product-tagline">Experience beyond the screen.</p>
            <div className="product-actions">

              <Link href="/spectra-x">
                <button className="product-btn-circle">Explore</button>
              </Link>
            </div>
            <div className="product-image-wrap">
              <Image src="/spectra-x-hero.png" alt="SpectraX" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="product-card product-card-dark">
            <p className="product-name">DownTown</p>
            <p className="product-tagline">Design for modern crowd.</p>
            <div className="product-actions">
              <Link href="/downtown">
                <button className="product-btn-circle">Explore</button>
              </Link>
            </div>
            <div className="product-image-wrap">
              <Image src="/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png" alt="DownTown" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>
        </div>

        <div className="products-nav">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              className={`products-dot ${idx === activeProductIdx ? 'products-dot-active' : ''}`}
              onClick={() => scrollToProduct(idx)}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="why-section" ref={whyRef}>

        <div className="why-image-wrapper">
          <div className="why-bg-layer">
            <Image
              src="/assets/cinema_bg.png"
              alt="Luxury Cinema Background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className={`why-popcorn-layer ${isWhyVisible ? "animate-up" : ""}`}>
            <Image
              src="/assets/popcorn.png"
              alt="Popcorn Bucket"
              width={600}
              height={600}
              className="why-popcorn-bucket"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="why-image-overlay">
            <div className="why-image-content">
              <div className="why-logo-wrap">
                <Image src="/logo.png" alt="Connplex Cinemas" width={300} height={100} style={{ objectFit: "contain" }} />
              </div>
              <h3 className="why-image-text">Where cinema becomes an experience.</h3>
              <div className="why-image-btns">

                <a href="https://ticketing.theconnplex.com/" target="_blank" rel="noopener noreferrer" className="why-btn why-btn-outline">
                  Book Your Tickets
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="why-stats">
          <div className="why-stat">
            <span className="why-stat-num">
              <Counter target={10} isVisible={isWhyVisible} suffix="M+" />
            </span>
            <span className="why-stat-label">Annual Footfall</span>
          </div>
          <div className="why-stat">
            <span className="why-stat-num">
              <Counter target={115} isVisible={isWhyVisible} suffix="+" />
            </span>
            <span className="why-stat-label">Premium Screens</span>
          </div>
          <div className="why-stat">
            <span className="why-stat-num">Tier 1 &amp; 2</span>
            <span className="why-stat-label">Cities Covered</span>
          </div>
          <div className="why-stat">
            <span className="why-stat-num">Immersive</span>
            <span className="why-stat-label">Cinema Experiences Delivered</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CASE STUDIES ── */}
      <section className="cases-section">
        <div className="cases-header">
          <div>
            <p className="cases-eyebrow">CASE STUDIES</p>
            <h2 className="cases-title">
              Work that moved <span>audiences.</span>
            </h2>
          </div>
          <div className="cases-nav">
            <button
              className="cases-nav-btn"
              onClick={() => goToCase((currentCase - 1 + cases.length) % cases.length)}
            >←</button>
            <button
              className="cases-nav-btn"
              onClick={() => goToCase((currentCase + 1) % cases.length)}
            >→</button>
          </div>
        </div>

        <div className="cases-slider">
          <div className={`cases-track ${caseAnimating ? "fade-out" : ""}`}>
            <div className="case-slide">
              <span className="case-tag">{cases[currentCase].tag}</span>
              <div className="case-image-wrap">
                <Image
                  src={cases[currentCase].src}
                  alt={cases[currentCase].title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="case-info-overlay">
                <h3 className="case-info-title">{cases[currentCase].title}</h3>
                <p className="case-info-desc">{cases[currentCase].desc}</p>
              </div>
            </div>
          </div>

          <div className="cases-indicators">
            {cases.map((_, i) => (
              <div
                key={i}
                className={`case-dot ${i === currentCase ? "active" : ""}`}
                onClick={() => goToCase(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="movies-section">
        <div className="movies-header">
          <h2 className="movies-title">
            <span className="movies-title-strong">Latest Releases</span>{" "}
            <span className="movies-title-muted">now screening.</span>
          </h2>
          <a href="https://ticketing.theconnplex.com/" target="_blank" rel="noopener noreferrer" className="movies-view-all">
            View All Movies →
          </a>
        </div>

        <div className="movies-grid" role="list">
          {movies.map((m) => (
            <div className="movie-card" key={m.title} role="listitem">
              <Image
                src={m.src}
                alt={m.alt}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="movie-card-overlay">
                <div className="movie-info">
                  <div className="movie-rating">
                    <span className="star">★</span> {m.rating}
                  </div>
                  <h3 className="movie-card-title">{m.title}</h3>
                  <p className="movie-card-genre">{m.genre}</p>
                  <a href="https://ticketing.theconnplex.com/" target="_blank" rel="noopener noreferrer" className="movie-book-btn">
                    Book Tickets
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-content">
          <p className="partner-eyebrow">LET&apos;S CREATE TOGETHER</p>
          <h2 className="partner-title">
            Build  <span className="text-gold">high-impact</span><br />
            brand experiences.
          </h2>
          <p className="partner-subtitle">
            Tell us your vision. We'll handle the rest.
          </p>
          <div className="partner-action">
            <Link href="/contact" className="btn-get-touch">Get in Touch</Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
