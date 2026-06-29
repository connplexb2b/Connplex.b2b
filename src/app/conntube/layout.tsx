import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConnTube | Next-Gen Video Streaming Platform",
  description: "Share, stream, and interact on ConnTube, the dedicated video streaming platform integrated into the Connplex Cinemas digital ecosystem.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
