import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinema Gallery & Infrastructure Showcase | Connplex",
  description: "Take a visual tour of Connplex premium cinema halls, recliners, active LED screens, gourmet F&B counters, and events.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
