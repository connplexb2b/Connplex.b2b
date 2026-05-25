import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Connplex Cinemas | Founders Anish Patel & Rahul Dhyani",
  description: "Learn about Connplex Cinemas, founded by Rahul Dhyani & Anish Patel. Discover our vision of scaling premium cinema experiences in Tier 1 & 2 cities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
