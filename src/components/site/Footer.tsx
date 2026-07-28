"use client";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <img src="/images/logo.png" alt="Connplex Cinemas" className="mx-auto h-9 w-auto sm:h-10" />
        <p className="mt-4 text-xs tracking-widest text-muted-foreground uppercase font-display">Own a Connplex Cinema at a Pre-Approved Location</p>
        <p className="mt-8 text-[0.66rem] text-muted-foreground/60">&copy; {new Date().getFullYear()} Connplex Cinemas. All rights reserved.</p>
      </div>
    </footer>
  );
}
