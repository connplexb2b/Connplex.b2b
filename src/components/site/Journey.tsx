"use client";

import { motion } from "motion/react";
import { Eyebrow, SectionHeading, Reveal } from "./primitives";

const steps = [
  {
    number: "01",
    title: "Select Pre-Approved Location",
    description: "Review our list of pre-vetted, high-feasibility locations and select the city that fits your profile."
  },
  {
    number: "02",
    title: "Financial & Feasibility Review",
    description: "Walk through the project reports, detailed capital requirements, and return projections with an advisor."
  },
  {
    number: "03",
    title: "Booking & Agreement",
    description: "Reserve your chosen location and sign the franchise partnership agreement to officially lock in the territory."
  },
  {
    number: "04",
    title: "Site Design & Fit-Outs",
    description: "Connplex architects design layout, acoustic shell, and seating. Civil work and equipment installations begin."
  },
  {
    number: "05",
    title: "Licensing & Pre-Marketing",
    description: "We secure local cinema licenses, set up box office integrations, and launch localized marketing campaigns."
  },
  {
    number: "06",
    title: "Grand Opening & Returns",
    description: "Launch commercial shows, begin operations under Connplex management, and start receiving monthly reports and returns."
  }
];

export function Journey() {
  return (
    <section id="journey" className="relative overflow-hidden bg-muted/20 py-24 lg:py-32">
      <div className="absolute left-0 bottom-1/4 h-[350px] w-[350px] rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 gold-rule opacity-35" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl text-center mx-auto mb-20">
          <Eyebrow>The Roadmap</Eyebrow>
          <SectionHeading className="mt-6">Your Investment Journey</SectionHeading>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            A structured, transparent pathway from signing the contract to screening the first blockbusters.
          </p>
        </Reveal>

        {/* Timeline Layout */}
        <div className="relative mx-auto max-w-5xl">
          {/* Vertical central line for desktop */}
          <div className="absolute left-4 top-0 h-full w-[2px] bg-border md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full w-full bg-[image:var(--gradient-gold)] origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="space-y-12 md:space-y-20">
            {steps.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={s.number} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  
                  {/* Left Column (Desktop) */}
                  <div className={`w-full md:w-[45%] ${isEven ? "md:text-right md:order-1" : "md:order-2"}`}>
                    <Reveal delay={0.1}>
                      {isEven && (
                        <div className="hidden md:block">
                          <span className="font-display text-4xl font-extrabold text-gold/20 group-hover:text-gold/40 transition-colors duration-300">{s.number}</span>
                          <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wider text-foreground">{s.title}</h3>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                      )}
                      {!isEven && (
                        <div className="md:hidden block pl-10 md:pl-0">
                          <span className="font-display text-3xl font-extrabold text-gold">{s.number}</span>
                          <h3 className="mt-2 font-display text-md font-bold uppercase tracking-wider text-foreground">{s.title}</h3>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                      )}
                    </Reveal>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-[9px] top-2 md:top-auto z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gold bg-background md:left-1/2 md:-translate-x-1/2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </div>

                  {/* Right Column (Desktop) */}
                  <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isEven ? "md:order-2" : "md:order-1 text-left"}`}>
                    <Reveal delay={0.1}>
                      {!isEven && (
                        <div className="hidden md:block">
                          <span className="font-display text-4xl font-extrabold text-gold/20 group-hover:text-gold/40 transition-colors duration-300">{s.number}</span>
                          <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wider text-foreground">{s.title}</h3>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                      )}
                      {isEven && (
                        <div className="md:hidden block">
                          <span className="font-display text-3xl font-extrabold text-gold">{s.number}</span>
                          <h3 className="mt-2 font-display text-md font-bold uppercase tracking-wider text-foreground">{s.title}</h3>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                      )}
                    </Reveal>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
