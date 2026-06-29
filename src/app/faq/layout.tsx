import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ & Help Center | Connplex Cinemas",
  description: "Get answers to questions regarding online ticket bookings, cinema franchise costs, B2B advertisements, and private screenings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
