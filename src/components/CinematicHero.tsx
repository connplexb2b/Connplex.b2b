"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const FRAME_PATH = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

type CinematicHeroProps = {
  children?: ReactNode;
};

export default function CinematicHero({ children }: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;

    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => {
      if (!isMounted) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = images[currentFrame];
      if (img?.complete) draw(img);
    };
    window.addEventListener("resize", resize);

    const draw = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let currentFrame = 0;
    let targetFrame = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        if (i === 0) draw(images[0]);
        if (loaded === TOTAL_FRAMES) setupST();
      };
      images.push(img);
    }

    const tick = () => {
      if (!isMounted) return;
      if (targetFrame !== currentFrame) {
        currentFrame = targetFrame;
        const img = images[currentFrame];
        if (img?.complete) draw(img);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const setupST = () => {
      if (!isMounted) return;

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=3000",
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.floor(self.progress * TOTAL_FRAMES)
          );
        },
      });
    };

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Scroll background layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 0,
        }}
      />

      {/* Optional dark overlay so text stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.55) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Existing hero content on top */}
      {children && (
        <div
          ref={contentRef}
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
