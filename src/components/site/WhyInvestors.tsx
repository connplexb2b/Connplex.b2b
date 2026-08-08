"use client";

import { Check } from "lucide-react";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";

const reasons = [
  {
    title: "Proven Business Model",
    desc: "A scalable, recession-resilient multiplex model optimized for consistent occupancy and fast breakeven."
  },
  {
    title: "Ancillary Revenue Streams",
    desc: "Maximize profit margins with high-margin Food & Beverage (F&B), local onscreen ads, and private event rentals."
  },
  {
    title: "100% Operational Hands-Off",
    desc: "Connplex operates the multiplex completely—staffing, projectionists, logistics, security, and programming."
  },
  {
    title: "Transparent Profit Sharing",
    desc: "Access daily box office admissions data and automated financial reporting for transparent profit sharing."
  },
  {
    title: "Premium Audio-Visual Spec",
    desc: "Fitted with state-of-the-art 3D projection, Dolby Atmos surround audio, and premium plush recliner seating."
  },
  {
    title: "Centralized Programming",
    desc: "Our programming desk secures agreements and optimizes film scheduling to match regional audience tastes."
  },
  {
    title: "Robust Promoter Pedigree",
    desc: "Backed by industry leaders and expert corporate structures specializing in hospitality and retail entertainment."
  },
  {
    title: "Tax Advantages",
    desc: "Benefit from tax depreciation structures on cinema equipment, audio installs, and commercial fit-outs."
  },
  {
    title: "Exclusive Brand Equity",
    desc: "Accelerate your local traction by leveraging Connplex's national marketing campaigns and strong brand name."
  }
];

export function WhyInvestors() {
  return (
    <section id="why-investors" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute left-1/4 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gold/5 blur-[170px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule opacity-35" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl text-center mx-auto mb-16">
          <Eyebrow>The Business Case</Eyebrow>
          <SectionHeading className="mt-6">Why Investors Partner with Connplex</SectionHeading>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <article className="glass-card group relative h-full overflow-hidden rounded-sm p-6 bg-surface/30">
                <div className="absolute inset-x-0 top-0 h-px bg-gold/20" />
                <div className="flex gap-4 items-start">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/30">
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-[0.9rem] font-bold uppercase tracking-wider text-foreground leading-normal">{r.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
