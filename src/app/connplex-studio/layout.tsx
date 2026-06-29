import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connplex Studio | Audio-Visual & Film Production HQ",
  description: "Connplex Studio offers state-of-the-art production, dubbing, VFX, and audio mixing facilities for premium cinematic releases.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
