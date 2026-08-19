"use client";

import { Reveal } from "@/components/gameplex/Reveal";
import { Gamepad2, Trophy, Martini, Users, Disc, Flame, Laptop, Clapperboard } from "lucide-react";

const experiences = [
  {
    title: "VR Arena",
    desc: "Immersive multiplayer VR gaming with full-body tracking and next-gen feedback.",
    icon: Gamepad2,
    img: "/assets/gameplex/gal-4.jpg",
  },
  {
    title: "Kids Zone",
    desc: "Interactive adventure zones and play spaces designed for active, creative minds.",
    icon: Flame,
    img: "/assets/gameplex/gal-1.jpg",
  },
  {
    title: "Bar & Lounge",
    desc: "Artisanal cocktails, premium spirits, and local drafts in a sophisticated lounge setting.",
    icon: Martini,
    img: "/assets/gameplex/gal-2.jpg",
  },
  {
    title: "Birthday Parties",
    desc: "Private luxury party suites with dedicated hosts, premium catering, and custom themes.",
    icon: Users,
    img: "/assets/gameplex/gal-3.jpg",
  },
  {
    title: "Live Events",
    desc: "Stand-up comedy, acoustic nights, esports tournaments, and televised live sports screenings.",
    icon: Disc,
    img: "/assets/gameplex/gal-8.jpg",
  },
  {
    title: "Restaurant",
    desc: "Gourmet dining featuring globally inspired small plates and multi-cuisine dinners.",
    icon: Trophy,
    img: "/assets/gameplex/gal-6.jpg",
  },
  {
    title: "Racing Sims",
    desc: "Full-motion racing simulators mapping real world tracks with real-time feedback.",
    icon: Laptop,
    img: "/assets/gameplex/gal-7.jpg",
  },
  {
    title: "Corporate Events",
    desc: "Tailored team-building, product launches, and private functions with premium presentation facilities.",
    icon: Clapperboard,
    img: "/assets/gameplex/gal-5.jpg",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="py-20 px-5 sm:px-10 max-w-[1800px] mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Reveal>
          <span className="eyebrow block mb-4">The Entertainment</span>
          <h1 className="text-4xl sm:text-6xl font-bold font-sora text-white mb-6">
            Unrivaled <span className="text-gold-gradient">Experiences</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            From state-of-the-art virtual reality to fine dining and premium social bowling, GamePlex blends high-energy play with sophisticated entertainment.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {experiences.map((exp, idx) => {
          const Icon = exp.icon;
          return (
            <Reveal key={exp.title} delay={idx * 0.05}>
              <div className="group relative overflow-hidden rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-xl flex flex-col h-full">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-75"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.parentElement?.querySelector(".fallback-bg");
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                  {/* Fallback Graphic */}
                  <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-secondary to-black flex items-center justify-center p-6">
                    <Icon className="h-12 w-12 text-primary/30" />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-black/80 border border-primary/30 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-lg text-white font-sora">{exp.title}</h3>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {exp.desc}
                  </p>
                  <div className="w-full h-px bg-border/40 my-4" />
                  <span className="text-xs font-semibold tracking-wider text-primary group-hover:underline flex items-center space-x-1 cursor-pointer">
                    <span>Learn More</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
