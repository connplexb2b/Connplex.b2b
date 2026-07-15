import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Odyssey — Connplex Ultra HNI Premier Night",
  description: "An invitation-only Ultra HNI premiere of Christopher Nolan's The Odyssey. July 18, 2026 · 7:55 PM at Connplex Luxury Cinemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
