"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const leftLinks = [
  { to: "/experiences", label: "Experiences" },
  { to: "/formats", label: "Formats" },
] as const;

const rightLinks = [
  { to: "/franchise", label: "Franchise" },
  { to: "/contact", label: "Contact" },
] as const;

const allLinks = [{ to: "/", label: "Home" }, ...leftLinks, ...rightLinks] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getLinkClass = (to: string) => {
    // Check if the link is active on the subdomain or subpath
    // Support both '/experiences' and '/gameplex/experiences' in dev/production environments
    const isActive = pathname === to || pathname === `/gameplex${to}`;
    return `flex h-full items-center justify-center border-l border-border/50 px-6 font-eyebrow text-[0.68rem] font-medium uppercase tracking-[0.28em] transition-colors ${
      isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
    }`;
  };

  const getMobileLinkClass = (to: string) => {
    const isActive = pathname === to || pathname === `/gameplex${to}`;
    return `block border-b border-border/50 py-4 font-eyebrow text-xs uppercase tracking-[0.28em] transition-colors ${
      isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
    }`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#050505]/80 backdrop-blur-md transition-all duration-500 ${
        scrolled ? "border-b border-border shadow-lg" : "border-b border-border/60"
      }`}
    >
      <nav className="mx-auto hidden h-24 max-w-[1800px] items-stretch md:flex">
        {/* Left side links */}
        <div className="flex flex-1 items-stretch justify-end">
          {leftLinks.map((l) => (
            <Link key={l.to} href={l.to} className={getLinkClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center Wordmark Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center justify-center border-x border-border/50 px-8"
        >
          <img
            src="/assets/gameplex/gameplex-logo.png"
            alt="GamePlex by Connplex"
            className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback if logo fails
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("nav-logo-fallback");
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          <span
            id="nav-logo-fallback"
            className="hidden text-xl font-bold tracking-[0.2em] text-gold-gradient uppercase font-cinzel"
          >
            GAME<span className="text-white">PLEX</span>
          </span>
        </Link>

        {/* Right side links */}
        <div className="flex flex-1 items-stretch">
          {rightLinks.map((l) => (
            <Link key={l.to} href={l.to} className={getLinkClass(l.to)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-auto flex items-center border-l border-border/50 px-8 font-eyebrow text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-primary transition-all hover:brightness-110"
          >
            Inquire Now
          </Link>
        </div>
      </nav>

      {/* Mobile bar */}
      <div className="flex h-20 items-center justify-between px-5 md:hidden">
        <Link href="/" onClick={() => setOpen(false)} className="group flex items-center">
          <img
            src="/assets/gameplex/gameplex-logo.png"
            alt="GamePlex by Connplex"
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("nav-mobile-logo-fallback");
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
          <span
            id="nav-mobile-logo-fallback"
            className="hidden text-lg font-bold tracking-[0.2em] text-gold-gradient uppercase font-cinzel"
          >
            GAME<span className="text-white">PLEX</span>
          </span>
        </Link>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-primary p-2 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-border bg-[#050505]/97 px-5 pb-6 pt-2 backdrop-blur-xl md:hidden">
          {allLinks.map((l) => (
            <Link
              key={l.label}
              href={l.to}
              onClick={() => setOpen(false)}
              className={getMobileLinkClass(l.to)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-primary px-5 py-3 text-center font-eyebrow text-xs font-bold uppercase tracking-[0.28em] text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Inquire Now
          </Link>
        </div>
      )}
    </header>
  );
}
