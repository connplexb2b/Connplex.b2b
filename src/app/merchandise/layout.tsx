import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connplex Shop | Official Cinema Merchandise & Apparel",
  description: "Buy official Connplex movie merchandise, cinema-themed apparel, premium collectables, and pop culture accessories online.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
