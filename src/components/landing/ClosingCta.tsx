import { Button } from "@/components/ui/button";

export function ClosingCta() {
  return (
    <section className="border-t border-border bg-[linear-gradient(180deg,oklch(0.19_0.02_34),oklch(0.145_0.012_30))] py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-4xl sm:text-6xl">
          Your City Could Be The <span className="text-gradient-gold">Next Connplex.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          And right now, you have an exclusive reason to make it happen. This isn&apos;t a public
          discount — it&apos;s an invitation for first-time partners entering the Connplex
          expansion cycle.
        </p>
        <p className="mt-10 text-xs uppercase tracking-[0.35em] text-gold">
          Ready To Claim Your Offer?
        </p>
        <Button asChild variant="gold" size="xl" className="mt-6">
          <a href="#apply">Yes, I Want My Upto 50% Benefit →</a>
        </Button>
        <p className="mt-6 text-xs text-muted-foreground">
          Offer subject to eligibility, territory availability and final franchise agreement.
        </p>
      </div>
    </section>
  );
}
