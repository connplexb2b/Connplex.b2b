"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Film,
  Sparkles,
  Crown,
  Wine,
  ShieldCheck,
  Users,
  MapPin,
  Star,
  ChevronRight,
  Mail,
  Phone,
  Menu,
  X,
  Utensils,
  Handshake,
  Ticket,
  ShoppingBag,
  Music,
  Rocket,
  Megaphone,
  Award,
  Building2,
  Lock,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Local assets with Unsplash fallbacks
const connplexLogoUrl = "/logo.png";
const uncoreLogoUrl = "/assets/new_uncore_logo.png";
const auditorium1Url = "/auditorium_new.jpg"; 
const auditorium2Url = "/luxury_cinema_lounge.png"; 

const HEADING = "font-display uppercase tracking-[0.02em]";
const EVENT_DATE = new Date("2026-08-27T21:00:00+05:30").getTime();

const SPIDER_LOCATIONS = [
  { name: "Connplex – Parimal Garden, Ahmedabad", time: "9:00 PM", date: "Saturday (1st Aug)" },
  { name: "Connplex – Adani Shantigram, Ahmedabad", time: "9:00 PM", date: "Saturday (1st Aug)" },
  { name: "Connplex – Gota, Ahmedabad", time: "8:00 PM", date: "Saturday (1st Aug)" },
  { name: "Connplex – Gandhinagar", time: "8:00 PM", date: "Saturday (1st Aug)" },
  { name: "Connplex – Vadodara", time: "9:10 PM", date: "Saturday (1st Aug)" },
];

const PREMIER_LOCATIONS = [
  { name: "Connplex Luxuriance – Vaishnodevi", amount: 1500 },
  { name: "Connplex Luxuriance – Rajkot", amount: 1500 },
  { name: "Connplex Luxuriance – Ahilyanagar", amount: 1500 },
  { name: "Connplex Luxuriance – Kankarbagh", amount: 1500 },
  { name: "Connplex Luxuriance – Siwan", amount: 1500, tier3: true },
  { name: "Connplex Luxuriance – Bhagalpur", amount: 1500, tier3: true },
  { name: "Connplex Luxuriance – Vadodara", amount: 1500 },
  { name: "Connplex Luxuriance – MPM Mall", amount: 1500 },
  { name: "Connplex Luxuriance – Muzaffarpur", amount: 1500, tier3: true },
  { name: "Connplex Luxuriance – Tribeca", amount: 1500 },
  { name: "Connplex Luxuriance – Adani Shantigram", amount: 1500 },
  { name: "Connplex Luxuriance – Jajpur", amount: 1500, tier3: true },
  { name: "Connplex Luxuriance – Mundhra", amount: 1000, tier3: true },
  { name: "Connplex Luxuriance – Junagadh", amount: 1100 },
  { name: "Connplex Luxuriance – Darbhnga", amount: 1100, tier3: true },
  { name: "Connplex Luxuriance – Jagdalpur", amount: 1100, tier3: true },
  { name: "Connplex Luxuriance – Phulbani", amount: 1100, tier3: true },
  { name: "Connplex Luxuriance – Mahesana", amount: 1100 },
  { name: "Connplex Luxuriance – Bhikhna pahadi", amount: 1100, tier3: true },
  { name: "Connplex Luxuriance – Jd mall", amount: 1100 },
  { name: "Connplex Luxuriance – Solapur", amount: 1100, tier3: true },
  { name: "Connplex Luxuriance – Balotra", amount: 1500, tier3: true },
  { name: "Connplex Luxuriance – Sangmner", amount: 1000 },
  { name: "Connplex Luxuriance – Prahladnagar", amount: 1000 },
  { name: "Connplex Luxuriance – Biswanath assam", amount: 1000, tier3: true },
  { name: "Connplex Luxuriance – Bilaspur", amount: 1000 },
  { name: "Connplex Luxuriance – Gandhinagar", amount: 1000 },
  { name: "Connplex Luxuriance – Madhubani", amount: 1000, tier3: true },
  { name: "Connplex Luxuriance – SR arcade - bihar", amount: 1000, tier3: true },
];

function useCountdown() {
  const [now, setNow] = useState(() => EVENT_DATE);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  
  const diff = Math.max(0, EVENT_DATE - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  
  return { d, h, m, s, mounted };
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <span className="h-px w-10 bg-gold-gradient" />
      <span className="font-caps text-[11px] font-semibold uppercase tracking-[0.36em] text-[color:var(--color-gold-soft)]">
        {children}
      </span>
      <span className="h-px w-10 bg-gold-gradient" />
    </div>
  );
}

