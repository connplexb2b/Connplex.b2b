import { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { OfferBanner } from "@/components/landing/OfferBanner";
import { UnlockedStrip } from "@/components/landing/UnlockedStrip";
import { WhyYou } from "@/components/landing/WhyYou";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { Advantage } from "@/components/landing/Advantage";
import { Support } from "@/components/landing/Support";
import { Formats } from "@/components/landing/Formats";
import { LeadForm } from "@/components/landing/LeadForm";
import { Contact } from "@/components/landing/Contact";
import { Toaster } from "sonner";

const title = "Connplex Cinema Franchise | 50% Off Franchise Fee";
const description =
  "Own a Connplex smart luxury cinema. 80% revenue share, 18-24 month ROI, launch in 90-120 days. Limited 50% franchise fee discount for first-time partners.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://www.theconnplex.com/flashsale",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function FlashSalePage() {
  return (
    <main className="flashsale-theme min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="top-center" richColors />
      <Nav />
      <Hero />
      <UnlockedStrip />
      <OfferBanner />
      <WhyYou />
      <Advantage />
      <Support />
      <Formats />
      <LeadForm />
      <ClosingCta />
      <Contact />
    </main>
  );
}
