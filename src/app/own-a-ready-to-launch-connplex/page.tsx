import type { Metadata } from "next";
import { ConnplexLandingPage } from "@/components/site/ConnplexLandingPage";

export const metadata: Metadata = {
  title: "Own a Ready-to-Launch Connplex — Cinema Investment Projects",
  description: "Own a Ready-to-Launch Connplex at a pre-approved location. Seventeen curated cinema investment projects across India with feasibility, execution and franchise support.",
  openGraph: {
    title: "Own a Ready-to-Launch Connplex — Cinema Investment Projects",
    description: "Own a Ready-to-Launch Connplex at a pre-approved location. Seventeen curated cinema investment projects across India.",
    type: "website",
  },
};

export default function Page() {
  return <ConnplexLandingPage />;
}
