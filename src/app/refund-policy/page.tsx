"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Building2,
  Megaphone,
  Briefcase,
  Settings,
  AlertTriangle,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PolicyItem {
  num: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  intro: string;
  details: string[];
}

const policyItems: PolicyItem[] = [
  {
    num: "01.",
    icon: <Building2 size={28} />,
    title: "CORPORATE BOOKINGS & PRIVATE EVENTS",
    badge: "Event Terms",
    intro: "Due to the extensive planning, venue blocking, resource allocation, and operational preparation involved, confirmed corporate bookings, private screenings, and event reservations are generally non-refundable.",
    details: [
      "Cancellations made within the agreed notice period may be eligible for partial credit or rescheduling, subject to management approval.",
      "Requests received after operational commitments have commenced may not qualify for refunds.",
      "Date modifications are subject to venue availability and operational feasibility.",
    ],
  },
  {
    num: "02.",
    icon: <Megaphone size={28} />,
    title: "ADVERTISING & BRAND PARTNERSHIPS",
    badge: "Media Allocations",
    intro: "Advertising campaigns, sponsorships, in-cinema branding, digital promotions, and experiential activations involve advance planning, inventory allocation, creative deployment, and media commitments.",
    details: [
      "Payments made toward confirmed advertising or partnership campaigns are generally non-refundable.",
      "In the event of campaign modifications, Connplex may offer equivalent inventory, alternative placements, or revised campaign schedules at its discretion.",
    ],
  },
  {
    num: "03.",
    icon: <Briefcase size={28} />,
    title: "FRANCHISE & BUSINESS DEVELOPMENT SERVICES",
    badge: "Consultation Fees",
    intro: "Connplex provides comprehensive support to developer and franchise partners. Commercial site audits and analytical audits require early resource planning.",
    details: [
      "Fees paid toward franchise evaluations, feasibility studies, consultation services, project assessments, business development support, or related professional services are non-refundable once the engagement process has commenced.",
    ],
  },
  {
    num: "04.",
    icon: <Settings size={28} />,
    title: "TECHNOLOGY & PROJECT CONSULTING",
    badge: "Consulting Terms",
    intro: "For specialized technical advisory, cinema design setups, and execution monitoring, deliverables are tied to commercial milestones.",
    details: [
      "For consulting, operational advisory, technology implementation, and project management services, refunds are not applicable for work already completed, delivered, or initiated under agreed commercial terms.",
    ],
  },
  {
    num: "05.",
    icon: <AlertTriangle size={28} />,
    title: "EXCEPTIONAL CIRCUMSTANCES",
    badge: "Force Majeure",
    intro: "In rare operational circumstances, Connplex guarantees business protection and alternative solutions to ensure business continuity.",
    details: [
      "In rare situations involving force majeure events, venue unavailability, regulatory restrictions, or circumstances beyond reasonable control, Connplex may offer alternative solutions including rescheduling, service credits, or mutually agreed commercial adjustments.",
    ],
  },
  {
    num: "06.",
    icon: <CreditCard size={28} />,
    title: "PAYMENT DISPUTES",
    badge: "Banking Timelines",
    intro: "We work to ensure secure transactions and rapid resolution of payment discrepancies across all payment channels.",
    details: [
      "If a payment is processed successfully but the corresponding service engagement is not confirmed, the amount will be reviewed and, where applicable, refunded to the original payment method within the standard banking timeline.",
    ],
  },
];

const faqs = [
  {
    q: "Can corporate bookings or private screenings be rescheduled?",
    a: "Yes, date modifications are possible but remain subject to venue availability and operational feasibility. Cancellations or modifications made within the agreed notice period are eligible for partial credit or rescheduling, subject to management approval.",
  },
  {
    q: "Are advertising campaign payments refundable?",
    a: "Payments made toward confirmed advertising or brand partnership campaigns are generally non-refundable because inventory allocation and creative deployment planning begin immediately. However, Connplex may offer alternative placements or scheduling adjustments at its discretion.",
  },
  {
    q: "What is the policy for franchise consultation and site assessment fees?",
    a: "Fees paid toward site audits, feasibility studies, and consultation assessments are strictly non-refundable once our analytics and site inspection teams commence the evaluation process.",
  },
  {
    q: "How long does it take for a disputed transaction refund to reflect?",
    a: "For verified payment failures where a service was not confirmed, the refunded amount will be processed back to your original payment source within standard banking timelines (typically 5 to 7 business days).",
  },
];

