"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/gameplex/Reveal";
import { CTABand } from "@/components/gameplex/CTABand";
import { formats, pillars } from "@/lib/gameplex-data";
import {
  Gamepad2,
  CircleDot,
  Joystick,
  Martini,
  PartyPopper,
  Sparkles,
  Users,
  Compass,
  ArrowUpRight,
} from "lucide-react";

export default function GameplexHomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const tomorrowVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.playbackRate = 0.55;
    }
    if (tomorrowVideoRef.current) {
      tomorrowVideoRef.current.playbackRate = 0.7;
    }
  }, []);

  // Category strip items
  const categories = [
    { label: "Gaming", icon: Gamepad2 },
    { label: "Bowling", icon: CircleDot },
    { label: "Activities", icon: Joystick },
    { label: "Dining & Bar", icon: Martini },
    { label: "Events", icon: PartyPopper },
  ];

  // See It In Motion Videos
  const motionVideos = [
    {
      src: "/assets/gameplex/vid-bowling-lux.mp4",
      title: "Bowling",
      desc: "VIP lanes, up to 16",
    },
    {
      src: "/assets/gameplex/vid-gokart-race.mp4",
      title: "Go-Karting & Arcade",
      desc: "Indoor track + 100 games",
    },
    {
      src: "/assets/gameplex/vid-dining.mp4",
      title: "Dining & Bar",
      desc: "Kitchen, café & cocktails",
    },
  ];

  // Gallery items (gal-1.jpg to gal-8.jpg)
  const galleryPhotos = [
    { src: "/assets/gameplex/gal-4.jpg", title: "VR Arena" },
    { src: "/assets/gameplex/gal-2.jpg", title: "Bar & Lounge" },
    { src: "/assets/gameplex/gal-3.jpg", title: "Birthday Parties" },
    { src: "/assets/gameplex/gal-7.jpg", title: "Racing Sims" },
    { src: "/assets/gameplex/gal-1.jpg", title: "Kids Zone" },
    { src: "/assets/gameplex/gal-6.jpg", title: "Restaurant" },
    { src: "/assets/gameplex/gal-5.jpg", title: "Corporate Events" },
    { src: "/assets/gameplex/gal-8.jpg", title: "Live Events" },
  ];

  // Never Sleeps tag pills
  const tags = [
    "Morning coffee",
    "Afternoon family outings",
    "Evening bowling",
    "Late-night gaming",
    "Weekend birthdays",
    "Corporate events",
    "School groups",
    "Festival celebrations",
  ];

  return (
    <div className="relative font-sans bg-[oklch(0.07_0.004_60)] overflow-x-hidden">
      {/* SECTION A: HeroVideo (100svh) */}
      <section className="relative h-[100svh] w-full overflow-hidden bg-black">
        {/* Slow walkthrough background video */}
        <video
          ref={heroVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          onError={(e) => {
            // If the video fails to load, gracefully display a beautiful dark luxury placeholder
            e.currentTarget.style.display = "none";
            const fallback = document.getElementById("hero-fallback");
            if (fallback) fallback.classList.remove("hidden");
          }}
        >
          <source src="/assets/gameplex/vid-hero-luxury.mp4" type="video/mp4" />
        </video>

        {/* Hero Video Fallback Background */}
        <div
          id="hero-fallback"
          className="hidden absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#050505] to-[#120d03] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        </div>

        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.004_60)] via-black/30 to-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/20 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 flex h-full flex-col justify-end pb-24 sm:pb-32 px-5 sm:px-10 max-w-[1800px] mx-auto">
          <Reveal>
            <span className="eyebrow block mb-4">A Connplex Initiative</span>
            <h1 className="max-w-5xl text-4xl font-extrabold sm:text-7xl md:text-8xl tracking-tight leading-none text-white font-sora">
              Socializing, <br />
              <span className="text-gold-gradient">Elevated.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-base sm:text-xl leading-relaxed">
              India's premier luxury multi-entertainment destination. Fusing high-end socializing, gourmet hospitality, and state-of-the-art interactive gaming.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-primary px-8 py-4 font-bold text-center text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              >
                Inquire Franchise
              </Link>
              <Link
                href="/experiences"
                className="rounded-full border border-white/20 hover:border-primary/50 bg-black/40 backdrop-blur-md px-8 py-4 font-bold text-center text-white transition-all hover:scale-105"
              >
                Explore Zones
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION B: Category strip */}
      <section className="relative z-20 -mt-10 mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="rounded-2xl border border-border/80 bg-black/80 backdrop-blur-xl py-6 px-6 sm:px-12 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-between">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  href="/experiences"
                  className="flex items-center space-x-3 p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/40 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold tracking-wider text-white group-hover:text-primary transition-colors">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C: "See It In Motion" */}
      <section className="py-24 px-5 sm:px-10 max-w-[1800px] mx-auto">
        <div className="mb-16 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <Reveal>
            <span className="eyebrow block mb-3">Live the Vibe</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-sora text-white">
              See It In <span className="text-gold-gradient">Motion</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed">
              Step inside our luxury zones designed for guests who command the finer details.
            </p>
          </Reveal>
        </div>

        {/* 3 Video Cards Grid (4:3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {motionVideos.map((video, idx) => (
            <Reveal key={video.title} delay={idx * 0.1}>
              <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-secondary/10 shadow-2xl aspect-[4/3]">
                {/* Fallback Graphic behind the video */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-black/90 flex flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="h-8 w-8 text-primary/30 mb-2" />
                  <span className="font-semibold text-white/60">{video.title}</span>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover z-10 transition-transform duration-700 group-hover:scale-105 opacity-85"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20" />
                <div className="absolute bottom-5 left-5 right-5 z-30">
                  <h3 className="text-lg font-bold font-sora text-white">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{video.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 8 Photo Grid (4:5) */}
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {galleryPhotos.map((photo, idx) => (
              <div
                key={photo.title}
                className="group relative overflow-hidden rounded-lg border border-border/40 aspect-[4/5] bg-secondary/20 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".photo-fallback");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <div className="photo-fallback hidden absolute inset-0 bg-gradient-to-br from-secondary/50 to-black/90 flex items-center justify-center p-4">
                  <Compass className="h-6 w-6 text-primary/30" />
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-xs font-semibold text-white/90 font-outfit uppercase tracking-wider">
                    {photo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SECTION D: Formats */}
      <section className="py-24 border-t border-border/40 bg-black/20">
        <div className="mx-auto max-w-[1800px] px-5 sm:px-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Reveal>
              <span className="eyebrow block mb-3">Modular Growth</span>
              <h2 className="text-3xl sm:text-5xl font-bold font-sora text-white">
                Franchise <span className="text-gold-gradient">Formats</span>
              </h2>
              <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
                Scale your presence with layouts matched to municipal footprints and demographic catchments.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {formats.map((fmt, idx) => (
              <Reveal key={fmt.code} delay={idx * 0.1}>
                <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-secondary/15 transition-all duration-500 hover:border-primary/50 shadow-2xl flex flex-col h-full">
                  {/* Image Header with scale effect */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <img
                      src={fmt.image}
                      alt={fmt.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement?.querySelector(".fmt-fallback");
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                    <div className="fmt-fallback hidden absolute inset-0 bg-gradient-to-br from-secondary/50 to-black/90 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary/20" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary font-outfit">
                        {fmt.code}
                      </span>
                      <h3 className="text-xl font-bold font-sora text-white mt-2 leading-snug">
                        {fmt.tagline}
                      </h3>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-8 pt-6 border-t border-border/40 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Area</span>
                        <p className="font-bold text-white font-sora mt-0.5">{fmt.area}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Investment</span>
                        <p className="font-bold text-white font-sora mt-0.5">{fmt.investment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E: Pillars */}
      <section className="py-24 border-t border-border/40">
        <div className="mx-auto max-w-[1800px] px-5 sm:px-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Reveal>
              <span className="eyebrow block mb-3">Investor Security</span>
              <h2 className="text-3xl sm:text-5xl font-bold font-sora text-white">
                The Pillars of <span className="text-gold-gradient">Growth</span>
              </h2>
              <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
                Why developers choose GamePlex to anchor commercial projects and retail centers.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pl, idx) => (
              <Reveal key={pl.title} delay={idx * 0.05}>
                <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-secondary/10 p-8 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-semibold text-muted-foreground tracking-widest font-outfit uppercase">
                        {pl.n}
                      </span>
                      <span className="text-[10px] font-bold text-white bg-secondary border border-border/80 rounded-full px-3 py-1 font-outfit uppercase tracking-wider">
                        {pl.stat}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-sora text-white mb-3">
                      {pl.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pl.copy}
                    </p>
                  </div>

                  {/* Visual Background hint */}
                  <div className="mt-6 aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/40 relative">
                    <img
                      src={pl.image}
                      alt={pl.imageAlt}
                      className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: "Never Sleeps" (90svh) */}
      <section className="relative h-[90svh] w-full overflow-hidden bg-black">
        {/* Full-width image background */}
        <img
          src="/assets/gameplex/gameplex-luxury-bg.jpg"
          alt="GamePlex luxury environment never sleeps"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = document.getElementById("never-sleeps-fallback");
            if (fallback) fallback.classList.remove("hidden");
          }}
        />
        {/* Fallback container */}
        <div
          id="never-sleeps-fallback"
          className="hidden absolute inset-0 bg-gradient-to-br from-black via-secondary/40 to-black flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_80%)]" />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.004_60)] via-black/20 to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 z-10" />

        {/* Content Centered */}
        <div className="relative z-20 flex h-full flex-col justify-center px-5 sm:px-10 max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="eyebrow block mb-4">Round the clock demand</span>
            <h2 className="text-4xl sm:text-6xl font-bold font-sora text-white leading-tight">
              An Asset That <br />
              <span className="text-gold-gradient">Never Sleeps</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Engineered with multiple social, gaming, and dining triggers to capture different demographic spend segments from morning to late night.
            </p>

            {/* Tag Pills Overlay */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 hover:border-primary/40 bg-black/60 px-5 py-2 text-xs font-semibold tracking-wider text-white/90 hover:text-white transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION G: "Built for Today" (80svh) */}
      <section className="relative h-[80svh] w-full overflow-hidden bg-black border-y border-border/40">
        <video
          ref={tomorrowVideoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = document.getElementById("built-fallback");
            if (fallback) fallback.classList.remove("hidden");
          }}
        >
          <source src="/assets/gameplex/vid-tomorrow.mp4" type="video/mp4" />
        </video>
        {/* Video Fallback */}
        <div
          id="built-fallback"
          className="hidden absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#101010] to-[#0d0903]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.004_60)] via-black/20 to-black/60 z-10" />

        {/* Centered text overlay */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-5 sm:px-10 max-w-4xl mx-auto">
          <Reveal>
            <span className="eyebrow block mb-4">Engineered for Tomorrow</span>
            <h2 className="text-3xl sm:text-5xl font-bold font-sora text-white leading-tight">
              Built for Today, <br />
              <span className="text-gold-gradient">Designed for the Future</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Integrated booking systems, real-time yield optimization, and game catalogs updated overnight via automated pipelines.
            </p>
            <div className="mt-8">
              <Link
                href="/franchise"
                className="inline-flex items-center space-x-2 rounded-full border border-primary/30 hover:border-primary/60 bg-black/70 hover:bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary transition-all"
              >
                <span>Read Technology Roadmap</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION H: Philosophy */}
      <section className="py-24 px-5 sm:px-10 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Column 1: Image philosophy-1-clean.jpg */}
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border/40 bg-secondary/20 shadow-xl relative">
            <img
              src="/assets/gameplex/philosophy-1-clean.jpg"
              alt="GamePlex design philosophy interior details"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Column 2: Centered Text & CTA */}
          <div className="text-center space-y-6 px-4">
            <Reveal>
              <span className="eyebrow block">Our Values</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-sora text-white">
                Our Experience <br />
                <span className="text-gold-gradient">Philosophy</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We believe premium entertainment isn't just about games; it's about the connections formed between them. Every corner, lighting temperature, and menu recipe is calibrated to design the perfect social circle.
              </p>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground"
                >
                  Join Us
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Column 3: Image philosophy-2.jpg */}
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border/40 bg-secondary/20 shadow-xl relative">
            <img
              src="/assets/gameplex/philosophy-2.jpg"
              alt="GamePlex customer social interaction philosophy"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* SECTION I: CTABand */}
      <CTABand />
    </div>
  );
}
