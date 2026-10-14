"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHero } from "@/components/gameplex/PageHero";
import { Reveal } from "@/components/gameplex/Reveal";

function ContactForm() {
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const phone = String(data.get("phone") || "").trim();
    const city = String(data.get("city") || "").trim();
    const state = String(data.get("state") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      await fetch("/api/forms/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          city,
          state,
          message,
          company: "GamePlex Inquiry",
          businessType: "GamePlex Franchise",
        }),
      });
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    }

    setSending(false);
    (e.target as HTMLFormElement).reset();
    toast.success(
      `Thanks ${firstName || "there"}! Our expansion team will reach out within 48 hours.`
    );
  };

  return (
    <form className="surface-card rounded-2xl p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white">
          First name
          <input
            name="firstName"
            required
            placeholder="First name"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Last name
          <input
            name="lastName"
            required
            placeholder="Last name"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white sm:col-span-2">
          Phone number
          <input
            name="phone"
            type="tel"
            required
            placeholder="+91 "
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
        <label className="block text-sm font-medium text-white">
          State
          <input
            name="state"
            required
            placeholder="State"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium text-white">
        Message (optional)
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
            <ContactForm />
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
                  href="mailto:franchise@theconnplex.com"
                  className="mt-4 block font-display text-lg font-bold hover:text-primary transition-colors text-white font-sora no-underline"
                >
                  franchise@theconnplex.com
                </a>
                <a
                  href="tel:+919213015573"
                  className="mt-2 block font-display text-lg font-bold hover:text-primary transition-colors text-white font-sora no-underline"
                >
                  +91 92130 15573
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

