"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timelines = [
  { value: "immediate", label: "Immediately" },
  { value: "week", label: "Within a week" },
  { value: "month", label: "Within a month" },
];

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [timeline, setTimeline] = useState("immediate");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10)) || !city.trim()) {
      toast.error("Please enter your name, a valid 10-digit number and your city.");
      return;
    }

    setSubmitting(true);

    const payload = {
      fullName: name.trim(),
      email: "inquiry@theconnplex.com",
      phone: phone.trim(),
      state: "N/A",
      city: city.trim(),
      preferredInvestment: "N/A",
      preferredCity: city.trim(),
      company: "N/A",
      businessType: "N/A",
      hasProperty: "No",
      timeframe: timeline === "immediate" ? "Immediate" : timeline === "week" ? "Within a week" : "Within a month",
      message: `[Flash Sale Franchise Lead]\nPreferred City: ${city}\nTimeline: ${timeline}\nCoupon Code: 50% Off Franchise Fee`
    };

    try {
      const response = await fetch("/api/forms/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request.");
      }

      toast.success("Thank you! Our franchise team will call you shortly.");
      setName("");
      setPhone("");
      setCity("");
      setTimeline("immediate");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
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
            site feasibility and the 50% franchise-fee offer for your city.
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
          <div className="space-y-3">
            <Label>How soon do you want to start?</Label>
            <RadioGroup value={timeline} onValueChange={setTimeline} className="grid gap-3">
              {timelines.map((t) => (
                <Label
                  key={t.value}
                  htmlFor={t.value}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                    timeline === t.value
                      ? "border-gold bg-gold/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  <RadioGroupItem value={t.value} id={t.value} disabled={submitting} />
                  {t.label}
                </Label>
              ))}
            </RadioGroup>
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
