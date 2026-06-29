import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sky Inn Premium Lounges & Luxury Stay | Connplex",
  description: "Indulge in Sky Inn, our premium boutique stay and luxury lounge concept integrated inside premium cinema properties.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
