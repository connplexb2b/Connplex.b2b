"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHero } from "@/components/gameplex/PageHero";
import { Reveal } from "@/components/gameplex/Reveal";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const formatFromQuery = searchParams.get("format") || "";

  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(formatFromQuery);

  useEffect(() => {
    if (formatFromQuery) {
      setSelectedFormat(formatFromQuery);
    }
  }, [formatFromQuery]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const city = String(data.get("city") || "").trim();
    const state = String(data.get("state") || "").trim();
    const format = String(data.get("format") || selectedFormat || "").trim();
    const message = String(data.get("message") || "").trim();

    const fullDescription = [
      format ? `Preferred Format: ${format}` : null,
      `Property Address - City: ${city}`,
      `Property Address - State / Province: ${state}`,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // 1. Submit to Zoho CRM Web-to-Lead Form (Form Script: 329426000040802803)
    try {
      const zohoParams = new URLSearchParams();
      // Zoho CRM Form Identification Tokens
      zohoParams.append("xnQsjsdp", "d96443823e046356170063a4837a446bb5d724c0bc5f3383ac50d36af4f33e63");
      zohoParams.append("xmIwtLD", "017afde6581ba0511a27036d630e3df3c7a2a8b941de4b825e9de3a7429fcdd0b20a6578fadef2654ba1852971f5ad34");
      zohoParams.append("actionType", "TGVhZHM=");
      zohoParams.append("returnURL", "null");

      // Lead Details
      zohoParams.append("First Name", firstName);
      zohoParams.append("Last Name", lastName || "Inquiry");
      if (email) {
        zohoParams.append("Email", email);
      }
      zohoParams.append("Phone", phone);
      zohoParams.append("Company", fullName || "GamePlex Inquiry");

      // Custom Zoho Mappings
      zohoParams.append("LEADCF130", city); // Property Address - City
      zohoParams.append("LEADCF151", state); // Property Address - State / Province
      zohoParams.append("LEADCF126", "B2B GamePlex"); // Business Type
      zohoParams.append("Lead Source", "GamePlex Website Leads");
      zohoParams.append("Description", fullDescription);
      zohoParams.append("aG9uZXlwb3Q", "");
      zohoParams.append("wFaTrisJS", "true");

      console.log("Submitting GamePlex inquiry to Zoho CRM...");
      fetch("https://crm.zoho.in/crm/WebToLeadForm", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: zohoParams.toString(),
      })
        .then(() => console.log("Zoho CRM GamePlex lead dispatched successfully"))
        .catch((err) => console.error("Zoho CRM GamePlex dispatch error:", err));
    } catch (zohoErr) {
      console.error("Failed to prepare Zoho CRM GamePlex payload:", zohoErr);
    }

    // 2. Submit to internal database
    try {
      await fetch("/api/forms/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          city,
          state,
          message: fullDescription,
          company: "GamePlex Inquiry",
          businessType: "B2B GamePlex",
        }),
      });
    } catch (err) {
      console.error("Failed to submit inquiry to internal DB:", err);
    }

    setSending(false);
    setSubmitted(true);
    form.reset();
    toast.success(
      `Thanks ${firstName || "there"}! Our expansion team will reach out within 48 hours.`
    );
  };

  if (submitted) {
    return (
      <div className="surface-card rounded-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-6">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-sora text-2xl font-bold text-white mb-3">
          Inquiry Received
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
          Thank you for your interest in GamePlex. Your details have been submitted to our expansion team and synchronized with Zoho CRM. We will contact you within 48 hours with the franchise deck.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="rounded-full border border-border/80 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary cursor-pointer"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="surface-card rounded-2xl p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-white">
          First name <span className="text-primary">*</span>
          <input
            name="firstName"
            required
            placeholder="First name"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Last name <span className="text-primary">*</span>
          <input
            name="lastName"
            required
            placeholder="Last name"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Email address
          <input
            name="email"
            type="email"
            placeholder="name@example.com"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          Phone number <span className="text-primary">*</span>
          <input
            name="phone"
            type="tel"
            required
            placeholder="+91 "
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          City <span className="text-primary">*</span>
          <input
            name="city"
            required
            placeholder="City of interest"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
        <label className="block text-sm font-medium text-white">
          State <span className="text-primary">*</span>
          <input
            name="state"
            required
            placeholder="State / Province"
            className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary text-white"
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium text-white">
        Preferred Format
        <select
          name="format"
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border/80 bg-background px-4 py-3 text-sm outline-none transition-colors text-white focus:border-primary"
        >
          <option value="" className="bg-[#121212] text-white">Select format (or general inquiry)</option>
          <option value="GamePlex Mini" className="bg-[#121212] text-white">GamePlex Mini (from ₹2 Cr · 5,000–8,000 sq ft)</option>
          <option value="GamePlex Standard" className="bg-[#121212] text-white">GamePlex Standard (from ₹4 Cr · 10,000–15,000 sq ft)</option>
          <option value="GamePlex Grand" className="bg-[#121212] text-white">GamePlex Grand (from ₹6 Cr · 18,000–25,000+ sq ft)</option>
          <option value="Custom / Other" className="bg-[#121212] text-white">Custom / Other Requirement</option>
        </select>
      </label>

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

function ContactForm() {
  return (
    <Suspense
      fallback={
        <div className="surface-card rounded-2xl p-8 min-h-[420px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ContactFormInner />
    </Suspense>
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

