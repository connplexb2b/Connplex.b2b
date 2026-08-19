export function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="mx-auto grid h-full max-w-[1800px] grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-l border-border/40 last:border-r" />
        ))}
      </div>
    </div>
  );
}
