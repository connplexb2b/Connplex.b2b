import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConnMusic | Cinema-Grade Audio & Music Streaming",
  description: "Discover ConnMusic, our dedicated platform for high-fidelity audio releases, movie soundtracks, and independent artist albums.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
