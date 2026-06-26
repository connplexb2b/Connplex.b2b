import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import './newfranchiasepage.css';
import { franchiseAdsSchema } from '../../validations/franchiseSchema';

// Utility component for counting up numbers when scrolled into view
const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

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

        const animate = (currentTime) => {
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

// Infinite scroll testimonial slider
const TestimonialSlider = () => {
    const cards = [
        {
            name: "Jignesh Jobanputra",
            location: "Ahmedabad, Gujarat",
            text: "Partnering with Connplex Cinemas has been one of the best business decisions for our commercial property. The Connplex team handled everything from cinema design and operations to marketing and technology integration. Within months, we saw strong audience footfalls and excellent response from families and young audiences.",
            img: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Rakesh",
            location: "Ahmedabad, Gujarat",
            text: "We were looking for a premium cinema franchise opportunity in Rajasthan, and Connplex stood out because of their modern cinema formats and scalable business model. Today, our cinema has become a leading entertainment destination.",
            img: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            name: "Viraj Shah",
            location: "Ahmedabad, Gujarat",
            text: "What impressed us most about Connplex Cinemas was their understanding of Metros, Tier 2 and Tier 3 markets. The combination of ticket revenue, F&B, and advertising has created multiple stable income streams.",
            img: "https://randomuser.me/api/portraits/men/46.jpg"
        }
    ];
    const displayCards = [...cards, ...cards]; // Duplicate for infinite scroll
    return (
        <div className="fra-testimonials-infinite-container">
            <div className="fra-testimonials-scroll-track">
                {displayCards.map((c, i) => (
                    <div className="fra-testimonial-card-infinite" key={i}>
                        <div className="fra-testimonial-card-inner">
                            <div style={{ fontSize: '3rem', color: '#c19b62', lineHeight: 1 }}>“</div>
                            <p style={{ fontStyle: 'italic', margin: '15px 0', opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.5' }}>{c.text}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(193, 155, 98, 0.15)',
                                    border: '1px solid #c19b62',
                                    color: '#c19b62',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    flexShrink: 0
                                }}>
                                    {c.name.charAt(0).toUpperCase()}
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

// FAQ Component with expandable answers
const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const faqs = [
        {
            q: "What are the location requirements for starting a Connplex Cinemas franchise?",
            a: "Typically we look for spaces ranging from 10,000 to 14,000 sq. ft., depending on the number of screens and seating capacity. Height requirements range from 11 ft. to 24 ft. and above."
        },
        {
            q: "What is the minimum investment required to open a franchise?",
            a: "The investment starts from ₹2 Crore onwards depending on format, screen counts, and property setups."
        },
        {
            q: "What support will I receive as a franchise partner?",
            a: "We provide end-to-end guidance including site selection, acoustics design, interior development, marketing, operations training, and ticketing system setups."
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

export default function NewFranchisePage() {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = '';
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            investmentRange: "",
            preferredCity: "",
            hasProperty: "",
            timeline: "",
            message: "",
        },
        validationSchema: franchiseAdsSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const response = await fetch('/api/create-franchise-ads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                });
                const data = await response.json();
                if (response.status === 201) {
                    resetForm();
                    setIsSubmitted(true);
                    closeModal();
                    router.push({
                        pathname: "/franchiseads/thank-you",
                        query: { source: "franchise-ads" }
                    });
                }
            } catch (error) {
                console.error("Submission failed:", error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="franchise-page">
            {/* Hero Banner */}
            <section className="fra-hero">
                <div className="fra-hero-overlay"></div>
                <div className="fra-hero-content">
                    <h1>OWN YOUR<br /><span className="fra-gold-text">OWN CINEMA</span></h1>
                    <p className="fra-hero-p">
                        Partner with India's fastest-growing Cinema chain and bring a world-class cinema experience to your city.
                    </p>
                    <div className="fra-hero-buttons">
                        <button onClick={openModal} className="fra-btn-solid">Explore Opportunities →</button>
                        <button onClick={openModal} className="fra-btn-outline">Talk to Our Team</button>
                    </div>
                </div>
            </section>

            {/* Cinema formats */}
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
                            subtitle: "Flagship luxury multiplex cinema format.",
                            idealFor: "Metro & Tier 1 markets",
                            features: ["4-6 screens", "Dolby Atmos acoustics", "Premium Lounges & Café"],
                            area: "10,000 – 14,000 sq ft"
                        },
                        {
                            title: "SIGNATURE",
                            subtitle: "Versatile mid-scale cinema footprint.",
                            idealFor: "Tier 1 & Tier 2 Cities",
                            features: ["3-4 screens", "Luxury recliner choices", "Accessible investments"],
                            area: "8,000 – 10,000 sq ft"
                        }
                    ].map((m, i) => (
                        <div className="fra-model-card" key={i}>
                            <div className="model-header">
                                <h3>{m.title}</h3>
                                <p>{m.subtitle}</p>
                                <span>Ideal for: {m.idealFor}</span>
                            </div>
                            <div className="model-body">
                                <div>
                                    <ul className="fra-features-list">
                                        {m.features.map((f, j) => <li key={j}>✓ {f}</li>)}
                                    </ul>
                                </div>
                                <div className="model-specs">
                                    <h4>Specs</h4>
                                    <strong>{m.area}</strong>
                                    <button onClick={openModal} className="fra-btn-solid" style={{ marginTop: '20px', width: '100%' }}>EXPLORE {m.title}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Partner Grid */}
            <section className="fra-why-section">
                <div className="fra-why-grid">
                    <div>
                        <h2 className="fra-why-title">WHY PARTNER WITH<br /><span className="fra-gold-text">CONNPLEX?</span></h2>
                        <p style={{ opacity: 0.7 }}>Becoming a franchise partner means joining a sustainable, cash-rich business.</p>
                    </div>
                    <div className="fra-stats-grid">
                        {[
                            { val: "42+", lbl: "Cinemas Nationwide" },
                            { val: "10M+", lbl: "Happy Moviegoers" }
                        ].map((s, i) => (
                            <div className="fra-stat-card" key={i}>
                                <div className="fra-stat-value"><AnimatedNumber value={s.val} /></div>
                                <p>{s.lbl}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialSlider />
            <FAQSection />

            {/* Direct Inline Contact Form */}
            <section className="fra-contact-section" id="contact">
                <div className="fra-contact-left"></div>
                <div className="fra-contact-right">
                    <span className="fra-subtitle">TAKE THE FIRST STEP</span>
                    <h2 className="fra-contact-title">LET'S BUILD TOGETHER</h2>
                    {isSubmitted ? (
                        <div className="fra-success-message">
                            <h3>SUCCESSFULLY SUBMITTED!</h3>
                            <p>Our team will contact you shortly.</p>
                        </div>
                    ) : (
                        <form className="fra-form" onSubmit={formik.handleSubmit}>
                            <div className="fra-form-row">
                                <div className="fra-input-group">
                                    <input type="text" name="name" className="fra-input" placeholder="Full Name" onChange={formik.handleChange} value={formik.values.name} />
                                    {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
                                </div>
                                <div className="fra-input-group">
                                    <input type="email" name="email" className="fra-input" placeholder="Email" onChange={formik.handleChange} value={formik.values.email} />
                                    {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
                                </div>
                            </div>
                            <div className="fra-form-row">
                                <div className="fra-input-group">
                                    <input type="text" name="phone" className="fra-input" placeholder="Phone" onChange={formik.handleChange} value={formik.values.phone} />
                                    {formik.touched.phone && formik.errors.phone && <div className="form-error">{formik.errors.phone}</div>}
                                </div>
                                <div className="fra-input-group">
                                    <input type="text" name="state" className="fra-input" placeholder="State" onChange={formik.handleChange} value={formik.values.state} />
                                    {formik.touched.state && formik.errors.state && <div className="form-error">{formik.errors.state}</div>}
                                </div>
                            </div>
                            <button type="submit" className="fra-btn-solid">SUBMIT ENQUIRY</button>
                        </form>
                    )}
                </div>
            </section>

            {/* Popup Modal Form */}
            {isModalOpen && (
                <div className="fra-modal-overlay" onClick={closeModal}>
                    <div className="fra-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="fra-modal-close" onClick={closeModal}>✕</button>
                        <h2>EXPLORE FRANCHISE</h2>
                        <form className="fra-form" onSubmit={formik.handleSubmit}>
                            <input type="text" name="name" className="fra-input" placeholder="Full Name" onChange={formik.handleChange} value={formik.values.name} />
                            <input type="email" name="email" className="fra-input" placeholder="Email" onChange={formik.handleChange} value={formik.values.email} />
                            <input type="text" name="phone" className="fra-input" placeholder="Phone" onChange={formik.handleChange} value={formik.values.phone} />
                            <button type="submit" className="fra-btn-solid">SUBMIT</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
