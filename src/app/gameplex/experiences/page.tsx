"use client";

import { PageHero } from "@/components/gameplex/PageHero";
import { CTABand } from "@/components/gameplex/CTABand";
import { Reveal } from "@/components/gameplex/Reveal";
import { TiltCard } from "@/components/gameplex/TiltCard";
import { experiences } from "@/lib/gameplex-data";

const groups = ["Play", "Dine", "Celebrate"] as const;

export default function ExperiencesPage() {
  return (
    <div className="gameplex-theme min-h-screen bg-background text-foreground pt-12">
      <PageHero
        eyebrow="Entertainment Beyond Gaming"
        title="Fourteen reasons to"
        accent="come back."
        subtitle="Every GamePlex is thoughtfully designed to maximise customer engagement, repeat visits and multiple revenue streams."
      />

      {/* Main Experience Showcase Image */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-black/40">
              <img
                src="/assets/gameplex/experiences.jpg"
                alt="VR zone, simulators and arcade inside GamePlex"
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  e.currentTarget.src = "/assets/gameplex/philosophy-1-clean.jpg"; // fallback
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experience Groups */}
      {groups.map((g) => (
        <section key={g} className="py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="flex items-center space-x-4 mb-8">
                <p className="eyebrow m-0">{g}</p>
                <div className="h-px flex-1 bg-border/40" />
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {experiences
                .filter((e) => e.group === g)
                .map((e, i) => (
                  <Reveal key={e.name} delay={i * 0.05}>
                    <TiltCard
                      intensity={8}
                      className="surface-card flex h-full items-center gap-4 rounded-xl p-6 transition-colors hover:border-primary/60 cursor-default"
                    >
                      <span className="text-3xl select-none" role="img" aria-label={e.name}>
                        {e.icon}
                      </span>
                      <p className="font-display text-base font-bold text-white font-sora m-0">
                        {e.name}
                      </p>
                    </TiltCard>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      ))}

      {/* Food & Beverage Spotlight Section */}
      <section className="py-20 border-t border-border/30">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black/40">
              <img
                src="/assets/gameplex/dining-lounge-gameplex.jpg"
                alt="GamePlex luxury dining lounge and bar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/assets/gameplex/philosophy-2.jpg"; // fallback
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl text-white font-sora leading-tight">
                Dining is not an add-on. It's a <span className="text-gold-gradient font-bold">second business.</span>
              </h2>
              <p className="leading-relaxed text-muted-foreground text-base">
                A full restaurant, café and coffee lounge keeps guests on-site longer, lifts average spend per head and turns a gaming visit into an evening out. The dining layout is integrated alongside our lanes to deliver premium cinema-grade hospitality directly to guests.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
