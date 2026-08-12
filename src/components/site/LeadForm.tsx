"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";
import { projects } from "./Projects";

const budgetOptions = [
  "INR 1.5 - 2 Crores",
  "INR 2 - 3 Crores",
  "INR 3 - 5 Crores",
  "INR 5 Crores+"
];

const leadSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  city: z.string().min(2, "City must be at least 2 characters"),
  project: z.string().min(1, "Please select a project location"),
  budget: z.string().min(1, "Please select a budget range"),
  message: z.string().optional()
});

export function LeadForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    project: "",
    budget: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      (result.error as any).errors.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setSubmitting(false);
      toast.error("Please correct the errors in the form.");
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.mobile.trim(),
      state: "N/A",
      city: formData.city.trim(),
      preferredInvestment: formData.budget,
      preferredCity: formData.city.trim(),
      company: "N/A",
      businessType: "N/A",
      hasProperty: "No",
      timeframe: "Immediate",
      message: `[Cinema Investment Enquiry]\nSelected Project: ${formData.project}\nBudget Range: ${formData.budget}\nMessage: ${formData.message.trim() || "N/A"}`
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

      toast.success("Thank you! Your investment request has been submitted. Our team will contact you shortly.");
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        city: "",
        project: "",
        budget: "",
        message: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute left-1/2 bottom-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gold/5 blur-[170px]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Image Card */}
          <div className="relative lg:col-span-5 hidden lg:block">
            <Reveal className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-border bg-muted">
              <img 
                src="/images/lobby-reception.png" 
                alt="Luxury cinema reception" 
                className="h-full w-full object-cover grayscale-[15%] transition-transform duration-700 hover:scale-105 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-10 left-8 right-8">
                <span className="font-display text-[0.66rem] font-bold uppercase tracking-[0.32em] text-gold">Exclusive Partnerships</span>
                <h3 className="mt-3 font-display text-2xl font-extrabold uppercase leading-[1.2] text-foreground">
                  Begin Your Journey With Connplex
                </h3>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Fill in the form to download detailed project viability reports, floor plans, and financial models.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Lead Form */}
          <div className="w-full lg:col-span-7">
            <Reveal>
              <Eyebrow>Inquire Now</Eyebrow>
              <SectionHeading className="mt-6">Request Project Viability Report</SectionHeading>
            </Reveal>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Reveal delay={0.05} className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                    placeholder="Enter your name"
                  />
                  {errors.fullName && <span className="text-[0.65rem] text-red-500">{errors.fullName}</span>}
                </Reveal>

                <Reveal delay={0.1} className="flex flex-col gap-2">
                  <label htmlFor="mobile" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                    placeholder="10-digit number"
                  />
                  {errors.mobile && <span className="text-[0.65rem] text-red-500">{errors.mobile}</span>}
                </Reveal>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Reveal delay={0.15} className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                    placeholder="name@domain.com"
                  />
                  {errors.email && <span className="text-[0.65rem] text-red-500">{errors.email}</span>}
                </Reveal>

                <Reveal delay={0.2} className="flex flex-col gap-2">
                  <label htmlFor="city" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Your City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                    placeholder="e.g. Mumbai, Pune"
                  />
                  {errors.city && <span className="text-[0.65rem] text-red-500">{errors.city}</span>}
                </Reveal>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Reveal delay={0.25} className="flex flex-col gap-2">
                  <label htmlFor="project" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Select Project Location</label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/45 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="" className="bg-background">Choose location...</option>
                    {projects.map((p) => (
                      <option key={p.name} value={p.name} className="bg-background">
                        {p.name} ({p.state})
                      </option>
                    ))}
                    <option value="Other / More Locations" className="bg-background">Other / Custom Location</option>
                  </select>
                  {errors.project && <span className="text-[0.65rem] text-red-500">{errors.project}</span>}
                </Reveal>

                <Reveal delay={0.3} className="flex flex-col gap-2">
                  <label htmlFor="budget" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Investment Budget</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="rounded-sm border border-border bg-surface/45 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="" className="bg-background">Choose budget...</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-background">{opt}</option>
                    ))}
                  </select>
                  {errors.budget && <span className="text-[0.65rem] text-red-500">{errors.budget}</span>}
                </Reveal>
              </div>

              <Reveal delay={0.35} className="flex flex-col gap-2">
                <label htmlFor="message" className="font-display text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Message / Remarks (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="rounded-sm border border-border bg-surface/40 px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none resize-none"
                  placeholder="Share details on timeline or specific site preferences..."
                />
              </Reveal>

              <Reveal delay={0.4} className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full group inline-flex items-center justify-center gap-2 rounded-sm px-8 py-4 font-display text-[0.78rem] font-bold uppercase tracking-[0.18em] transition-all duration-300 bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[0_10px_40px_-16px_rgba(212,175,55,0.7)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-18px_rgba(212,175,55,0.85)] cursor-pointer disabled:opacity-50 disabled:-translate-y-0"
                >
                  {submitting ? "Submitting Request..." : "Request Call Back"}
                </button>
              </Reveal>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
