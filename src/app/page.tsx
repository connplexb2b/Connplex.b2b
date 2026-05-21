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
      <main className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 py-32 overflow-hidden bg-bg-dark">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]"></div>
        </div>

        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] mb-6 tracking-tight relative z-10 animate-fade-in-up [animation-delay:0.2s] font-outfit uppercase">
          Unbox your Own<br />
          <span className="text-primary-gold">Cinema.</span>
        </h1>

        <p className="text-[clamp(1rem,2vw,1.4rem)] text-text-secondary mb-12 font-normal tracking-wide relative z-10 animate-fade-in-up [animation-delay:0.4s]">
          Luxury. Technology. Cinema.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-24 relative z-10 animate-fade-in-up [animation-delay:0.6s] w-full max-w-[320px] sm:max-w-none px-4">
          <a 
            href="https://theconnplex.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto bg-[#191919]/60 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            Franchise With Us <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
          <a 
            href="https://ticketing.theconnplex.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto bg-[#191919]/60 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            Book tickets <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-[1000px] mx-auto border-t border-white/10 pt-8 relative z-10 animate-fade-in-up [animation-delay:0.8s] px-4">
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-[1.1rem] font-semibold text-white">Pan-India Reach</h3>
            <p className="text-sm text-text-secondary">115+ screens operational</p>
          </div>
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-[1.1rem] font-semibold text-white">High Cinema Footfall</h3>
            <p className="text-sm text-text-secondary">Connect with thousands of daily viewers</p>
          </div>
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-[1.1rem] font-semibold text-white">Next-Generation Cinema Screens</h3>
            <p className="text-sm text-text-secondary">Luxury movie experiences across India</p>
          </div>
        </div>
      </main>

      {/* ── SECTION 1: THE CONNPLEX SUITE ── */}
      <section className="bg-bg-dark py-20 px-[4%] sm:px-[6%] border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col text-left">
            <p className="text-[0.7rem] font-semibold tracking-[3px] text-primary-gold mb-3 uppercase">THE CONNPLEX SUITE</p>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight">
              One Ecosystem. <span className="text-text-secondary">Infinite Experiences.</span>
            </h2>
          </div>
          <Link href="/ecosystem" className="text-sm text-text-secondary font-medium tracking-wider hover:text-white transition-colors duration-300 whitespace-nowrap mb-1 inline-block text-left">
            Scroll →
          </Link>
        </div>

        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          <div className="flex gap-10 pb-4 w-max">
            {apps.map((app) => (
              <div className="flex flex-col items-center gap-4 cursor-pointer group" key={app.name}>
                <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div
                    className="w-[65px] h-[65px] rounded-[22px] flex items-center justify-center border transition-all duration-300"
                    style={{
                      background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                      boxShadow: `0 0 25px ${app.glow}, inset 0 0 15px ${app.glow}`,
                      color: app.color,
                      borderColor: app.glow
                    }}
                  >
                    {app.icon}
                  </div>
                </div>
                <p className="text-xs text-text-secondary text-center transition-colors duration-200 group-hover:text-white">{app.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PREMIUM LOUNGERS SLIDESHOW ── */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end px-[4%] sm:px-[6%] py-20 overflow-hidden bg-bg-dark">
        {/* Slide images stacked, crossfade */}
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 z-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20 max-md:bg-gradient-to-t max-md:from-black/95 max-md:via-black/80 max-md:to-black/30"></div>
          </div>
        ))}

        <div
          className="relative z-10 max-w-[520px] w-full text-left transition-opacity duration-500"
          style={{ opacity: animating ? 0 : 1 }}
        >
          <p className="text-[0.7rem] font-semibold tracking-[3px] text-primary-gold mb-4 uppercase">{slide.eyebrow}</p>
          <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold text-white leading-tight mb-4 font-outfit uppercase">
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <p className="text-sm text-text-secondary mb-5 font-normal tracking-wide">{slide.tags}</p>
          <p className="text-sm sm:text-[0.95rem] text-white/60 leading-relaxed font-normal">
            {slide.desc.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
        </div>

        <div className="absolute right-[6%] bottom-12 z-10 hidden md:flex flex-col items-end gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              className="flex items-center gap-2 bg-transparent border-none cursor-pointer group"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span className={`block h-[1px] transition-all duration-300 ${i === current ? 'w-10 bg-white' : 'w-7 bg-white/25 group-hover:bg-white/50'}`}></span>
              <span className={`text-[0.78rem] font-medium transition-colors duration-300 ${i === current ? 'text-white' : 'text-white/35 group-hover:text-white/70'}`}>{i + 1}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: PRODUCTS ── */}
      <section className="bg-bg-dark px-[4%] sm:px-[6%] pt-20 pb-0 overflow-x-hidden border-t border-white/5">
        <div className="flex flex-row justify-between items-end gap-6 mb-12 text-left">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[3px] text-primary-gold mb-3 uppercase">OUR PRODUCTS</p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-white leading-tight uppercase font-outfit">
              A platform built <span className="text-text-secondary">for</span><br />
              <span className="text-text-secondary font-bold">every screen</span>
            </h2>
          </div>
          <Link href="/products" className="mb-2">
            <button className="bg-white text-black rounded-full px-6 py-2.5 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105 whitespace-nowrap">
              Explore More
            </button>
          </Link>
        </div>

        <div 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-0 w-full overflow-x-auto md:overflow-visible scroll-snap-x mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          ref={productsGridRef}
          onScroll={handleProductsScroll}
        >
          <div className="relative flex flex-col items-center pt-12 px-8 pb-0 min-h-[480px] overflow-hidden bg-[#0a0a0a] border border-white/5 flex-shrink-0 w-full md:w-auto md:flex-shrink">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">Connflix</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Stream cinema-grade originals.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/connflix">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full flex-1 min-h-[260px] rounded-t-xl overflow-hidden">
              <Image src="/connflix_hero_mockup.png" alt="Connflix" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-12 px-8 pb-0 min-h-[480px] overflow-hidden bg-[#0a0a0a] border border-white/5 flex-shrink-0 w-full md:w-auto md:flex-shrink">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">Conntube</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Your channel. Your audience.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/conntube">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full flex-1 min-h-[260px] rounded-t-xl overflow-hidden">
              <Image src="/conntube_hero_mockup.png" alt="Conntube" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-12 px-8 pb-0 min-h-[480px] overflow-hidden bg-[#0a0a0a] border border-white/5 flex-shrink-0 w-full md:w-auto md:flex-shrink">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">SpectraX</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Experience beyond the screen.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/spectra-x">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full flex-1 min-h-[260px] rounded-t-xl overflow-hidden">
              <Image src="/spectra-x-hero.png" alt="SpectraX" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-12 px-8 pb-0 min-h-[480px] overflow-hidden bg-[#0a0a0a] border border-white/5 flex-shrink-0 w-full md:w-auto md:flex-shrink">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">DownTown</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Design for modern crowd.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/downtown">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full flex-1 min-h-[260px] rounded-t-xl overflow-hidden">
              <Image src="/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png" alt="DownTown" fill style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>
        </div>

        <div className="flex md:hidden justify-center items-center gap-3 mt-6 mb-8 w-full">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all duration-350 ${idx === activeProductIdx ? 'w-6 bg-primary-gold' : 'w-2 bg-white/25 hover:bg-white/50'}`}
              onClick={() => scrollToProduct(idx)}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 4: WHY CONNPLEX ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-20 border-t border-white/5" ref={whyRef}>
        <div className="relative w-full md:w-[calc(100%+8%)] md:-ml-[4%] aspect-square md:aspect-[16/8] overflow-hidden mb-20 bg-black flex items-center justify-center rounded-2xl md:rounded-none">
          <div className="absolute inset-0 opacity-60 z-10">
            <Image
              src="/assets/cinema_bg.png"
              alt="Luxury Cinema Background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className={`absolute left-1/2 -translate-x-1/2 z-20 w-[80%] md:w-[55%] max-w-[650px] pointer-events-none mix-blend-screen transition-all duration-1000 ease-out [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] ${isWhyVisible ? 'bottom-0 md:bottom-[-10%] translate-y-0 opacity-100' : 'bottom-[-20%] translate-y-[100px] opacity-0'}`}>
            <Image
              src="/assets/popcorn.png"
              alt="Popcorn Bucket"
              width={600}
              height={600}
              className="transition-transform duration-100 ease-linear"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 px-6 pt-12 pb-24 md:pb-[15rem] bg-gradient-to-b from-black/50 via-transparent to-black/75">
            <div className="max-w-[800px] w-full -translate-y-5">
              <div className="mb-6 flex justify-center drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                <Image src="/logo.png" alt="Connplex Cinemas" width={300} height={100} style={{ objectFit: "contain" }} />
              </div>
              <h3 className="text-white/85 text-[clamp(0.9rem,1.5vw,1.25rem)] font-light mb-6 tracking-wide">Where cinema becomes an experience.</h3>
              <div className="flex gap-6 justify-center">
                <a 
                  href="https://ticketing.theconnplex.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 bg-transparent text-white border border-white/45 hover:bg-white hover:text-black hover:border-white hover:-translate-y-1"
                >
                  Book Your Tickets
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-14 text-left">
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">
              <Counter target={10} isVisible={isWhyVisible} suffix="M+" />
            </span>
            <span className="text-sm text-text-secondary font-normal">Annual Footfall</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">
              <Counter target={115} isVisible={isWhyVisible} suffix="+" />
            </span>
            <span className="text-sm text-text-secondary font-normal">Premium Screens</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">Tier 1 &amp; 2</span>
            <span className="text-sm text-text-secondary font-normal">Cities Covered</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">Immersive</span>
            <span className="text-sm text-text-secondary font-normal">Cinema Experiences Delivered</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CASE STUDIES ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-20 md:py-32 border-t border-white/5">
        <div className="flex flex-row justify-between items-end gap-6 mb-12 text-left">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[3px] text-primary-gold mb-3 uppercase">CASE STUDIES</p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-white leading-tight font-outfit uppercase">
              Work that moved <span className="text-text-secondary">audiences.</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white cursor-pointer text-lg"
              onClick={() => goToCase((currentCase - 1 + cases.length) % cases.length)}
            >
              ←
            </button>
            <button
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black hover:border-white cursor-pointer text-lg"
              onClick={() => goToCase((currentCase + 1) % cases.length)}
            >
              →
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <div className={`relative w-full aspect-[4/3] md:aspect-[21/9] rounded-2xl md:rounded-[2rem] overflow-hidden transition-opacity duration-500 bg-[#111] ${caseAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="relative w-full h-full">
              <span className="absolute top-4 left-4 md:top-10 md:left-10 z-10 bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider border border-white/10 uppercase">
                {cases[currentCase].tag}
              </span>
              <div className="w-full h-full relative">
                <Image
                  src={cases[currentCase].src}
                  alt={cases[currentCase].title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 text-left">
                <h3 className="text-xl md:text-4xl font-bold text-white mb-2 uppercase font-outfit">{cases[currentCase].title}</h3>
                <p className="text-sm md:text-lg text-white/70 max-w-[500px] font-normal">{cases[currentCase].desc}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {cases.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] cursor-pointer transition-all duration-300 ${i === currentCase ? "w-10 bg-primary-gold" : "w-7 bg-white/10 hover:bg-white/20"}`}
                onClick={() => goToCase(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: LATEST RELEASES ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-20 border-t border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 text-left">
          <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold leading-tight tracking-tight uppercase font-outfit">
            <span className="text-white">Latest Releases</span>{" "}
            <span className="text-text-secondary font-bold">now screening.</span>
          </h2>
          <a 
            href="https://ticketing.theconnplex.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 bg-transparent text-primary-gold border border-primary-gold/30 hover:bg-primary-gold hover:text-black hover:border-primary-gold whitespace-nowrap"
          >
            View All Movies →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" role="list">
          {movies.map((m) => (
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/3] rounded-2xl overflow-hidden bg-[#111] border border-white/5 cursor-pointer group" key={m.title} role="listitem">
              <Image
                src={m.src}
                alt={m.alt}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 transition-colors duration-300 text-left">
                <div className="transition-transform duration-500 ease-out translate-y-0 sm:translate-y-6 sm:group-hover:translate-y-0">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white mb-4 border border-white/10">
                    <span className="text-primary-gold">★</span> {m.rating}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 tracking-wide font-outfit uppercase">{m.title}</h3>
                  <p className="text-xs md:text-sm text-white/60 mb-5">{m.genre}</p>
                  <a 
                    href="https://ticketing.theconnplex.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-primary-gold hover:text-black block text-center opacity-100 sm:opacity-0 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:scale-100"
                  >
                    Book Tickets
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: CREATE TOGETHER ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-24 md:py-32 text-center relative border-t border-white/5 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[200px] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary-gold before:to-transparent">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[0.8rem] font-bold tracking-[4px] text-primary-gold mb-8 uppercase">LET&apos;S CREATE TOGETHER</p>
          <h2 className="text-[clamp(2.2rem,6vw,4rem)] font-bold text-white leading-tight mb-8 tracking-tighter uppercase font-outfit">
            Build <span className="text-primary-gold">high-impact</span><br />
            brand experiences.
          </h2>
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-text-secondary leading-relaxed mb-12">
            Tell us your vision. We&apos;ll handle the rest.
          </p>
          <div className="mb-16">
            <Link href="/contact" className="bg-[#111] text-white px-10 py-4 rounded-full text-base font-semibold border border-white/10 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.05)] hover:shadow-[0_10px_30px_rgba(234,179,8,0.15)] inline-block">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
