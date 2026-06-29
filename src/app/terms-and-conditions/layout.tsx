import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Website Usage | Connplex Cinemas",
  description: "Access the official terms of service governing ticketing, website usage, private hall rentals, and brand partnerships at Connplex.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
