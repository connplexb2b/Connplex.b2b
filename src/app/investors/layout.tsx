import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Desk & Shareholder Information | Connplex",
  description: "Partner with Connplex. View investor presentations, shareholder announcements, growth strategies, and official reports.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
