import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On Screen cinema Ads & Cinema Advertising Rates | Connplex",
  description: "Advertise on India's most premium cinema screens. Get cost-effective on-screen ads, digital lobby branding, and high-recall cinema marketing rates.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
