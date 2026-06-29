import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers & Job Openings | Connplex Cinemas",
  description: "Join the team at India's fastest-growing premium next-gen cinema chain. Explore corporate, cinema-level, and internship roles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
