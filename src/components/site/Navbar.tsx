"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Investment Journey", href: "#journey" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "border-b border-transparent bg-transparent")}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#home" className="flex items-center">
          <img src="/images/logo.png" alt="Connplex Cinemas" className="h-9 w-auto sm:h-10" />
        </a>
        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold">{l.label}</a>
          ))}
          <a href="#contact" className="rounded-sm bg-[image:var(--gradient-gold)] px-6 py-3 font-display text-[0.72rem] font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-18px_rgba(212,175,55,0.9)]">Become Investor</a>
        </div>
        <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)} className="text-gold lg:hidden cursor-pointer">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{l.label}</a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="rounded-sm bg-[image:var(--gradient-gold)] px-6 py-3 text-center font-display text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">Become Investor</a>
          </div>
        </div>
      )}
    </header>
  );
}
