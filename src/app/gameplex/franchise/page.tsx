"use client";

import { Reveal } from "@/components/gameplex/Reveal";
import { pillars } from "@/lib/gameplex-data";
import { ShieldCheck, TrendingUp, HelpCircle } from "lucide-react";

export default function FranchisePage() {
  return (
    <div className="py-20 px-5 sm:px-10 max-w-[1800px] mx-auto font-sans">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <Reveal>
          <span className="eyebrow block mb-4">Invest in Entertainment</span>
          <h1 className="text-4xl sm:text-6xl font-bold font-sora text-white mb-6">
            The Franchise <span className="text-gold-gradient">Model</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Connplex's award-winning franchise infrastructure meets next-gen socializing. Secure a high-yield, premium asset backed by professional operations.
          </p>
        </Reveal>
      </div>

      {/* Grid of 6 Pillars */}
      <div className="mb-24">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold font-sora text-center text-white mb-12">
            The 6 Pillars of <span className="text-gold-gradient">Investor Success</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pl, idx) => (
            <Reveal key={pl.title} delay={idx * 0.05}>
              <div className="group relative overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 bg-secondary/10 p-8 transition-all duration-500 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold tracking-widest text-primary/70 font-outfit uppercase">Pillar {pl.n}</span>
                    <span className="text-xs font-bold text-white bg-secondary border border-border/80 rounded-full px-3 py-1 font-outfit uppercase tracking-wider">{pl.stat}</span>
                  </div>
                  <h3 className="text-xl font-bold font-sora text-white mb-4">{pl.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{pl.copy}</p>
                </div>

                {/* Decorative background image hint */}
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/40">
                  <img
                    src={pl.image}
                    alt={pl.imageAlt}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* FAQs or Operational Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16 border-t border-border/40">
        <div>
          <Reveal>
            <span className="eyebrow block mb-4">Operations & Management</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-sora text-white mb-6">
              Hands-off for Investors. <br />
              <span className="text-gold-gradient">Managed by Experts.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Connplex operates GamePlex locations under a professional management structure. Investors provide capital and site support, while our central operations handle staffing, booking systems, vendor agreements, and everyday maintenance.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Full Transparency</h4>
                  <p className="text-sm text-muted-foreground">Access live dashboards for occupancy, game counts, and bar receipts 24/7.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white">Optimized Yield</h4>
                  <p className="text-sm text-muted-foreground">Strategic layouts engineered to drive high-margin food, beverage, and private event bookings.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="bg-secondary/20 border border-border/60 rounded-2xl p-8 sm:p-10 space-y-6">
          <Reveal>
            <h3 className="text-2xl font-bold font-sora text-white mb-6 flex items-center space-x-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <span>Investment FAQ</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-white mb-2">What is the lock-in period?</h4>
                <p className="text-sm text-muted-foreground">GamePlex franchise models operate on a standard 5-to-9 year commercial lease agreement, designed for consistent long-term returns.</p>
              </div>
              <div className="w-full h-px bg-border/40" />
              <div>
                <h4 className="font-bold text-white mb-2">Are there royalty charges?</h4>
                <p className="text-sm text-muted-foreground">Yes, royalty is structured as a percentage of gross revenues, aligning Connplex's operations team directly with your location's growth.</p>
              </div>
              <div className="w-full h-px bg-border/40" />
              <div>
                <h4 className="font-bold text-white mb-2">Do you assist in location selection?</h4>
                <p className="text-sm text-muted-foreground">Absolutely. Our real-estate team validates catchment areas, footfall mapping, and target demographics before approving any site.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
