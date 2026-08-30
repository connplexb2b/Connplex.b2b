"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is the Flash Sale?",
    a: "The Flash Sale is an exclusive limited-period offer for our enquired franchise partners, with a special ₹5,00,000 + GST discount on the franchise fee.",
  },
  {
    q: "Who is eligible for the Flash Sale?",
    a: "The Flash Sale is specially available for customers who have previously enquired about a Connplex franchise opportunity.",
  },
  {
    q: "How long is the Flash Sale valid?",
    a: "The Flash Sale is valid for 3 days only. This exclusive offer is available for a limited time.",
  },
  {
    q: "What special benefit do I get under the Flash Sale?",
    a: "You get an exclusive ₹5,00,000 + GST discount on the franchise fee during the Flash Sale period.",
  },
  {
    q: "How can I avail the Flash Sale offer?",
    a: "Simply submit the form on this page. Once submitted, you can either proceed directly to the payment page or choose to speak with our team before proceeding.",
  },
  {
    q: "Do I need to wait for a callback after submitting the form?",
    a: "No. You can choose to proceed directly to the payment page after submitting the form. Alternatively, you can contact our team directly using the number provided below.",
  },
  {
    q: "Is there any additional charge or condition for the Flash Sale discount?",
    a: "No additional charge is applicable for availing the Flash Sale discount. The ₹5,00,000 + GST discount is a special franchise fee offer available during the Flash Sale period.",
  },
  {
    q: "What happens after I submit the form?",
    a: "After submitting the form, you will have the option to proceed directly to payment or connect with our team directly for further discussion.",
  },
  {
    q: "I have already enquired earlier. Do I need to submit my details again?",
    a: "Yes. Please submit the form on this page so we can confirm your eligibility for the Flash Sale offer and provide you with the next steps.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">
            FAQ
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="surface-card border border-border px-6 py-1 transition-colors hover:border-gold/30"
              >
                <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-gold transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground pt-1 pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
