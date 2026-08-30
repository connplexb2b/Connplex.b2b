"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function useCountdown(target: number) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    setLeft(target - Date.now());
    const id = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(left, 0);
  return {
    days: Math.floor(clamped / 86400000),
    hours: Math.floor((clamped / 3600000) % 24),
    minutes: Math.floor((clamped / 60000) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

export function OfferBanner() {
  const [target] = useState(() => Date.now() + 3 * 86400000);
  const t = useCountdown(target);
  const units = [
    { v: t.days, l: "Days" },
    { v: t.hours, l: "Hrs" },
    { v: t.minutes, l: "Min" },
    { v: t.seconds, l: "Sec" },
  ];

  return (
    <>
      <div className="overflow-hidden border-y border-gold/30 bg-[image:var(--gradient-gold)] py-2.5">
        <div className="flex w-max animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((__, j) => (
                <span
                  key={j}
                  className="px-8 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground"
                >
                  You were invited · You qualify · Your benefit is reserved · Claim it
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="offer" className="relative overflow-hidden py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-crimson">
              Reserved For You
            </span>
            <h2 className="mt-5 text-4xl sm:text-6xl">
              A Special Offer, Reserved
              <br />
              For Your <span className="text-gradient-gold">First Connplex</span>
            </h2>
            <p className="mt-7 text-xs uppercase tracking-[0.3em] text-gold">
              Your offer includes
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "upto ₹5,00,000 franchise fee discount",
                "Priority city / territory discussion",
                "Complimentary feasibility & site study",
                "Format recommendation based on your location",
                "Dedicated franchise consultation",
              ].map((li) => (
                <li key={li} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
                  {li}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-gold">
              Why are we offering this?
            </p>
            <p className="mt-4 max-w-lg text-muted-foreground">
              As Connplex expands across India, we&apos;re inviting a limited number of
              first-time partners to join this expansion cycle. We&apos;d like you to be one of
              them.
            </p>
            <Button asChild variant="gold" size="xl" className="mt-9">
              <a href="#apply">Lock My Offer →</a>
            </Button>
          </div>

          <div className="surface-card p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Your offer expires in
            </p>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {units.map((u) => (
                <div key={u.l} className="border border-border bg-background/60 py-5 text-center">
                  <div className="font-display text-4xl text-gold">
                    {String(u.v).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {u.l}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4 border-t border-border pt-6 text-sm">
              <p className="text-muted-foreground">
                After the offer window closes, the franchise fee returns to the standard
                ₹15,00,000 + GST.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Standard franchise fee</span>
                <span className="text-muted-foreground line-through">₹15,00,000 + GST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest text-foreground">Your fee today</span>
                <span className="font-display text-3xl text-gradient-gold">₹10,00,000 + GST</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
