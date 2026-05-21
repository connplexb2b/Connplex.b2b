import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Movie Screen for Corporate Event & Private Screenings",
  description: "Book a premium cinema screen hall for corporate presentations, private screenings, VIP previews, or brand launches. Contact Connplex for slots.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
