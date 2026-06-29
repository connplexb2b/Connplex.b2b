import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Relations & Financial Disclosures | Connplex",
  description: "Access financial statements, corporate governance updates, and official investor documentation for Connplex Cinemas Limited.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
