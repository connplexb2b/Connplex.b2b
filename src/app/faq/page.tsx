'use client';

import React, { useState, useEffect } from 'react';
import './faq.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiUrl } from '@/utils/api';

const FRANCHISE_FAQS = [
    {
        q: 'What are the location requirements for starting a Connplex Cinemas franchise?',
        a: `At Connplex Cinemas, we typically look for spaces ranging from 7,000 to 15,000 sq. ft., depending on the number of screens, seating capacity, and cinema format selected.

The ideal property should also offer:
• Clear height ranging from 11 ft. to 24 ft. & more
• Strong visibility and accessibility
• High-footfall surroundings
• Strong catchment potential
• Entertainment and retail compatibility

We believe the right location becomes the heart of the city's entertainment ecosystem. Whether it's a mall, high street, mixed-use development, or standalone property — if your location has the potential to become a leisure destination, it could be the perfect fit for Connplex.`,
    },
    {
        q: 'Do I need to own a property to start a Connplex franchise?',
        a: `Not necessarily. While owning a property is an advantage, it is not mandatory to partner with Connplex Cinemas.

Many of our successful franchise partners operate from leased or long-term rental spaces that meet our cinema development standards.

What matters most is:
• The right location
• Strong audience potential
• Proper layout feasibility
• Commercial viability

Whether you own the property or plan to lease one, our team will help evaluate and guide the opportunity.`,
    },
    {
        q: 'What is the minimum investment required to open a Connplex Cinemas franchise?',
        a: `The investment depends on the cinema format, city category, screen count, and property condition.

Typically, Franchise investment starts from ₹2 Crore onwards for cinema or auditorium development.

This usually includes:
• Interior development
• Cinema seating
• Projection systems
• Sound & acoustics
• F&B setup
• Technology infrastructure
• Branding elements

The overall investment may vary depending on:
• Tier 1 / Tier 2 / Tier 3 city
• Number of screens
• Premium or luxury format selection
• Existing site readiness`,
    },
    {
        q: 'What kind of returns and payback period can I expect?',
        a: `Cinema is one of the few entertainment businesses with strong cash-flow potential, as customers pay upfront through ticketing and F&B purchases.

With Connplex's proven business model and operational support, franchise partners can typically expect:
• Attractive ROI opportunities
• Estimated payback within 18–24 months
• Long-term recurring revenue potential
• Multiple revenue streams through ticketing, F&B, advertising, and events

Actual returns may vary depending on location performance and operational scale.`,
    },
    {
        q: 'How soon can I launch my Connplex Cinemas after approval?',
        a: `Once the location and agreement are finalized, the development process moves quickly.

On average, a Connplex Cinemas franchise can become operational within 3–6 months, depending on:
• Site readiness
• Construction requirements
• Number of screens
• Interior scope
• Technology installation timelines

For ready-to-develop sites, timelines can be even faster.`,
    },
    {
        q: 'Do I need prior cinema or business experience to start?',
        a: `Not at all.

Connplex Cinemas is designed for entrepreneurs, developers, investors, and business owners who want to enter the entertainment industry with expert support.

You do not need prior cinema experience because our team provides:
• End-to-end guidance
• Operational training
• SOP frameworks
• Technology integration
• Marketing support
• Launch assistance

All you need is the vision to build a landmark entertainment destination — we'll help you bring it to life.`,
    },
    {
        q: 'What support will I receive as a Connplex franchise partner?',
        a: `When you partner with Connplex, you gain access to a complete cinema ecosystem designed for long-term growth and operational success.

Our Support Includes:
Location & Design Assistance
Site evaluation, space planning, audience flow optimization, and premium cinema layout development.

Project & Setup Guidance
Support for interiors, acoustics, projection systems, seating, sound engineering, and technology integration.

Operations & Training
Comprehensive staff training, SOP implementation, and operational guidance to ensure smooth daily management.

Marketing & Brand Support
National-level campaigns combined with localized marketing strategies to maximize awareness and footfalls.

Technology Integration
Advanced ticketing systems, automation tools, analytics dashboards, and digital infrastructure.

Ongoing Business Support
Continuous assistance in operations, marketing, financial planning, and business optimization.

At Connplex, we don't just offer a franchise — we build long-term growth partnerships.`,
    },
    {
        q: 'Are there any franchise fees or revenue-sharing models?',
        a: `Yes. Connplex Cinemas follows a transparent and performance-driven franchise model.

The Structure Typically Includes:
One-Time Franchise Fee
A non-refundable fee that provides access to the Connplex brand, systems, expertise, and support ecosystem.

Revenue Sharing Model
A predefined revenue-sharing structure designed to ensure aligned growth for both Connplex and the franchise partner.

Transparent Agreements
Clear commercial terms with no hidden operational surprises.

Our goal is to create a sustainable and mutually profitable partnership.`,
    },
    {
        q: 'Will I get exclusivity in my city or region?',
        a: `Yes, depending on the market size, city potential, and selected franchise format, Connplex may offer location-based exclusivity.

This helps:
• Protect your market potential
• Avoid brand saturation
• Maintain premium positioning
• Enable sustainable growth opportunities

However, all exclusivity approvals are subject to Connplex management evaluation and final approval.`,
    },
    {
        q: 'What are the major revenue streams in a Connplex Cinemas franchise?',
        a: `A Connplex franchise generates revenue through multiple channels, including:
• Movie ticket sales
• Food & beverage sales
• Brand advertising
• Celebrity & event activations
• Sports screenings
• Stand-up comedy & live shows
• Gaming & experiential zones
• Digital promotions

This diversified model helps maximize profitability.`,
    },
    {
        q: 'Can Connplex Cinemas be developed inside malls or mixed-use projects?',
        a: `Yes. Connplex Cinemas can be integrated into:
• Shopping malls
• Commercial complexes
• Mixed-use developments
• High-street properties
• Standalone entertainment hubs

Our flexible cinema formats are designed to suit different real estate models.`,
    },
    {
        q: 'Does Connplex help with marketing before launch?',
        a: `Absolutely.

We provide:
• Pre-launch campaigns
• Influencer marketing
• PR & media coverage
• Digital advertising
• Outdoor branding
• Launch event planning
• Social media promotions

Our objective is to create strong market buzz before your cinema opens.`,
    },
    {
        q: 'What cinema formats does Connplex offer?',
        a: `Connplex offers multiple scalable formats including:
• Luxuriance
• Signature
• Smart

Each format is designed for different market sizes, audience segments, and investment capacities.`,
    },
    {
        q: 'Can I operate multiple Connplex franchise locations?',
        a: `Yes. Connplex welcomes multi-location and regional expansion partnerships for qualified investors and developers.

Many partners expand into multiple cities after successfully operating their first location.`,
    },
    {
        q: 'How do I apply for a Connplex Cinemas franchise?',
        a: `You can apply by:
• Filling out the franchise inquiry form
• Sharing your property details
• Connecting with our expansion team

Once submitted, our team will evaluate your location and discuss the next steps for partnership development.`,
    },
];

