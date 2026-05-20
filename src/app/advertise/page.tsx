"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef, useCallback } from "react";
import "./advertise.css";

// --- Components ---

/**
 * Animated Counter Component
 */
const Counter = ({ target, isVisible }: { target: string, isVisible: boolean }) => {
    const [displayValue, setDisplayValue] = useState("0");
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isVisible || hasAnimated.current) return;

        const match = target.match(/^([^\d\.]*)([\d\.]+)([^\d\.]*)$/);
        if (!match) {
            setDisplayValue(target);
            return;
        }

        const prefix = match[1];
        const numberStr = match[2];
        const suffix = match[3];
        const targetValue = parseFloat(numberStr);
        const decimals = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;

        let startTime: number | null = null;
        const duration = 1800;
        const easeOutCubic = (t: number) => (--t) * t * t + 1;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentValue = easedProgress * targetValue;

            setDisplayValue(prefix + currentValue.toFixed(decimals) + suffix);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(target);
                hasAnimated.current = true;
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, target]);

    return <span>{displayValue}</span>;
};

/**
 * Projector Motes Canvas Component
 */
const ProjectorMotes = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isInside: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let motes: Mote[] = [];
        const moteCount = 45;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        class Mote {
            x = 0; y = 0; size = 0; speedX = 0; speedY = 0; alpha = 0;
            shimmerSpeed = 0; shimmerDir = 1; color = "";

            constructor() { this.reset(true); }

            reset(initial = false) {
                this.x = Math.random() * canvas!.width;
                this.y = initial ? Math.random() * canvas!.height : canvas!.height + 10;
                this.size = Math.random() * 2.2 + 0.4;
                this.speedY = -(Math.random() * 0.25 + 0.08);
                this.speedX = (Math.random() - 0.5) * 0.12;
                this.alpha = Math.random() * 0.4 + 0.1;
                this.shimmerSpeed = Math.random() * 0.006 + 0.002;
                this.shimmerDir = Math.random() > 0.5 ? 1 : -1;
                this.color = `rgba(235, 213, 155, `;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                if (mouseRef.current.isInside) {
                    const dx = this.x - mouseRef.current.x;
                    const dy = this.y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150 * 0.35;
                        this.x += (dx / dist) * force;
                        this.y += (dy / dist) * force;
                    }
                }

                this.alpha += this.shimmerSpeed * this.shimmerDir;
                if (this.alpha >= 0.6 || this.alpha <= 0.08) this.shimmerDir *= -1;
                if (this.y < -10 || this.x < -10 || this.x > canvas!.width + 10) this.reset(false);
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + Math.max(0, this.alpha) + ')';
                if (this.size > 1.6) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = 'rgba(201, 159, 74, 0.4)';
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
        }

        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < moteCount; i++) motes.push(new Mote());

        const render = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (mouseRef.current.isInside) {
                mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
                mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
            }

            motes.forEach(mote => {
                mote.update();
                mote.draw();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseRef.current.targetX = e.clientX - rect.left;
        mouseRef.current.targetY = e.clientY - rect.top;
        mouseRef.current.isInside = true;
    };

    const handleMouseLeave = () => {
        mouseRef.current.isInside = false;
    };

    return (
        <canvas
            ref={canvasRef}
            className="projector-motes-canvas"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, opacity: 0.7 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};

// --- Main Page ---

export default function AdvertisePage() {
    const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
    const heroRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for counting animations
    const setRef = useCallback((node: HTMLElement | null, id: string) => {
        if (node) {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(prev => ({ ...prev, [id]: true }));
                    observer.unobserve(node);
                }
            }, { threshold: 0.1 });
            observer.observe(node);
        }
    }, []);

    // Cinematic Parallax Effect
    useEffect(() => {
        const handleParallax = (e: MouseEvent) => {
            if (!heroRef.current) return;
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            const shiftX = mouseX * -15;
            const shiftY = mouseY * -15;
            heroRef.current.style.backgroundPosition = `calc(50% + ${shiftX}px) calc(30% + ${shiftY}px)`;
        };
        window.addEventListener('mousemove', handleParallax);
        return () => window.removeEventListener('mousemove', handleParallax);
    }, []);



    return (
        <div className="advertise-page-wrapper">
            <Header />

            {/* Immersive Cinematic Wrapper */}
            <div className="cinematic-hero-wrapper" ref={heroRef}>
                <video className="hero-bg-video" autoPlay loop muted playsInline poster="/img/advertise/theater_bg.png">
                    <source src="/video/advertise_lion.mp4" type="video/mp4" />
                </video>
                <div className="atmospheric-overlay"></div>
                <div className="left-vignette"></div>

                <ProjectorMotes />

                {/* Main Hero Content */}
                <main className="main-content">
                    <div className="hero-left-content">
                        <div className="subtitle-wrapper">
                            <span className="hero-subtitle">BIGGER SCREEN. BIGGER IMPACT.</span>
                        </div>

                        <h1 className="main-heading">
                            ADVERTISE<br />
                            <span className="gold-gradient-text">WITH CONNPLEX</span>
                        </h1>

                        <p className="tagline-paragraph">
                            Premium Cinema Advertising Solutions Designed to Maximize Attention & Brand Recall.
                        </p>

                        <div className="cta-wrapper">
                            <Link href="/contact" className="btn-partner">
                                <span>LET&apos;S PARTNER</span>
                                <div className="arrow-circle">
                                    <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Bottom Brand Bar */}
                <footer className="brands-footer">
                    <div className="brands-header">
                        <span className="brands-title">TRUSTED BY WORLD-CLASS BRANDS</span>
                    </div>

                    <div className="brands-logos-wrapper">
                        <div className="brands-logos-track">
                            {/* Duplicate the group twice for seamless infinite scrolling */}
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="brands-logos-group">
                                    <div className="brand-item brand-samsung"><span>SAMSUNG</span></div>
                                    <div className="brand-item brand-samsung"><span>DELL</span></div>
                                    <div className="brand-item brand-jacob"><span>HP</span></div>
                                    <div className="brand-item brand-emaar"><span>TVS Electronics</span></div>
                                    <div className="brand-item brand-UFO"><span>UFO</span></div>
                                    <div className="brand-item brand-barco"><span>Barco</span></div>
                                    <div className="brand-item brand-barco"><span>Sony</span></div>
                                    <div className="brand-item brand-barco"><span>Dolby</span></div>
                                    <div className="brand-item brand-barco"><span>Galalite</span></div>
                                    <div className="brand-item brand-barco"><span>Bookmyshow</span></div>
                                    <div className="brand-item brand-barco"><span>JBL</span></div>
                                    <div className="brand-item brand-barco"><span>Lavaza</span></div>
                                    <div className="brand-item brand-barco"><span>Panaroma Studios</span></div>
                                    <div className="brand-item brand-barco"><span>Paytm</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>

            {/* Section 2: Why Advertise */}
            <section className="advantage-section">
                <div className="advantage-container">
                    <div className="advantage-header-grid">
                        <div className="advantage-header-left">
                            <span className="advantage-tag">THE CINEMA ADVANTAGE</span>
                            <h2 className="advantage-heading">
                                AD FORMATS<br />
                                THAT DELIVER<br />
                                <span className="gold-gradient-text">MAXIMUM IMPACT</span>
                            </h2>
                        </div>
                        <div className="advantage-header-right">
                            <p className="advantage-desc-paragraph">
                                Cinema is more than just a screen&mdash;it&apos;s an immersive environment where your brand connects with highly engaged audiences, creating a lasting impact.
                            </p>
                        </div>
                    </div>

                    <div className="advantage-cards-grid">
                        {[
                            { title: "UNMATCHED ATTENTION", desc: "Captive audience with zero distractions.", icon: <circle cx="12" cy="10" r="3" /> },
                            { title: "PREMIUM ENVIRONMENT", desc: "Your brand in high-end, luxurious settings.", icon: <path d="M6 3h12l4 6-10 12L2 9z" /> },
                            { title: "HIGH-VALUE AUDIENCE", desc: "Affluent, educated & influential moviegoers.", icon: <circle cx="9" cy="7" r="4" /> },
                            { title: "MASSIVE REACH", desc: "Multiple locations. Thousands of screens.", icon: <circle cx="12" cy="12" r="10" /> },
                            { title: "MEASURABLE IMPACT", desc: "Proven brand lift & campaign performance.", icon: <polyline points="2 13 6 10 12 3 18 8 22 4" /> }
                        ].map((card, i) => (
                            <div className="advantage-card" key={i}>
                                <div className="card-icon-wrapper">
                                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {card.icon}
                                    </svg>
                                </div>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-desc">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Ad Formats */}
            <section className="formats-section">
                <div className="formats-container">
                    <div className="formats-layout-grid">
                        <div className="formats-title-col">
                            <h2 className="formats-section-title">
                                AD FORMATS<br />
                                THAT DELIVER<br />
                                <span className="gold-gradient-text">MAXIMUM IMPACT</span>
                            </h2>
                        </div>
                        <div className="formats-cards-row">
                            {[
                                { title: "PRE-SHOW ADS", desc: "Premium cinema advertising that captures audience attention before every movie.", img: "/img/advertise/case_study_4.png" },
                                { title: "ON-SCREEN ADS", desc: "High-impact big screen advertising designed for maximum brand visibility and recall.", img: "/img/advertise/case_study_5.png" },
                                { title: "LOBBY & DIGITAL", desc: "Strategic cinema lobby branding and digital advertising for immersive audience.", img: "/img/advertise/case_study_6.png" },
                                { title: "MASSIVE EXPERIENCES", desc: "Experiential marketing campaigns that create memorable and interactive brand connections.", img: "/img/advertise/theater_bg.png" },
                                { title: "EVENT SPONSORSHIPS", desc: "Exclusive movie premiere and entertainment sponsorships that elevate brand presence.", img: "/img/advertise/cta_theater_bg.png" }
                            ].map((format, i) => (
                                <div className="format-card" key={i}>
                                    <div className="format-image-container">
                                        <Image src={format.img} alt={format.title} fill style={{ objectFit: 'cover' }} className="format-img" />
                                        <div className="format-overlay"></div>
                                    </div>
                                    <h3 className="format-title">{format.title}</h3>
                                    <p className="format-description">{format.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Power of Big Screen */}
            <section className="power-section">
                <div className="power-container">
                    <div className="power-layout-grid">
                        <div className="power-visual-col">
                            <div className="screen-mockup-wrapper">
                                <Image src="/img/advertise/theater_bg.png" alt="Big Screen Power" fill style={{ objectFit: 'cover' }} className="screen-mockup-img" />
                                <div className="screen-glow-reflection"></div>
                                <div className="screen-text-overlay">YOUR BRAND ON THE BIG SCREEN</div>
                            </div>
                        </div>
                        <div className="power-stats-col">
                            <span className="power-subtitle">THE POWER OF THE BIG SCREEN</span>
                            <div className="stats-matrix-grid">
                                {[
                                    { val: "97%", lbl: "attention to ads on big screen" },
                                    { val: "2.5x", lbl: "higher brand recall than other media" },
                                    { val: "84%", lbl: "audiences take action after seeing ad" },
                                    { val: "100%", lbl: "viewability with zero ad-blocking" }
                                ].map((stat, i) => (
                                    <div className="stat-card" key={i} ref={(el) => setRef(el, `stat-${i}`)}>
                                        <span className="stat-value">
                                            <Counter target={stat.val} isVisible={isVisible[`stat-${i}`]} />
                                        </span>
                                        <p className="stat-label">{stat.lbl}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Section 6: Audience */}
            <section className="audience-section">
                <div className="audience-container">
                    <div className="audience-layout-grid">
                        <div className="audience-left-col">
                            <h2 className="audience-main-heading">
                                YOUR BRAND. IN FRONT<br />
                                <span className="gold-gradient-text">OF THE RIGHT AUDIENCE.</span>
                            </h2>
                            <p className="audience-main-desc">
                                Our audience is diverse, upscale, and highly engaged&mdash;perfect for brands that demand quality attention.
                            </p>
                            <Link href="/contact" className="btn-audience">
                                <span>OUR AUDIENCE</span>
                                <div className="arrow-circle">
                                    <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </div>
                            </Link>
                        </div>
                        <div className="audience-mid-col">
                            {[
                                { val: "70%", lbl: "AGE 18-45", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
                                { val: "65%", lbl: "PREMIUM INCOME", icon: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
                                { val: "80%", lbl: "FREQUENT MOVIE GOERS", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
                                { val: "4.7/5", lbl: "ENGAGEMENT RATE", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" },
                                { val: "10+", lbl: "CITIES", icon: "M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M9 7h2 M9 11h2 M9 15h2 M13 7h2 M13 11h2 M13 15h2" },
                                { val: "115+", lbl: "SCREENS", icon: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z M12 17v4 M8 21h8" }
                            ].map((stat, i) => (
                                <div className="aud-stat-item" key={i} ref={(el) => setRef(el, `aud-${i}`)}>
                                    <div className="aud-icon-wrapper">
                                        <svg className="aud-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={stat.icon} /></svg>
                                    </div>
                                    <div className="aud-stat-text">
                                        <span className="aud-stat-val">
                                            <Counter target={stat.val} isVisible={isVisible[`aud-${i}`]} />
                                        </span>
                                        <span className="aud-stat-lbl">{stat.lbl}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="audience-right-col">
                            <div className="world-map-wrapper">
                                <svg className="gold-world-map" viewBox="0 0 1000 480" fill="none">
                                    <path d="M150 120h5v5h-5zm30 40h5v5h-5zm120-20h5v5h-5zm40 60h5v5h-5zm150-100h5v5h-5zm80 140h5v5h-5zm100-80h5v5h-5zm120 60h5v5h-5zm90-40h5v5h-5zm30 120h5v5h-5zm-550 80h5v5h-5zm120 40h5v5h-5zm280-120h5v5h-5zm40-100h5v5h-5zm140 300h5v5h-5" fill="var(--gold-primary)" opacity="0.6" />
                                    <circle cx="582.5" cy="182.5" r="4" fill="var(--gold-primary)" />
                                    <circle cx="302.5" cy="142.5" r="4" fill="var(--gold-primary)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 7: CTA Extraordinary */}
            <section className="cta-extraordinary-section">
                <div className="cta-container">
                    <div className="cta-layout-grid">
                        <div className="cta-content-col">
                            <h2 className="cta-main-heading">
                                LET&apos;S CREATE<br />
                                <span className="gold-gradient-text">SOMETHING EXTRAORDINARY</span>
                            </h2>
                            <p className="cta-description">
                                Partner with Connplex and put your brand in front of the right audience, at the right time.
                            </p>
                            <Link href="/contact" className="btn-partner">
                                <span>GET IN TOUCH</span>
                                <div className="arrow-circle">
                                    <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </div>
                            </Link>
                        </div>
                        <div className="cta-visual-col">
                            <div className="cta-theater-frame">
                                <Image src="/img/advertise/cta_theater_bg.png" alt="Theater Screen" fill style={{ objectFit: 'cover' }} />
                                <div className="cta-screen-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
