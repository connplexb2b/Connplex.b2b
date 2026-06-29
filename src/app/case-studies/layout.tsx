import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinema Advertising & Partnership Case Studies | Connplex",
  description: "See real-world success stories of on-screen cinema ads, brand launches, and capex lease models implemented by Connplex Cinemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
