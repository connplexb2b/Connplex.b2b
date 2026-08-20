"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHero } from "@/components/gameplex/PageHero";
import { Reveal } from "@/components/gameplex/Reveal";
import { formats } from "@/lib/gameplex-data";

function ContactForm() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState("GamePlex Standard");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const formatParam = searchParams.get("format");
    if (formatParam && formats.some((f) => f.code === formatParam)) {
      setSelected(formatParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.currentTarget);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success(
        `Thanks ${String(data.get("name") || "").split(" ")[0]}! Our expansion team will reach out within 48 hours.`
      );
    }, 700);
  };

  return (
    <form className="surface-card rounded-2xl p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white">
          Full name
          <input
            name="name"
            required
            placeholder="Your name"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Phone
          <input
            name="phone"
            required
            placeholder="+91 "
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          City
          <input
            name="city"
            required
            placeholder="City of interest"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
      </div>

      <p className="mt-8 eyebrow m-0">Format of interest</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {formats.map((f) => (
          <button
            key={f.code}
            type="button"
            onClick={() => setSelected(f.code)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              selected === f.code
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {f.code}
          </button>
        ))}
      </div>
      <input type="hidden" name="format" value={selected} />

      <label className="mt-8 block text-sm font-medium text-white">
        Message
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your city, site or investment timeline."
          className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-8 w-full rounded-full bg-primary px-8 py-4 font-display font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
      >
        {sending ? "Sending..." : "Request franchise deck"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="gameplex-theme min-h-screen bg-background text-foreground pt-12">
      <PageHero
        eyebrow="Become part of the GamePlex story"
        title="Own one."
        accent="Shape your city."
        subtitle="Tell us about your city and we'll send the franchise deck along with an investment breakdown."
      />

      <section className="pb-28 font-sans">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Suspense
              fallback={
                <div className="surface-card rounded-2xl p-8 min-h-[400px] flex items-center justify-center text-muted-foreground">
                  Loading inquiry form...
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-8">
              <div className="surface-card rounded-2xl p-8">
                <p className="eyebrow m-0">Investment</p>
                <p className="mt-3 font-display text-5xl font-bold text-gold-gradient font-sora m-0">
                  ₹2 Cr+
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed m-0">
                  Entry investment for GamePlex Mini. Standard from ₹4 Cr, Grand from ₹6 Cr.
                </p>
              </div>
              <div className="surface-card rounded-2xl p-8">
                <p className="eyebrow m-0 font-sans">Talk to us</p>
                <a
                  href="mailto:franchise@gameplex.in"
                  className="mt-4 block font-display text-lg font-bold hover:text-primary transition-colors text-white font-sora no-underline"
                >
                  franchise@gameplex.in
                </a>
                <a
                  href="tel:+919000000000"
                  className="mt-2 block font-display text-lg font-bold hover:text-primary transition-colors text-white font-sora no-underline"
                >
                  +91 90000 00000
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
