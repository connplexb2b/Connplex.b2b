import { Button } from "@/components/ui/button";

const heroVideoUrl = "/flashsale/hero-cinema.mp4";
const heroPosterUrl = "/flashsale/hero-auditorium.jpg";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideoUrl}
        poster={heroPosterUrl}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background)_4%,transparent_55%)]" />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pt-28 pb-16">
        <span className="w-fit border border-gold/50 px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-gold">
          A Private Invitation For First-Time Partners
        </span>
        <h1 className="mt-7 max-w-4xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          Your <span className="text-gradient-gold">upto 50% Franchise Fee</span>
          <br />
          Benefit Is Waiting.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          You&apos;ve taken the first step toward owning a Connplex Cinema. To make your entry
          into the cinema business easier, we&apos;re extending an exclusive upto 50% waiver on your
          franchise fee — available for a limited time and only for first-time Connplex partners.
        </p>

        <div className="mt-9 flex w-fit flex-wrap items-end gap-8 border border-gold/30 bg-background/70 px-7 py-5 backdrop-blur-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Standard Franchise Fee
            </p>
            <p className="mt-1 font-display text-3xl text-muted-foreground line-through">
              ₹15,00,000
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Your Exclusive Fee</p>
            <p className="mt-1 font-display text-4xl text-gradient-gold">₹11,50,000</p>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button asChild variant="gold" size="xl">
            <a href="#apply">Claim My Exclusive Offer →</a>
          </Button>
          <Button asChild variant="outlineGold" size="xl">
            <a href="#formats">Explore Formats</a>
          </Button>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Limited invitations · First-time partners only · Offer valid for a limited period
        </p>
      </div>
    </section>
  );
}
