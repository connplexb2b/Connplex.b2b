"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-gold">
      <span className="h-px w-8 bg-gold/60" />
      {children}
    </span>
  );
}

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("font-display text-3xl font-extrabold uppercase leading-[1.15] tracking-[0.02em] text-foreground sm:text-4xl lg:text-[2.9rem]", className)}>
      {children}
    </h2>
  );
}

export function GoldButton({ children, href, variant = "solid", type, className }: {
  children: ReactNode; href?: string; variant?: "solid" | "outline"; type?: "submit" | "button"; className?: string;
}) {
  const base = cn(
    "group inline-flex items-center justify-center gap-2 rounded-sm px-8 py-4 font-display text-[0.78rem] font-bold uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer",
    variant === "solid"
      ? "bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[0_10px_40px_-16px_rgba(212,175,55,0.7)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-18px_rgba(212,175,55,0.85)]"
      : "border border-gold/40 text-gold hover:-translate-y-1 hover:border-gold hover:bg-gold/10 hover:shadow-[0_18px_50px_-20px_rgba(212,175,55,0.6)]",
    className,
  );
  if (href) return <a href={href} className={base}>{children}</a>;
  return <button type={type ?? "button"} className={base}>{children}</button>;
}
