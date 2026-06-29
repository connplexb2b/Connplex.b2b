import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Notice & Corporate Information | Connplex",
  description: "View official corporate details, licensing agreements, legal disclosures, and regulatory filings for Connplex Cinemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
