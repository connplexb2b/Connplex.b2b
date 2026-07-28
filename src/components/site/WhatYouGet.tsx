"use client";

import { MapPinned, ClipboardCheck, LineChart, HardHat, Handshake, Landmark } from "lucide-react";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";

const benefits = [
  {
    icon: MapPinned,
    title: "Validated Location Search",
    description: "Access our pre-vetted locations, optimized for accessibility, demographic fit, and zero competition gaps."
  },
  {
    icon: ClipboardCheck,
    title: "Licenses & Approvals",
    description: "Get full administrative backing to navigate municipal permissions, safety clearances, and cinema operating licenses."
  },
  {
    icon: LineChart,
    title: "Revenue & Cash Flow Planning",
    description: "Benefit from structured financial models showing transparent ROI, film hire costs, and ancillary income sources."
  },
  {
    icon: HardHat,
    title: "Turnkey Project Execution",
    description: "Full management of cinema design, sound acoustics, luxurious seating layout, and quality execution by Connplex team."
  },
  {
    icon: Handshake,
    title: "Marketing & Launch Campaign",
    description: "A comprehensive grand launch strategy, localized digital advertising, and integration into primary online ticketing platforms."
  },
  {
    icon: Landmark,
    title: "Operational Management",
    description: "Day-to-day cinema operation, film programming, box office management, and snack counter supply chain handled fully by us."
  }
];

export function WhatYouGet() {
  return (
    <section id="benefits" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute right-1/4 top-0 h-[480px] w-[480px] rounded-full bg-gold/5 blur-[160px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule opacity-35" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl text-center mx-auto">
          <Eyebrow>Franchise Package</Eyebrow>
          <SectionHeading className="mt-6">What You Get as a Connplex Partner</SectionHeading>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            From the initial blueprint to the first screening, Connplex handles the heavy lifting, ensuring a seamless and high-yielding business setup.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 0.08}>
                <article className="glass-card group relative h-full overflow-hidden rounded-sm p-8 bg-surface/40">
                  <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-gold)] opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-gold/20 bg-gold/5 text-gold">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-8 font-display text-md font-bold uppercase tracking-wider text-foreground">{b.title}</h3>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{b.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
