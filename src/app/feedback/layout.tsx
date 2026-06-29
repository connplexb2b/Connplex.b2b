import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Feedback & Suggestions | Connplex Cinemas",
  description: "Your experience matters. Send us your feedback, inquiries, or suggestions to help us refine your premium next-gen cinema experience.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
