"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";

const faqItems = [
  {
    question: "What is a Pre-Approved Cinema Investment?",
    answer: "A pre-approved cinema investment represents a project location where Connplex has already completed feasibility analysis, verified regional catchment demographics, negotiated property lease terms, and validated compliance. Investors bypass location risks and project launch delays."
  },
  {
    question: "What is the typical range of capital investment?",
    answer: "Capital requirements depend on screen count, local property conditions, seating density, and spatial fit-out specifications. Typically, projects start at INR 1.5 Crores. Complete project cost breakdown reports are available upon request."
  },
  {
    question: "How does the revenue-sharing model operate?",
    answer: "Our franchise model is designed for transparency. Revenues from cinema tickets (box office), food & beverage sales (F&B), and screen advertisements are tracked daily. Payouts are distributed on a monthly basis according to the pre-agreed franchise shares."
  },
  {
    question: "Can I inspect the pre-approved properties prior to signing?",
    answer: "Absolutely. Once your initial contact details and investment capability are verified, our investment advisors will schedule a direct guided site visit for you to inspect the property, meet the developers, and review technical layout maps."
  },
  {
    question: "What is the timeline from signing to the grand opening?",
    answer: "Because properties are pre-vetted and commercial lease outlines are ready, construction and equipment install can start almost immediately. The typical timeline from signing the agreement to screening the first film is between 120 and 150 days."
  }
];

export function Faqs() {
  return (
    <section id="faqs" className="relative overflow-hidden bg-muted/30 py-24 lg:py-32">
      <div className="absolute right-0 top-1/4 h-[350px] w-[350px] rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule opacity-35" />
      
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal className="text-center mb-16">
          <Eyebrow>FAQ</Eyebrow>
          <SectionHeading className="mt-6">Frequently Asked Questions</SectionHeading>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-border/80 bg-surface/20 rounded-sm px-6">
                <AccordionTrigger className="font-display font-bold uppercase tracking-wider text-foreground hover:text-gold text-[0.88rem] py-5 no-underline hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-2 pb-6 border-t border-border/20">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
