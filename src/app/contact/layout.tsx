import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Connplex Cinemas | cinema Corporate Office & Inquiries",
  description: "Get in touch for cinema franchise details, brand advertisement slots, or private cinema booking. Contact our corporate team for official support.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
