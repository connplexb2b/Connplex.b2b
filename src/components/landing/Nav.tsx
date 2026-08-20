import { Button } from "@/components/ui/button";

const links = [
  { label: "Your Offer", href: "#offer" },
  { label: "Why You", href: "#why-you" },
  { label: "Advantage", href: "#advantage" },
  { label: "Support", href: "#support" },
  { label: "Formats", href: "#formats" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a href="#top" className="font-display text-2xl tracking-[0.25em] text-gradient-gold">
          CONNPLEX
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="gold" size="sm">
          <a href="#apply">Unlock My Offer →</a>
        </Button>
      </div>
    </header>
  );
}
