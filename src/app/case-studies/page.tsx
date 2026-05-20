'use client';

import React, { useState, useEffect, useRef } from 'react';
import './case-studies.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AnimatedNumber = ({ target }: { target: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const duration = 2000;
                const startTime = performance.now();

                const update = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    if (elapsed >= duration) {
                        setCount(target);
                        return;
                    }
                    const progress = elapsed / duration;
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(easeOut * target));
                    requestAnimationFrame(update);
                };
                requestAnimationFrame(update);
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count}</span>;
};

const CaseStudyCard = ({ study }: { study: any }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current || !glareRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const rotateX = (0.5 - y) * 10;
        const rotateY = (x - 0.5) * 10;
        
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale3d(1.02, 1.02, 1.02)`;
        
        glareRef.current.style.opacity = '1';
        glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(251, 209, 114, 0.12) 0%, transparent 70%)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current || !glareRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
        glareRef.current.style.opacity = '0';
    };

    return (
        <div 
            className="case-study-card" 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.1s ease-out, border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease' }}
        >
            <div className="card-glare" ref={glareRef}></div>
            <div className="card-details">
                <div className="card-num">{study.num}</div>
                <div className="card-meta">
                    <span className="card-tag">{study.tag}</span>
                    <h2 className="card-title" dangerouslySetInnerHTML={{ __html: study.title }}></h2>
                    <p className="card-subtitle">{study.subtitle}</p>
                </div>
                <div className="card-location">
                    <svg className="location-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{study.location}</span>
                </div>
            </div>
            <div className="card-visual">
                <img src={study.img} alt={study.title.replace(/<br>/g, ' ')} className="card-img" />
                <div className="card-img-overlay"></div>
            </div>
            <div className="card-summary">
                <p className="card-desc">{study.desc}</p>
                <a href="#" className="card-link">
                    VIEW CASE STUDY
                    <svg className="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default function CaseStudiesPage() {
    const [filter, setFilter] = useState('all');
    const chairRef = useRef<HTMLDivElement>(null);
    const chairImgRef = useRef<HTMLImageElement>(null);

    const studies = [
        { id: 1, num: '01', tag: 'SMART THEATRE', title: 'CONNPLEX<br>EXPERIENCE CENTRE', subtitle: 'REDEFINING THE FUTURE OF CINEMA', location: 'MUMBAI, MAHARASHTRA', img: '/img/case-study/case_study_1.png', desc: 'A next-gen flagship theatre featuring 7 premium auditoriums, recliners, immersive sound and intelligent automation.', category: 'smart-theatres' },
        { id: 2, num: '02', tag: 'PREMIUM FORMAT', title: 'IMAX WITH LASER<br>AT CONNPLEX', subtitle: 'BIGGER SCREEN. BOLDER IMPACT.', location: 'PUNE, MAHARASHTRA', img: '/img/case-study/case_study_2.png', desc: "India's most advanced IMAX experience with Laser projection, precision sound and wall-to-wall visuals.", category: 'premium-formats' },
        { id: 3, num: '03', tag: 'LUXURY RECLINERS', title: 'THE RECLINER<br>EXPERIENCE', subtitle: 'COMFORT THAT ELEVATES EVERY MOMENT.', location: 'MULTIPLE LOCATIONS', img: '/img/case-study/case_study_3.png', desc: 'Crafted for those who expect more. Our recliner auditoriums blend luxury, privacy and unmatched comfort.', category: 'experience-initiatives' },
        { id: 4, num: '04', tag: 'DRIVE-IN CINEMA', title: 'CONNPLEX<br>DRIVE-IN', subtitle: 'CINEMA UNDER THE STARS.', location: 'LONAVALA, MAHARASHTRA', img: '/img/case-study/case_study_4.png', desc: 'A nostalgic experience reimagined with crystal clear visuals, powerful sound and a magical outdoor ambience.', category: 'drive-in-cinemas' },
        { id: 5, num: '05', tag: 'TECHNOLOGY', title: 'DOLBY ATMOS<br>IMMERSIVE SOUND', subtitle: 'SOUND THAT MOVES YOU.', location: 'ACROSS INDIA', img: '/img/case-study/case_study_5.png', desc: 'Immersive audio that places you at the centre of every scene with breathtaking clarity and depth.', category: 'premium-formats' },
        { id: 6, num: '06', tag: 'EXPERIENCE INITIATIVE', title: 'PRIVATE SCREENING<br>EXPERIENCES', subtitle: 'MADE FOR MOMENTS THAT MATTER.', location: 'MUMBAI, DELHI, BENGALURU', img: '/img/case-study/case_study_6.png', desc: 'Curated private screenings for corporate events, premieres and celebrations with bespoke service and exclusivity.', category: 'experience-initiatives' }
    ];

    const filteredStudies = filter === 'all' ? studies : studies.filter(s => s.category === filter);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!chairRef.current || !chairImgRef.current) return;
            const rect = chairRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 20;
            const rotateY = (x - 0.5) * 20;
            chairImgRef.current.style.transform = `translateZ(40px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        };

        const handleMouseLeave = () => {
            if (chairImgRef.current) chairImgRef.current.style.transform = 'translateZ(30px) rotateX(0deg) rotateY(0deg) scale(1)';
        };

        const chair = chairRef.current;
        if (chair) {
            chair.addEventListener('mousemove', handleMouseMove);
            chair.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            if (chair) {
                chair.removeEventListener('mousemove', handleMouseMove);
                chair.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    return (
        <div className="case-studies-page-wrapper">
            <div className="glow-backdrop glow-left"></div>
            <div className="glow-backdrop glow-right"></div>
            <div className="starfield"></div>

            <Header />

            <div className="app-container">
                <main className="main-content">
                    <div className="content-grid">
                        <section className="hero-info">
                            <span className="category-tag">CASE STUDIES</span>
                            <h1 className="main-heading">
                                EXPERIENCES<br />
                                THAT INSPIRE.<br />
                                STORIES THAT<br />
                                <span className="gold-text-glow">STAY.</span>
                            </h1>
                            <p className="tagline">
                                Every Connplex theatre is more than a destination—it's an experience engineered to create impact, emotion and unforgettable memories.
                            </p>
                            <div className="cta-container">
                                <a href="#" className="btn-primary-magnetic">
                                    EXPLORE OUR WORK
                                    <span className="btn-icon-wrapper">
                                        <svg className="arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </section>

                        <section className="hero-visual" id="canvas-3d-container">
                            <div className="chair-3d-wrapper" ref={chairRef}>
                                <div className="chair-animator">
                                    <img 
                                        ref={chairImgRef}
                                        src="/img/case-study/connplex_chair.png" 
                                        alt="Connplex Premium Cinema Chair" 
                                        className="chair-3d-img" 
                                        style={{ transition: 'transform 0.1s ease-out' }}
                                    />
                                </div>
                                <div className="chair-glow"></div>
                            </div>
                        </section>
                    </div>

                    <section className="stats-dashboard">
                        <div className="dashboard-border-glow"></div>
                        <div className="stats-grid">
                            {[
                                { label: 'SMART THEATRES DELIVERED', target: 85, suffix: '+' },
                                { label: 'SCREENS DEPLOYED', target: 450, suffix: '+' },
                                { label: 'GUESTS IMPRESSED', target: 25, suffix: 'M+' },
                                { label: 'CITIES ACROSS INDIA', target: 28, suffix: '+' },
                                { label: 'YEARS OF CINEMATIC EXCELLENCE', target: 10, suffix: '+' }
                            ].map((stat, i) => (
                                <div className="stat-card" key={i}>
                                    <div className="icon-container">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div className="stat-number-wrapper">
                                        <AnimatedNumber target={stat.target} />
                                        <span className="stat-suffix">{stat.suffix}</span>
                                    </div>
                                    <p className="stat-label">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="case-studies-section">
                        <div className="filter-header">
                            <div className="filter-options">
                                {[
                                    { label: 'ALL', value: 'all' },
                                    { label: 'SMART THEATRES', value: 'smart-theatres' },
                                    { label: 'PREMIUM FORMATS', value: 'premium-formats' },
                                    { label: 'DRIVE-IN CINEMAS', value: 'drive-in-cinemas' },
                                    { label: 'EXPERIENCE INITIATIVES', value: 'experience-initiatives' },
                                    { label: 'BRAND COLLABORATIONS', value: 'brand-collaborations' }
                                ].map((opt) => (
                                    <button 
                                        key={opt.value}
                                        className={`filter-btn ${filter === opt.value ? 'active' : ''}`}
                                        onClick={() => setFilter(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="case-studies-list">
                            {filteredStudies.map((study) => (
                                <CaseStudyCard key={study.id} study={study} />
                            ))}
                        </div>
                    </section>

                    <section className="cta-section">
                        <div className="cta-content">
                            <span className="cta-subtitle">LET'S CREATE IMPACT TOGETHER</span>
                            <h2 className="cta-heading">HAVE A STORY IN MIND?</h2>
                            <p className="cta-desc">Partner with us to build unforgettable cinematic experiences.</p>
                            <a href="#" className="cta-btn">
                                <span>START A CONVERSATION</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
