import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Releases, News & Promotions | Connplex",
  description: "Stay updated with the latest press releases, new cinema hall launches, promotional offers, and brand announcements from Connplex.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
