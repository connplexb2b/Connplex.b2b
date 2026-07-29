import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HNI Events — Connplex Cinema",
  description: "Exclusive HNI Premiere Nights at Connplex Cinemas — experience high-end luxury movie screenings and premier hospitality.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
