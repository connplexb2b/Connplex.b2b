"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import { useStats } from '@/hooks/useStats';

const AnimatedNumber = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const match = value.match(/^([^\d\.]*)([\d\.]+)([^\d\.]*)$/);
        if (!match) return;

        const target = parseFloat(match[2]);
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(easeOut * target);

            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, value, duration]);

    const match = value.match(/^([^\d\.]*)([\d\.]+)([^\d\.]*)$/);
    if (!match) return <span ref={ref}>{value}</span>;
    const prefix = match[1];
    const suffix = match[3];
    return <span ref={ref}>{prefix}{Math.floor(count)}{suffix}</span>;
};

const TestimonialSlider = () => {
    const cards = [
        {
            name: "Jignesh Jobanputra",
            location: "Ahmedabad, Gujarat",
            text: "Partnering with Connplex Cinemas has been one of the best business decisions for our commercial property. The Connplex team handled everything from cinema design and operations to marketing and technology integration. Within months, we saw strong audience footfalls and excellent response from families and young audiences. The ROI and revenue potential from ticketing and F&B have exceeded our expectations.",
            img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Rakesh",
            location: "Ahmedabad, Gujarat",
            text: "We were looking for a premium cinema franchise opportunity in Rajasthan, and Connplex stood out because of their modern cinema formats and scalable business model. Their support team guided us through every stage of setup. Today, our cinema has become a leading entertainment destination in the city.",
            img: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            name: "Viraj Shah",
            location: "Ahmedabad, Gujarat",
            text: "What impressed us most about Connplex Cinemas was their understanding of Metros, Tier 2 and Tier 3 markets. They know how to create luxury cinema experiences that work commercially. The combination of movie ticket revenue, F&B sales, and advertising opportunities has created multiple income streams for us.",
            img: "https://randomuser.me/api/portraits/men/46.jpg"
        },
        {
            name: "Chintan Shah",
            location: "Anand, Gujarat",
            text: "Connplex is not just a cinema franchise brand — it’s a complete entertainment ecosystem. Their marketing campaigns, launch support, and operational guidance made the process seamless. We recovered our investment faster than expected, and the business continues to grow steadily.",
            img: "https://randomuser.me/api/portraits/men/81.jpg"
        },
        {
            name: "Rahul Patel",
            location: "Gandhinagar, Gujarat",
            text: "We explored several multiplex franchise opportunities before choosing Connplex Cinemas. Their flexible investment model and premium positioning gave us confidence. The customer experience, luxury interiors, and advanced technology have helped us build a strong brand reputation locally.",
            img: "https://randomuser.me/api/portraits/men/11.jpg"
        },
        {
            name: "Sagar Patel",
            location: "Mehsana, Gujarat",
            text: "The Connplex franchise model is designed for long-term profitability. Their team helped us optimize seating layouts, F&B counters, and customer flow, which significantly improved operational efficiency. The audience response has been phenomenal, especially during weekends and blockbuster releases.",
            img: "https://randomuser.me/api/portraits/men/90.jpg"
        },
        {
            name: "Vigyaan",
            location: "Hyderabad, Telangana",
            text: "What sets Connplex apart is their ongoing support after launch. From digital marketing and social media promotions to operational assistance, they continue to help franchise partners grow. Our cinema has now become a preferred entertainment hub in the region.",
            img: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
            name: "Pranil Munot",
            location: "Pune, Maharashtra",
            text: "We wanted to convert our property into a high-footfall entertainment business, and Connplex helped us achieve exactly that. Their cinema franchise system is highly organized, transparent, and scalable. The ROI from ticket sales and food & beverage operations has been very encouraging.",
            img: "https://randomuser.me/api/portraits/men/33.jpg"
        },
        {
            name: "Dr. Srinivas",
            location: "Tadepalligudem, Andhra Pradesh",
            text: "Connplex Cinemas understands the future of entertainment. Beyond movies, they helped us host sports screenings, live events, and celebrity engagements that generated additional revenue opportunities. It’s a modern multiplex franchise model built for sustainable growth.",
            img: "https://randomuser.me/api/portraits/men/45.jpg"
        }
    ];

    // Duplicate cards for infinite loop
    const displayCards = [...cards, ...cards];

    return (
        <div className="w-full overflow-hidden py-8 relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-fra-scroll hover:[animation-play-state:paused]">
                {displayCards.map((c, i) => (
                    <div className="w-[320px] sm:w-[400px] px-3 sm:px-5 box-border shrink-0" key={i}>
                        <div className="bg-[#191919]/60 border border-[#c19b62]/20 p-8 rounded-2xl h-full flex flex-col justify-between">
                            <div className="text-5xl text-[#c19b62] font-serif leading-none h-6 font-semibold">“</div>
                            <p className="italic text-xs sm:text-sm leading-relaxed text-white/80 my-5">{c.text}</p>
                            <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-white/5">
                                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center border border-[#c19b62]/50 text-[#c19b62] text-sm font-semibold uppercase">
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-[#c19b62] text-xs sm:text-sm font-semibold">{c.name}</h4>
                                    <span className="text-[10px] sm:text-xs text-white/50 block">{c.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "What are the location requirements for starting a Connplex Cinemas franchise?",
            a: "At Connplex Cinemas, we typically look for spaces ranging from 7,000 to 15,000 sq. ft., depending on the number of screens, seating capacity, and cinema format selected.\n\nThe ideal property should also offer:\n• Clear height ranging from 11 ft. to 24 ft. & more\n• Strong visibility and accessibility\n• High-footfall surroundings\n• Strong catchment potential\n• Entertainment and retail compatibility\n\nWe believe the right location becomes the heart of the city’s entertainment ecosystem. Whether it’s a mall, high street, mixed-use development, or standalone property — if your location has the potential to become a leisure destination, it could be the perfect fit for Connplex."
        },
        {
            q: "Do I need to own a property to start a Connplex franchise?",
            a: "Not necessarily. While owning a property is an advantage, it is not mandatory to partner with Connplex Cinemas.\n\nMany of our successful franchise partners operate from leased or long-term rental spaces that meet our cinema development standards.\n\nWhat matters most is:\n• The right location\n• Strong audience potential\n• Proper layout feasibility\n• Commercial viability\n\nWhether you own the property or plan to lease one, our team will help evaluate and guide the opportunity."
        },
        {
            q: "What is the minimum investment required to open a Connplex Cinemas franchise?",
            a: "The investment depends on the cinema format, city category, screen count, and property condition.\n\nTypically, Franchise investment starts from ₹2 Crore onwards for cinema or auditorium development. This usually includes interior development, cinema seating, projection systems, sound & acoustics, F&B setup, technology infrastructure, and branding elements.\n\nThe overall investment may vary depending on city tier, number of screens, and format selection."
        },
        {
            q: "What kind of returns and payback period can I expect?",
            a: "Cinema is one of the few entertainment businesses with strong cash-flow potential. With Connplex’s proven business model and operational support, franchise partners can typically expect:\n• Attractive ROI opportunities\n• Estimated payback within 18–24 months\n• Long-term recurring revenue potential\n• Multiple revenue streams through ticketing, F&B, advertising, and events"
        },
        {
            q: "How soon can I launch my Connplex Cinemas after approval?",
            a: "On average, a Connplex Cinemas franchise can become operational within 3–6 months, depending on site readiness, construction requirements, number of screens, and technology installation timelines."
        },
        {
            q: "Do I need prior cinema or business experience to start?",
            a: "Not at all. Connplex Cinemas is designed for entrepreneurs, developers, investors, and business owners who want to enter the entertainment industry with expert support. Our team provides end-to-end guidance, training, and operational support."
        },
        {
            q: "What support will I receive as a Connplex franchise partner?",
            a: "When you partner with Connplex, you gain access to a complete cinema ecosystem:\n• Location & Design Assistance: Site evaluation and planning.\n• Project & Setup Guidance: Support for interiors and technology.\n• Operations & Training: Staff training and SOP implementation.\n• Marketing & Brand Support: National and localized strategies.\n• Technology Integration: Advanced ticketing and analytics.\n• Ongoing Business Support: Continuous assistance in optimization."
        },
        {
            q: "Are there any franchise fees or revenue-sharing models?",
            a: "Yes. Connplex Cinemas follows a transparent and performance-driven model including a one-time franchise fee for brand access and systems, and a predefined revenue-sharing structure designed to ensure aligned growth."
        },
        {
            q: "Will I get exclusivity in my city or region?",
            a: "Yes, depending on the market size, city potential, and selected franchise format, Connplex may offer location-based exclusivity to protect your market potential and enable sustainable growth."
        },
        {
            q: "What are the major revenue streams in a Connplex Cinemas franchise?",
            a: "A Connplex franchise generates revenue through multiple channels:\n• Movie ticket sales\n• Food & beverage sales\n• Brand advertising\n• Celebrity & event activations\n• Sports screenings\n• Stand-up comedy & live shows\n• Gaming & experiential zones"
        },
        {
            q: "Can Connplex Cinemas be developed inside malls or mixed-use projects?",
            a: "Yes. Connplex Cinemas can be integrated into shopping malls, commercial complexes, mixed-use developments, high-street properties, and standalone entertainment hubs."
        },
        {
            q: "Does Connplex help with marketing before launch?",
            a: "Absolutely. We provide pre-launch campaigns, influencer marketing, PR & media coverage, digital advertising, outdoor branding, and social media promotions to create strong market buzz."
        },
        {
            q: "What cinema formats does Connplex offer?",
            a: "Connplex offers multiple scalable formats including Luxuriance, Signature, and Smart, each designed for different market sizes and investment capacities."
        },
        {
            q: "Can I operate multiple Connplex franchise locations?",
            a: "Yes. Connplex welcomes multi-location and regional expansion partnerships for qualified investors and developers."
        },
        {
            q: "How do I apply for a Connplex Cinemas franchise?",
            a: "You can apply by filling out the franchise inquiry form on our website, sharing your property details, or connecting directly with our expansion team."
        }
    ];

    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1400px] mx-auto w-full">
            <div className="text-center mb-12 sm:mb-16">
                <span className="block font-outfit text-[11px] md:text-xs font-semibold tracking-[0.2em] text-text-secondary mb-3.5 uppercase">ANY QUESTIONS?</span>
                <h2 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-wide">
                    FREQUENTLY ASKED <span className="text-[#c19b62] font-normal">QUESTIONS</span>
                </h2>
                <div className="w-10 h-[2px] bg-[#c19b62] mx-auto mt-4"></div>
            </div>
            <div className="max-w-[900px] mx-auto flex flex-col gap-4">
                {faqs.map((faq, i) => (
                    <div key={i} className={`bg-[#191919]/60 border border-[#c19b62]/20 rounded-lg overflow-hidden transition-all duration-300 ${activeIndex === i ? 'border-[#c19b62] shadow-[0_5px_20px_rgba(0,0,0,0.3)]' : ''}`}>
                        <div
                            className="py-5 px-6 sm:py-6 sm:px-8 flex justify-between items-center cursor-pointer transition-colors duration-200 hover:bg-[#c19b62]/5 min-h-[48px]"
                            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                        >
                            <h3 className="text-sm sm:text-base font-semibold m-0 text-white pr-5">{faq.q}</h3>
                            <span className="text-xl text-[#c19b62] font-light transition-transform duration-300 select-none">
                                {activeIndex === i ? '−' : '+'}
                            </span>
                        </div>
                        <div className={`transition-all duration-500 ease-[cubic-bezier(0,1,0,1)] overflow-hidden ${activeIndex === i ? 'max-h-[1000px] ease-in-out' : 'max-h-0'}`}>
                            <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-white/5">
                                {faq.a.split('\n').map((line, j) => (
                                    <p key={j} className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-4 first:mt-6">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function FranchisePage() {
    const { stats } = useStats();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [hasProperty, setHasProperty] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.5;
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const apiUrl = getApiUrl();
            const requestUrl = `${apiUrl}/api/forms/franchise-applications`;
            console.log('API URL:', requestUrl);
            console.log('Request Payload:', data);

            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('Response Status:', response.status);

            const result = await response.json();
            console.log('Response Payload:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Submission Error:', error);
            setSubmitError(error.message || 'Unable to submit enquiry. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#070707] text-white font-inter overflow-x-hidden min-h-screen">
            {/* Navbar Overlay */}
            <Header />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-10 lg:px-20 py-24 md:py-32 overflow-hidden justify-center sm:justify-start">
                <video ref={videoRef} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-110 object-cover z-1" autoPlay muted loop playsInline>
                    <source src="/img/franchise/top_video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-2"></div>
                <div className="max-w-[650px] w-full z-10 relative text-center sm:text-left mt-10">
                    <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 uppercase text-white">
                        OWN YOUR<br /><span className="text-[#c19b62]">OWN CINEMA</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-light mb-10 leading-relaxed text-white/90">
                        Partner with Connplex — India&apos;s fastest-growing<br className="hidden sm:inline" />
                        Cinema chain — and bring a <br className="hidden sm:inline" />
                        world-class cinema experience to your city.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center sm:justify-start items-center mt-2.5">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-[#c19b62] hover:bg-[#a88554] text-black font-outfit text-xs font-bold tracking-widest uppercase rounded shadow-[0_5px_15px_rgba(193,155,98,0.3)] hover:-translate-y-0.5 transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Explore Franchise Opportunities  →
                        </button>
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#c19b62]/10 border border-[#c19b62] hover:border-[#a88554] text-white font-outfit text-xs font-bold tracking-widest uppercase rounded transition-all duration-300 min-h-[48px] flex items-center justify-center cursor-pointer"
                        >
                            Talk to Our Franchise Team
                        </button>
                    </div>
                </div>
            </section>

            {/* Models */}
            <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1400px] mx-auto w-full" id="models">
                <div className="text-center mb-12 sm:mb-16">
                    <span className="block font-outfit text-[11px] md:text-xs font-semibold tracking-[0.2em] text-text-secondary mb-3.5 uppercase">FLEXIBLE MODELS</span>
                    <h2 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-wide">
                        CHOOSE YOUR PATH TO OWNERSHIP
                    </h2>
                    <div className="w-10 h-[2px] bg-[#c19b62] mx-auto mt-4"></div>
                </div>

                <div className="flex flex-col gap-10 md:gap-12">
                    {[
                        {
                            title: "LUXURIANCE",
                            subtitle: "The full-scale luxury cinema franchise built for maximum impact.",
                            idealFor: "Metro & Tier 1 markets",
                            description: [
                                "The Connplex Luxuriance is our flagship luxury cinema franchise format, a full-scale multiplex experience designed for high-footfall urban markets where audiences expect nothing less than world-class. With 4 to 6 premium auditoriums, recliner seating, Dolby Atmos sound, Spectrax, premium lounge/cafe, and a Premium lobby experience, Luxuriance sets the benchmark for premium cinema in India.",
                                "Built across 10,000–14,000 sq ft and more, this format is engineered for developers and investors seeking a high-revenue cinema franchise anchor in malls, mixed-use developments, and large commercial properties in metro and Tier 1 markets."
                            ],
                            features: [
                                "Maximum screen count for higher content variety",
                                "Largest audience capacity — up to 300 seats",
                                "Premium lobby design with premium F&B & Lounges & cafe",
                                "Strongest ROI potential in high-density markets"
                            ],
                            specs: [
                                { label: "Required Area", value: "10,000 – 14,000 sq ft", desc: "Built-up area" },
                                { label: "Screens", value: "4 – 6 Screens", desc: "Auditorium count" },
                                { label: "Seat Capacity", value: "Up to 300 Seats", desc: "Across all screens" },
                                { label: "Clear Height", value: "11 ft – 24 ft and more", desc: "Minimum ceiling height" }
                            ]
                        },
                        {
                            title: "SIGNATURE",
                            subtitle: "The perfect balance of luxury, scale, and investment efficiency.",
                            idealFor: "Tier 1 & strong Tier 2 cities",
                            description: [
                                "The Connplex Signature is the most versatile format in our cinema franchise portfolio, delivering the full Connplex luxury experience at a more accessible footprint and investment threshold. With 3 to 4 screens and seating for up to 250 guests, Signature is purpose-built for markets that demand quality without requiring the scale of a flagship multiplex.",
                                "Across 8,000–10,000 sq ft, this mid-scale multiplex franchise model suits established Tier 2 cities, premium high streets, and developers looking for a cinema franchise with a faster break-even and strong neighbourhood loyalty."
                            ],
                            features: [
                                "Optimal screen-to-footprint ratio",
                                "Full Connplex brand and technology standards",
                                "Up to 250 seats — right-sized for growing urban audiences",
                                "Faster break-even timeline compared to flagship format"
                            ],
                            specs: [
                                { label: "Required Area", value: "8,000 – 10,000 sq ft", desc: "Built-up area" },
                                { label: "Screens", value: "3 – 4 Screens", desc: "Auditorium count" },
                                { label: "Seat Capacity", value: "Up to 250 Seats", desc: "Across all screens" },
                                { label: "Clear Height", value: "11 ft and more", desc: "Minimum ceiling height" }
                            ]
                        },
                        {
                            title: "SMART",
                            subtitle: "The entry-level cinema franchise that opens every market.",
                            idealFor: "Tier 2, Tier 3 & emerging cities",
                            description: [
                                "The Connplex Smart is the most accessible format in our cinema franchise range and the one changing the face of entertainment in India's underserved markets. With 2 to 4 screens, seating up to 200 guests, and a footprint starting at just 7,000 sq ft, the Smart model is the ideal mini multiplex franchise for Tier 2, Tier 3, and emerging cities where organised cinema has never existed.",
                                "This is where the biggest opportunities are. Low competition. High demand. A first-mover advantage that no other cinema franchise model in India currently addresses with this level of brand quality and technology at this scale."
                            ],
                            features: [
                                "Smallest footprint, ideal for compact commercial spaces",
                                "Lowest cinema franchise investment entry point",
                                "First-mover advantage in high-growth, low-competition markets",
                                "Same Connplex brand, technology, and content access as flagship"
                            ],
                            specs: [
                                { label: "Required Area", value: "7,000 – 10,000 sq ft", desc: "Built-up area" },
                                { label: "Screens", value: "2 – 4 Screens", desc: "Auditorium count" },
                                { label: "Seat Capacity", value: "Up to 200 Seats", desc: "Across all screens" },
                                { label: "Clear Height", value: "10 ft – 12 ft", desc: "Minimum ceiling height" }
                            ]
                        }
                    ].map((m, i) => (
                        <div className="bg-[#191919]/60 border border-[#c19b62]/20 hover:border-[#c19b62] rounded-2xl p-6 sm:p-10 md:p-12 transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col gap-8 md:gap-10" key={i}>
                            <div>
                                <h3 className="font-outfit text-3xl sm:text-4xl text-[#c19b62] font-light tracking-wide mb-2.5">{m.title}</h3>
                                <p className="text-lg sm:text-xl font-semibold text-white mb-1.5">{m.subtitle}</p>
                                <span className="text-xs sm:text-sm text-text-secondary italic block">Ideal for: {m.idealFor}</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 lg:gap-16">
                                <div>
                                    {m.description.map((p, j) => (
                                        <p key={j} className="text-sm sm:text-base text-white/80 leading-relaxed mb-4">{p}</p>
                                    ))}
                                    <ul className="flex flex-col gap-3 text-left mt-6">
                                        {m.features.map((f, j) => (
                                            <li key={j} className="flex gap-3 items-start text-sm text-white/90">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#c19b62" width="20" height="20" className="mr-2.5 shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-black/35 border border-[#c19b62]/10 p-6 sm:p-8 rounded-xl h-fit w-full flex flex-col">
                                    <h4 className="text-white font-outfit text-base font-semibold mb-6 border-b border-white/10 pb-3 uppercase tracking-wider">Technical Specifications</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        {m.specs.map((s, j) => (
                                            <div key={j} className="flex flex-col gap-1">
                                                <span className="text-[9px] sm:text-[10px] tracking-wider text-text-secondary uppercase">{s.label}</span>
                                                <strong className="text-sm sm:text-base font-bold text-[#c19b62] font-outfit">{s.value}</strong>
                                                <span className="text-[10px] sm:text-xs text-text-secondary">{s.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full mt-8 py-3.5 bg-[#c19b62] hover:bg-[#a88554] text-black font-outfit text-xs font-bold tracking-widest uppercase rounded shadow-[0_4px_12px_rgba(193,155,98,0.2)] hover:-translate-y-0.5 transition-all duration-300 min-h-[44px] cursor-pointer"
                                    >
                                        EXPLORE {m.title}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Partner */}
            <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 bg-[#040404] max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 lg:gap-20 items-center">
                    <div>
                        <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-light leading-[1.1] mb-6 uppercase text-white">
                            WHY PARTNER WITH<br /><span className="text-[#c19b62] font-normal">CONNPLEX?</span>
                        </h2>
                        <p className="text-sm sm:text-base text-white/70 font-light mb-8 max-w-[500px]">Joining Connplex means more than just business, it&apos;s becoming a part of a legacy.</p>
                        <ul className="flex flex-col gap-4 text-left">
                            {["India's Most Premium Cinema Brand", "Cutting-edge Technology & Immersive Experience", "End-to-End Support & Training", "Proven Business Model with Strong ROI", "Marketing Power of a Trusted Brand"].map((item, i) => (
                                <li key={i} className="flex gap-4 items-center text-sm sm:text-base text-white/90">
                                    <div className="w-10 h-10 shrink-0 rounded-full border border-[#c19b62]/20 flex items-center justify-center bg-[#c19b62]/5 text-[#c19b62]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c19b62" strokeWidth="1.5"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"></path></svg>
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                        {[
                            { val: stats.franchisePage.cinemasNationwide, lbl: "Cinemas Nationwide" },
                            { val: stats.franchisePage.happyMoviegoers, lbl: "Happy Moviegoers" },
                            { val: stats.franchisePage.citiesCovered, lbl: "Cities Covered" },
                            { val: stats.franchisePage.partnerSatisfaction, lbl: "Partner Satisfaction" }
                        ].map((s, i) => (
                            <div className="bg-[#191919]/60 border border-[#c19b62]/20 hover:border-[#c19b62] p-6 sm:p-8 rounded-2xl text-center hover:bg-[#c19b62]/5 transition-all duration-300 flex flex-col justify-center items-center" key={i}>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#c19b62] font-outfit mb-2">
                                    <AnimatedNumber value={s.val} />
                                </div>
                                <p className="text-xs sm:text-sm text-white/60 font-light">{s.lbl}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20 max-w-[1400px] mx-auto w-full">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="font-outfit text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-wide">
                        <span className="text-[#c19b62] font-normal">TESTIMONIALS</span>
                    </h2>
                    <div className="w-10 h-[2px] bg-[#c19b62] mx-auto mt-4"></div>
                </div>
                <TestimonialSlider />
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* Contact */}
            <section className="grid grid-cols-1 lg:grid-cols-2 bg-[#040404] min-h-[600px] w-full max-w-[1400px] mx-auto border-t border-white/5" id="contact">
                <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-full">
                    <Image src="/img/franchise/last_cta_image.png" alt="Interior" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-6 sm:p-10 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-center">
                    <span className="block font-outfit text-[11px] md:text-xs font-semibold tracking-[0.2em] text-text-secondary mb-3.5 uppercase">TAKE THE FIRST STEP</span>
                    <h2 className="font-outfit text-3xl sm:text-4xl font-light text-[#c19b62] mb-3 uppercase">LET&apos;S BUILD TOGETHER</h2>
                    <p className="text-sm sm:text-base text-white/70 font-light mb-8 max-w-[500px]">Fill in your details and our team will get in touch with you shortly.</p>

                    {isSubmitted ? (
                        <div className="text-center p-8 bg-[#c19b62]/5 border border-[#c19b62]/20 rounded-xl">
                            <div className="w-14 h-14 bg-[#c19b62] text-black rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-[#c19b62] text-xl font-bold mb-4 font-outfit">SUCCESSFULLY SUBMITTED!</h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[400px] mx-auto">Thank you for your interest in Connplex Cinemas. Our franchise team will review your details and contact you shortly.</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="px-6 py-2.5 bg-transparent border border-[#c19b62] text-[#c19b62] rounded font-outfit text-xs font-semibold tracking-wider hover:bg-[#c19b62]/10 transition-all duration-300 min-h-[44px]"
                            >
                                Send another enquiry
                            </button>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input name="fullName" type="text" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="Full Name" required />
                                <input name="email" type="email" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="Email Address" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input name="phone" type="tel" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="Phone Number" required />
                                <input name="state" type="text" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="State" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input name="city" type="text" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="City" required />

                                <div className="relative">
                                    <select
                                        name="preferredInvestment"
                                        className="w-full bg-black/90 border border-white/20 px-4 py-3.5 pr-10 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px] appearance-none cursor-pointer"
                                        required
                                        defaultValue=""
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c19b62' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 18px center',
                                            backgroundSize: '14px',
                                        }}
                                    >
                                        <option value="" disabled className="bg-[#111] text-white">Preferred investment range?</option>
                                        <option value="1.5-2cr" className="bg-[#111] text-white">1.5 to 2 cr</option>
                                        <option value="2-2.5cr" className="bg-[#111] text-white">2cr to 2.5 cr</option>
                                        <option value="2.5-3cr" className="bg-[#111] text-white">2.5 to 3cr</option>
                                        <option value="3cr+" className="bg-[#111] text-white">3cr and above</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input name="preferredCity" type="text" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px]" placeholder="Which city do you prefer for Connplex Cinema?" required />
                                <div className="relative">
                                    <select
                                        name="hasProperty"
                                        className="w-full bg-black/90 border border-white/20 px-4 py-3.5 pr-10 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px] appearance-none cursor-pointer"
                                        required
                                        value={hasProperty}
                                        onChange={(e) => setHasProperty(e.target.value)}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c19b62' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 18px center',
                                            backgroundSize: '14px',
                                        }}
                                    >
                                        <option value="" disabled className="bg-[#111] text-white">Do you have a property or location?</option>
                                        <option value="yes" className="bg-[#111] text-white">Yes</option>
                                        <option value="no" className="bg-[#111] text-white">No</option>
                                    </select>
                                </div>
                            </div>

                            {hasProperty === 'no' && (
                                <div className="relative">
                                    <select
                                        name="preApprovedCity"
                                        className="w-full bg-black/90 border border-white/20 px-4 py-3.5 pr-10 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px] appearance-none cursor-pointer"
                                        required
                                        defaultValue=""
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c19b62' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 18px center',
                                            backgroundSize: '14px',
                                        }}
                                    >
                                        <option value="" disabled className="bg-[#111] text-white">Select Pre-approved Franchise City</option>
                                        <option value="Ahmedabad" className="bg-[#111] text-white">Ahmedabad</option>
                                        <option value="Assam" className="bg-[#111] text-white">Assam</option>
                                        <option value="Jammu" className="bg-[#111] text-white">Jammu</option>
                                        <option value="Mandvi" className="bg-[#111] text-white">Mandvi</option>
                                        <option value="Sanand" className="bg-[#111] text-white">Sanand</option>
                                        <option value="Badoli" className="bg-[#111] text-white">Badoli</option>
                                        <option value="Chhattisgarh" className="bg-[#111] text-white">Chhattisgarh</option>
                                        <option value="Himmatnagar" className="bg-[#111] text-white">Himmatnagar</option>
                                        <option value="Dhamtari" className="bg-[#111] text-white">Dhamtari</option>
                                        <option value="Navsari" className="bg-[#111] text-white">Navsari</option>
                                        <option value="Rajnandgaon" className="bg-[#111] text-white">Rajnandgaon</option>
                                        <option value="Uttar Pradesh" className="bg-[#111] text-white">Uttar Pradesh</option>
                                        <option value="Haryana" className="bg-[#111] text-white">Haryana</option>
                                        <option value="Telangana" className="bg-[#111] text-white">Telangana</option>
                                        <option value="Pune" className="bg-[#111] text-white">Pune</option>
                                        <option value="Nashik" className="bg-[#111] text-white">Nashik</option>
                                        <option value="Jharkhand" className="bg-[#111] text-white">Jharkhand</option>
                                        <option value="Maharashtra" className="bg-[#111] text-white">Maharashtra</option>
                                        <option value="Rajasthan" className="bg-[#111] text-white">Rajasthan</option>
                                    </select>
                                </div>
                            )}

                            <div className="relative">
                                <select
                                    name="timeframe"
                                    className="w-full bg-black/90 border border-white/20 px-4 py-3.5 pr-10 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[48px] appearance-none cursor-pointer"
                                    required
                                    defaultValue=""
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c19b62' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 18px center',
                                        backgroundSize: '14px',
                                    }}
                                >
                                    <option value="" disabled className="bg-[#111] text-white">How soon do you plan to start this investment?</option>
                                    <option value="immediately" className="bg-[#111] text-white">Immediately</option>
                                    <option value="1-month" className="bg-[#111] text-white">1 month</option>
                                    <option value="1-3-months" className="bg-[#111] text-white">1-3 months</option>
                                    <option value="3plus-months" className="bg-[#111] text-white">3+ months</option>
                                </select>
                            </div>

                            <textarea name="message" className="bg-transparent border border-white/20 px-4 py-3.5 text-white rounded text-sm transition-all focus:outline-none focus:border-[#c19b62] min-h-[120px] resize-none" placeholder="Message" rows={4}></textarea>

                            {submitError && (
                                <div className="text-[#ff5252] text-xs font-semibold">
                                    ⚠️ {submitError}
                                </div>
                            )}

                            <button type="submit" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#c19b62] hover:bg-[#a88554] text-black font-outfit text-xs font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_5px_15px_rgba(193,155,98,0.3)] hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] w-full sm:w-auto cursor-pointer" disabled={isSubmitting}>
                                {isSubmitting ? 'SUBMITTING...' : <>SUBMIT ENQUIRY <span>→</span></>}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