function Navbar({ onBookClick }: { onBookClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  const links = [
    { href: "#top", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#journey", label: "Premiere Journey" },
    { href: "#book", label: "Book Seats" },
    { href: "#host", label: "Host Event" },
  ];
  
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={connplexLogoUrl}
            alt="Connplex Cinemas"
            className="h-10 w-auto md:h-11 rounded"
            onError={(e) => {
              // fallback if local file logo doesn't exist
              e.currentTarget.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=200";
            }}
          />
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (l.href === "#book" && onBookClick) {
                  e.preventDefault();
                  onBookClick();
                }
              }}
              className={`${HEADING} group relative text-[11px] text-white/80 transition hover:text-[color:var(--color-gold-soft)]`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-gradient transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href="#book"
          onClick={(e) => {
            if (onBookClick) {
              e.preventDefault();
              onBookClick();
            }
          }}
          className="hidden lg:inline-flex items-center gap-2 rounded-[14px] bg-gold-gradient px-6 py-2.5 font-caps text-[12px] font-semibold uppercase tracking-[0.16em] text-black shadow-[0_10px_40px_-10px_rgba(212,175,55,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-10px_rgba(212,175,55,0.8)]"
        >
          Book Seats <ChevronRight className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-[color:var(--color-gold)]"
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-black/95 border-t border-white/10">
          <div className="flex flex-col gap-1 px-6 py-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  setOpen(false);
                  if (l.href === "#book" && onBookClick) {
                    e.preventDefault();
                    onBookClick();
                  }
                }}
                className={`${HEADING} py-3 text-xs text-white/85`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={(e) => {
                setOpen(false);
                if (onBookClick) {
                  e.preventDefault();
                  onBookClick();
                }
              }}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-[14px] bg-gold-gradient px-6 py-3 font-caps text-xs font-semibold uppercase tracking-[0.16em] text-black"
            >
              Book Seats
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ onBookClick }: { onBookClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const stats = [
    "70+ Premium Guests",
    "Luxury Hospitality",
    "Red Carpet Experience",
    "Multiple Cities",
  ];
  
  return (
    <section id="top" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={auditorium2Url}
          alt="Connplex Cinemas premium auditorium"
          className="h-full w-full object-cover animate-zoom-out"
          width={1920}
          height={1200}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-gold)]/15 blur-[160px]" />
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/40 bg-black/40 px-5 py-2 font-caps text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--color-gold-soft)]"
        >
          ✨ CONNPLEX EXCLUSIVE
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`${HEADING} max-w-4xl text-2xl leading-[1.15] text-white sm:text-3xl md:text-4xl lg:text-5xl`}
        >
          India's First Cinema Chain
          <br />
          <span className="text-gold-gradient">to Host Exclusive HNI Premiere Nights</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95 }}
          className="mt-8 max-w-2xl font-body text-base font-light leading-[1.9] text-[color:var(--color-champagne)] sm:text-lg"
        >
          At Connplex Cinemas, we don't just premiere movies—we create unforgettable experiences.
          From celebrities and business leaders to influencers and premium guests, our HNI Premiere
          Nights redefine how India celebrates cinema.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-6 font-body text-sm italic text-white/70 sm:text-base"
        >
          An invitation-only experience. Limited seats. Unlimited memories.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10"
        >
          <a
            href="#book"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              }
            }}
            className="group inline-flex items-center gap-3 rounded-[14px] bg-gold-gradient px-10 py-4 font-caps text-[13px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_20px_60px_-15px_rgba(212,175,55,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-15px_rgba(212,175,55,0.9)]"
          >
            Claim Your Seat
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          animate="visible"
          transition={{ delay: 1.5 }}
          className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 + i * 0.1 }}
              className="glass-card px-4 py-5 text-center"
            >
              <div className={`${HEADING} text-xs text-white sm:text-sm`}>{s}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function CountdownSection() {
  const { d, h, m, s, mounted } = useCountdown();
  
  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] py-14 border-y border-white/10">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="font-caps text-[11px] tracking-[0.36em] text-[color:var(--color-gold-soft)] uppercase mb-6">
          THE HNI PREMIERE NIGHT BEGINS IN
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            { label: "Days", val: d },
            { label: "Hours", val: h },
            { label: "Minutes", val: m },
            { label: "Seconds", val: s },
          ].map((item) => (
            <div key={item.label} className="glass-card py-6 px-4 hover:border-[color:var(--color-gold)]/40">
              <span className="font-display text-4xl sm:text-5xl text-gold-gradient tabular-nums block font-bold">
                {mounted ? String(item.val).padStart(2, "0") : "00"}
              </span>
              <span className="font-caps text-[10px] tracking-[0.25em] text-white/50 uppercase mt-2 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0d0d0d] py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-[color:var(--color-gold)]/15 blur-[140px]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="glass-card relative overflow-hidden rounded-3xl p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={auditorium1Url}
                alt="Luxury cinema auditorium prepared for a premiere"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1200}
                height={1500}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-[color:var(--color-gold)]/10 blur-3xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
        >
          <SectionEyebrow>About</SectionEyebrow>
          <h2 className={`${HEADING} text-4xl leading-tight text-white sm:text-5xl md:text-6xl`}>
            The Future of{" "}
            <span className="text-gold-gradient">Movie Premieres</span>
          </h2>
          <div className="mt-8 space-y-6 font-body text-base font-light leading-[1.9] text-[color:var(--color-champagne)] md:text-lg">
            <p>
              Connplex proudly introduced a first-of-its-kind concept in the Indian cinema
              industry—exclusive HNI Premiere Nights.
            </p>
            <p>
              Every event is thoughtfully curated with luxury hospitality, premium dining,
              networking opportunities, entertainment, exclusive merchandise, and the first
              opportunity to experience blockbuster films before the public.
            </p>
            <p>
              Whether it's Ahmedabad, Pune, Hyderabad, Odisha, or Assam, every Connplex premiere is
              designed to become a landmark celebration.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Journey({
  onSelectEvent,
  selectedEvent,
}: {
  onSelectEvent: (event: any) => void;
  selectedEvent: any;
}) {
  const highlights = [
    "70+ Premium Guests",
    "Industry Leaders",
    "Influencers & Media",
    "Exclusive Red Carpet Experience",
    "Premium Hospitality",
    "Luxury Networking",
    "Movie Premiere Celebration",
  ];
  
  return (
    <section id="journey" className="relative bg-[#050505] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <SectionEyebrow>Premiere Journey</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className={`${HEADING} text-4xl leading-tight text-white sm:text-5xl md:text-6xl`}
          >
            <span className="text-gold-gradient">Premiere Journey</span>
          </motion.h2>
        </div>
        <div className="relative mx-auto mt-20 max-w-5xl">
          {/* Gold vertical line */}
          <div className="absolute left-6 top-0 bottom-0 hidden w-px bg-gradient-to-b from-transparent via-[color:var(--color-gold)]/60 to-transparent md:left-8 md:block" />
          <div className="space-y-14">
            {/* CARD 1 — HNI Premiere Night (Upcoming) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9 }}
              className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10"
            >
              <div className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[color:var(--color-gold)]/50 bg-[#0d0d0d] shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)]">
                <Crown className="h-6 w-6 text-[color:var(--color-gold)]" />
              </div>
              <div className="glass-card flex-1 p-8 md:p-10 border-[color:var(--color-gold)]/30 hover:border-[color:var(--color-gold)]/60 hover:-translate-y-1 shadow-[0_15px_45px_-10px_rgba(212,175,55,0.15)]">
                <div className="mb-4">
                  <div className="mb-2 font-caps text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)] animate-pulse">
                    ✨ Upcoming Event · Ticket Sales Open
                  </div>
                  <h3 className={`${HEADING} text-2xl text-white md:text-3xl`}>
                    🎬 HNI Premiere Night
                  </h3>
                </div>
                <div className="mb-6 flex flex-col gap-2 font-body text-sm text-[color:var(--color-champagne)] md:text-base">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold)]" />
                    <span>29 Premium Luxuriance Locations (Vaishnodevi, Rajkot, Vadodara, Adani Shantigram, MPM Mall, Solapur, Bilaspur, and more)</span>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold)]" />
                    <span>Exclusive Pricing: ₹1,000 / ₹1,100 / ₹1,500 per seat (exclusively on this landing page)</span>
                  </div>
                </div>
                <div className="mb-4 font-caps text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]">
                  Standard Event Timings
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="font-caps text-[10px] text-white/50 uppercase">Show Date 1</div>
                    <div className="font-body font-semibold text-white mt-0.5">27 August 2026 (9:00 PM)</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="font-caps text-[10px] text-white/50 uppercase">Show Date 2</div>
                    <div className="font-body font-semibold text-white mt-0.5">28 August 2026 (9:00 PM)</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="font-caps text-[10px] text-white/50 uppercase">Show Date 3</div>
                    <div className="font-body font-semibold text-white mt-0.5">29 August 2026 (9:00 PM)</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="font-caps text-[10px] text-white/50 uppercase">Show Date 4</div>
                    <div className="font-body font-semibold text-white mt-0.5">30 August 2026 (9:00 PM)</div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectEvent({
                    movie: "HNI Premiere Night",
                    location: PREMIER_LOCATIONS[0].name,
                    date: "Thursday (27th Aug)",
                    time: "9:00 PM",
                    amount: PREMIER_LOCATIONS[0].amount,
                  })}
                  className="inline-flex items-center gap-2 rounded-[14px] bg-gold-gradient px-7 py-3 font-caps text-[12px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_15px_45px_-15px_rgba(212,175,55,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-15px_rgba(212,175,55,0.85)] cursor-pointer"
                >
                  Book Now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* CARD 2 — Spider-Man (Completed) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10"
            >
              <div className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[color:var(--color-gold)]/50 bg-[#0d0d0d] shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)]">
                <Star className="h-6 w-6 text-[color:var(--color-gold)]" />
              </div>
              <div className="glass-card flex-1 p-8 md:p-10 hover:border-[color:var(--color-gold)]/50 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="mb-2 font-caps text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]">
                    Event Completed
                  </div>
                  <h3 className={`${HEADING} text-2xl text-white md:text-3xl`}>
                    🕷 Spider-Man Premiere Night
                  </h3>
                </div>
                <div className="mb-6 flex items-start gap-2 font-body text-sm text-[color:var(--color-champagne)] md:text-base">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold)]" />
                  <span>Connplex Cinemas – Parimal, Adani, Gota, Gandhinagar, Vadodara</span>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-7 py-3 font-caps text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Event Completed
                </div>
              </div>
            </motion.div>
            {/* CARD 2 — Odyssey */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-10"
            >
              <div className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[color:var(--color-gold)]/50 bg-[#0d0d0d] shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)]">
                <Film className="h-6 w-6 text-[color:var(--color-gold)]" />
              </div>
              <div className="glass-card flex-1 p-8 md:p-10 hover:border-[color:var(--color-gold)]/50 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="mb-2 font-caps text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]">
                    Successfully Hosted
                  </div>
                  <h3 className={`${HEADING} text-2xl text-white md:text-3xl`}>
                    🎬 Odyssey HNI Premiere Night
                  </h3>
                </div>
                <div className="mb-6 flex items-start gap-2 font-body text-sm text-[color:var(--color-champagne)] md:text-base">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold)]" />
                  <span>Connplex Luxuriance – Adani Shantigram, Ahmedabad</span>
                </div>
                <div className="mb-4 font-caps text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold-soft)]">
                  Experience Highlights
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 font-body text-sm text-white/85"
                    >
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--color-gold)]" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/5 px-7 py-3 font-caps text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Event Completed
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyConnplex() {
  const features: { icon: React.ComponentType<{ className?: string }>; title: string }[] = [
    { icon: Crown, title: "Premium Experience" },
    { icon: Mail, title: "Exclusive Invitations" },
    { icon: Star, title: "Celebrity & Influencer Presence" },
    { icon: Wine, title: "Luxury Hospitality" },
    { icon: Handshake, title: "Networking with Business Leaders" },
    { icon: Utensils, title: "Premium Food & Beverages" },
    { icon: Ticket, title: "Red Carpet Experience" },
    { icon: ShoppingBag, title: "Exclusive Merchandise" },
    { icon: Film, title: "First Day First Show Experience" },
    { icon: Music, title: "Curated Entertainment" },
  ];
  
  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <SectionEyebrow>Why Connplex Premiere Nights?</SectionEyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className={`${HEADING} mx-auto max-w-4xl text-4xl leading-tight text-white sm:text-5xl md:text-6xl`}
          >
            More Than A Movie.{" "}
            <span className="text-gold-gradient">It is an experience.</span>
          </motion.h2>
        </div>
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: (i % 5) * 0.08 }}
              className="glass-card group relative overflow-hidden p-6 hover:-translate-y-1 hover:border-[color:var(--color-gold)]/60 hover:shadow-[0_25px_60px_-20px_rgba(212,175,55,0.35)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-gold)]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-[color:var(--color-gold)]/30 bg-gradient-to-br from-[color:var(--color-gold)]/10 to-transparent">
                <f.icon className="h-5 w-5 text-[color:var(--color-gold)]" />
              </div>
              <h3 className={`${HEADING} text-sm text-white md:text-base`}>{f.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection({
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  isPaying,
  handlePayment,
  selectedEvent,
  setSelectedEvent,
  selectedSeats,
  setSelectedSeats,
  refreshKey,
}: {
  guestName: string;
  setGuestName: (v: string) => void;
  guestEmail: string;
  setGuestEmail: (v: string) => void;
  guestPhone: string;
  setGuestPhone: (v: string) => void;
  isPaying: boolean;
  handlePayment: (e: React.MouseEvent) => void;
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  refreshKey: number;
}) {
  const movies = ["HNI Premiere Night"];
  const currentLocationsList = selectedEvent.movie === "Spider-Man" ? SPIDER_LOCATIONS : PREMIER_LOCATIONS;

  const handleMovieChange = (movieName: string) => {
    if (movieName === "Spider-Man") {
      const loc = SPIDER_LOCATIONS[0];
      setSelectedSeats([]);
      setSelectedEvent({
        movie: "Spider-Man",
        location: loc.name,
        date: loc.date,
        time: loc.time,
        amount: 1000,
      });
    } else {
      const loc = PREMIER_LOCATIONS[0];
      setSelectedSeats([]);
      setSelectedEvent({
        movie: "HNI Premiere Night",
        location: loc.name,
        date: "Thursday (27th Aug)",
        time: "9:00 PM",
        amount: loc.amount,
      });
    }
  };

  const handleLocationChange = (locationName: string) => {
    if (selectedEvent.movie === "Spider-Man") {
      const loc = SPIDER_LOCATIONS.find(l => l.name === locationName);
      if (loc) {
        setSelectedSeats([]);
        setSelectedEvent({
          ...selectedEvent,
          location: loc.name,
          date: loc.date,
          time: loc.time,
          amount: 1000,
        });
      }
    } else {
      const loc = PREMIER_LOCATIONS.find(l => l.name === locationName);
      if (loc) {
        setSelectedSeats([]);
        setSelectedEvent({
          ...selectedEvent,
          location: loc.name,
          amount: loc.amount,
        });
      }
    }
  };

  return (
    <section id="book" className="relative overflow-hidden bg-[#050505] py-28 lg:py-36 border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <SectionEyebrow>Invite-Only Registration</SectionEyebrow>
        <h2 className={`${HEADING} text-4xl leading-tight text-white sm:text-5xl md:text-6xl`}>
          Claim Your <span className="text-gold-gradient">Seat</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto font-body text-base font-light leading-[1.9] text-[color:var(--color-champagne)] md:text-lg">
          {selectedEvent.movie === "The Odyssey" ? (
            <>
              Christopher Nolan's <em className="text-[color:var(--color-gold-soft)]">The Odyssey</em> — an intimate premiere with Damon, Holland, Hathaway, Pattinson, Nyong'o, Zendaya & Theron on screen.
            </>
          ) : selectedEvent.movie === "HNI Premiere Night" ? (
            <>
              Indulge in a premium cinematic experience with the <em className="text-[color:var(--color-gold-soft)]">HNI Premiere Night</em> — an exclusive screening across participating Luxuriance properties.
            </>
          ) : (
            <>
              Experience the web-slinging action with <em className="text-[color:var(--color-gold-soft)]">Spider-Man Premiere Night</em> — an exclusive HNI screening event with luxury hospitality.
            </>
          )}
        </p>
        <p className="mt-4 font-caps text-xs tracking-[0.25em] text-[color:var(--color-gold-soft)] font-semibold uppercase">
          {selectedEvent.date} · {selectedEvent.time} · {selectedEvent.location}
        </p>
        
        {/* Form Container */}
        <div className="glass-card max-w-md mx-auto mt-12 p-8 text-left hover:border-[color:var(--color-gold)]/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
          <div className="space-y-5">
            <div>
              <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">SELECT MOVIE</label>
              <select
                value={selectedEvent.movie}
                onChange={(e) => handleMovieChange(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body cursor-pointer"
              >
                {movies.map((m) => (
                  <option key={m} value={m} className="bg-[#141414] text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">SELECT LOCATION</label>
              <select
                value={selectedEvent.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body cursor-pointer"
              >
                {currentLocationsList.map((loc: any) => (
                  <option key={loc.name} value={loc.name} className="bg-[#141414] text-white">
                    {selectedEvent.movie === "Spider-Man"
                      ? `${loc.name} (${loc.date} @ ${loc.time})`
                      : `${loc.name} (₹${loc.amount.toLocaleString()})`}
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent.movie === "HNI Premiere Night" && (
              <div>
                <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">SELECT DATE & SHOWTIME</label>
                <select
                  value={selectedEvent.date}
                  onChange={(e) => {
                    setSelectedSeats([]);
                    setSelectedEvent({
                      ...selectedEvent,
                      date: e.target.value,
                    });
                  }}
                  className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body cursor-pointer"
                >
                  <option value="Thursday (27th Aug)" className="bg-[#141414] text-white">
                    Thursday (27th Aug) @ 9:00 PM
                  </option>
                  <option value="Friday (28th Aug)" className="bg-[#141414] text-white">
                    Friday (28th Aug) @ 9:00 PM
                  </option>
                  <option value="Saturday (29th Aug)" className="bg-[#141414] text-white">
                    Saturday (29th Aug) @ 9:00 PM
                  </option>
                  <option value="Sunday (30th Aug)" className="bg-[#141414] text-white">
                    Sunday (30th Aug) @ 9:00 PM
                  </option>
                </select>
              </div>
            )}

            {selectedEvent.movie === "HNI Premiere Night" && (
              <div className="text-[11px] text-[color:var(--color-champagne)]/70 bg-white/5 border border-white/10 rounded-lg p-3 mt-1">
                <div className="flex justify-between items-center">
                  <span>Price per seat: <strong className="text-white">₹{selectedEvent.amount.toLocaleString()}</strong></span>
                  <span className="text-[9px] uppercase tracking-wider text-[color:var(--color-gold-soft)] font-semibold">Exclusively HNI</span>
                </div>
                {PREMIER_LOCATIONS.find(l => l.name === selectedEvent.location)?.tier3 && (
                  <div className="mt-2 text-[10px] text-amber-500 font-medium leading-relaxed border-t border-white/5 pt-1.5 flex items-start gap-1">
                    <span className="shrink-0 font-bold">⚠️</span>
                    <span>Pricing for this Tier-3 location is subject to final market feasibility review.</span>
                  </div>
                )}
              </div>
            )}

            {/* SEATING LAYOUT */}
            {(() => {
              const [layoutRows, setLayoutRows] = React.useState<any[] | null>(null);
              const [isLoadingLayout, setIsLoadingLayout] = React.useState(false);

              React.useEffect(() => {
                let active = true;
                if (!selectedEvent.location) {
                  setLayoutRows(null);
                  return;
                }

                async function loadLayout() {
                  setIsLoadingLayout(true);
                  try {
                    const res = await fetch(`/api/proxy-layout?location=${encodeURIComponent(selectedEvent.location)}&movie=${encodeURIComponent(selectedEvent.movie)}&date=${encodeURIComponent(selectedEvent.date)}&time=${encodeURIComponent(selectedEvent.time)}&t=${Date.now()}`, { cache: 'no-store' });
                    if (res.ok) {
                      const data = await res.json();
                      if (active) {
                        if (!data.fallback && data.layout) {
                          setLayoutRows(data.layout);
                        } else {
                          setLayoutRows(null);
                        }
                      }
                    } else {
                      if (active) setLayoutRows(null);
                    }
                  } catch (e) {
                    if (active) setLayoutRows(null);
                  } finally {
                    if (active) setIsLoadingLayout(false);
                  }
                }

                loadLayout();
                return () => {
                  active = false;
                };
              }, [selectedEvent.location, selectedEvent.movie, selectedEvent.date, selectedEvent.time, refreshKey]);

              // Deterministically generate booked seats based on location name (Fallback Layout)
              const bookedSeats = React.useMemo(() => {
                const booked = new Set<string>();
                if (!selectedEvent.location) return booked;
                const seed = selectedEvent.location.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                const rList = ["A", "B", "C", "D", "E", "F"];
                for (let r = 0; r < rList.length; r++) {
                  for (let s = 1; s <= 10; s++) {
                    const seatId = `${rList[r]}${s}`;
                    const val = (seed * (r + 1) * (s + 3) + s * 17) % 100;
                    if (val < 45) {
                      booked.add(seatId);
                    }
                  }
                }
                return booked;
              }, [selectedEvent.location]);

              const fallbackRows = ["A", "B", "C", "D", "E", "F"];
              const fallbackCols = [1, 2, "aisle", 3, 4, 5, 6, 7, 8, "aisle", 9, 10];

              const handleSeatClick = (seatId: string, isBooked: boolean) => {
                if (isBooked) return;
                if (selectedSeats.includes(seatId)) {
                  setSelectedSeats(selectedSeats.filter((s: string) => s !== seatId));
                } else {
                  if (selectedSeats.length >= 10) {
                    alert("You can select up to 10 seats per booking.");
                    return;
                  }
                  setSelectedSeats([...selectedSeats, seatId]);
                }
              };

              return (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-4 font-medium uppercase text-center">
                    Select Seats
                  </label>

                  {isLoadingLayout ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
                      <span className="text-[9px] font-caps tracking-widest text-[color:var(--color-gold-soft)] uppercase animate-pulse">Loading Live Layout...</span>
                    </div>
                  ) : (
                    <div className="bg-white text-black rounded-xl p-4 sm:p-6 shadow-inner border border-white/10">
                      {layoutRows ? (
                        <div className="overflow-x-auto w-full py-2">
                          <div className="inline-flex flex-col items-center min-w-full gap-2.5 select-none">
                            {(() => {
                              let lastCategory = "";
                              return layoutRows.map((row) => {
                                const showCategoryHeader = row.category && row.category !== lastCategory;
                                if (row.category) lastCategory = row.category;

                                return (
                                  <React.Fragment key={row.rowName}>
                                    {showCategoryHeader && (
                                      <div className="w-full text-left pl-2 mt-4 mb-2 border-b border-black/10 pb-1">
                                        <span className="text-[10px] font-bold text-black/60 uppercase tracking-wider">
                                          {row.category} - ₹{selectedEvent.amount.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5 min-w-max">
                                      <span className="w-5 text-[10px] text-black/40 font-bold font-caps text-center">{row.rowName}</span>
                                      {row.seats.map((seat: any, idx: number) => {
                                        if (seat.isAisle) {
                                          return <div key={`aisle-${idx}`} className="w-4" />;
                                        }
                                        const isSelected = selectedSeats.includes(seat.seatId);
                                        
                                        return (
                                          <button
                                            key={seat.seatId}
                                            type="button"
                                            disabled={seat.isBooked}
                                            onClick={() => handleSeatClick(seat.seatId, seat.isBooked)}
                                            className={`h-6 w-6 rounded-[3px] text-[8px] font-semibold flex items-center justify-center border transition-all ${
                                              seat.isBooked
                                                ? "bg-[#e4e4e4] border-[#e4e4e4] text-black/15 cursor-not-allowed"
                                                : isSelected
                                                ? "bg-[#4abd5d] border-[#4abd5d] text-white shadow-[0_2px_8px_rgba(74,189,93,0.4)]"
                                                : "bg-white border-[#4abd5d]/45 text-[#4abd5d] hover:bg-[#4abd5d] hover:text-white hover:border-[#4abd5d]"
                                            }`}
                                            title={`${seat.seatId} ${seat.isBooked ? "(Booked)" : isSelected ? "(Selected)" : "(Available)"}`}
                                          >
                                            {seat.seatNumber}
                                          </button>
                                        );
                                      })}
                                      <span className="w-5 text-[10px] text-black/40 font-bold font-caps text-center">{row.rowName}</span>
                                    </div>
                                  </React.Fragment>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto w-full py-2">
                          <div className="inline-flex flex-col items-center min-w-full gap-2.5 select-none">
                            <div className="w-full text-left pl-2 mt-2 mb-2 border-b border-black/10 pb-1">
                              <span className="text-[10px] font-bold text-black/60 uppercase tracking-wider">
                                Premium Recliner - ₹{selectedEvent.amount.toLocaleString("en-IN")}
                              </span>
                            </div>
                            {fallbackRows.map((row) => (
                              <div key={row} className="flex items-center gap-1.5 min-w-max">
                                <span className="w-5 text-[10px] text-black/40 font-bold font-caps text-center">{row}</span>
                                {fallbackCols.map((col, idx) => {
                                  if (col === "aisle") {
                                    return <div key={`aisle-${idx}`} className="w-4" />;
                                  }
                                  const seatId = `${row}${col}`;
                                  const isBooked = bookedSeats.has(seatId);
                                  const isSelected = selectedSeats.includes(seatId);
                                  
                                  return (
                                    <button
                                      key={seatId}
                                      type="button"
                                      disabled={isBooked}
                                      onClick={() => handleSeatClick(seatId, isBooked)}
                                      className={`h-6 w-6 rounded-[3px] text-[8px] font-semibold flex items-center justify-center border transition-all ${
                                        isBooked
                                          ? "bg-[#e4e4e4] border-[#e4e4e4] text-black/15 cursor-not-allowed"
                                          : isSelected
                                          ? "bg-[#4abd5d] border-[#4abd5d] text-white shadow-[0_2px_8px_rgba(74,189,93,0.4)]"
                                          : "bg-white border-[#4abd5d]/45 text-[#4abd5d] hover:bg-[#4abd5d] hover:text-white hover:border-[#4abd5d]"
                                      }`}
                                      title={`${seatId} ${isBooked ? "(Booked)" : isSelected ? "(Selected)" : "(Available)"}`}
                                    >
                                      {col}
                                    </button>
                                  );
                                })}
                                <span className="w-5 text-[10px] text-black/40 font-bold font-caps text-center">{row}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BookMyShow Screen at the bottom */}
                      <div className="w-full flex flex-col items-center mt-8 border-t border-black/5 pt-6">
                        <div className="w-3/5 relative h-3 mb-1">
                          <div className="absolute inset-0 border-t-2 border-black/20 rounded-[50%/8px_8px_0_0]" />
                        </div>
                        <span className="text-[9px] font-sans tracking-[0.3em] text-black/35 uppercase font-medium">All eyes this way</span>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 mt-6 text-[10px] font-sans tracking-wide text-black/60 font-medium border-t border-black/5 pt-4">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-[2px] border border-[#4abd5d]/45 bg-white text-[#4abd5d]" />
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-[2px] bg-[#4abd5d]" />
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-[2px] bg-[#e4e4e4]" />
                          <span>Sold</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seating Summary */}
                  {selectedSeats.length > 0 && (
                    <div className="mt-5 rounded-lg bg-[color:var(--color-gold)]/5 border border-[color:var(--color-gold)]/20 p-3 text-center">
                      <div className="text-[10px] font-caps tracking-wider text-[color:var(--color-champagne)]">
                        Selected Seats: <span className="font-bold text-white uppercase">{selectedSeats.join(", ")}</span>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[color:var(--color-gold-soft)]">
                        Total Price: ₹{(selectedSeats.length * selectedEvent.amount).toLocaleString("en-IN")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <div>
              <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">FULL NAME</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Gaurav Kumar"
                className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white placeholder-white/30 focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body"
                required
              />
            </div>
            <div>
              <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">EMAIL ADDRESS</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="gaurav.kumar@example.com"
                className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white placeholder-white/30 focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body"
                required
              />
            </div>
            <div>
              <label className="block font-caps text-[10px] tracking-[0.2em] text-[color:var(--color-champagne)] mb-2 font-medium">CONTACT NUMBER</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="9999999999"
                className="w-full bg-[#050505] border border-white/10 px-4 py-3 text-sm rounded-[10px] text-white placeholder-white/30 focus:outline-none focus:border-[color:var(--color-gold)] transition-colors font-body"
                required
              />
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isPaying || selectedSeats.length === 0}
              className="w-full mt-8 inline-flex items-center justify-center gap-2 rounded-[14px] bg-gold-gradient py-4 font-caps text-[13px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_15px_45px_-15px_rgba(212,175,55,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_-15px_rgba(212,175,55,0.85)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPaying ? "Processing..." : selectedSeats.length > 0 ? `Book Now - ₹${(selectedSeats.length * selectedEvent.amount).toLocaleString()}` : "Select Seats to Book"}
            </button>
          </div>
        </div>
        
        <p className="mt-8 font-caps text-[11px] tracking-[0.28em] text-white/50 uppercase">Only 70 invitations available per event</p>
        <p className="mt-2 font-caps text-[11px] tracking-[0.28em] text-white/50 uppercase">First Come. First Served.</p>
      </div>
    </section>
  );
}

function HostWithConnplex({ onBookClick }: { onBookClick?: () => void }) {
  const cards: { icon: React.ComponentType<{ className?: string }>; title: string }[] = [
    { icon: Film, title: "Movie Premieres" },
    { icon: Rocket, title: "Corporate Launches" },
    { icon: Lock, title: "Private Screenings" },
    { icon: Megaphone, title: "Brand Activations" },
    { icon: Users, title: "Influencer Events" },
    { icon: ShoppingBag, title: "Product Launches" },
    { icon: Award, title: "Award Nights" },
  ];
  
  return (
    <section
      id="host"
      className="relative overflow-hidden bg-gradient-to-b from-[#050505] via-[#0d0d0d] to-[#050505] py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionEyebrow>Host With Connplex</SectionEyebrow>
          <h2 className={`${HEADING} text-4xl leading-tight text-white sm:text-5xl md:text-6xl`}>
            Host With <span className="text-gold-gradient">Connplex</span>
          </h2>
          <p className={`${HEADING} mt-8 text-base text-white/85 sm:text-lg md:text-xl`}>
            Want To Host Your Brand Launch, Movie Premiere or Corporate Event?
          </p>
          <p className="mt-6 font-body text-base font-light leading-[1.9] text-[color:var(--color-champagne)] md:text-lg">
            Connplex offers premium cinema spaces for
          </p>
        </motion.div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: (i % 4) * 0.08 }}
              className="glass-card group p-7 text-center hover:-translate-y-1 hover:border-[color:var(--color-gold)]/60 hover:shadow-[0_25px_60px_-20px_rgba(212,175,55,0.35)]"
            >
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-xl border border-[color:var(--color-gold)]/30 bg-gradient-to-br from-[color:var(--color-gold)]/10 to-transparent">
                <c.icon className="h-6 w-6 text-[color:var(--color-gold)]" />
              </div>
              <h3 className={`${HEADING} text-base text-white`}>{c.title}</h3>
            </motion.div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a
            href="#book"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              }
            }}
            className="inline-flex items-center gap-3 rounded-[14px] bg-gold-gradient px-10 py-4 font-caps text-[13px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_20px_60px_-15px_rgba(212,175,55,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-15px_rgba(212,175,55,0.9)]"
          >
            Book An Event <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onBookClick }: { onBookClick?: () => void }) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#050505] py-28 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-0">
        <img
          src={auditorium2Url}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-20"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/80 to-[#050505]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-gold)]/12 blur-[160px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        className="relative mx-auto max-w-4xl px-6 text-center"
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-gold-gradient" />
          <Crown className="h-5 w-5 text-[color:var(--color-gold)]" />
          <span className="h-px w-16 bg-gold-gradient" />
        </div>
        <h2 className={`${HEADING} text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl`}>
          The Next Premiere Could Be <span className="text-gold-gradient">Yours.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl font-body text-base font-light leading-[1.9] text-[color:var(--color-champagne)] md:text-lg">
          Whether you're a movie lover, brand partner, or corporate client, Connplex HNI Premiere
          Nights offer an unmatched cinematic experience.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#book"
            onClick={(e) => {
              if (onBookClick) {
                e.preventDefault();
                onBookClick();
              }
            }}
            className="inline-flex items-center gap-3 rounded-[14px] bg-gold-gradient px-9 py-4 font-caps text-[13px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_20px_60px_-15px_rgba(212,175,55,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-15px_rgba(212,175,55,0.9)]"
          >
            Explore Upcoming Events <ChevronRight className="h-4 w-4" />
          </a>
          <a
            href="#host"
            className="inline-flex items-center gap-3 rounded-[14px] border border-[color:var(--color-gold)]/50 bg-black/40 px-9 py-4 font-caps text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-gold-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-gold)] hover:bg-[color:var(--color-gold)]/10"
          >
            Partner With Connplex
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={connplexLogoUrl}
                alt="Connplex Cinemas"
                className="h-11 w-auto rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=200";
                }}
              />
            </div>
            <p className="mt-6 max-w-md font-body text-sm leading-[1.9] text-[color:var(--color-champagne)]">
              India's first cinema chain to host exclusive HNI Premiere Nights — where luxury,
              cinema and community meet.
            </p>
          </div>
          <div>
            <div className={`${HEADING} mb-5 text-[11px] tracking-[0.28em] text-[color:var(--color-gold-soft)]`}>
              Reach Us
            </div>
            <ul className="space-y-3 font-body text-sm text-white/75">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[color:var(--color-gold)]" /> ankita@theconnplex.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[color:var(--color-gold)]" /> +91 92279 81125
              </li>
            </ul>
          </div>
          <div>
            <div className={`${HEADING} mb-5 text-[11px] tracking-[0.28em] text-[color:var(--color-gold-soft)]`}>
              Follow
            </div>
            <ul className="space-y-3 font-body text-sm text-white/75">
              <li className="flex items-center gap-3">
                <InstagramIcon className="h-4 w-4 text-[color:var(--color-gold)]" /> @connplex.cinemas
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[color:var(--color-gold)]" /> Invitation only
              </li>
            </ul>
          </div>
        </div>
        <div className="gold-divider mt-12" />
        <div className="mt-8 flex flex-col items-center justify-between gap-3 font-caps text-[11px] text-white/50 md:flex-row">
          <div className="uppercase tracking-[0.28em]">© {new Date().getFullYear()} Connplex Cinemas</div>
          <div className="uppercase tracking-[0.28em]">HNI Premiere Nights</div>
        </div>
      </div>
    </footer>
  );
}

function RecommendedEvents({
  onSelectEvent
}: {
  onSelectEvent: (event: any) => void;
}) {
  const events = [
    {
      movie: "HNI Premiere Night",
      poster: "/movies/hni_premiere_night_poster.png",
      status: "TICKETS OPEN",
      statusColor: "bg-[#DF1827]",
      rating: "9.8",
      votes: "5.2K+ Votes",
      genre: "Premium Red Carpet / Multi-City",
      isUpcoming: true,
      amount: PREMIER_LOCATIONS[0].amount,
      location: PREMIER_LOCATIONS[0].name,
      date: "Thursday (27th Aug)",
      time: "9:00 PM"
    },
    {
      movie: "Spider-Man",
      poster: "/movies/spiderman_ticketing.png",
      status: "COMPLETED",
      statusColor: "bg-white/20 backdrop-blur-md",
      rating: "9.5",
      votes: "3.1K+ Votes",
      genre: "Action / Sci-Fi / Adventure",
      isUpcoming: false
    },
    {
      movie: "The Odyssey",
      poster: "/assets/odyssey-poster.jpg",
      status: "COMPLETED",
      statusColor: "bg-white/20 backdrop-blur-md",
      rating: "9.2",
      votes: "2.4K+ Votes",
      genre: "Sci-Fi / Space / Drama",
      isUpcoming: false
    }
  ];

  const handleCardClick = (e: any) => {
    if (e.isUpcoming) {
      onSelectEvent({
        movie: e.movie,
        location: e.location,
        date: e.date,
        time: e.time,
        amount: e.amount
      });
    } else {
      alert(`The ${e.movie} HNI Premiere Night event has been successfully completed and is closed for bookings.`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 lg:py-28 border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-12 text-left">
          <h2 className={`${HEADING} text-3xl font-bold text-white tracking-wide`}>
            Recommended Events
          </h2>
          <p className="mt-2 font-body text-sm font-light text-[color:var(--color-champagne)]/60">
            Book live premiere tickets or explore past premium cinema events
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {events.map((e) => (
            <div
              key={e.movie}
              onClick={() => handleCardClick(e)}
              className="group cursor-pointer flex flex-col text-left"
            >
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] bg-[#111]">
                <img
                  src={e.poster}
                  alt={e.movie}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                
                {/* BMS Status Badge */}
                <div className={`absolute top-3 right-3 text-[10px] font-bold text-white px-2.5 py-1 rounded-[4px] uppercase tracking-wider ${e.statusColor}`}>
                  {e.status}
                </div>

                {/* Hover Play/Book Icon Overlay */}
                {e.isUpcoming && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="rounded-xl bg-gold-gradient text-black font-caps text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 shadow-[0_10px_30px_rgba(212,175,55,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Book Now
                    </span>
                  </div>
                )}

                {/* BMS Rating Overlay Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/85 px-4 py-2.5 flex items-center justify-between text-xs text-white border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <span className="text-[#DF1827] text-sm font-bold">★</span>
                    <span className="font-bold text-white">{e.rating}</span>
                    <span className="text-white/45">/10</span>
                  </div>
                  <span className="text-white/70 font-semibold">{e.votes}</span>
                </div>
              </div>

              {/* Title & Genre below poster */}
              <h3 className="mt-4 font-body font-bold text-lg text-white group-hover:text-[color:var(--color-gold-soft)] transition-colors line-clamp-1">
                {e.movie === "Spider-Man" ? "Spider-Man Premiere Night" : e.movie === "The Odyssey" ? "Odyssey HNI Premiere Night" : e.movie}
              </h3>
              <p className="mt-1 font-body text-xs text-white/50">
                {e.genre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PremiereLuxeLanding() {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    movie: "HNI Premiere Night",
    location: PREMIER_LOCATIONS[0].name,
    date: "Thursday (27th Aug)",
    time: "9:00 PM",
    amount: PREMIER_LOCATIONS[0].amount,
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill in all registration fields.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Razorpay payment gateway is loading. Please try again in a moment.");
      return;
    }

    setIsPaying(true);
    try {
      // 1. Create order on the Next.js API endpoint
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedSeats.length * selectedEvent.amount }), // Dynamic Amount based on selected seats count
      });
      const orderData = await res.json();

      if (!res.ok || !orderData.id) {
        alert(`Failed to initiate order. Details: ${orderData.details || orderData.error || "Please try again."}`);
        setIsPaying(false);
        return;
      }

      // 2. Configure checkout configuration options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Connplex Cinemas",
        description: `HNI Premier Night Registration - ${selectedEvent.movie}`,
        image: uncoreLogoUrl,
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Send payment signature details to backend for verification
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              guestName,
              guestEmail,
              guestPhone,
              amount: selectedSeats.length * selectedEvent.amount,
              movie: selectedEvent.movie,
              location: selectedEvent.location,
              date: selectedEvent.date,
              time: selectedEvent.time,
              seats: selectedSeats,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.status === "success") {
            alert("Booking & Payment Successful! We will contact you shortly with your digital invitation.");
            setGuestName("");
            setGuestEmail("");
            setGuestPhone("");
            setSelectedSeats([]);
            setRefreshKey(prev => prev + 1);
          } else {
            alert("Payment Verification Failed! Please check with your bank.");
          }
          setIsPaying(false);
        },
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone,
        },
        theme: {
          color: "#d4af37", // Custom gold theme color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed! Error description: ${response.error.description}`);
        setIsPaying(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay payment transaction setup failed:", error);
      alert("Payment transaction initialization error.");
      setIsPaying(false);
    }
  };

  const selectEventHandler = (event: any) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setShowBookingForm(true);
    setTimeout(() => {
      const bookSection = document.getElementById("book");
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleShowBooking = () => {
    setShowBookingForm(true);
    setTimeout(() => {
      const bookSection = document.getElementById("book");
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[color:var(--color-gold)] selection:text-black">
      {/* Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <Navbar onBookClick={handleShowBooking} />
      <main>
        <Hero onBookClick={handleShowBooking} />
        <CountdownSection />
        <RecommendedEvents onSelectEvent={selectEventHandler} />
        <Journey onSelectEvent={selectEventHandler} selectedEvent={selectedEvent} />
        <About />
        <WhyConnplex />
        {showBookingForm && (
          <BookingSection
            guestName={guestName}
            setGuestName={setGuestName}
            guestEmail={guestEmail}
            setGuestEmail={setGuestEmail}
            guestPhone={guestPhone}
            setGuestPhone={setGuestPhone}
            isPaying={isPaying}
            handlePayment={handlePayment}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            refreshKey={refreshKey}
          />
        )}
        <HostWithConnplex onBookClick={handleShowBooking} />
        <FinalCTA onBookClick={handleShowBooking} />
      </main>
      <Footer />
    </div>
  );
}
