import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downtown Screens & Experiential Lounges | Connplex",
  description: "Explore Connplex Downtown, our ultra-luxurious downtown cinema concept featuring high-end lounges, food concepts, and signature screens.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
