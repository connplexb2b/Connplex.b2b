"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const text = textRef.current;

    if (!hero || !video || !text) return;

    let tl: gsap.core.Timeline | null = null;

    const initScrollTrigger = () => {
      const duration = video.duration;
      if (!duration || isNaN(duration)) return;

      // Force pause video initially
      video.pause();
      video.currentTime = 0;

      // Object to animate virtually
      const scrollObj = { time: 0 };

      // Create a unified timeline for scroll animations
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 0.5, // Smooth lag to ease seeking and playback transitions
          anticipatePin: 1,
        },
      });

      // Scrub the video playhead using virtual time object and force pause
      tl.to(
        scrollObj,
        {
          time: duration - 0.05, // Avoid absolute end frame to prevent black screen or looping glitch
          ease: "none",
          duration: 1,
          onUpdate: () => {
            video.currentTime = scrollObj.time;
            // Prevent browser from automatically playing video during seek
            if (!video.paused) {
              video.pause();
            }
          },
        },
        0
      );

      // Smooth zoom-in and slight rotation effect for 3D/parallax feel
      tl.to(
        video,
        {
          scale: 1.15,
          rotationZ: 2, // Rotate slightly as user scrolls
          ease: "none",
          duration: 1,
        },
        0
      );

      // Elegant text fade out, fading completely within the first 25% of scroll
      tl.to(
        text,
        {
          opacity: 0,
          y: -60,
          ease: "power1.out",
          duration: 0.25,
        },
        0
      );
    };

    // Prevent default autoplay and loop behaviors
    video.autoplay = false;
    video.loop = false;
    video.pause();

    // If metadata is already loaded, initialize immediately
    if (video.readyState >= 1) {
      initScrollTrigger();
    } else {
      video.addEventListener("loadedmetadata", initScrollTrigger);
    }

    // Additional event listener to prevent any automatic playback
    const handlePlay = (e: Event) => {
      e.preventDefault();
      video.pause();
    };
    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("loadedmetadata", initScrollTrigger);
      video.removeEventListener("play", handlePlay);
      if (tl) {
        tl.kill();
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src="/video/hero-bg.mp4"
        preload="auto"
        muted
        playsInline
        autoPlay={false}
        controls={false}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      {/* Luxury cinematic overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/80 pointer-events-none" />

      {/* Typography and CTA Buttons */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 select-none pointer-events-none"
      >
        <h1 className="text-7xl md:text-9xl font-bold tracking-[6px] md:tracking-[12px] text-[#C9A84C] font-outfit uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          CONNPLEX
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-[600px] font-medium tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          The Ultimate Cinematic Experience
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12 w-full max-w-[320px] sm:max-w-none px-4 pointer-events-auto">
          <a
            href="https://theconnplex.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#191919]/60 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            Franchise With Us <span className="transition-transform duration-300">&rarr;</span>
          </a>
          <a
            href="https://ticketing.theconnplex.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#191919]/60 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            Book tickets <span className="transition-transform duration-300">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
