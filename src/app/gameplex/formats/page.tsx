"use client";

import Link from "next/link";
import { PageHero } from "@/components/gameplex/PageHero";
import { CTABand } from "@/components/gameplex/CTABand";
import { Reveal } from "@/components/gameplex/Reveal";
import { TiltCard } from "@/components/gameplex/TiltCard";
import { formats } from "@/lib/gameplex-data";

export default function FormatsPage() {
  return (
    <div className="gameplex-theme min-h-screen bg-background text-foreground pt-12">
      <PageHero
        eyebrow="Formats"
        title="Built Around"
        accent="Every City."
        subtitle="Three signature formats, engineered like model lines — each one complete, each one scaled to its market."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {formats.map((f, i) => (
            <Reveal key={f.code} delay={i * 0.05}>
              <div className="grid items-center gap-10 border-t border-border py-16 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="font-display text-3xl font-bold text-gold-gradient sm:text-5xl font-sora">
                    {f.code}
                  </p>
                  <p className="mt-4 font-display text-xl font-bold text-white font-sora">{f.tagline}</p>
                </div>
                <TiltCard intensity={6} className="surface-card rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="eyebrow m-0">Area</p>
                      <p className="mt-2 font-display text-2xl font-bold text-white font-sora m-0">{f.area}</p>
                    </div>
                    <div>
                      <p className="eyebrow m-0">Investment from</p>
                      <p className="mt-2 font-display text-2xl font-bold text-primary font-sora m-0">
                        {f.investment}
                      </p>
                    </div>
                  </div>
                  <div className="my-7 gold-line" />
                  <p className="text-muted-foreground text-sm leading-relaxed mb-0">{f.description}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2 list-none p-0">
                    {f.highlights.map((h) => (
                      <li key={h} className="text-sm text-muted-foreground flex items-center">
                        <span className="mr-2 text-primary select-none">—</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={`/contact?format=${encodeURIComponent(f.code)}`}
                      className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    >
                      Enquire about {f.code}
                    </Link>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand />
    </div>
  );
}
