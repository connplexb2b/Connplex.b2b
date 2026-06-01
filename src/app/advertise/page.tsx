"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState, useRef, useCallback } from "react";

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
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-2 opacity-70"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};

// --- Main Page ---

export default function AdvertisePage() {
    const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
    const heroRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.5;
        }
    }, []);

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
        <div className="bg-[#030303] text-white font-outfit min-h-screen relative overflow-x-hidden">
            <Header />

            {/* Immersive Cinematic Wrapper */}
            <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-cover bg-[center_30%] bg-no-repeat bg-[url('/img/advertise/theater_bg.png')]" ref={heroRef}>
                <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none" autoPlay loop muted playsInline poster="/img/advertise/theater_bg.png">
                    <source src="/video/advertise_lion.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-1 bg-[radial-gradient(circle_at_75%_45%,rgba(3,3,3,0)_0%,rgba(3,3,3,0.75)_100%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-1 bg-gradient-to-r from-black/95 via-black/80 to-black/40"></div>

                <ProjectorMotes />

                {/* Main Hero Content */}
                <main className="flex-1 flex items-center px-4 md:px-20 z-10 relative pt-[110px] pb-12 md:pt-[140px] md:pb-20">
                    <div className="flex flex-col max-w-[650px] w-full text-center md:text-left items-center md:items-start">
                        <div className="flex items-center mb-5">
                            <span className="font-inter text-[11px] font-semibold tracking-[3px] text-zinc-500 uppercase">BIGGER SCREEN. BIGGER IMPACT.</span>
                        </div>

                        <h1 className="font-outfit text-4xl sm:text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.92] tracking-tight text-white mb-6 uppercase">
                            ADVERTISE<br />
                            <span className="bg-gradient-to-r from-[#fdf1d6] via-gold-primary to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">WITH CONNPLEX</span>
                        </h1>

                        <p className="text-sm sm:text-base leading-relaxed text-white/70 tracking-wide font-light max-w-[490px] mb-10">
                            Premium Cinema Advertising Solutions Designed to Maximize Attention & Brand Recall.
                        </p>

                        <div className="flex">
                            <Link href="/contact" className="group inline-flex items-center gap-5 border border-white/25 bg-white/3 hover:border-gold-primary hover:text-black text-white px-7 py-3 font-inter text-xs font-semibold tracking-wider uppercase rounded-sm relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(201,159,74,0.35)] cursor-pointer h-12 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gold-primary before:transition-all before:duration-500 before:z-0 hover:before:left-0">
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">LET&apos;S PARTNER</span>
                                <div className="flex items-center justify-center width-[26px] height-[26px] w-6.5 h-6.5 rounded-full border border-white/30 relative z-10 transition-all duration-500 group-hover:border-black group-hover:bg-black/10">
                                    <svg className="stroke-white group-hover:stroke-black group-hover:translate-x-1 transition-all duration-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Bottom Brand Bar */}
                <footer className="z-10 relative px-4 md:px-16 pt-5 pb-10 bg-gradient-to-t from-[#030303]/98 to-transparent">
                    <div className="flex items-center justify-center mb-6 before:content-[''] before:flex-1 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#c99f4a]/25 before:to-transparent before:mr-6 after:content-[''] after:flex-1 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-[#c99f4a]/25 after:to-transparent after:ml-6">
                        <span className="font-inter text-[10px] font-medium tracking-[3px] text-[#7a612d] uppercase">TRUSTED BY WORLD-CLASS BRANDS</span>
                    </div>

                    <div className="overflow-hidden w-full relative py-2.5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] max-w-[1320px] mx-auto">
                        <div className="flex w-max animate-fra-scroll hover:[animation-play-state:paused]">
                            {/* Duplicate the group twice for seamless infinite scrolling */}
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="flex items-center justify-around gap-16 pr-16">
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-extrabold tracking-[5px] text-lg"><span>SAMSUNG</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-extrabold tracking-[5px] text-lg"><span>DELL</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-outfit font-normal tracking-[4px] text-sm"><span>HP</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-semibold tracking-[5px] text-base"><span>TVS Electronics</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>UFO</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Barco</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Sony</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Dolby</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Galalite</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Bookmyshow</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>JBL</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Lavaza</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Panaroma Studios</span></div>
                                    <div className="text-base text-white/35 transition-all duration-400 cursor-default select-none flex items-center justify-center h-10 hover:text-[#ebd59b] hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(201,159,74,0.3)] font-inter font-medium tracking-[3px] text-sm"><span>Paytm</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>

            {/* Section 2: Why Advertise */}
            <section className="bg-[#030303] py-20 md:py-32 relative z-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-end mb-12 md:mb-16">
                        <div className="flex flex-col">
                            <span className="font-inter text-[11px] font-semibold tracking-[3px] text-gold-primary mb-3.5 uppercase">THE CINEMA ADVANTAGE</span>
                            <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-white uppercase">
                                AD FORMATS<br />
                                THAT DELIVER<br />
                                <span className="bg-gradient-to-r from-[#fdf1d6] via-gold-primary to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">MAXIMUM IMPACT</span>
                            </h2>
                        </div>
                        <div className="flex items-end">
                            <p className="text-sm sm:text-base leading-relaxed text-white/65 font-light max-w-[520px]">
                                Cinema is more than just a screen, it&apos;s an immersive environment where your brand connects with highly engaged audiences, creating a lasting impact.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-white/5 bg-[#050505]/20 rounded-md overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                        {[
                            { title: "UNMATCHED ATTENTION", desc: "Captive audience with zero distractions.", icon: <circle cx="12" cy="10" r="3" /> },
                            { title: "PREMIUM ENVIRONMENT", desc: "Your brand in high-end, luxurious settings.", icon: <path d="M6 3h12l4 6-10 12L2 9z" /> },
                            { title: "HIGH-VALUE AUDIENCE", desc: "Affluent, educated & influential moviegoers.", icon: <circle cx="9" cy="7" r="4" /> },
                            { title: "MASSIVE REACH", desc: "Multiple locations. Thousands of screens.", icon: <circle cx="12" cy="12" r="10" /> },
                            { title: "MEASURABLE IMPACT", desc: "Proven brand lift & campaign performance.", icon: <polyline points="2 13 6 10 12 3 18 8 22 4" /> }
                        ].map((card, i) => (
                            <div className="group/card p-8 md:p-12 flex flex-col items-start bg-[#030303]/40 border-b lg:border-b-0 lg:border-r border-white/5 last:border-0 relative transition-all duration-500 hover:bg-[#c99f4a]/[0.035]" key={i}>
                                <div className="mb-8 text-gold-primary flex items-center justify-center transition-all duration-500 group-hover/card:-translate-y-1 group-hover/card:scale-105 group-hover/card:text-[#ebd59b]">
                                    <svg className="w-9.5 h-9.5 stroke-gold-primary stroke-[1.25] fill-none transition-colors duration-400 group-hover/card:stroke-[#ebd59b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {card.icon}
                                    </svg>
                                </div>
                                <h3 className="font-inter text-[11px] font-bold tracking-[1.8px] text-[#ebd59b] mb-4 uppercase leading-normal">{card.title}</h3>
                                <p className="text-xs leading-relaxed text-white/55 font-light transition-colors duration-400 group-hover/card:text-white/80">{card.desc}</p>
                                <div className="content-[''] absolute bottom-0 left-0 w-0 h-0.5 bg-gold-primary transition-all duration-500 shadow-[0_0_12px_#c99f4a] group-hover/card:w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Ad Formats */}
            <section className="bg-[#030303] py-20 relative z-10 border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
                        <div className="formats-title-col">
                            <h2 className="font-outfit text-3xl md:text-[34px] font-bold leading-tight tracking-normal text-white uppercase">
                                AD FORMATS<br />
                                THAT DELIVER<br />
                                <span className="bg-gradient-to-r from-[#fdf1d6] via-gold-primary to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">MAXIMUM IMPACT</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            {[
                                { title: "PRE-SHOW ADS", desc: "Premium cinema advertising that captures audience attention before every movie.", img: "/img/advertise/case_study_4.png" },
                                { title: "ON-SCREEN ADS", desc: "High-impact big screen advertising designed for maximum brand visibility and recall.", img: "/img/advertise/case_study_5.png" },
                                { title: "LOBBY & DIGITAL", desc: "Strategic cinema lobby branding and digital advertising for immersive audience.", img: "/img/advertise/case_study_6.png" },
                                { title: "MASSIVE EXPERIENCES", desc: "Experiential marketing campaigns that create memorable and interactive brand connections.", img: "/img/advertise/theater_bg.png" },
                                { title: "EVENT SPONSORSHIPS", desc: "Exclusive movie premiere and entertainment sponsorships that elevate brand presence.", img: "/img/advertise/cta_theater_bg.png" }
                            ].map((format, i) => (
                                <div className="group/format bg-[#0f0f0f]/40 border border-white/5 p-3.5 rounded-lg transition-all duration-500 flex flex-col hover:border-[#c99f4a]/30 hover:bg-[#c99f4a]/[0.02] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]" key={i}>
                                    <div className="w-full aspect-[4/3] rounded-md overflow-hidden relative mb-4 bg-black">
                                        <Image src={format.img} alt={format.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" style={{ objectFit: 'cover' }} className="w-full h-full object-cover block transition-transform duration-700 group-hover/format:scale-108" />
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"></div>
                                    </div>
                                    <h3 className="font-inter text-[11px] font-bold tracking-[1.5px] text-[#ebd59b] mb-2 uppercase">{format.title}</h3>
                                    <p className="text-[11.5px] leading-relaxed text-white/50 font-light">{format.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Power of Big Screen */}
            <section className="bg-[#030303] py-20 relative z-10 border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
                        <div className="w-full">
                            {/* Mobile/Tablet Title: Above picture */}
                            <div className="lg:hidden mb-6">
                                <span className="font-inter text-[11px] font-semibold tracking-[3px] text-gold-primary uppercase">THE POWER OF THE BIG SCREEN</span>
                            </div>
                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative border border-white/8 shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_40px_rgba(201,159,74,0.05)]">
                                <Image src="/img/advertise/theater_bg.png" alt="Big Screen Power" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} className="w-full h-full object-cover block brightness-[0.65] contrast-[1.05]" />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#c99f4a]/6 via-transparent to-[#030303]/75 pointer-events-none z-10"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-outfit text-base sm:text-xl font-semibold tracking-[3px] text-white/75 uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] z-20 text-center w-[90%]">YOUR BRAND ON THE BIG SCREEN</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {/* Desktop Title: Above stats */}
                            <span className="font-inter text-[11px] font-semibold tracking-[3px] text-gold-primary uppercase hidden lg:block">THE POWER OF THE BIG SCREEN</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mt-0 lg:mt-9">
                                {[
                                    { val: "97%", lbl: "attention to ads on big screen" },
                                    { val: "2.5x", lbl: "higher brand recall than other media" },
                                    { val: "84%", lbl: "audiences take action after seeing ad" },
                                    { val: "100%", lbl: "viewability with zero ad-blocking" }
                                ].map((stat, i) => (
                                    <div className="flex flex-col py-2.5" key={i} ref={(el) => setRef(el, `stat-${i}`)}>
                                        <span className="font-outfit text-5xl sm:text-6xl font-bold leading-none mb-3 bg-gradient-to-br from-white to-gold-primary bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                                            <Counter target={stat.val} isVisible={isVisible[`stat-${i}`]} />
                                        </span>
                                        <p className="text-xs sm:text-sm leading-relaxed text-white/60 font-light tracking-wide">{stat.lbl}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: Audience */}
            <section className="bg-[#030303] py-20 relative z-10 border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1.25fr] gap-10 lg:gap-16 items-center">
                        <div className="flex flex-col">
                            <h2 className="font-outfit text-3xl md:text-[38px] font-bold leading-tight text-white uppercase">
                                YOUR BRAND. IN FRONT<br />
                                <span className="bg-gradient-to-r from-[#fdf1d6] via-gold-primary to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">OF THE RIGHT AUDIENCE.</span>
                            </h2>
                            <p className="text-[14.5px] leading-relaxed text-white/65 font-light my-5 max-w-[380px]">
                                Our audience is diverse, upscale, and highly engaged, perfect for brands that demand quality attention.
                            </p>
                            <Link href="/contact" className="group inline-flex items-center gap-5 border border-white/25 bg-white/3 hover:border-gold-primary hover:text-black text-white px-7 py-3 font-inter text-xs font-semibold tracking-wider uppercase rounded-sm relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(201,159,74,0.35)] cursor-pointer h-12 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gold-primary before:transition-all before:duration-500 before:z-0 hover:before:left-0">
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">OUR AUDIENCE</span>
                                <div className="flex items-center justify-center width-[26px] height-[26px] w-6.5 h-6.5 rounded-full border border-white/30 relative z-10 transition-all duration-500 group-hover:border-black group-hover:bg-black/10">
                                    <svg className="stroke-white group-hover:stroke-black group-hover:translate-x-1 transition-all duration-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </div>
                            </Link>
                        </div>
                        <div className="flex flex-col border-y md:border-y-0 md:border-x border-white/5 divide-y divide-white/5 py-4 md:py-0 md:px-8">
                            {[
                                { val: "70%", lbl: "AGE 18-45", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
                                { val: "65%", lbl: "PREMIUM INCOME", icon: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
                                { val: "80%", lbl: "FREQUENT MOVIE GOERS", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
                                { val: "4.7/5", lbl: "ENGAGEMENT RATE", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" },
                                { val: "50+", lbl: "CITIES", icon: "M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M9 7h2 M9 11h2 M9 15h2 M13 7h2 M13 11h2 M13 15h2" },
                                { val: "125+", lbl: "SCREENS", icon: "M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z M12 17v4 M8 21h8" }
                            ].map((stat, i) => (
                                <div className="flex items-center gap-5 py-4.5 border-b border-white/5 last:border-b-0" key={i} ref={(el) => setRef(el, `aud-${i}`)}>
                                    <div className="text-gold-primary flex items-center justify-center">
                                        <svg className="w-6.5 h-6.5 stroke-gold-primary stroke-[1.5] fill-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={stat.icon} /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-outfit text-[28px] font-bold leading-tight text-white">
                                            <Counter target={stat.val} isVisible={isVisible[`aud-${i}`]} />
                                        </span>
                                        <span className="text-[9px] tracking-[1.5px] text-white/40 font-semibold uppercase mt-0.5">{stat.lbl}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="w-full h-[220px] relative bg-[radial-gradient(circle,rgba(201,159,74,0.08)_0%,rgba(3,3,3,0)_70%)] flex items-center justify-center">
                                <svg className="w-full h-full opacity-75" viewBox="0 0 1000 480" fill="none">
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
            <section className="bg-[#030303] py-24 md:py-32 relative z-10 border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
                        <div className="flex flex-col">
                            <h2 className="font-outfit text-4xl sm:text-[46px] font-bold leading-tight text-white uppercase">
                                LET&apos;S CREATE<br />
                                <span className="bg-gradient-to-r from-[#fdf1d6] via-gold-primary to-[#906c24] bg-clip-text text-transparent inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">SOMETHING EXTRAORDINARY</span>
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed text-white/65 font-light my-6 lg:my-8 max-w-[440px]">
                                Partner with Connplex and put your brand in front of the right audience, at the right time.
                            </p>
                            <Link href="/contact" className="group inline-flex items-center gap-5 border border-white/25 bg-white/3 hover:border-gold-primary hover:text-black text-white px-7 py-3 font-inter text-xs font-semibold tracking-wider uppercase rounded-sm relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(201,159,74,0.35)] cursor-pointer h-12 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gold-primary before:transition-all before:duration-500 before:z-0 hover:before:left-0">
                                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">GET IN TOUCH</span>
                                <div className="flex items-center justify-center width-[26px] height-[26px] w-6.5 h-6.5 rounded-full border border-white/30 relative z-10 transition-all duration-500 group-hover:border-black group-hover:bg-black/10">
                                    <svg className="stroke-white group-hover:stroke-black group-hover:translate-x-1 transition-all duration-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full">
                            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(201,159,74,0.05)]">
                                <Image src="/img/advertise/cta_theater_bg.png" alt="Theater Screen" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#c99f4a]/2 via-transparent to-[#030303]/85 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
