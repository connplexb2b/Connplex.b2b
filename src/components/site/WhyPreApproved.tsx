"use client";

import { Users, Crosshair, Footprints, TrendingUp, Calculator, IndianRupee, Building2, ShieldCheck } from "lucide-react";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";

const reasons = [
  {
    icon: Users,
    title: "Validated Demographics",
    description: "Detailed catchment studies analyze household incomes and entertainment habits to guarantee footfalls."
  },
  {
    icon: Crosshair,
    title: "Precision Targeting",
    description: "Cinemas positioned strategically in underscreened micro-markets with high unsatisfied demand."
  },
  {
    icon: Footprints,
    title: "High-Traffic Hubs",
    description: "Locations situated in prime malls, retail high streets, or transit hubs with steady natural traffic."
  },
  {
    icon: TrendingUp,
    title: "High Growth Potential",
    description: "Located in rapidly expanding Tier-2 and Tier-3 cities experiencing a retail revolution."
  },
  {
    icon: Calculator,
    title: "Assured ROI Model",
    description: "Each site has a pre-audited financial model, proving feasibility and projecting clear payback periods."
  },
  {
    icon: IndianRupee,
    title: "Optimized Commercials",
    description: "Lease terms, rental models, and revenue-sharing percentages are pre-negotiated for maximum investor yield."
  },
  {
    icon: Building2,
    title: "Structural Feasibility",
    description: "Properties selected meet the specific ceiling height, span, and loading requirements of a modern multiplex."
  },
  {
    icon: ShieldCheck,
    title: "Compliance Verified",
    description: "Due diligence is fully completed on property titles, structural stability, and municipal permissions."
  }
];

export function WhyPreApproved() {
  return (
    <section id="why-pre-approved" className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
      <div className="absolute right-0 top-1/4 h-[350px] w-[350px] rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule opacity-35" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <Eyebrow>Strategic Advantage</Eyebrow>
          <SectionHeading className="mt-6">Why Choose a Pre-Approved Location?</SectionHeading>
          <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground">
            We eliminate the guesswork. Every pre-approved location in our portfolio has undergone comprehensive technical, financial, and legal evaluations.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.title} delay={(i % 2) * 0.1} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold/20 bg-gold/5 text-gold">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-md font-bold uppercase tracking-wider text-foreground">{r.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={0.2} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-border bg-muted">
              <img 
                src="/images/auditorium-wave.jpeg" 
                alt="Premium wave-design auditorium" 
                className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 hover:scale-105 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-display text-[0.6rem] font-bold uppercase tracking-[0.25em] text-gold">Designed for Acoustics</span>
                <h4 className="mt-2 font-display text-lg font-bold uppercase text-foreground">Signature Wave Auditorium</h4>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
