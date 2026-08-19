import type { Metadata } from "next";
import { SiteNav } from "@/components/gameplex/SiteNav";
import { GridLines } from "@/components/gameplex/GridLines";
import { SiteFooter } from "@/components/gameplex/SiteFooter";

export const metadata: Metadata = {
  title: "GamePlex | Premium Entertainment Franchise by Connplex",
  description: "Create your city's most talked-about entertainment destination. Invest in GamePlex premium lounge and socializing gaming centers.",
};

export default function GameplexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gameplex-theme relative min-h-screen bg-[oklch(0.07_0.004_60)] text-[oklch(0.97_0.006_80)] selection:bg-[oklch(0.82_0.14_84)] selection:text-black antialiased font-sans">
      <GridLines />
      <SiteNav />
      {/* SiteNav is fixed and 20/24h, this main component should start relative to it */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
