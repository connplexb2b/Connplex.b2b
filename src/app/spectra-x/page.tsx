import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './spectra-x.css';

export const metadata = {
    title: "Connplex | Spectra X – India's First Active LED Cinema Technology",
    description: "Spectra X by Connplex Cinemas – India's first patented Active LED Cinema Technology. Government of India granted patent. 20 years patent protection.",
};

const SpectraXPage = () => {
    return (
        <div className="spectra-x-page">
            {/* Header Overlay */}
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="hero" id="heroSection">
                    {/* Left text content */}
                    <div className="hero-text">
                        <h1 className="hero-logo-text">
                            <span className="spectra-text">SPECTRA</span>
                            <span className="x-text">X</span>
                        </h1>
                        <p className="hero-tagline">
                            INDIA'S FIRST PATENTED<br />
                            <span className="gold">ACTIVE LED</span> <span className="white">CINEMA TECHNOLOGY</span>
                        </p>
                        <p className="hero-sub">PATENTED. POWERFUL. PROVEN.</p>
                        <div className="hero-ctas">
                            <a href="#technology" className="btn-outline" id="exploreTech">EXPLORE TECHNOLOGY →</a>
                            <a href="#patent" className="btn-outline-ghost" id="viewPatent">VIEW PATENT &nbsp;⧉</a>
                        </div>
                    </div>
                    {/* Right image — full bleed cinematic */}
                    <div className="hero-image-wrap">
                        <Image
                            src="/spectrax/TOP IMAGE.png"
                            alt="Spectra X Active LED Cinema Screen"
                            fill
                            priority
                            className="hero-img"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                        <div className="hero-glow"></div>
                    </div>
                </section>

                {/* PATENT STATS STRIP */}
                <section className="stats-strip" id="patent">
                    <div className="container stats-grid">
                        <div className="stat-card" id="statGov">
                            <div className="stat-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="22" stroke="#C9A84C" strokeWidth={2} />
                                    <path d="M24 10l3.09 9.26H37l-8 5.81 3.09 9.26L24 29.52l-8.09 4.81L19 25.07 11 19.26h9.91z" fill="#C9A84C" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">GOVERNMENT<br />OF INDIA</p>
                                <p className="stat-value gold">GRANTED PATENT</p>
                            </div>
                        </div>
                        <div className="stat-card" id="stat20">
                            <div className="stat-icon stat-num">20</div>
                            <div className="stat-content">
                                <p className="stat-label">20 YEARS<br />PATENT PROTECTION</p>
                                <p className="stat-value gold">STARTING MAY 2025</p>
                            </div>
                        </div>
                        <div className="stat-card" id="statLed">
                            <div className="stat-icon dots-icon">
                                <span></span><span></span><span></span>
                                <span></span><span></span><span></span>
                                <span></span><span></span><span></span>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">ACTIVE LED +<br />NON-DCI INTEGRATION</p>
                                <p className="stat-value gold">INDIA'S FIRST</p>
                            </div>
                        </div>
                        <div className="stat-card stat-patent-no" id="statPatentNo">
                            <p className="pn-label">PATENT NO.</p>
                            <p className="pn-number">202521021257</p>
                            <p className="pn-label">DATE OF GRANT</p>
                            <p className="pn-date gold">MAY 2025</p>
                            <div className="pn-logo">
                                <svg viewBox="0 0 40 20" fill="none">
                                    <circle cx="10" cy="10" r="8" stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M10 5l1.5 4.5H16l-3.5 2.5 1.5 4.5L10 14l-4 2.5 1.5-4.5L4 9.5h4.5z" fill="#C9A84C" />
                                </svg>
                                <span>GOVERNMENT OF INDIA</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className="features-grid-section" id="technology">
                    <div className="container features-grid">
                        <div className="feature-card" id="featBright">
                            <div className="feature-img">
                                <Image
                                    src="/spectrax/ultra high brightness image.png"
                                    alt="Ultra High Brightness"
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className="feature-info">
                                <div className="feature-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                </div>
                                <h3>ULTRA HIGH<br />BRIGHTNESS</h3>
                                <p>Brilliant visuals that stay consistent across every seat.</p>
                            </div>
                        </div>
                        <div className="feature-card" id="featBlacks">
                            <div className="feature-img">
                                <Image
                                    src="/spectrax/deeper blacks image.png"
                                    alt="Deeper Blacks"
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className="feature-info">
                                <div className="feature-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a10 10 0 0 1 0 20" />
                                    </svg>
                                </div>
                                <h3>DEEPER<br />BLACKS</h3>
                                <p>True blacks. Unmatched depth. Stunning realism.</p>
                            </div>
                        </div>
                        <div className="feature-card" id="featNonDci">
                            <div className="feature-img">
                                <Image
                                    src="/spectrax/non - dci flexibility image.png"
                                    alt="Non-DCI Flexibility"
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className="feature-info">
                                <div className="feature-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 3H8" />
                                        <path d="M12 3v4" />
                                    </svg>
                                </div>
                                <h3>NON-DCI<br />FLEXIBILITY</h3>
                                <p>Faster content deployment. Greater creative freedom.</p>
                            </div>
                        </div>
                        <div className="feature-card" id="featLive">
                            <div className="feature-img">
                                <Image
                                    src="/spectrax/live events & gaming ready.png"
                                    alt="Live Events & Gaming Ready"
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className="feature-info">
                                <div className="feature-icon-wrap">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <circle cx="12" cy="12" r="2" />
                                        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                                        <path d="M7.76 7.76a6 6 0 0 0 0 8.49" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                                    </svg>
                                </div>
                                <h3>LIVE EVENTS &<br />GAMING READY</h3>
                                <p>Beyond movies. Built for the future of entertainment.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NOT PROJECTION SECTION */}
                <section className="not-projection-section" id="notProjection">
                    <div className="np-left">
                        <Image
                            src="/spectrax/not projection image.png"
                            alt="Spectra X Cinema Hall"
                            fill
                            sizes="(max-width: 768px) 100vw, 52vw"
                        />
                    </div>
                    <div className="np-right">
                        <h2 className="np-headline">NOT<br />PROJECTION.<br />PURE LIGHT.</h2>
                        <p className="np-desc">The next generation of cinematic storytelling.</p>
                    </div>
                </section>

                {/* WHY IT MATTERS */}
                <section className="why-matters container" id="whyMatters">
                    <div className="section-title-bar">
                        <div className="title-line"></div>
                        <h2>WHY IT MATTERS</h2>
                        <div className="title-line"></div>
                    </div>
                    <div className="matters-grid">
                        <div className="matters-card" id="matFilmmakers">
                            <div className="matters-header">
                                <div className="matters-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="2" y="7" width="16" height="13" rx="2" />
                                        <path d="M22 8l-5 4 5 4V8z" />
                                    </svg>
                                </div>
                                <h3>FOR FILMMAKERS</h3>
                            </div>
                            <div className="matters-img" style={{ position: 'relative' }}>
                                <Image
                                    src="/spectrax/for filmmakers image.png"
                                    alt="For Filmmakers"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <ul className="matters-list">
                                <li><span className="check">✓</span> Superior visual fidelity</li>
                                <li><span className="check">✓</span> Colors and contrast as intended</li>
                                <li><span className="check">✓</span> Greater creative flexibility</li>
                                <li><span className="check">✓</span> Future-ready delivery pipeline</li>
                            </ul>
                        </div>
                        <div className="matters-card" id="matExhibitors">
                            <div className="matters-header">
                                <div className="matters-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18" />
                                        <path d="M9 21V9" />
                                    </svg>
                                </div>
                                <h3>FOR EXHIBITORS</h3>
                            </div>
                            <div className="matters-img" style={{ position: 'relative' }}>
                                <Image
                                    src="/spectrax/for exhibitors image.png"
                                    alt="For Exhibitors"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <ul className="matters-list">
                                <li><span className="check">✓</span> Lower operational complexity</li>
                                <li><span className="check">✓</span> Energy efficient infrastructure</li>
                                <li><span className="check">✓</span> Premium ticketing potential</li>
                                <li><span className="check">✓</span> Multi-purpose venue support</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ENGINEERED FOR EXCELLENCE */}
                <section className="engineered-section" id="engineered">
                    <div className="section-title-bar container">
                        <div className="title-line"></div>
                        <h2>ENGINEERED FOR EXCELLENCE</h2>
                        <div className="title-line"></div>
                    </div>
                    <div className="container eng-grid">
                        <div className="eng-card" id="engLed">
                            <div className="eng-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x={4} y={4} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={19} y={4} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={34} y={4} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={4} y={19} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={19} y={19} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={34} y={19} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={4} y={34} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={19} y={34} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={34} y={34} width={10} height={10} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                </svg>
                            </div>
                            <h4>ULTRA BRIGHT LED</h4>
                            <p>Next-gen LED emitters for breathtaking brightness and clarity.</p>
                        </div>
                        <div className="eng-card" id="engArch">
                            <div className="eng-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x={8} y={24} width={32} height={16} rx={2} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={14} y={16} width={20} height={12} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={20} y={8} width={8} height={12} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                </svg>
                            </div>
                            <h4>ACTIVE LED ARCHITECTURE</h4>
                            <p>Self-emissive technology. Pixel-level precision. Zero projection loss.</p>
                        </div>
                        <div className="eng-card" id="engNonDci">
                            <div className="eng-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x={6} y={10} width={36} height={28} rx={3} stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M6 18h36" stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M24 10v28" stroke="#C9A84C" strokeWidth={1.5} />
                                </svg>
                            </div>
                            <h4>NON-DCI COMPATIBLE</h4>
                            <p>Open architecture. Greater compatibility. Lower barriers.</p>
                        </div>
                        <div className="eng-card" id="engImmersive">
                            <div className="eng-icon">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx={24} cy={24} r={18} stroke="#C9A84C" strokeWidth={1.5} />
                                    <circle cx={24} cy={24} r={10} stroke="#C9A84C" strokeWidth={1.5} />
                                    <circle cx={24} cy={24} r={4} fill="#C9A84C" />
                                </svg>
                            </div>
                            <h4>IMMERSIVE CONTRAST SYSTEM</h4>
                            <p>Deeper blacks. Richer colors. Unmatched immersion.</p>
                        </div>
                    </div>
                </section>

                {/* FUTURE OF CINEMA CTA */}
                <section className="future-section" id="futureCta">
                    <div className="future-bg">
                        <Image
                            src="/spectrax/bottom image.png"
                            alt="Spectra X Cinema"
                            fill
                            style={{ objectFit: 'cover', filter: 'brightness(0.32) saturate(1.2)' }}
                        />
                        <div className="future-overlay"></div>
                    </div>
                    <div className="future-content container">
                        <h2 className="future-headline">THE FUTURE OF CINEMA<br />STARTS HERE.</h2>
                        <p className="future-desc">Connplex Cinemas Limited is leading India into a brighter, bigger, and more immersive future.</p>
                        <div className="future-ctas">
                            <a href="#" className="btn-future" id="ctaBook">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <rect x={3} y={4} width={18} height={18} rx={2} />
                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                                BOOK PRESENTATION
                            </a>
                            <a href="#" className="btn-future" id="ctaInvestor">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                                INVESTOR ENQUIRY
                            </a>
                            <a href="#" className="btn-future" id="ctaPartner">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx={9} cy={7} r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                PARTNER WITH CONNPLEX
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default SpectraXPage;