export default function RefundPolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white font-outfit leading-relaxed overflow-x-hidden antialiased">
      <style>{`
        @keyframes ppFadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center h-screen px-[5%] md:px-[10%] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/privacy-hero.png"
            alt="Connplex Cinema"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.82) 100%)",
          }}
        />
        <div className="relative z-10">
          <div className="text-[0.8rem] text-[#A0A0A0] mb-[30px] tracking-[2px] font-medium uppercase">
            HOME / <span className="text-[#C5A059]">REFUND POLICY</span>
          </div>
          <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] font-extrabold leading-[0.85] mb-10 uppercase tracking-[2px]">
            <span
              className="text-[#C5A059] block brightness-125"
              style={{ textShadow: "0 0 20px rgba(197, 160, 89, 0.4)" }}
            >
              REFUND &
            </span>
            CANCELLATION
          </h1>
          <div
            className="max-w-[650px] text-[#A0A0A0] text-[0.95rem] min-[481px]:text-[1.05rem] leading-[1.8] border-l-2 border-[#C5A059] pl-[15px] min-[481px]:pl-[30px]"
            style={{ animation: "ppFadeIn 1s ease-out 0.5s both" }}
          >
            <p className="font-bold text-white mb-2 text-base tracking-wide uppercase">
              Commitment to Professional Partnerships
            </p>
            <p>
              At Connplex, we are committed to delivering exceptional business
              solutions across cinema development, franchise partnerships,
              corporate events, private screenings, advertising collaborations,
              and experiential marketing initiatives. Our refund and cancellation
              policy is designed to ensure transparency, accountability, and
              smooth business engagements for all stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Items Grid */}
      <section className="pt-20 pb-10 px-[5%] md:pt-[120px] md:pb-[60px] md:px-[10%] bg-black relative flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-0"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[120px] gap-y-[100px] gap-[60px] max-w-[1400px]">
          {policyItems.map((item) => (
            <div
              className="flex flex-col min-[481px]:flex-row gap-[15px] min-[481px]:gap-[35px] transition-transform duration-400 ease hover:-translate-y-1.25 group z-10"
              key={item.num}
            >
              <div
                className="min-w-[60px] h-[60px] min-[481px]:min-w-[80px] min-[481px]:h-[80px] rounded-full border border-[rgba(197,160,89,0.2)] flex items-center justify-center text-[#C5A059] shadow-[inset_0_0_15px_rgba(197,160,89,0.1)] transition-all duration-300 shrink-0 group-hover:border-[#C5A059] group-hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] group-hover:scale-105"
                style={{
                  background:
                    "radial-gradient(circle, rgba(197,160,89,0.05) 0%, rgba(0,0,0,0) 100%)",
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <h3 className="text-[1.1rem] font-bold text-white tracking-[1.5px] uppercase transition-colors duration-300 group-hover:text-[#C5A059] m-0">
                    <span className="text-[#C5A059] mr-2.5">{item.num}</span>{" "}
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="text-[10px] font-semibold bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[#A0A0A0] text-[0.95rem] leading-[1.8] mb-4">
                  {item.intro}
                </p>
                <ul className="list-disc pl-5 text-[#A0A0A0] text-[0.9rem] leading-[1.8] flex flex-col gap-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="relative z-10 mt-32 w-full max-w-[900px]">
          <h2 className="text-[#C5A059] text-[1.8rem] font-extrabold mb-10 tracking-[2px] uppercase text-center md:text-left">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="flex flex-col gap-5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#c5a059]/20 rounded-lg overflow-hidden bg-[#0A0A0A] transition-all duration-300 hover:border-[#c5a059]/40"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                  >
                    <span className="text-white font-bold text-base tracking-[0.5px] pr-4">
                      {faq.q}
                    </span>
                    <span className="text-[#C5A059] shrink-0">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "max-h-[300px] border-t border-[#c5a059]/10"
                        : "max-h-0"
                    }`}
                  >
                    <div className="p-6 text-[#A0A0A0] text-[0.95rem] leading-[1.8]">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="relative z-10 mt-24 w-full max-w-[900px] border-t border-[#c5a059]/20 pt-10 text-[#A0A0A0] text-[0.95rem] leading-[1.8]">
          <p className="mb-6">
            Connplex may revise or update this Refund & Cancellation Policy from
            time to time. Updated versions will be published on this page along
            with the revised effective date. Continued use of the platform after
            such changes constitutes acceptance of the updated policy.
          </p>
          <p className="font-bold text-[#C5A059] tracking-[1.5px] uppercase font-outfit">
            CONNPLEX CINEMAS LIMITED
          </p>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="mx-[5%] my-10 md:mx-[10%] md:my-[80px] mb-[80px] md:mb-[120px] p-5 min-[481px]:p-[30px] md:p-20 border border-[rgba(197,160,89,0.2)] rounded bg-[#0A0A0A] flex flex-col md:flex-row items-start md:items-center relative overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.05)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/privacy-contact-bg.png"
            alt="Contact Background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, #0A0A0A 40%, rgba(10,10,10,0.2) 70%, rgba(10,10,10,0.9) 100%)",
          }}
        />
        <div className="relative z-10 w-full md:max-w-[65%]">
          <h2 className="text-[#C5A059] text-[1.2rem] font-bold mb-[15px] tracking-[4px] uppercase">
            CONTACT US
          </h2>
          <h3 className="text-[1.8rem] min-[481px]:text-[2.8rem] font-extrabold mb-[25px] uppercase tracking-[2px] leading-[1.1]">
            WE&apos;RE HERE
            <br />
            TO HELP.
          </h3>
          <p className="text-[#A0A0A0] text-[1rem] mb-6">
            For any commercial, partnership, or refund-related inquiries, please contact our business team:
          </p>
          <div className="italic text-[#A0A0A0] text-[0.9rem] min-[481px]:text-[0.95rem] border-l border-[#C5A059]/40 pl-4 mb-10 leading-relaxed">
            &quot;Our objective is not merely to process transactions, but to build long-term strategic partnerships that create sustainable value for both Connplex and our business partners.&quot;
          </div>
          <div className="flex flex-col gap-[25px]">
            <div className="flex items-center gap-[20px] text-white text-base">
              <Building2 size={20} className="text-[#C5A059] shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">Connplex Cinemas</span>
                <span className="text-xs text-[#A0A0A0]">Business Partnerships & Corporate Relations</span>
              </div>
            </div>
            <div className="flex items-center gap-[20px] text-white text-base">
              <Mail size={20} className="text-[#C5A059] shrink-0" />
              <a
                href="mailto:feedback@connplex.com"
                className="text-white no-underline transition-colors duration-300 hover:text-[#C5A059]"
              >
                feedback@connplex.com
              </a>
            </div>
            <div className="flex items-center gap-[20px] text-white text-base">
              <Phone size={20} className="text-[#C5A059] shrink-0" />
              <a
                href="tel:+919924577556"
                className="text-white no-underline transition-colors duration-300 hover:text-[#C5A059]"
              >
                +91 99245 77556
              </a>
            </div>
            <div className="flex items-center gap-[20px] text-white text-base">
              <MapPin size={20} className="text-[#C5A059] shrink-0" />
              <span className="font-medium flex-1">
                Krish Cubical, Block C: (1001 to 1008), 10th Floor, Opp. Avalon
                Hotel Road, SBR - Sindhu Bhavan Marg, Thaltej, Ahmedabad,
                Gujarat - 380059
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
