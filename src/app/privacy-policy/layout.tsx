import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | Connplex Cinemas",
  description: "Read our privacy policy to understand how we collect, store, secure, and use your personal information when using Connplex services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
