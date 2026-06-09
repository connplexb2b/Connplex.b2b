import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Connplex Cinemas",
  description: "Understand the terms, cancellation windows, processing fees, and refund guidelines for movie tickets, F&B orders, private screenings, and advertising slots at Connplex Cinemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
