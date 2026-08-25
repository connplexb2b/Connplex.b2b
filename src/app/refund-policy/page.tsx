"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Building2,
  Briefcase,
  Settings,
  AlertTriangle,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  UserCheck,
  Coins,
  XOctagon,
  FileWarning,
  Clock,
  Percent,
  TrendingUp,
  Shuffle,
  ShieldCheck,
  Scale,
  FileSignature
} from "lucide-react";

interface PolicyItem {
  num: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  intro: string;
  details?: string[];
  outro?: string;
}

const policyItems: PolicyItem[] = [
  {
    num: "01.",
    icon: <BookOpen size={28} />,
    title: "PURPOSE",
    badge: "Scope",
    intro: "This Refund Policy (\"Policy\") governs all payments made by prospective franchisees, business associates, developers, investors, territory partners, and other commercial applicants (\"Applicant\") in connection with obtaining or applying for a Connplex franchise or any other business opportunity offered by Connplex (\"Company\").",
    outro: "This Policy forms an integral part of the franchise application process and shall be read together with all application forms, letters of intent, confidentiality agreements, franchise agreements, business proposals, and other related documents executed between the parties."
  },
  {
    num: "02.",
    icon: <UserCheck size={28} />,
    title: "NATURE OF RELATIONSHIP",
    badge: "Legal Status",
    intro: "The Applicant acknowledges that:",
    details: [
      "submission of an application does not create any franchise relationship;",
      "no franchise rights are granted until execution of the definitive Franchise Agreement;",
      "Connplex retains absolute discretion to approve or reject any application."
    ],
    outro: "Receipt of any payment shall not be construed as acceptance of the Applicant as a franchise partner."
  },
  {
    num: "03.",
    icon: <Coins size={28} />,
    title: "CATEGORIES OF PAYMENTS",
    badge: "Applicability",
    intro: "This Policy applies to, including but not limited to:",
    details: [
      "Franchise Application Fee",
      "Processing Fee",
      "Due Diligence Fee",
      "Territory Reservation Amount",
      "Initial Franchise Fee",
      "Business Development Charges",
      "Market Study Charges",
      "Technical Consultancy Charges",
      "Project Planning Charges",
      "Training Fees",
      "Documentation Charges",
      "Any advance or deposit received towards commencement of the franchise process."
    ]
  },
  {
    num: "04.",
    icon: <Briefcase size={28} />,
    title: "NATURE OF PAYMENTS",
    badge: "Consideration",
    intro: "Unless expressly agreed otherwise in writing, all payments made to Connplex are deemed to be consideration towards business development, evaluation, administrative processing, technical consultancy, commercial planning and resource allocation. Accordingly, such payments shall be non-refundable."
  },
  {
    num: "05.",
    icon: <Settings size={28} />,
    title: "IMMEDIATE ALLOCATION OF RESOURCES",
    badge: "Operations",
    intro: "Immediately upon receipt of payment, Connplex may commence various activities including feasibility studies, demographic analysis, location assessments, financial and business model evaluations, architectural and operational planning, and onboarding preparations.",
    details: [
      "Commercial feasibility studies & demographic analysis",
      "Location assessment & financial evaluation",
      "Architectural planning & project consultancy",
      "Business model assessment & territory reservation",
      "Internal management approvals & legal documentation",
      "Operational planning, brand allocation, and training preparation",
      "Onboarding activities & management review"
    ],
    outro: "The Applicant acknowledges that substantial internal resources are deployed immediately upon receipt of payment."
  },
  {
    num: "06.",
    icon: <XOctagon size={28} />,
    title: "NON-REFUNDABLE PAYMENTS",
    badge: "Strictly Non-Refundable",
    intro: "Unless otherwise expressly approved in writing by Connplex or mandated by applicable law, the following shall be strictly non-refundable:",
    details: [
      "Application Fees & Evaluation Fees",
      "Booking Amounts & Territory Reservation Charges",
      "Brand Fees & Processing Charges",
      "Business Development Charges & Documentation Charges",
      "Consultancy Fees & Technical Fees",
      "Any other amount paid in connection with the franchise process."
    ]
  },
  {
    num: "07.",
    icon: <FileWarning size={28} />,
    title: "APPLICANT WITHDRAWAL",
    badge: "Withdrawal",
    intro: "If the Applicant withdraws from the proposed franchise for any reason whatsoever, no refund shall be payable by Connplex. This includes, but is not limited to:",
    details: [
      "Change in investment plans or internal business decisions",
      "Inability to arrange finance or secure premises",
      "Dissatisfaction with market conditions",
      "Change in ownership or corporate restructuring",
      "Delay in project implementation or personal reasons",
      "Regulatory concerns or any other commercial reason."
    ]
  },
  {
    num: "08.",
    icon: <AlertTriangle size={28} />,
    title: "REJECTION OF APPLICATION",
    badge: "Rejection Terms",
    intro: "Connplex reserves the unrestricted right to reject any application where it determines that:",
    details: [
      "the Applicant does not satisfy financial requirements;",
      "the proposed location is commercially unsuitable;",
      "the territory is unavailable;",
      "the Applicant fails due diligence;",
      "documentation is incomplete;",
      "regulatory concerns arise;",
      "there is a conflict with business strategy; or",
      "approval is otherwise not considered commercially appropriate."
    ],
    outro: "In such event, Connplex may, at its sole discretion: (a) retain the non-refundable processing and evaluation charges; and (b) refund such portion of the balance amount, if any, as may be determined by the Company after deducting all costs incurred."
  },
  {
    num: "09.",
    icon: <Clock size={28} />,
    title: "DELAYS BEYOND CONNPLEX'S CONTROL",
    badge: "External Delays",
    intro: "The Applicant agrees that no refund shall arise due to delays resulting from external variables, third-party consultants, or force majeure events:",
    details: [
      "Statutory approvals & governmental permissions",
      "Mall, landlord, or construction delays",
      "Force majeure events & litigation affecting the property",
      "Utility connections & equipment procurement",
      "Labour shortages & supply chain disruptions",
      "Third-party consultants or any event beyond the reasonable control of Connplex."
    ]
  },
  {
    num: "10.",
    icon: <FileWarning size={28} />,
    title: "MISREPRESENTATION",
    badge: "Forfeiture",
    intro: "If Connplex discovers that the Applicant has provided false, misleading or incomplete information, concealed material facts or misrepresented financial capability, Connplex may immediately terminate the application. All amounts paid shall stand forfeited."
  },
  {
    num: "11.",
    icon: <Percent size={28} />,
    title: "TAXES",
    badge: "Statutory",
    intro: "All applicable taxes including GST shall be payable in addition to the applicable charges unless otherwise specified. Any taxes already deposited with statutory authorities shall not be refundable except as required by law."
  },
  {
    num: "12.",
    icon: <TrendingUp size={28} />,
    title: "NO GUARANTEE OF SUCCESS",
    badge: "Business Success",
    intro: "The Applicant acknowledges that:",
    details: [
      "cinema performance depends upon numerous market variables;",
      "Connplex does not guarantee revenue, profitability, occupancy, return on investment or business success;",
      "any financial projections, business plans or feasibility studies are illustrative only and should not be treated as guaranteed outcomes."
    ]
  },
  {
    num: "13.",
    icon: <Shuffle size={28} />,
    title: "NON-TRANSFERABILITY",
    badge: "Transfer Policy",
    intro: "Payments cannot be transferred except with prior written approval from Connplex. This includes transfers to another applicant, company, project, city, franchise format, or business opportunity."
  },
  {
    num: "14.",
    icon: <Coins size={28} />,
    title: "SET-OFF",
    badge: "Adjustment",
    intro: "Connplex may adjust any monies payable by the Applicant against any outstanding dues, damages, penalties, costs, expenses or liabilities owed by the Applicant."
  },
  {
    num: "15.",
    icon: <CreditCard size={28} />,
    title: "CHARGEBACKS & PAYMENT DISPUTES",
    badge: "Disputes",
    intro: "Applicants shall first raise any payment-related concern directly with Connplex. Any unauthorised chargeback, payment reversal or disputed transaction shall constitute a material breach of this Policy. Connplex reserves the right to initiate appropriate legal proceedings for recovery of losses, costs and damages."
  },
  {
    num: "16.",
    icon: <ShieldCheck size={28} />,
    title: "LIMITATION OF LIABILITY",
    badge: "Liability",
    intro: "To the maximum extent permitted under applicable law, Connplex shall not be liable for any indirect, consequential, special, incidental, punitive or loss of profit damages arising from the Applicant's decision to pursue or discontinue the franchise opportunity."
  },
  {
    num: "17.",
    icon: <Scale size={28} />,
    title: "GOVERNING LAW & JURISDICTION",
    badge: "Jurisdiction",
    intro: "This Policy shall be governed by the laws of India. Subject to the arbitration clause below, the courts at Ahmedabad, Gujarat shall have exclusive jurisdiction."
  },
  {
    num: "18.",
    icon: <Scale size={28} />,
    title: "DISPUTE RESOLUTION",
    badge: "Arbitration",
    intro: "Any dispute arising out of or relating to this Policy shall be referred to arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Ahmedabad, Gujarat. The proceedings shall be conducted in English. The arbitral award shall be final and binding."
  },
  {
    num: "19.",
    icon: <FileSignature size={28} />,
    title: "ACCEPTANCE",
    badge: "Consent",
    intro: "By making any payment, the Applicant confirms that:",
    details: [
      "it has carefully reviewed this Policy;",
      "it has had sufficient opportunity to seek independent legal, financial and commercial advice;",
      "it understands that franchise approval is subject to Connplex's evaluation;",
      "it understands that payments are primarily for business development, evaluation and administrative services;",
      "it voluntarily agrees that such payments are non-refundable except where expressly provided under this Policy or applicable law."
    ]
  },
  {
    num: "20.",
    icon: <Mail size={28} />,
    title: "CONTACT DETAILS",
    badge: "Inquiries",
    intro: "Connplex – Franchise Development Division",
    details: [
      "Email: feedback@connplex.com",
      "Phone: +91 99245 77556",
      "Website: www.theconnplex.com",
      "Business Hours: Monday to Saturday | 10:00 AM – 6:00 PM (IST)"
    ]
  }
];

