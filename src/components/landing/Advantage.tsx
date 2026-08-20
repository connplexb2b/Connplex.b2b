import {
  Armchair,
  BadgePercent,
  BrainCircuit,
  Building2,
  Clock4,
  Coins,
  Cpu,
  LayoutGrid,
  LineChart,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: Coins,
    title: "80% Revenue Share",
    body: "Partner-first economics across box office, F&B, advertising and events.",
  },
  {
    icon: Clock4,
    title: "18–24 Month ROI",
    body: "Lower CapEx and a lean footprint compared to traditional multiplexes.",
  },
  {
    icon: Building2,
    title: "Launch In 90–120 Days",
    body: "Optimised execution from site handover to first show.",
  },
  {
    icon: Armchair,
    title: "All-Recliner Auditoriums",
    body: "No economy rows. Luxury seating in every screen, every format.",
  },
  {
    icon: Cpu,
    title: "Smart Cinema Technology",
    body: "Laser projection, Dolby immersive sound and automated show control.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Operations",
    body: "Dynamic pricing, smart scheduling and analytics that lift occupancy.",
  },
  {
    icon: LayoutGrid,
    title: "8 Revenue Streams",
    body: "Box office, F&B, advertising, events, private screenings, brand activations and more.",
  },
  {
    icon: BadgePercent,
    title: "Up To 40% Company Participation",
    body: "Connplex co-invests in select high-potential sites.",
  },
  {
    icon: Users,
    title: "End-To-End Support",
    body: "Site selection, design, licensing, hiring, marketing and operations — handled.",
  },
];

const support = [
  "Site Selection",
  "Design & Architecture",
  "Technology Setup",
  "Licensing & Legal",
  "Vendor Management",
  "Recruitment & Training",
  "Marketing Campaigns",
  "Operations Management",
];

export function Advantage() {
  return (
    <section id="advantage" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-5">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">
          A Glimpse Of The Franchise
        </span>
        <h2 className="mt-5 max-w-3xl text-4xl sm:text-6xl">
          Built For Scale. <span className="text-gradient-gold">Designed For Profitability.</span>
        </h2>

        <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group bg-background p-8 transition-colors hover:bg-card"
            >
              <b.icon className="size-7 text-gold" strokeWidth={1.4} />
              <h3 className="mt-5 text-2xl">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div id="opportunity" className="surface-card p-9">
            <LineChart className="size-7 text-gold" strokeWidth={1.4} />
            <h3 className="mt-5 text-3xl">The Underserved Market</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              India has just 9,000–10,000 screens for 1.4 billion people — the largest
              cinema-loving nation with the least premium infrastructure.
            </p>
            <div className="mt-7 space-y-4">
              {[
                { c: "India", v: "1 : 1,47,000", w: "w-full" },
                { c: "China", v: "1 : 24,000", w: "w-1/4" },
                { c: "USA", v: "1 : 8,000", w: "w-[10%]" },
              ].map((r) => (
                <div key={r.c}>
                  <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{r.c}</span>
                    <span>{r.v} people/screen</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-secondary">
                    <div className={`h-full bg-[image:var(--gradient-gold)] ${r.w}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-9">
            <Sparkles className="size-7 text-gold" strokeWidth={1.4} />
            <h3 className="mt-5 text-3xl">From Location To Launch, We Handle Everything</h3>
            <ul className="mt-7 grid gap-y-4 sm:grid-cols-2">
              {support.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-display text-lg text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <Ticket className="size-4 text-gold" />
              A complete turnkey cinema ecosystem — you invest, we operate the craft.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
