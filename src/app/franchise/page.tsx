"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';
import './franchise.css';

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
        <div className="fra-testimonials-infinite-container">
            <div className="fra-testimonials-scroll-track">
                {displayCards.map((c, i) => (
                    <div className="fra-testimonial-card-infinite" key={i}>
                        <div className="fra-testimonial-card-inner">
                            <div style={{ fontSize: '3rem', color: '#c19b62', lineHeight: 1 }}>“</div>
                            <p style={{ fontStyle: 'italic', margin: '15px 0', opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.5' }}>{c.text}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={c.img} alt={c.name} width="40" height="40" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#c19b62', fontSize: '0.85rem', fontWeight: 600 }}>{c.name}</h4>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.5, display: 'block' }}>{c.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Using global Footer component now

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "What are the location requirements for starting a Connplex Cinemas franchise?",
            a: "At Connplex Cinemas, we typically look for spaces ranging from 10,000 to 14,000 sq. ft., depending on the number of screens, seating capacity, and cinema format selected.\n\nThe ideal property should also offer:\n• Clear height ranging from 11 ft. to 24 ft. & more\n• Strong visibility and accessibility\n• High-footfall surroundings\n• Strong catchment potential\n• Entertainment and retail compatibility\n\nWe believe the right location becomes the heart of the city’s entertainment ecosystem. Whether it’s a mall, high street, mixed-use development, or standalone property — if your location has the potential to become a leisure destination, it could be the perfect fit for Connplex."
        },
        {
            q: "Do I need to own a property to start a Connplex franchise?",
            a: "Not necessarily. While owning a property is an advantage, it is not mandatory to partner with Connplex Cinemas.\n\nMany of our successful franchise partners operate from leased or long-term rental spaces that meet our cinema development standards.\n\nWhat matters most is:\n• The right location\n• Strong audience potential\n• Proper layout feasibility\n• Commercial viability\n\nWhether you own the property or plan to lease one, our team will help evaluate and guide the opportunity."
        },
        {
            q: "What is the minimum investment required to open a Connplex Cinemas franchise?",
            a: "The investment depends on the cinema format, city category, screen count, and property condition.\n\nTypically, the investment starts from ₹2 Crore onwards for cinema or auditorium development. This usually includes interior development, cinema seating, projection systems, sound & acoustics, F&B setup, technology infrastructure, and branding elements.\n\nThe overall investment may vary depending on city tier, number of screens, and format selection."
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
            a: "Connplex offers multiple scalable formats including Luxuriance, Signature, and Express, each designed for different market sizes and investment capacities."
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
        <section className="fra-faq-section">
            <div className="fra-section-heading">
                <span className="fra-subtitle">ANY QUESTIONS?</span>
                <h2>FREQUENTLY ASKED <span className="fra-gold-text">QUESTIONS</span></h2>
                <div style={{ width: '40px', height: '2px', background: '#c19b62', margin: '15px auto' }}></div>
            </div>
            <div className="fra-faq-container">
                {faqs.map((faq, i) => (
                    <div key={i} className={`fra-faq-item ${activeIndex === i ? 'active' : ''}`}>
                        <div className="fra-faq-question" onClick={() => setActiveIndex(activeIndex === i ? null : i)}>
                            <h3>{faq.q}</h3>
                            <span className="fra-faq-icon">{activeIndex === i ? '−' : '+'}</span>
                        </div>
                        <div className="fra-faq-answer">
                            <div className="fra-faq-answer-inner">
                                {faq.a.split('\n').map((line, j) => (
                                    <p key={j}>{line}</p>
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/forms/franchise-applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong. Please try again.');
            }

            setIsSubmitted(true);
        } catch (error: any) {
            setSubmitError(error.message || 'Unable to submit enquiry. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="franchise-page">
            {/* Navbar Overlay */}
            <Header />

            {/* Hero */}
            <section className="fra-hero">
                <video className="fra-hero-video" autoPlay muted loop playsInline>
                    <source src="/img/franchise/top_video.mp4" type="video/mp4" />
                </video>
                <div className="fra-hero-overlay"></div>
                <div className="fra-hero-content">
                    <h1>OWN YOUR<br /><span className="fra-gold-text">OWN CINEMA</span></h1>
                    <p className="fra-hero-p">
                        Partner with Connplex — India's fastest-growing<br />
                        Cinema chain — and bring a <br />
                        world-class cinema experience to your city.
                    </p>
                    <div className="fra-hero-buttons">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="fra-btn-solid"
                        >
                            Explore Franchise Opportunities  →
                        </button>
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="fra-btn-outline"
                        >
                            Talk to Our Franchise Team
                        </button>
                    </div>
                </div>
            </section>

            {/* Models */}
            <section className="fra-models-section" id="models">
                <div className="fra-section-heading">
                    <span className="fra-subtitle">FLEXIBLE MODELS</span>
                    <h2 className="fra-section-title">CHOOSE YOUR PATH TO OWNERSHIP</h2>
                    <div style={{ width: '40px', height: '2px', background: '#c19b62', margin: '15px auto' }}></div>
                </div>
                <div className="fra-models-grid">
                    {[
                        {
                            title: "LUXURIANCE",
                            subtitle: "The full-scale luxury cinema franchise — built for maximum impact.",
                            idealFor: "Metro & Tier 1 markets",
                            description: [
                                "The Connplex Luxuriance is our flagship luxury cinema franchise format — a full-scale multiplex experience designed for high-footfall urban markets where audiences expect nothing less than world-class. With 4 to 6 premium auditoriums, recliner seating, Dolby Atmos sound, Spectrax , premium lounge/ cafe,and a Premium lobby experience, Luxuriance sets the benchmark for premium cinema in India.",
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
                                "The Connplex Signature is the most versatile format in our cinema franchise portfolio — delivering the full Connplex luxury experience at a more accessible footprint and investment threshold. With 3 to 4 screens and seating for up to 250 guests, Signature is purpose-built for markets that demand quality without requiring the scale of a flagship multiplex.",
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
                                "The Connplex Smart is the most accessible format in our cinema franchise range — and the one changing the face of entertainment in India's underserved markets. With 2 to 4 screens, seating up to 200 guests, and a footprint starting at just 7,000 sq ft, the Smart model is the ideal mini multiplex franchise for Tier 2, Tier 3, and emerging cities where organised cinema has never existed.",
                                "This is where the biggest opportunities are. Low competition. High demand. A first-mover advantage that no other cinema franchise model in India currently addresses with this level of brand quality and technology at this scale."
                            ],
                            features: [
                                "Smallest footprint — ideal for compact commercial spaces",
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
                        <div className="fra-model-card" key={i}>
                            <div className="model-header">
                                <h3 style={{ fontSize: '2rem', color: '#c19b62', marginBottom: '10px' }}>{m.title}</h3>
                                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '5px' }}>{m.subtitle}</p>
                                <span style={{ color: '#a0a0a0', fontSize: '0.9rem', fontStyle: 'italic' }}>Ideal for: {m.idealFor}</span>
                            </div>

                            <div className="model-body">
                                <div className="model-desc">
                                    {m.description.map((p, j) => <p key={j} style={{ fontSize: '0.95rem', color: '#ddd', marginBottom: '15px', lineHeight: 1.6 }}>{p}</p>)}
                                    <ul className="fra-features-list" style={{ marginTop: '20px' }}>
                                        {m.features.map((f, j) => (
                                            <li key={j} style={{ marginBottom: '10px', alignItems: 'flex-start' }}><svg viewBox="0 0 24 24" fill="none" stroke="#c19b62" width="20" height="20" style={{ marginRight: '10px', flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg> <span style={{ fontSize: '0.95rem' }}>{f}</span></li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="model-specs" style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '8px', border: '1px solid rgba(193, 155, 98, 0.1)', height: 'fit-content' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Technical Specifications</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        {m.specs.map((s, j) => (
                                            <div key={j} className="spec-item">
                                                <span style={{ display: 'block', fontSize: '0.75rem', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{s.label}</span>
                                                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#c19b62', marginBottom: '3px' }}>{s.value}</strong>
                                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{s.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="fra-btn-solid"
                                        style={{ display: 'inline-block', marginTop: '30px', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}
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
            <section className="fra-why-section">
                <div className="fra-why-grid">
                    <div>
                        <h2 className="fra-why-title">WHY PARTNER WITH<br /><span className="fra-gold-text">CONNPLEX?</span></h2>
                        <p style={{ margin: '20px 0', opacity: 0.7 }}>Joining Connplex means more than just business – it&apos;s becoming a part of a legacy.</p>
                        <ul className="fra-features-list">
                            {["India&apos;s Most Premium Cinema Brand", "Cutting-edge Technology & Immersive Experience", "End-to-End Support & Training", "Proven Business Model with Strong ROI", "Marketing Power of a Trusted Brand"].map((item, i) => (
                                <li key={i} style={{ alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(193,155,98,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(193,155,98,0.05)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c19b62" strokeWidth="1.5"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"></path></svg>
                                    </div>
                                    <span dangerouslySetInnerHTML={{ __html: item }}></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="fra-stats-grid">
                        {[
                            { val: "42+", lbl: "Cinemas Nationwide" },
                            { val: "10M+", lbl: "Happy Moviegoers" },
                            { val: "40+", lbl: "Cities Covered" },
                            { val: "98%", lbl: "Partner Satisfaction" }
                        ].map((s, i) => (
                            <div className="fra-stat-card" key={i}>
                                <div className="fra-stat-value"><AnimatedNumber value={s.val} /></div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>{s.lbl}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="fra-testimonials">
                <div className="fra-section-heading">
                    <h2>FRANCHISE OWNER <span className="fra-gold-text">TESTIMONIALS</span></h2>
                    <div style={{ width: '40px', height: '2px', background: '#c19b62', margin: '15px auto' }}></div>
                </div>
                <TestimonialSlider />
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* Contact */}
            <section className="fra-contact-section" id="contact">
                <div className="fra-contact-left">
                    <Image src="/img/franchise/last_cta_image.png" alt="Interior" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="fra-contact-right">
                    <span className="fra-subtitle">TAKE THE FIRST STEP</span>
                    <h2 className="fra-contact-title">LET&apos;S BUILD TOGETHER</h2>
                    <p style={{ margin: '15px 0 35px 0', opacity: 0.7 }}>Fill in your details and our team will get in touch with you shortly.</p>
                    {isSubmitted ? (
                        <div className="fra-success-message">
                            <div className="fra-success-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3>SUCCESSFULLY SUBMITTED!</h3>
                            <p>Thank you for your interest in Connplex Cinemas. Our franchise team will review your details and contact you shortly.</p>
                            <button onClick={() => setIsSubmitted(false)} className="fra-btn-outline" style={{ marginTop: '20px', background: 'transparent', border: '1px solid #c19b62', color: '#c19b62', padding: '10px 25px', borderRadius: '4px', cursor: 'pointer' }}>Send another enquiry</button>
                        </div>
                    ) : (
                        <form className="fra-form" onSubmit={handleSubmit}>
                            <div className="fra-form-row">
                                <input name="fullName" type="text" className="fra-input" placeholder="Full Name" required />
                                <input name="email" type="email" className="fra-input" placeholder="Email Address" required />
                            </div>
                            <div className="fra-form-row">
                                <input name="phone" type="tel" className="fra-input" placeholder="Phone Number" required />
                                <input name="state" type="text" className="fra-input" placeholder="State" required />
                            </div>
                            <div className="fra-form-row">
                                <input name="city" type="text" className="fra-input" placeholder="City" required />
                                <select name="preferredInvestment" className="fra-input" required defaultValue="">
                                    <option value="" disabled>Preferred investment range?</option>
                                    <option value="1.5-2cr">1.5 to 2 cr</option>
                                    <option value="2-2.5cr">2cr to 2.5 cr</option>
                                    <option value="2.5-3cr">2.5 to 3cr</option>
                                    <option value="3cr+">3cr and above</option>
                                </select>
                            </div>
                            <div className="fra-form-row">
                                <input name="preferredCity" type="text" className="fra-input" placeholder="Which city do you prefer for Connplex Cinema?" required />
                                <input name="hasProperty" type="text" className="fra-input" placeholder="Do you have a property or location for cinema?" required />
                            </div>
                            <select name="timeframe" className="fra-input" required defaultValue="" style={{ marginBottom: '20px' }}>
                                <option value="" disabled>How soon do you plan to start this investment?</option>
                                <option value="immediately">Immediately</option>
                                <option value="1-month">1 month</option>
                                <option value="1-3-months">1-3 months</option>
                                <option value="3plus-months">3+ months</option>
                            </select>
                            <textarea name="message" className="fra-input" placeholder="Message" rows={4}></textarea>
                            {submitError && (
                                <div style={{ color: '#ff5252', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                                    ⚠️ {submitError}
                                </div>
                            )}
                            <button type="submit" className="fra-btn-solid" disabled={isSubmitting}>
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
