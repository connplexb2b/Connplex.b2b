import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Products | Connplex Cinemas",
  description: "Explore our range of cinema-grade products and entertainment ecosystem.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
