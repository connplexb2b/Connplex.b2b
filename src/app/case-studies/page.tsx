'use client';

import React, { useState, useEffect, useRef } from 'react';
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.05fr_0.95fr] border border-white/3 rounded-xl bg-[#080808]/45 overflow-hidden h-auto lg:h-[330px] relative group [transform-style:preserve-3d]" 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.1s ease-out, border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease' }}
        >
            <div className="absolute inset-0 pointer-events-none z-[5] opacity-0 transition-opacity duration-300" ref={glareRef}></div>
            <div className="p-6 sm:p-10 flex flex-col justify-between relative z-10">
                <div className="font-oswald text-[54px] font-semibold text-[#c99f4a]/14 leading-none transition-colors duration-400 group-hover:text-[#c99f4a]">{study.num}</div>
                <div className="flex flex-col gap-2 mt-4">
                    <span className="font-outfit text-xs font-semibold tracking-wider text-[#c99f4a] uppercase">{study.tag}</span>
                    <h2 className="font-oswald text-2xl sm:text-[26px] font-semibold leading-tight text-white uppercase transition-colors duration-400 group-hover:text-[#f1cf85]" dangerouslySetInnerHTML={{ __html: study.title }}></h2>
                    <p className="font-inter text-xs text-[#a0a0a0] uppercase tracking-wide">{study.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#a0a0a0] mt-4">
                    <svg className="text-[#c99f4a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{study.location}</span>
                </div>
            </div>
            <div className="relative overflow-hidden h-[180px] sm:h-[220px] md:h-full bg-[#030303] [mask-image:none] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_88%,transparent_100%)]">
                <img src={study.img} alt={study.title.replace(/<br>/g, ' ')} className="w-full h-full object-cover filter brightness-[0.75] transition-transform duration-700 group-hover:scale-[1.04] group-hover:brightness-[0.95]" />
                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </div>
            <div className="p-6 sm:p-10 lg:p-[40px_45px] flex flex-col justify-between gap-4 lg:gap-0">
                <p className="font-inter text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">{study.desc}</p>
                <a href="#" className="text-[#c99f4a] font-outfit text-[12px] font-semibold flex items-center gap-2.5 transition-colors duration-300 hover:text-white relative group/link after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#c99f4a] hover:after:bg-white after:transition-all after:duration-300 w-fit">
                    VIEW CASE STUDY
                    <svg className="transition-transform duration-300 group-hover/link:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        { id: 1, num: '01', tag: 'SMART CINEMA', title: 'CONNPLEX<br>EXPERIENCE CENTRE', subtitle: 'REDEFINING THE FUTURE OF CINEMA', location: 'MUMBAI, MAHARASHTRA', img: '/img/case-study/case_study_1.png', desc: 'A next-gen flagship cinema featuring 7 premium auditoriums, recliners, immersive sound and intelligent automation.', category: 'smart-cinemas' },
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
        <div className="bg-[#050505] text-white font-inter font-normal leading-normal overflow-x-hidden min-h-screen relative">
            <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[500px] h-[500px] bg-[#c99f4a]/8 top-[-100px] left-[-150px] hidden md:block"></div>
            <div className="fixed rounded-full pointer-events-none z-0 filter blur-[120px] w-[700px] h-[700px] bg-[#c99f4a]/5 bottom-[-150px] right-[-200px] hidden md:block"></div>
            <div className="fixed inset-0 z-0 pointer-events-none starfield"></div>

            <Header />

            <div className="flex flex-col min-h-screen max-w-[1500px] mx-auto px-4 sm:px-6 md:px-[50px] lg:px-[80px] relative z-10">
                <main className="grow flex flex-col justify-center gap-10 md:gap-[60px] py-[80px] md:py-[100px] pb-[30px] md:pb-[50px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-[80px] items-center">
                        <section className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <span className="font-outfit text-[#c99f4a] text-sm font-semibold tracking-[0.25em] mb-6 relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1.5px] before:bg-[#c99f4a] before:shadow-[0_0_6px_#c99f4a]">CASE STUDIES</span>
                            <h1 className="font-oswald text-[2.2rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[4rem] xl:text-[72px] font-bold leading-[1.05] tracking-wide text-white mb-7 uppercase">
                                EXPERIENCES<br />
                                THAT INSPIRE.<br />
                                STORIES THAT<br />
                                <span className="bg-gradient-to-br from-[#c99f4a] via-[#ffd885] to-[#b3852d] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(201,159,74,0.25)] relative inline-block">STAY.</span>
                            </h1>
                            <p className="font-inter text-base sm:text-[17px] font-light leading-[1.65] text-[#a0a0a0] max-w-[540px] mb-11">
                                Every Connplex cinema is more than a destination it's an experience engineered to create impact, emotion and unforgettable memories.
                            </p>
                            <div className="flex">
                                <a href="#" className="group inline-flex items-center gap-4 px-9 py-4 border border-[#c99f4a]/35 bg-transparent text-[#c99f4a] font-outfit text-xs font-semibold tracking-[0.12em] no-underline rounded-sm relative overflow-hidden transition-all duration-300 hover:text-white hover:border-[#c99f4a] hover:shadow-[0_0_30px_rgba(201,159,74,0.15),_inset_0_0_15px_rgba(201,159,74,0.05)] hover:-translate-y-0.5 z-10 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[#ffd885]/10 before:to-transparent before:transition-all before:duration-500 before:z-[-1] hover:before:left-full">
                                    EXPLORE OUR WORK
                                    <span className="flex items-center justify-center bg-[#c99f4a]/8 border border-[#c99f4a]/15 rounded-full w-8 h-8 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#c99f4a] group-hover:via-[#ffd885] group-hover:to-[#b3852d] group-hover:border-[#c99f4a] group-hover:text-black group-hover:shadow-[0_0_12px_#c99f4a]">
                                        <svg className="w-[18px] h-[18px] transition-all duration-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </section>

                        <section className="relative h-[250px] sm:h-[350px] lg:h-[520px] flex justify-center items-center" id="canvas-3d-container">
                            <div className="relative w-full h-full flex justify-center items-center [perspective:1500px] [transform-style:preserve-3d] cursor-pointer" ref={chairRef}>
                                <div className="flex justify-center items-center w-full h-full [transform-style:preserve-3d] animate-[floatOnly_6s_ease-in-out_infinite]">
                                    <img 
                                        ref={chairImgRef}
                                        src="/img/case-study/connplex_chair.png" 
                                        alt="Connplex Premium Cinema Chair" 
                                        className="max-w-[110%] max-h-[110%] object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)] translate-z-[50px] z-10 relative" 
                                        style={{ transition: 'transform 0.1s ease-out' }}
                                    />
                                </div>
                                <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(201,159,74,0.35)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-z-[10px] z-0 pointer-events-none"></div>
                            </div>
                        </section>
                    </div>

                    <section className="relative bg-black/65 backdrop-blur-[25px] rounded-2xl px-5 sm:px-[50px] py-11 mb-5 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4),_inset_0_1px_0_rgba(255,255,255,0.05)] z-20">
                        <div className="dashboard-border-glow"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 md:gap-0 items-center relative">
                            {[
                                { label: 'SMART CINEMAS DELIVERED', target: 42, suffix: '+' },
                                { label: 'SCREENS DEPLOYED', target: 125, suffix: '+' },
                                { label: 'GUESTS IMPRESSED', target: 10, suffix: 'M+' },
                                { label: 'CITIES ACROSS INDIA', target: 50, suffix: '+' },
                                { label: 'YEARS OF CINEMATIC EXCELLENCE', target: 8, suffix: '+' }
                            ].map((stat, i) => (
                                <div className="flex flex-col items-center text-center px-[15px] py-2.5 relative cursor-pointer transition-all duration-500 cubic-bezier-[0.16,1,0.3,1] hover:-translate-y-2 hover:scale-[1.03] group" key={i}>
                                    <div className="flex items-center justify-center w-12 h-12 mb-5.5 text-[#c99f4a] bg-[#c99f4a]/3 border border-[#c99f4a]/8 rounded-full transition-all duration-400 group-hover:text-black group-hover:bg-gradient-to-br group-hover:from-[#c99f4a] group-hover:via-[#ffd885] group-hover:to-[#b3852d] group-hover:border-[#c99f4a] group-hover:shadow-[0_0_20px_rgba(201,159,74,0.4)]">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div className="font-oswald text-[48px] font-semibold leading-tight text-white mb-3.5 flex items-baseline justify-center">
                                        <AnimatedNumber target={stat.target} />
                                        {stat.suffix === 'M+' ? (
                                            <>
                                                <span>M</span>
                                                <span className="text-[#c99f4a] text-3xl ml-0.25 font-medium">+</span>
                                            </>
                                        ) : (
                                            <span className="text-[#c99f4a] text-3xl ml-0.25 font-medium">{stat.suffix}</span>
                                        )}
                                    </div>
                                    <p className="font-outfit text-[11px] font-semibold tracking-[0.1em] text-[#a0a0a0] leading-normal max-w-[160px] uppercase">{stat.label}</p>
                                    {i < 4 && <div className="absolute right-0 top-[15%] h-[70%] w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden lg:block"></div>}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-[60px] mb-10 flex flex-col gap-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex flex-wrap gap-2 sm:gap-4">
                                {[
                                    { label: 'ALL', value: 'all' },
                                    { label: 'SMART CINEMAS', value: 'smart-cinemas' },
                                    { label: 'PREMIUM FORMATS', value: 'premium-formats' },
                                    { label: 'DRIVE-IN CINEMAS', value: 'drive-in-cinemas' },
                                    { label: 'EXPERIENCE INITIATIVES', value: 'experience-initiatives' },
                                    { label: 'BRAND COLLABORATIONS', value: 'brand-collaborations' }
                                ].map((opt) => (
                                    <button 
                                        key={opt.value}
                                        className={`bg-transparent border border-transparent font-outfit text-xs sm:text-[13px] font-semibold tracking-[0.08em] px-4 sm:px-5.5 py-2 sm:py-2.5 rounded-full cursor-pointer transition-all duration-400 uppercase ${filter === opt.value ? 'text-[#c99f4a] border-[#c99f4a]/35 bg-[#c99f4a]/4' : 'text-[#a0a0a0] hover:text-white'}`}
                                        onClick={() => setFilter(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-7.5">
                            {filteredStudies.map((study) => (
                                <CaseStudyCard key={study.id} study={study} />
                            ))}
                        </div>
                    </section>

                    <section className="relative mt-[60px] md:mt-[100px] mb-[60px] py-[60px] px-6 sm:py-[120px] sm:px-[40px] rounded-2xl overflow-hidden border border-[#c99f4a]/15 flex justify-center items-center text-center">
                        <div className="absolute inset-0 bg-[url('/img/case-study/cta_theater_bg.png')] bg-cover bg-center filter blur-[2px] scale-103 z-0 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85 z-10 pointer-events-none"></div>
                        <div className="relative z-20 max-w-[750px] flex flex-col items-center gap-4">
                            <span className="font-outfit text-xs font-semibold tracking-wider text-[#c99f4a] uppercase">LET'S CREATE IMPACT TOGETHER</span>
                            <h2 className="font-oswald text-[32px] sm:text-[48px] font-bold text-white uppercase">HAVE A STORY IN MIND?</h2>
                            <p className="font-inter text-sm sm:text-base text-[#a0a0a0] leading-relaxed max-w-[500px] mx-auto">Partner with us to build unforgettable cinematic experiences.</p>
                            <a href="#" className="border border-[#c99f4a] text-[#c99f4a] px-[34px] py-[14px] font-outfit font-semibold text-sm rounded-sm hover:bg-gradient-to-br hover:from-[#c99f4a] hover:via-[#ffd885] hover:to-[#b3852d] hover:text-black transition-all duration-300">
                                <span>START A CONVERSATION</span>
                            </a>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
}
