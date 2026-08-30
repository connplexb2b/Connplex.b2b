"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10)) || !city.trim()) {
      toast.error("Please enter your name, a valid 10-digit number and your city.");
      return;
    }

    if (!agreed) {
      toast.error("Please read and agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create HDFC payment session
      const sessionRes = await fetch("/api/hdfc/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          timeframe: "immediate",
        }),
      });

      const sessionData = await sessionRes.json();
      if (!sessionRes.ok || !sessionData.paymentLink) {
        throw new Error(sessionData.details || sessionData.error || "Failed to create payment session.");
      }

      // 2. Redirect the user to HDFC hosted payment page
      toast.success("Redirecting to HDFC Payment Gateway...");
      window.location.href = sessionData.paymentLink;

    } catch (err: any) {
      toast.error(err.message || "Something went wrong during payment setup.");
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="border-t border-border py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1fr]">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Register Interest</span>
          <h2 className="mt-5 text-4xl sm:text-6xl">
            Let&apos;s Build The Future Of <span className="text-gradient-gold">Cinema Together</span>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Share your details and our franchise desk will walk you through investment,
            site feasibility and the ₹5,00,000 franchise-fee discount offer for your city.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-px bg-border">
            {[
              { v: "300+", l: "Screens signed for 2026" },
              { v: "40%", l: "Company participation" },
              { v: "80%", l: "Revenue share" },
              { v: "90-120", l: "Days to launch" },
            ].map((s) => (
              <div key={s.l} className="bg-background px-5 py-6">
                <div className="font-display text-3xl text-gradient-gold">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="surface-card space-y-6 p-8 sm:p-10">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={submitting}
              className="h-12 bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 00000 00000"
              disabled={submitting}
              className="h-12 bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Preferred City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City you want the cinema in"
              disabled={submitting}
              className="h-12 bg-background/60"
            />
          </div>
          <div className="flex items-start gap-3 py-1">
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={submitting}
              className="h-4 w-4 mt-0.5 rounded border border-border bg-background/60 text-gold focus:ring-1 focus:ring-gold accent-gold cursor-pointer"
              required
            />
            <Label htmlFor="agree" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
              I have read and agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80 transition-colors"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </Label>
          </div>
          <Button type="submit" variant="gold" size="xl" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Unlock My Exclusive Offer →"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your details stay confidential and are used only for franchise discussions.
          </p>
        </form>
      </div>
    </section>
  );
}