export default function RefundPolicyPage() {
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
          <h1 className="text-[2.2rem] sm:text-[3.2rem] md:text-[4rem] lg:text-[5rem] font-extrabold leading-[0.95] mb-10 uppercase tracking-[2px]">
            <span
              className="text-[#C5A059] block brightness-125"
              style={{ textShadow: "0 0 20px rgba(197, 160, 89, 0.4)" }}
            >
              FRANCHISE PAYMENT
            </span>
            & REFUND POLICY
          </h1>
          <div
            className="max-w-[650px] text-[#A0A0A0] text-[0.95rem] min-[481px]:text-[1.05rem] leading-[1.8] border-l-2 border-[#C5A059] pl-[15px] min-[481px]:pl-[30px]"
            style={{ animation: "ppFadeIn 1s ease-out 0.5s both" }}
          >
            <p className="font-bold text-white mb-2 text-base tracking-wide uppercase">
              Effective Date: August 25, 2026
            </p>
            <p>
              This Refund Policy governs all payments made by prospective franchisees, business associates, developers, investors, territory partners, and other commercial applicants in connection with obtaining or applying for a Connplex franchise or any other business opportunity offered by Connplex.
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
                {item.details && (
                  <ul className="list-disc pl-5 text-[#A0A0A0] text-[0.9rem] leading-[1.8] flex flex-col gap-2 mb-4">
                    {item.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
                {item.outro && (
                  <p className="text-[#A0A0A0] text-[0.95rem] leading-[1.8] mt-4 border-l-2 border-[#C5A059]/30 pl-3">
                    {item.outro}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="relative z-10 mt-24 w-full max-w-[900px] border-t border-[#c5a059]/20 pt-10 text-[#A0A0A0] text-[0.95rem] leading-[1.8]">
          <p className="mb-6">
            Connplex may revise or update this Franchise Payment & Refund Policy from
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
            For any commercial, franchise, or refund-related inquiries, please contact our business team:
          </p>
          <div className="italic text-[#A0A0A0] text-[0.9rem] min-[481px]:text-[0.95rem] border-l border-[#C5A059]/40 pl-4 mb-10 leading-relaxed">
            &quot;Our objective is not merely to process transactions, but to build long-term strategic partnerships that create sustainable value for both Connplex and our business partners.&quot;
          </div>
          <div className="flex flex-col gap-[25px]">
            <div className="flex items-center gap-[20px] text-white text-base">
              <Building2 size={20} className="text-[#C5A059] shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">Connplex Cinemas</span>
                <span className="text-xs text-[#A0A0A0]">Franchise Development Division</span>
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
