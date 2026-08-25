import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchise Payment & Refund Policy | Connplex Cinemas",
  description: "Understand the terms, categories of payments, resource allocation, applicant withdrawal, and refund guidelines for Connplex franchise applications.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
