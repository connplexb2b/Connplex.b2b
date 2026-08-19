"use client";

import { Reveal } from "@/components/gameplex/Reveal";
import { formats } from "@/lib/gameplex-data";
import { Maximize2, IndianRupee, Layers, CheckCircle } from "lucide-react";

export default function FormatsPage() {
  return (
    <div className="py-20 px-5 sm:px-10 max-w-[1800px] mx-auto font-sans">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <Reveal>
          <span className="eyebrow block mb-4">Scalable Business Models</span>
          <h1 className="text-4xl sm:text-6xl font-bold font-sora text-white mb-6">
            Franchise <span className="text-gold-gradient">Formats</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Designed to scale according to space, city demographics, and developer capex capacity. Discover the signature models driving higher guest return.
          </p>
        </Reveal>
      </div>

      <div className="space-y-24">
        {formats.map((fmt, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={fmt.code}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Left/Right Visual Column */}
              <div className="w-full lg:w-1/2">
                <Reveal>
                  <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-secondary/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/10 to-transparent z-10" />
                    <img
                      src={fmt.image}
                      alt={fmt.imageAlt}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.parentElement?.querySelector(".fallback-graphic");
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                    <div className="fallback-graphic hidden w-full aspect-[16/10] bg-gradient-to-br from-secondary/40 to-black flex items-center justify-center">
                      <Layers className="h-16 w-16 text-primary/30" />
                    </div>
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-20 rounded-full bg-primary/95 text-primary-foreground font-bold font-outfit uppercase text-[10px] tracking-widest px-4 py-1.5 glow-ring">
                      {fmt.code.split(" ").pop()} Format
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Text Info Column */}
              <div className="w-full lg:w-1/2 space-y-6">
                <Reveal>
                  <span className="eyebrow block">{fmt.code}</span>
                  <h2 className="text-3xl sm:text-4xl font-bold font-sora text-white">
                    {fmt.tagline}
                  </h2>
                  <div className="grid grid-cols-2 gap-6 py-6 border-y border-border/40">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/50">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Required Area</p>
                        <p className="text-base font-bold text-white font-sora mt-0.5">{fmt.area}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/50">
                        <IndianRupee className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Min Investment</p>
                        <p className="text-base font-bold text-white font-sora mt-0.5">{fmt.investment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Each format is fully engineered to optimize spatial efficiency, food and beverage cross-selling, and guest dwell time. Supported by Connplex's national marketing campaigns and complete end-to-end ops.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <li className="flex items-center space-x-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Cinema-Grade Concessions</span>
                      </li>
                      <li className="flex items-center space-x-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Proprietary Tech Integrations</span>
                      </li>
                      <li className="flex items-center space-x-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>Centralized Operations Support</span>
                      </li>
                      <li className="flex items-center space-x-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>24/7 Revenue Dashboard Monitoring</span>
                      </li>
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
