import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Connplex Digital & Cinema Ecosystem",
  description: "Explore the connected entertainment universe of Connplex: ConnEvents, ConnMusic, Connflix, Connplex Studio, ConnTube, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
