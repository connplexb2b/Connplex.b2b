"use client";

import { motion } from "motion/react";
import { GoldButton } from "./primitives";

const stats = [
  { value: "17", label: "Pre-Approved Projects" },
  { value: "Multiple", label: "States" },
  { value: "Growing", label: "Brand" },
  { value: "End-to-End", label: "Support" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  delay: (i % 6) * 0.8,
  duration: 7 + (i % 5),
}));

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden pb-24 pt-36 lg:pb-32 lg:pt-44">
      <img src="/images/hero-cinebox-lobby.jpg" alt="Luxury Connplex Cinemas lobby" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.78)_50%,rgba(5,5,5,0.4)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,5,0.9)_0%,rgba(5,5,5,0.25)_45%,rgba(5,5,5,0.75)_100%)]" />
      <div className="blueprint-grid absolute inset-0 opacity-25" />
      <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-gold/10 blur-[160px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule" />
      
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <motion.span 
            key={i} 
            className="absolute h-1 w-1 rounded-full bg-gold/50" 
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
            animate={{ y: [0, -26, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} 
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} 
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-3 rounded-sm border border-gold/25 bg-gold/5 px-4 py-2 font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-gold">
            Connplex Investment Opportunity
          </span>
          <h1 className="mt-8 font-display text-4xl font-extrabold uppercase leading-[1.08] tracking-[0.01em] text-foreground sm:text-5xl lg:text-[3.6rem]">
            Own a Connplex Cinema at a <span className="text-gold-gradient">Pre-Approved Location</span>
          </h1>
          <div className="mt-6 max-w-xl space-y-3 text-[1.02rem] leading-relaxed text-muted-foreground">
            <p>Ready-to-launch cinema opportunities across India.</p>
            <p>Validated locations with strong business potential.</p>
            <p className="text-foreground">You invest. Connplex delivers.</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="#projects">View Available Projects</GoldButton>
            <GoldButton href="#contact" variant="outline">Talk to Investment Advisor</GoldButton>
          </div>
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }} 
                className="bg-surface/90 px-5 py-6 backdrop-blur-md"
              >
                <div className="font-display text-xl font-extrabold uppercase text-gold">{s.value}</div>
                <div className="mt-2 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
