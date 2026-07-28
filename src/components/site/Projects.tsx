"use client";

import { MapPin } from "lucide-react";
import { Eyebrow, GoldButton, Reveal, SectionHeading } from "./primitives";

export const projects = [
  { name: "Narol, Ahmedabad", state: "Gujarat" },
  { name: "Tadepalligudem", state: "Andhra Pradesh" },
  { name: "Biswanath Chariali", state: "Assam" },
  { name: "Navsari", state: "Gujarat" },
  { name: "Jagdalpur", state: "Chhattisgarh" },
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Mandvi", state: "Gujarat" },
  { name: "Safilguda, Secunderabad (Hyderabad)", state: "Telangana" },
  { name: "Dhamtari", state: "Chhattisgarh" },
];

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold/8 blur-[170px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <Eyebrow>Portfolio</Eyebrow>
          <SectionHeading className="mt-6">Available Investment Opportunities</SectionHeading>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.1}>
              <article className="glass-card group relative h-full overflow-hidden rounded-sm p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-gold)] opacity-70" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
                    <MapPin size={19} strokeWidth={1.6} />
                  </span>
                  <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-display text-[0.6rem] font-bold uppercase tracking-[0.2em] text-gold">Available</span>
                </div>
                <h3 className="mt-8 font-display text-lg font-extrabold uppercase leading-tight tracking-[0.02em] text-foreground">{p.name}</h3>
                <p className="mt-3 text-[0.8rem] uppercase tracking-[0.22em] text-muted-foreground">{p.state}</p>
                <div className="mt-8 gold-rule opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex flex-wrap justify-center gap-4">
          <GoldButton href="#contact" className="px-12 py-5 text-[0.85rem]">Request Detailed Project Report</GoldButton>
          <GoldButton href="#contact" variant="outline" className="px-12 py-5 text-[0.85rem]">More Locations</GoldButton>
        </Reveal>
      </div>
    </section>
  );
}
