export function UnlockedStrip() {
  return (
    <section className="border-y border-gold/30 bg-[linear-gradient(180deg,oklch(0.19_0.02_34),oklch(0.145_0.012_30))] py-14">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">
          This Offer Was Unlocked For You
        </span>
        <h2 className="mt-5 text-3xl sm:text-5xl">
          Not Everyone Gets <span className="text-gradient-gold">This Offer</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Your first Connplex cinema qualifies you for a ₹5,00,000 discount on the standard franchise fee.
          Choose your city. Complete your evaluation. Lock your opportunity before this benefit
          expires.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {["₹5,00,000 Discount", "First-Time Partners", "Limited Invitation"].map((t) => (
            <span
              key={t}
              className="border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-gold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
