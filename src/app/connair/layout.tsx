import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConnAir Active Air Purification Systems | Connplex",
  description: "Learn about ConnAir, Connplex's advanced custom air purification system delivering healthy, clean, and allergen-free air in every cinema hall.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
