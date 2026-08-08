"use client";

import { Toaster } from "sonner";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WhyPreApproved } from "./WhyPreApproved";
import { Projects } from "./Projects";
import { WhatYouGet } from "./WhatYouGet";
import { Journey } from "./Journey";
import { WhyInvestors } from "./WhyInvestors";
import { Faqs } from "./Faqs";
import { LeadForm } from "./LeadForm";
import { Footer } from "./Footer";

export function ConnplexLandingPage() {
  return (
    <div className="connplex-landing-theme min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <WhyPreApproved />
        <Projects />
        <WhatYouGet />
        <Journey />
        <WhyInvestors />
        <Faqs />
        <LeadForm />
      </main>
      <Footer />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