const FaqAnswerContent = ({ text }: { text: string }) => {
    const lines = text.split('\n');
    const blocks: React.ReactNode[] = [];
    let listItems: string[] = [];
    let key = 0;

    const flushList = () => {
        if (listItems.length === 0) return;
        blocks.push(
            <ul key={key++} className="faq-flat-list-bullets">
                {listItems.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        );
        listItems = [];
    };

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed) {
            flushList();
            continue;
        }
        if (trimmed.startsWith('•')) {
            listItems.push(trimmed.replace(/^•\s*/, ''));
            continue;
        }
        flushList();
        const nextLine = lines[i + 1]?.trim() ?? '';
        const isSupportTitle =
            !trimmed.endsWith(':') &&
            !trimmed.endsWith('.') &&
            trimmed.length < 55 &&
            nextLine.length > 0 &&
            !nextLine.startsWith('•') &&
            !nextLine.endsWith(':');

        if (trimmed.endsWith(':') && trimmed.length < 60) {
            blocks.push(
                <p key={key++} className="faq-flat-subheading">
                    {trimmed}
                </p>
            );
        } else if (isSupportTitle) {
            blocks.push(
                <p key={key++} className="faq-flat-support-title">
                    {trimmed}
                </p>
            );
            i++;
            blocks.push(<p key={key++}>{nextLine}</p>);
        } else {
            blocks.push(<p key={key++}>{trimmed}</p>);
        }
    }
    flushList();

    return <>{blocks}</>;
};

const FaqPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [faqs, setFaqs] = useState<{q: string, a: string}[]>(FRANCHISE_FAQS);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/api/forms/faqs`);
                const result = await response.json();
                if (response.ok && result.success && result.data && result.data.length > 0) {
                    const mapped = result.data.map((item: any) => ({
                        q: item.question,
                        a: item.answer
                    }));
                    setFaqs(mapped);
                }
            } catch (err) {
                console.error('Error fetching FAQs:', err);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <>
            <Header />
            <div className="faq-page-wrapper">
                <main className="page-wrapper">
                <header className="faq-header">
                    <span className="subtitle">FREQUENTLY ASKED</span>
                    <h1>QUESTIONS</h1>
                    <p className="tagline">Everything you need to know before partnering with Connplex Cinemas.</p>

                    <div className="divider-container" aria-hidden="true">
                        <div className="divider-line">
                            <div className="divider-dot"></div>
                        </div>
                    </div>
                </header>

                <section className="faq-content-grid" aria-label="FAQ Content">
                    <div className="faq-visual-column">
                        <div className="cinema-card-container">
                            <img
                                src="/faq/cinema_theatre.png"
                                className="cinema-image"
                                alt="Luxurious Connplex theater auditorium with gold lights, stars on the ceiling, and sunset mountain peak on a huge screen."
                            />
                        </div>

                        <article className="brand-benefit-card">
                            <div className="brand-card-icon" aria-hidden="true">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div className="brand-card-text">
                                <h3>
                                    PARTNER WITH INDIA&apos;S
                                    <br />
                                    NEXT-GENERATION CINEMA BRAND
                                </h3>
                                <p>Premium experiences. Strong returns. Long-term growth.</p>
                            </div>
                        </article>
                    </div>

                    <div className="faq-accordion-column">
                        <div className="faq-flat-list">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`faq-flat-item ${activeIndex === i ? 'active' : ''}`}
                                >
                                    <button
                                        type="button"
                                        className="faq-flat-question"
                                        aria-expanded={activeIndex === i}
                                        onClick={() =>
                                            setActiveIndex(activeIndex === i ? null : i)
                                        }
                                    >
                                        <span className="faq-flat-question-text">{faq.q}</span>
                                        <span className="faq-flat-icon" aria-hidden="true">
                                            {activeIndex === i ? '−' : '+'}
                                        </span>
                                    </button>
                                    <div className="faq-flat-answer">
                                        <div className="faq-flat-answer-inner">
                                            <FaqAnswerContent text={faq.a} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="faq-footer-box" aria-label="Still Have Questions">
                    <div className="footer-left">
                        <div className="footer-chat-icon" aria-hidden="true">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="9" r="0.5" fill="currentColor"></circle>
                                <path
                                    d="M12 13v-2.5a1.5 1.5 0 0 1 3 0v0a1.5 1.5 0 0 1-1.5 1.5h-1.5"
                                    strokeDasharray="2,2"
                                ></path>
                            </svg>
                        </div>
                        <div className="footer-left-text">
                            <h3>STILL HAVE QUESTIONS?</h3>
                            <p>Our team is here to help you every step of the way.</p>
                        </div>
                    </div>

                    <div className="footer-buttons-group">
                        <button className="faq-btn" aria-label="Book Presentation">
                            <svg
                                className="btn-main-icon"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>Book Presentation</span>
                            <svg
                                className="btn-chevron"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button className="faq-btn" aria-label="Investor Enquiry">
                            <svg
                                className="btn-main-icon"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                            <span>Investor Enquiry</span>
                            <svg
                                className="btn-chevron"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button className="faq-btn" aria-label="Download Franchise Deck">
                            <svg
                                className="btn-main-icon"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span>Download Franchise Deck</span>
                            <svg
                                className="btn-chevron"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </footer>
            </main>
            </div>
            <Footer />
        </>
    );
};

export default FaqPage;
