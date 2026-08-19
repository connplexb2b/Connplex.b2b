"use client";

import { useState } from "react";
import { Reveal } from "@/components/gameplex/Reveal";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    format: "Standard",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        city: "",
        format: "Standard",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="py-20 px-5 sm:px-10 max-w-[1800px] mx-auto font-sans">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Reveal>
          <span className="eyebrow block mb-4">Start the Conversation</span>
          <h1 className="text-4xl sm:text-6xl font-bold font-sora text-white mb-6">
            Become a Partner in <span className="text-gold-gradient">GamePlex</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with our franchise expansion division to analyze opportunities in your territory.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Contact Info (4 cols) */}
        <div className="lg:col-span-5 space-y-10">
          <Reveal>
            <h2 className="text-2xl font-bold font-sora text-white mb-6">
              Franchise Office
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Reach out directly to arrange an in-person meeting or schedule a walkthrough of one of our live operating entertainment centers.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/50">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Locations</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Connplex HQ, Ahmedabad, Gujarat, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/50">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Call Franchise Team</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-secondary/50 text-primary border border-border/50">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Franchise Team</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <a href="mailto:franchise@theconnplex.com" className="hover:text-white transition-colors">franchise@theconnplex.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-xl border border-border/50 bg-secondary/10">
              <h4 className="font-bold text-white mb-2">Investor Notice</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All territorial licenses are allocated on a first-come, first-served basis subject to commercial approvals and board vetting.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="bg-secondary/15 border border-border/80 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold font-sora text-white">Inquiry Received</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                    Thank you for your interest. A regional franchise manager will contact you via phone or email within 24 hours with details and a pitch deck.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex rounded-full border border-primary/30 px-6 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target City</label>
                      <input
                        type="text"
                        required
                        value={formState.city}
                        onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                        className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm"
                        placeholder="City of deployment"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Format</label>
                    <select
                      value={formState.format}
                      onChange={(e) => setFormState({ ...formState, format: e.target.value })}
                      className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm appearance-none"
                    >
                      <option value="Mini">GamePlex Mini (~5,000 Sq. Ft. / ₹2 Cr.)</option>
                      <option value="Standard">GamePlex Standard (~10,000 Sq. Ft. / ₹4 Cr.)</option>
                      <option value="Grand">GamePlex Grand (~15,000 Sq. Ft. / ₹6 Cr.)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Territory Details & Message</label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full bg-black/60 border border-border/60 hover:border-primary/50 focus:border-primary focus:outline-none rounded-lg px-4 py-3 text-white transition-all text-sm resize-none"
                      placeholder="Share details about proposed commercial space, timing, etc."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-full bg-primary hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Confidential Inquiry"}</span>
                    {!isSubmitting && <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
