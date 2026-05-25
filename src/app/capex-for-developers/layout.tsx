import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mall cinema Lease & CAPEX Partnership for Real Estate Developers",
  description: "Maximize your commercial property value. Partner with Connplex under highly profitable CAPEX lease models and revenue-sharing cinema agreements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
