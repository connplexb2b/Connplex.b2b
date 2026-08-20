"use client";

import { PageHero } from "@/components/gameplex/PageHero";
import { CTABand } from "@/components/gameplex/CTABand";
import { Reveal } from "@/components/gameplex/Reveal";
import { pillars } from "@/lib/gameplex-data";

const stages = [
  { n: "01", t: "Location", d: "Market study, catchment analysis and site shortlisting." },
  { n: "02", t: "Design", d: "International-standard layouts and zone planning." },
  { n: "03", t: "Build", d: "Vendor coordination, fit-out and equipment sourcing." },
  { n: "04", t: "Training", d: "Team hiring frameworks and hospitality training." },
  { n: "05", t: "Launch", d: "Pre-launch campaigns and opening-week activation." },
  { n: "06", t: "Operate", d: "Ongoing operations, tech and marketing support." },
] as const;

export default function FranchisePage() {
  return (
    <div className="gameplex-theme min-h-screen bg-background text-foreground pt-12">
      <PageHero
        eyebrow="Why Investors Choose GamePlex"
        title="More Than a Franchise."
        accent="A Partnership."
        subtitle="We don't hand over a brand. We build the business with you."
      />

      {/* Pillars Section */}
      <section className="pb-16 font-sans">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05}>
                <div className="h-full bg-background p-8 transition-colors hover:bg-secondary/40">
                  <p className="text-xs text-muted-foreground m-0">{p.n}</p>
                  <p className="mt-6 font-display text-4xl font-bold text-gold-gradient font-sora m-0">
                    {p.stat}
                  </p>
                  <p className="mt-3 font-display text-lg font-bold text-white font-sora m-0">{p.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed m-0">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 border-t border-border/30 font-sans">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-3xl text-3xl font-bold sm:text-5xl text-white font-sora leading-tight">
              From site selection to opening night —{" "}
              <span className="text-gold-gradient font-bold">our team works alongside yours.</span>
            </h2>
          </Reveal>

          <div className="mt-14 space-y-px overflow-hidden rounded-xl border border-border bg-border">
            {stages.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.04}>
                <div className="grid items-baseline gap-3 bg-background p-7 transition-colors hover:bg-secondary/40 sm:grid-cols-[80px_220px_1fr]">
                  <span className="text-xs text-primary font-eyebrow font-semibold">{s.n}</span>
                  <span className="font-display text-xl font-bold text-white font-sora">{s.t}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{s.d}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase City Image Backrop */}
      <section className="relative overflow-hidden h-[70vh] w-full font-sans">
        <img
          src="/assets/gameplex/city.jpg"
          alt="Illuminated entertainment landmark in an Indian city at night"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          onError={(e) => {
            e.currentTarget.src = "/assets/gameplex/philosophy-1-clean.jpg"; // fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 flex items-center relative z-10">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Reveal>
              <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl text-white font-sora leading-tight m-0">
                Built for Today. <span className="text-gold-gradient font-bold">Designed for Tomorrow.</span>
              </h2>
              <p className="mt-6 max-w-xl text-muted-foreground text-base leading-relaxed m-0">
                India is entering a new era of experience-led entertainment. GamePlex is built to lead it. We provide pre-validated demographics checks, real-estate analytics, and end-to-end setups so you can own a landmark commercial asset.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
