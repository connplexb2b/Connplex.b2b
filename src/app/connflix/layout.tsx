import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connflix | Stream Premium Originals & Cinema Content",
  description: "Stream exclusive next-gen cinema originals, regional indie projects, and premium film releases on the Connflix streaming ecosystem.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
