"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  const getHref = (to: string) => {
    if (pathname?.startsWith("/gameplex")) {
      if (to === "/") return "/gameplex";
      return `/gameplex${to}`;
    }
    return to;
  };

  return (
    <footer className="relative z-10 border-t border-[oklch(1_0_0_/_12%)] bg-[#050505] py-16 text-muted-foreground font-sans">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Column 1: Brand Blurb */}
          <div className="space-y-6">
            <Link href={getHref("/")} className="inline-block">
              <span className="text-2xl font-bold tracking-[0.15em] text-white uppercase font-cinzel">
                GAME<span className="text-gold-gradient font-semibold">PLEX</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-muted-foreground">
              A premium entertainment franchise concept by Connplex. Redefining modern socialize-and-play venues with cinema-grade hospitality, cutting-edge technology, and luxury gaming environments.
            </p>
          </div>

          {/* Column 2: Explore Links */}
          <div className="space-y-6 md:pl-12">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white font-outfit">
              Explore
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href={getHref("/experiences")} className="hover:text-white transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href={getHref("/formats")} className="hover:text-white transition-colors">
                  Formats
                </Link>
              </li>
              <li>
                <Link href={getHref("/franchise")} className="hover:text-white transition-colors">
                  Franchise
                </Link>
              </li>
              <li>
                <Link href={getHref("/contact")} className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Invest CTA */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white font-outfit">
              Franchise Opportunities
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bring India's fastest-growing luxury social gaming destination to your city. Scale across three premium formats.
            </p>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-outfit">
                Minimum Investment Starts From
              </p>
              <p className="mt-1 text-2xl font-bold text-white font-sora">
                ₹2 Crore <span className="text-gold-gradient font-medium text-lg">Onwards</span>
              </p>
            </div>
            <Link
              href={getHref("/contact")}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[color:var(--gold)] transition-colors group"
            >
              <span>Download Pitch Deck</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-[oklch(1_0_0_/_12%)]">
          <div className="gold-line mb-8" />
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 text-xs">
            <p>© {new Date().getFullYear()} GamePlex. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
