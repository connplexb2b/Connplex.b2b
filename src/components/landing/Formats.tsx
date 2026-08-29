import { Button } from "@/components/ui/button";

const smartImg = "/flashsale/format-smart.jpg";
const signatureImg = "/flashsale/format-signature.jpg";
const luxuranceImg = "/flashsale/format-luxuriance.jpg";

const formats = [
  {
    name: "Smart",
    img: smartImg,
    price: "₹2.0 Cr",
    tagline: "Efficient luxury format for fast-growing markets.",
    points: ["2 screens · compact footprint", "Laser projection + Dolby sound", "Ideal for Tier 3 cities"],
  },
  {
    name: "Signature",
    img: signatureImg,
    price: "₹2.5 Cr",
    tagline: "Premium mid-sized multiplex experience.",
    points: ["3–4 screens · all recliners", "Cine Brew Café included", "Best fit for Tier 2 hubs"],
    featured: true,
  },
  {
    name: "Luxuriance",
    img: luxuranceImg,
    price: "₹4.0 Cr",
    tagline: "Flagship ultra-premium destination cinema.",
    points: ["Spectra X large format", "Designer lounges & event spaces", "Metro & Tier 1 flagships"],
  },
];

export function Formats() {
  return (
    <section id="formats" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-5">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Franchise Models</span>
        <h2 className="mt-5 text-4xl sm:text-6xl">
          Three Formats. <span className="text-gradient-gold">One Premium Standard.</span>
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {formats.map((f) => (
            <article
              key={f.name}
              className={`surface-card flex flex-col overflow-hidden ${
                f.featured ? "ring-1 ring-gold/60 lg:-translate-y-4" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={f.img}
                  alt={`Connplex ${f.name} format auditorium`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-52 w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--card),transparent_70%)]" />
                {f.featured && (
                  <span className="absolute top-4 right-4 bg-[image:var(--gradient-gold)] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                    Most Chosen
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-3xl tracking-[0.15em]">{f.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.tagline}</p>
                <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                  Investment starts from
                </p>
                <p className="font-display text-5xl text-gradient-gold">{f.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={f.featured ? "gold" : "outlineGold"}
                  size="lg"
                  className="mt-8 w-full"
                >
                  <a href="#apply">Enquire About {f.name}</a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
