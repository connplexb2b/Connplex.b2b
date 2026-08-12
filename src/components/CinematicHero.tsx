"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ignore layout triggers from mobile browser address bar updates
ScrollTrigger.config({
  ignoreMobileResize: true,
});

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
    const gsapCtx = gsap.context(() => {}, heroRef);

    // Enable scroll normalization to synchronize touch events with scrub timeline on mobile
    let normalizedScroll: any = null;
    if (typeof window !== "undefined") {
      normalizedScroll = ScrollTrigger.normalizeScroll({
        type: "touch,pointer",
        momentum: true as any,
      });
    }

    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initial canvas dimension setup
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let lastWidth = rect.width;
    let lastHeight = rect.height;

    const resize = () => {
      if (!isMounted) return;
      const currentRect = hero.getBoundingClientRect();
      const newWidth = currentRect.width;
      const newHeight = currentRect.height;

      // Only resize the canvas if the width changes (orientation change) or height changes significantly
      if (newWidth !== lastWidth || Math.abs(newHeight - lastHeight) > 120) {
        lastWidth = newWidth;
        lastHeight = newHeight;
        canvas.width = newWidth;
        canvas.height = newHeight;
        const img = images[currentFrame];
        if (img?.complete) draw(img);
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener("resize", resize);

    const draw = (img: HTMLImageElement) => {
      // Robust fallback: if target frame is not loaded, find closest loaded neighbor
      if (!img || !img.complete || img.naturalWidth === 0) {
        let fallbackImg: HTMLImageElement | null = null;
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = images[currentFrame - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            fallbackImg = prev;
            break;
          }
          const next = images[currentFrame + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            fallbackImg = next;
            break;
          }
        }
        if (fallbackImg) {
          img = fallbackImg;
        } else {
          return; // Skip drawing if no image is available yet
        }
      }

      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let failed = 0;
    let currentFrame = 0;
    let targetFrame = 0;
    let stInitialized = false;

    const checkComplete = () => {
      if (!isMounted) return;
      // Initialize ScrollTrigger once all attempts finish or if we loaded at least 60 frames (first 25%)
      if (!stInitialized && (loaded + failed === TOTAL_FRAMES || loaded >= 60)) {
        stInitialized = true;
        setupST();
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i + 1);
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        if (i === 0) draw(images[0]);
        checkComplete();
      };
      img.onerror = () => {
        if (!isMounted) return;
        failed++;
        checkComplete();
      };
      images.push(img);
    }

    const tick = () => {
      if (!isMounted) return;
      if (targetFrame !== currentFrame) {
        currentFrame = targetFrame;
        const img = images[currentFrame];
        if (img) draw(img);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const setupST = () => {
      if (!isMounted) return;

      gsapCtx.add(() => {
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
      });
    };

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafRef.current);
      if (normalizedScroll) {
        normalizedScroll.kill();
      }
      window.removeEventListener("resize", resize);
      gsapCtx.revert();
    };
  }, []);

  return (
    <div style={{ width: "100%", overflow: "visible" }}>
      <section
        ref={heroRef}
        className="cinematic-hero-section"
        style={{
          position: "relative",
          width: "100%",
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
    </div>
  );
}
