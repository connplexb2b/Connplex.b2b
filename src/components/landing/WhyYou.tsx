import { Button } from "@/components/ui/button";

const reasons = [
  { k: "Your benefit", v: "upto ₹5,00,000 discount on franchise fee" },
  { k: "Your advantage", v: "Priority territory discussion" },
  { k: "Your support", v: "Site feasibility + turnkey execution" },
  { k: "Your opportunity", v: "Build your own cinema with Connplex" },
];

const rows = [
  { label: "Franchise Fee", std: "₹15,00,000 + GST", you: "₹10,00,000 + GST" },
  { label: "Your Saving", std: "—", you: "₹5,00,000" },
  { label: "Feasibility Study", std: "Paid / Standard", you: "Included" },
  { label: "Territory Discussion", std: "Standard", you: "Priority" },
];

const urgency = [
  { t: "Limited Invitation", d: "Only for first-time Connplex partners." },
  { t: "Limited Territories", d: "One opportunity per selected city or territory." },
  { t: "Limited Time", d: "The ₹5,00,000 franchise-fee discount ends with this expansion cycle." },
];

export function WhyYou() {
  return (
    <section id="why-you" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-5">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">You Qualify</span>
        <h2 className="mt-5 max-w-3xl text-4xl sm:text-6xl">
          Why Did You Receive <span className="text-gradient-gold">This Offer?</span>
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Because we&apos;re opening select territories to first-time Connplex partners. We are
          currently expanding our cinema network across Tier 1, Tier 2 and Tier 3 India and have
          reserved a limited number of first-partner benefits for investors entering during this
          expansion cycle.
        </p>

        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.k} className="bg-background p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{r.k}</p>
              <p className="mt-3 text-lg">{r.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Your Connplex Entry Benefit
            </p>
            <table className="mt-7 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="pb-3 font-normal"></th>
                  <th className="pb-3 font-normal">Standard</th>
                  <th className="pb-3 font-normal text-gold">Your Offer</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-border/60">
                    <td className="py-4 text-muted-foreground">{r.label}</td>
                    <td className="py-4 text-muted-foreground">{r.std}</td>
                    <td className="py-4 font-display text-xl text-gradient-gold">{r.you}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-7 text-lg">
              You save <span className="text-gradient-gold font-display text-2xl">₹5 Lakh</span>{" "}
              by joining during this offer window.
            </p>
            <Button asChild variant="gold" size="xl" className="mt-7 w-full">
              <a href="#apply">Secure My Benefit →</a>
            </Button>
          </div>

          <div className="grid gap-px self-start bg-border">
            {urgency.map((u) => (
              <div key={u.t} className="bg-background p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-crimson">{u.t}</p>
                <p className="mt-3 text-muted-foreground">{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
