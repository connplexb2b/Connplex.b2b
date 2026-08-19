"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050505]/90 border-b border-[oklch(1_0_0_/_12%)] backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-5 sm:px-10">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Left Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-12 w-1/3">
            <Link
              href="/experiences"
              className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="/formats"
              className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Formats
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center w-auto md:w-1/3">
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/assets/gameplex/gameplex-logo.png"
                alt="GamePlex Logo"
                className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.getElementById("nav-logo-fallback");
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <span
                id="nav-logo-fallback"
                className="hidden text-xl md:text-2xl font-bold tracking-[0.15em] text-gold-gradient uppercase font-cinzel"
              >
                GAME<span className="text-white">PLEX</span>
              </span>
            </Link>
          </div>

          {/* Right Menu (Desktop) */}
          <div className="hidden md:flex items-center justify-end space-x-12 w-1/3">
            <Link
              href="/franchise"
              className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Franchise
            </Link>
            <Link
              href="/contact"
              className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              Inquire Now
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-foreground focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col md:hidden transition-all duration-300">
          <div className="flex flex-col items-center justify-center space-y-8 pt-12 pb-6 px-6 text-center">
            <Link
              href="/experiences"
              onClick={() => setIsMobileOpen(false)}
              className="text-base font-semibold tracking-[0.25em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="/formats"
              onClick={() => setIsMobileOpen(false)}
              className="text-base font-semibold tracking-[0.25em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Formats
            </Link>
            <Link
              href="/franchise"
              onClick={() => setIsMobileOpen(false)}
              className="text-base font-semibold tracking-[0.25em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Franchise
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="text-base font-semibold tracking-[0.25em] uppercase hover:text-[color:var(--gold)] transition-colors"
            >
              Contact
            </Link>
            <div className="w-full pt-6 border-t border-[oklch(1_0_0_/_12%)]">
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="w-full inline-flex justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
