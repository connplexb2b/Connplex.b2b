"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStats } from "@/hooks/useStats";

const getNumeric = (val: string): number => {
  const match = val.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const getSuffix = (val: string): string => {
  const match = val.match(/[\d\.]+(.*)/);
  return match ? match[1] : "";
};


const apps = [
  { name: "Conn events", link: "/connevents", glow: "rgba(156, 39, 176, 0.35)", color: "#e040fb", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
  { name: "Conn Music", link: "/connmusic", glow: "rgba(0, 229, 255, 0.35)", color: "#00e5ff", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg> },
  { name: "Connflix", link: "/connflix", glow: "rgba(229, 57, 53, 0.35)", color: "#ff5252", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> },
  { name: "Connplex studio", link: "/connplex-studio", glow: "rgba(255, 235, 59, 0.35)", color: "#ffeb3b", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg> },
  { name: "ConnTube", link: "/conntube", glow: "rgba(255, 255, 255, 0.25)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 xl:w-9 xl:h-9" fill="currentColor"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9l5 3-5 3V9z" fill="#111" /></svg> },
  { name: "Downtown", link: "/downtown", glow: "rgba(233, 30, 99, 0.35)", color: "#ff4081", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="16" /><line x1="15" y1="22" x2="15" y2="16" /><path d="M9 16h6M8 6h2M14 6h2M8 10h2M14 10h2" /></svg> },
  { name: "Gameflix", link: "/gameflix", glow: "rgba(76, 175, 80, 0.35)", color: "#69f0ae", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" /></svg> },
  { name: "ConnAir", link: "/connair", glow: "rgba(224, 224, 224, 0.35)", color: "#ffffff", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /></svg> },
  { name: "Sky - inn", link: "/sky-inn", glow: "rgba(33, 150, 243, 0.35)", color: "#2196f3", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { name: "Spectra X", link: "/spectra-x", glow: "rgba(255, 110, 64, 0.35)", color: "#ff6e40", icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg> },
];

const HARDCODED_MOVIES = [
  {
    src: "/movies/hai_jawani.png",
    alt: "Hai Jawani Toh Ishq Hona Hai",
    title: "HAI JAWANI TOH ISHQ HONA HAI",
    genre: "Comedy • Romance",
    rating: "4.8",
    link: "https://ticketing.theconnplex.com/movie-details?mId=6a1d4fdeaec95804649703e6&rId=64da17939cdcb529a693aac2"
  },
  {
    src: "/movies/he_man.png",
    alt: "He-Man and the Masters of the Universe",
    title: "HE-MAN AND THE MASTERS OF THE UNIVERSE",
    genre: "Action • Adventure",
    rating: "4.9",
    link: "https://ticketing.theconnplex.com/movie-details?mId=6a1d4fdeaec95804649703e8&rId=64da17939cdcb529a693aac2"
  },
  {
    src: "/movies/peddi.png",
    alt: "Peddi",
    title: "PEDDI (TELUGU)",
    genre: "Action • Drama",
    rating: "4.8",
    link: "https://ticketing.theconnplex.com/movie-details?mId=6a1d4fdeaec95804649703eb&rId=64da17939cdcb529a693aac2"
  },
];

const HARDCODED_SLIDES: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  tags: string;
  desc: string;
  link?: string;
  linkText?: string;
}[] = [
  {
    src: "/img/LUX.jpeg",
    alt: "Luxury Cinema Lounge",
    eyebrow: "Luxury Cinema Experience.",
    title: "Luxury Cinema\nExperience",
    tags: "Recliners · Gourmet F&B · VIP Service",
    desc: "Plush recliners, curated menus, and white glove service. Every detail crafted for indulgence. Host premieres, VIP screenings, and private events in true luxury. This is cinema as an event intimate, indulgent, unforgettable.",
    link: "/franchise",
    linkText: "Know More",
  },
  {
    src: "/img/SIG.jpeg",
    alt: "Signature Screen",
    eyebrow: "Where Style Meets the Screen.",
    title: "Signature\nExperience",
    tags: "Technology · Design · Immersion",
    desc: "Sleek interiors, cutting edge technology, and an atmosphere that pulls you in from the moment you walk through the door. Cinema elevated for the modern audience.",
    link: "/franchise",
    linkText: "Know More",
  },
  {
    src: "/img/SMART.jpeg",
    alt: "Smart Cinema",
    eyebrow: "Strong Network of Cinemas for Every City.",
    title: "Smart Cinema\nNetwork",
    tags: "Comfort · Quality · Community",
    desc: "Thoughtfully designed spaces, quality screens, and a comfortable atmosphere. Smart makes every visit feel easy, enjoyable and just right.",
    link: "/franchise",
    linkText: "Explore",
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
  const { stats } = useStats();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);
  const [caseAnimating, setCaseAnimating] = useState(false);
  const [isWhyVisible, setIsWhyVisible] = useState(false);
  const whyRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slides, setSlides] = useState(HARDCODED_SLIDES);
  const [liveMovies, setLiveMovies] = useState(HARDCODED_MOVIES);
  const [activeStatIdx, setActiveStatIdx] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  // Auto-advance homepage hero stats on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStatIdx((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Fetch hero slides from admin panel (falls back to hardcoded if DB is empty)
  useEffect(() => {
    fetch('/api/admin/hero-slides')
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data.map(s => ({
            src: s.imagePath,
            alt: s.eyebrow,
            eyebrow: s.eyebrow,
            title: s.title,
            tags: s.tags || '',
            desc: s.description || '',
            link: s.link || '/franchise',
            linkText: s.linkText || 'Know More',
          })));
        }
      })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);
  
  // Fetch live recent release movies from ticketing database
  useEffect(() => {
    fetch('/api/recent-releases')
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.success && Array.isArray(res.movies) && res.movies.length > 0) {
          setLiveMovies(res.movies);
        }
      })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);


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
      <main className="relative min-h-[65vh] md:min-h-screen flex flex-col justify-center items-center text-center px-4 pt-40 pb-6 md:py-32 overflow-hidden bg-bg-dark">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[70%] md:h-full object-cover opacity-75 blur-[4px] scale-105 md:scale-110 absolute top-0 left-0"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-dark md:hidden"></div>
        </div>

        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[1.1] mb-6 tracking-tight relative z-10 animate-fade-in-up [animation-delay:0.2s] font-outfit uppercase">
          Unbox your Own<br />
          <span className="text-primary-gold">Cinema.</span>
        </h1>

        <p className="text-[clamp(1rem,2vw,1.4rem)] text-text-secondary mb-12 font-normal tracking-wide relative z-10 animate-fade-in-up [animation-delay:0.4s]">
          Luxury. Technology. Cinema.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 md:mb-24 relative z-10 animate-fade-in-up [animation-delay:0.6s] w-full max-w-[320px] sm:max-w-none px-4">
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

        {/* Desktop View (Visible on md and up) */}
        <div className="hidden md:grid grid-cols-3 gap-8 md:gap-12 w-full max-w-[1000px] mx-auto border-t border-white/10 pt-8 relative z-10 animate-fade-in-up [animation-delay:0.8s] px-4">
          <div className="text-center flex flex-col gap-2">
            <h3 className="text-[1.1rem] font-semibold text-white">Pan-India Reach</h3>
            <p className="text-sm text-text-secondary">{stats.homepage.premiumScreens} screens operational</p>
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

        {/* Mobile View (Visible on mobile, rotating every 1.5 seconds) */}
        <div className="block md:hidden w-full max-w-[400px] mx-auto border-y border-white/10 py-4 relative z-10 animate-fade-in-up [animation-delay:0.8s] px-4">
          <div className="relative overflow-hidden h-[55px] flex items-center justify-center">
            {/* Stat 1 */}
            <div className={`absolute w-full text-center flex flex-col gap-1.5 transition-all duration-500 transform ${activeStatIdx === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
              <h3 className="text-[1.05rem] font-semibold text-white">Pan-India Reach</h3>
              <p className="text-xs text-text-secondary">{stats.homepage.premiumScreens} screens operational</p>
            </div>
            {/* Stat 2 */}
            <div className={`absolute w-full text-center flex flex-col gap-1.5 transition-all duration-500 transform ${activeStatIdx === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
              <h3 className="text-[1.05rem] font-semibold text-white">High Cinema Footfall</h3>
              <p className="text-xs text-text-secondary">Connect with thousands of daily viewers</p>
            </div>
            {/* Stat 3 */}
            <div className={`absolute w-full text-center flex flex-col gap-1.5 transition-all duration-500 transform ${activeStatIdx === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
              <h3 className="text-[1.05rem] font-semibold text-white">Next-Generation Cinema Screens</h3>
              <p className="text-xs text-text-secondary">Luxury movie experiences across India</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── SECTION 1: THE CONNPLEX SUITE ── */}
      <section className="bg-bg-dark pt-8 pb-12 md:py-20 px-[4%] sm:px-[6%] border-t-0 md:border-t border-white/5">
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

        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth w-full">
          <div className="flex gap-4 md:gap-6 xl:gap-8 2xl:gap-10 pb-4 w-max min-w-full lg:justify-center px-4 lg:px-0">
            {apps.map((app) => (
              <Link href={app.link || "#"} className="flex flex-col items-center gap-4 cursor-pointer group" key={app.name}>
                <div className="w-[75px] h-[75px] md:w-[90px] md:h-[90px] xl:w-[100px] xl:h-[100px] 2xl:w-[110px] 2xl:h-[110px] rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div
                    className="w-[45px] h-[45px] md:w-[52px] md:h-[52px] xl:w-[58px] xl:h-[58px] 2xl:w-[65px] 2xl:h-[65px] rounded-[14px] md:rounded-[18px] xl:rounded-[20px] 2xl:rounded-[22px] flex items-center justify-center border transition-all duration-300"
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
                <p className="text-[10px] md:text-xs text-text-secondary text-center transition-colors duration-200 group-hover:text-white">{app.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PREMIUM LOUNGERS SLIDESHOW ── */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-end px-[4%] sm:px-[6%] py-12 md:py-20 overflow-hidden bg-bg-dark">
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
              sizes="100vw"
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
          {slide.link && (
            <div className="mt-8">
              <Link href={slide.link} className="bg-white text-black rounded-full px-8 py-3 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105 inline-block">
                {slide.linkText || "Explore"}
              </Link>
            </div>
          )}
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
      <section className="bg-bg-dark px-[4%] sm:px-[6%] pt-12 md:pt-20 pb-0 overflow-x-hidden border-t border-white/5">
        <div className="flex flex-row justify-between items-end gap-6 mb-12 text-left">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[3px] text-primary-gold mb-3 uppercase">OUR PRODUCTS</p>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold text-white leading-tight uppercase font-outfit">
              A platform built <span className="text-text-secondary">for</span><br />
              <span className="text-text-secondary font-bold">every screen</span>
            </h2>
          </div>
          <Link href="/ecosystem" className="mb-2">
            <button className="bg-white text-black rounded-full px-6 py-2.5 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105 whitespace-nowrap">
              Explore More
            </button>
          </Link>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 w-full"
          ref={productsGridRef}
        >
          <div className="relative flex flex-col items-center pt-8 w-full">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">Connflix</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Stream cinema-grade originals.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/connflix">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image src="/connflix_hero_mockup.png" alt="Connflix" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-8 w-full">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">Conntube</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Your channel. Your audience.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/conntube">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image src="/conntube_hero_mockup.png" alt="Conntube" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-8 w-full">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">SpectraX</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Experience beyond the screen.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/spectra-x">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image src="/spectra-x-hero.png" alt="SpectraX" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-8 w-full">
            <p className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 font-outfit uppercase">DownTown</p>
            <p className="text-sm sm:text-[0.95rem] text-text-secondary text-center mb-6">Design for modern crowd.</p>
            <div className="flex items-center gap-5 mb-8">
              <Link href="/downtown">
                <button className="bg-white text-black rounded-full px-6 py-2 text-[0.88rem] font-semibold transition-all duration-200 hover:opacity-85 hover:scale-105">Explore</button>
              </Link>
            </div>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image src="/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png" alt="DownTown" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
          </div>
        </div>

      </section>

      {/* ── SECTION 4: WHY CONNPLEX ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-12 md:py-20 border-t border-white/5" ref={whyRef}>
        <div className="relative w-full md:w-[calc(100%+8%)] md:-ml-[4%] aspect-square md:aspect-[16/8] overflow-hidden mb-20 bg-black flex items-center justify-center rounded-2xl md:rounded-none">
          <div className="absolute inset-0 opacity-60 z-10">
            <Image
              src="/assets/cinema_bg.png"
              alt="Luxury Cinema Background"
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className={`absolute left-1/2 -translate-x-1/2 z-20 w-[60%] md:w-[45%] max-w-[500px] pointer-events-none mix-blend-screen transition-all duration-1000 ease-out [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] ${isWhyVisible ? 'bottom-[-15%] md:bottom-[-20%] translate-y-0 opacity-100' : 'bottom-[-25%] md:bottom-[-30%] translate-y-[100px] opacity-0'}`}>
            <Image
              src="/assets/popcorn.png"
              alt="Popcorn Bucket"
              width={500}
              height={500}
              className="transition-transform duration-100 ease-linear"
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-start text-center z-30 px-6 pt-4 md:pt-8 pb-0 bg-gradient-to-b from-black/50 via-transparent to-black/75">
            <div className="max-w-[800px] w-full">
              <div className="mb-6 flex justify-center drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                <Image src="/logo.png" alt="Connplex Cinemas" width={300} height={100} style={{ objectFit: "contain", height: "auto" }} />
              </div>
              <h3 className="text-white text-[clamp(1.0rem,1.6vw,1.3rem)] font-semibold mb-6 tracking-[1px] font-outfit drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Where cinema becomes an experience.</h3>
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
              <Counter target={getNumeric(stats.homepage.annualFootfall)} isVisible={isWhyVisible} suffix={getSuffix(stats.homepage.annualFootfall)} />
            </span>
            <span className="text-sm text-text-secondary font-normal">Annual Footfall</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">
              <Counter target={getNumeric(stats.homepage.premiumScreens)} isVisible={isWhyVisible} suffix={getSuffix(stats.homepage.premiumScreens)} />
            </span>
            <span className="text-sm text-text-secondary font-normal">Premium Screens</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(1.5rem,4.2vw,2.8rem)] font-bold text-primary-gold leading-tight tracking-tight whitespace-pre-line">{stats.homepage.citiesCovered}</span>
            <span className="text-sm text-text-secondary font-normal">Cities Covered</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-gold leading-none tracking-tight">{stats.homepage.experiencesDelivered}</span>
            <span className="text-sm text-text-secondary font-normal">Cinema Experiences Delivered</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CASE STUDIES ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-12 md:py-32 border-t border-white/5">
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
                  sizes="100vw"
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
      <section className="bg-black px-[4%] sm:px-[6%] py-12 md:py-20 border-t border-white/5">
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
          {liveMovies.slice(0, 3).map((m, idx) => (
            <a
              href={m.link || "https://ticketing.theconnplex.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full max-w-[300px] mx-auto aspect-[2/3] sm:max-w-none rounded-2xl overflow-hidden bg-[#111] border border-white/5 cursor-pointer group block"
              key={`${m.title}-${idx}`}
              role="listitem"
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                unoptimized
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
                  <span
                    className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-primary-gold hover:text-black block text-center opacity-100 sm:opacity-0 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:scale-100"
                  >
                    Book Tickets
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: CREATE TOGETHER ── */}
      <section className="bg-black px-[4%] sm:px-[6%] py-16 md:py-32 text-center relative border-t border-white/5 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[200px] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary-gold before:to-transparent">
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
