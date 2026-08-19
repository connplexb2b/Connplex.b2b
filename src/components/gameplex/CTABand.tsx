import Link from "next/link";
import { Reveal } from "./Reveal";

export function CTABand() {
  return (
    <section className="relative overflow-hidden border-t border-[oklch(1_0_0_/_12%)] py-24 font-sans">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold sm:text-5xl">
            <span className="block tracking-[0.12em] font-sora">Connplex built successful franchises.</span>
            <span className="mt-2 block text-gold-gradient sm:mt-3 font-sora">Now, it builds GamePlex.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            The opportunity to create your city's most talked-about entertainment destination.
            Investment begins from ₹2 Crore.
          </p>
          <div className="mt-9">
            <Link href="/contact" className="inline-flex rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.55)] shadow-md">
              Become part of the GamePlex story
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
