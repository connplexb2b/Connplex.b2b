import { Banknote, Handshake, TrendingUp, Megaphone } from "lucide-react";

const pillars = [
  {
    icon: Banknote,
    tag: "01 · Funding",
    title: "Loan Management From Our Side",
    body: "You don't chase banks — we do. Our in-house finance desk structures, files and follows through on your entire cinema loan, end to end.",
    points: [
      "Tie-ups with leading nationalised & private banks and NBFCs",
      "Project report, DPR, cash-flow model and valuation prepared by us",
      "Up to 60–70% of project cost fundable as term loan",
      "Documentation, sanction follow-up and disbursement tracking handled",
      "Guidance on collateral, subsidy schemes and equipment leasing options",
    ],
  },
  {
    icon: Handshake,
    tag: "02 · Partnership",
    title: "Co-Investment Plan",
    body: "For high-potential sites, Connplex puts its own money on the table — up to 40% company participation, so risk and reward are genuinely shared.",
    points: [
      "Up to 40% equity participation by Connplex in select locations",
      "Skin-in-the-game model: we win only when your cinema wins",
      "Lower personal capital outlay for the franchise partner",
      "Joint approval on site, design and capex to protect both sides",
      "Company-managed operations with transparent monthly reporting",
    ],
  },
  {
    icon: TrendingUp,
    tag: "03 · Returns",
    title: "ROI You Can Model",
    body: "An 80% revenue share across eight streams, with a lean cost base, targets full capital recovery in 18–24 months.",
    points: [
      "80% revenue share to the franchise partner",
      "Payback period: 18–24 months on a well-selected site",
      "Revenue from box office, F&B, ads, events, private screenings & more",
      "AI dynamic pricing and smart scheduling to lift occupancy",
      "Lower CapEx and manpower cost vs. traditional multiplexes",
    ],
  },
  {
    icon: Megaphone,
    tag: "04 · Growth",
    title: "₹10 Lakh Marketing Spend",
    body: "A dedicated ₹10,00,000 marketing investment behind your launch and first-year growth — planned and executed by the Connplex brand team.",
    points: [
      "Grand launch campaign: outdoor, radio, digital and PR",
      "Always-on performance marketing on Meta, Google & YouTube",
      "Local influencer, school, corporate and mall tie-ups",
      "Loyalty programme, offers calendar and festival campaigns",
      "Creative, media buying and reporting managed centrally",
    ],
  },
];

const stats = [
  { v: "Up to 70%", l: "Project cost loan-funded" },
  { v: "Up to 40%", l: "Company co-investment" },
  { v: "18–24 mo", l: "Target ROI window" },
  { v: "₹10 Lac", l: "Marketing spend" },
];

export function Support() {
  return (
    <section id="support" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-5">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">
          Investor Support Programme
        </span>
        <h2 className="mt-5 max-w-3xl text-4xl sm:text-6xl">
          We Fund, Co-Invest And{" "}
          <span className="text-gradient-gold">Market It With You.</span>
        </h2>

        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-background px-6 py-7">
              <div className="font-display text-4xl text-gradient-gold">{s.v}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pillars.map((p) => (
            <article key={p.title} className="surface-card p-9">
              <div className="flex items-center gap-3">
                <p.icon className="size-7 text-gold" strokeWidth={1.4} />
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-5 text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 bg-[image:var(--gradient-gold)]" />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
