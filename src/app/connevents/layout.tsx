import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Screenings & Community Event Management | ConnEvents",
  description: "Experience ConnEvents. Host community meetups, live sports screenings, fan conventions, and corporate bookings on premium cinema screens.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
