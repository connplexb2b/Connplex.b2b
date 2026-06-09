import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpectraXForm from '@/components/SpectraXForm';

export const metadata = {
    title: "Connplex | Spectra X – India's First Active LED Cinema Technology",
    description: "Spectra X by Connplex Cinemas – India's first patented Active LED Cinema Technology. Government of India granted patent. 20 years patent protection.",
};

const SpectraXPage = () => {
    return (
        <div className="font-outfit bg-black text-[#e0e0e0] antialiased overflow-x-hidden">
            {/* Header Overlay */}
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="relative min-h-[600px] lg:h-screen flex flex-col lg:flex-row items-stretch overflow-hidden bg-black" id="heroSection">
                    {/* Left gold ambient overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_5%_60%,rgba(180,120,20,0.12)_0%,transparent_55%)] pointer-events-none z-10"></div>
                    
                    {/* Left text content */}
                    <div className="relative z-30 w-full lg:w-[44%] shrink-0 flex flex-col justify-center px-[15px] sm:px-[28px] lg:px-[5%] pt-[120px] lg:pt-[120px] pb-[32px] lg:pb-[60px]">
                        <h1 className="text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[7rem] xl:text-[9rem] font-black leading-[0.88] tracking-[-0.02em] mb-7">
                            <span className="bg-gradient-to-r from-[#00d4ff] via-[#6a1bff] to-[#ee00cc] bg-clip-text text-transparent">SPECTRA</span>
                            <span className="bg-gradient-to-r from-[#ff7700] via-[#cc00ff] to-[#00d4ff] bg-clip-text text-transparent">X</span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-[1.15rem] font-extrabold leading-normal tracking-[0.06em] mb-3 text-white uppercase">
                            INDIA'S FIRST PATENTED<br />
                            <span className="text-[#C9A84C]">ACTIVE NON DCI</span> <span className="text-white">CINEMA SCREEN</span>
                        </p>
                        <p className="text-[0.68rem] tracking-[0.22em] text-[#444] font-normal mb-9 uppercase">PATENTED. POWERFUL. PROVEN.</p>
                        <div className="flex gap-3.5 flex-wrap">
                            <a href="#technology-form" className="inline-block px-6 py-3 border border-[#C9A84C] text-[#C9A84C] text-[0.72rem] font-bold tracking-[0.1em] rounded-[3px] hover:bg-[#C9A84C] hover:text-black transition-colors duration-200 uppercase" id="exploreTech">EXPLORE TECHNOLOGY →</a>
                        </div>
                    </div>
                    
                    {/* Right image — full bleed cinematic */}
                    <div className="relative w-full lg:flex-1 h-[56vw] sm:h-[45vw] lg:h-full min-h-[240px] overflow-hidden z-20">
                        <Image
                            src="/spectrax/TOP IMAGE.png"
                            alt="Spectra X Active LED Cinema Screen"
                            fill
                            priority
                            className="w-full h-full object-cover block"
                            sizes="(max-width: 1024px) 100vw, 56vw"
                        />
                        
                        {/* Gradients to blend image */}
                        {/* Left edge fade for large screens */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent w-[35%] z-20 pointer-events-none hidden lg:block"></div>
                        
                        {/* Top/bottom/mobile edge fade for small screens */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black lg:hidden z-20 pointer-events-none"></div>
                        
                        {/* General top/bottom fade */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40 z-10 pointer-events-none"></div>
                        
                        {/* Ambient glow overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_60%_50%,rgba(90,20,180,0.22)_0%,transparent_60%)] pointer-events-none z-30"></div>
                    </div>
                </section>

                {/* PATENT STATS STRIP */}
                <section className="bg-[#0a0a0a] border-y border-[#C9A84C]/15 py-0" id="patent">
                    <div className="max-w-[1320px] mx-auto px-[15px] sm:px-[32px] lg:px-[48px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        
                        {/* Card 1 */}
                        <div className="flex items-center gap-4 px-[30px] py-[28px] border-b border-[#C9A84C]/10 md:border-b-0 md:border-r border-[#C9A84C]/12" id="statGov">
                            <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="22" stroke="#C9A84C" strokeWidth={2} />
                                    <path d="M24 10l3.09 9.26H37l-8 5.81 3.09 9.26L24 29.52l-8.09 4.81L19 25.07 11 19.26h9.91z" fill="#C9A84C" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-[0.72rem] font-bold tracking-[0.08em] text-white leading-relaxed uppercase">GOVERNMENT<br />OF INDIA</p>
                                <p className="text-[0.62rem] font-bold tracking-[0.12em] mt-1.5 text-[#C9A84C] uppercase">GRANTED PATENT</p>
                            </div>
                        </div>
                        
                        {/* Card 2 */}
                        <div className="flex items-center gap-4 px-[30px] py-[28px] border-b border-[#C9A84C]/10 md:border-b-0 md:border-r-0 lg:border-r border-[#C9A84C]/12" id="stat20">
                            <div className="text-[2.8rem] font-black text-[#C9A84C] leading-none w-12 h-12 flex items-center justify-center">20</div>
                            <div className="flex-1">
                                <p className="text-[0.72rem] font-bold tracking-[0.08em] text-white leading-relaxed uppercase">20 YEARS<br />PATENT PROTECTION</p>
                                <p className="text-[0.62rem] font-bold tracking-[0.12em] mt-1.5 text-[#C9A84C] uppercase">STARTING MAY 2025</p>
                            </div>
                        </div>
                        
                        {/* Card 3 */}
                        <div className="flex items-center gap-4 px-[30px] py-[28px] border-b border-[#C9A84C]/10 md:border-t md:border-r lg:border-t-0 border-[#C9A84C]/12" id="statLed">
                            <div className="grid grid-cols-3 gap-1.25 w-auto h-auto shrink-0">
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                                <span className="w-2 h-2 rounded-full bg-[#C9A84C] opacity-80"></span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[0.72rem] font-bold tracking-[0.08em] text-white leading-relaxed uppercase">ACTIVE LED +<br />NON-DCI INTEGRATION</p>
                                <p className="text-[0.62rem] font-bold tracking-[0.12em] mt-1.5 text-[#C9A84C] uppercase">INDIA'S FIRST</p>
                            </div>
                        </div>
                        
                        {/* Card 4 */}
                        <div className="flex flex-col items-start gap-1 px-[30px] py-[28px] border-b-0 md:border-t md:border-r-0 lg:border-t-0 border-[#C9A84C]/12" id="statPatentNo">
                            <p className="text-[0.58rem] tracking-[0.14em] text-[#555] uppercase">PATENT NO.</p>
                            <p className="text-[0.92rem] font-extrabold text-white tracking-[0.04em]">202521021257</p>
                            <p className="text-[0.58rem] tracking-[0.14em] text-[#555] uppercase mt-1">DATE OF GRANT</p>
                            <p className="text-[0.72rem] font-bold tracking-[0.1em] text-[#C9A84C] uppercase">MAY 2025</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <svg className="w-5 h-2.5" viewBox="0 0 40 20" fill="none">
                                    <circle cx="10" cy="10" r="8" stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M10 5l1.5 4.5H16l-3.5 2.5 1.5 4.5L10 14l-4 2.5 1.5-4.5L4 9.5h4.5z" fill="#C9A84C" />
                                </svg>
                                <span className="text-[0.52rem] tracking-[0.08em] text-[#666] uppercase">GOVERNMENT OF INDIA</span>
                            </div>
                        </div>
                        
                    </div>
                </section>

                {/* FEATURES GRID */}
                <section className="bg-black py-0" id="technology">
                    <div className="max-w-[1320px] mx-auto px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden">
                        
                        {/* Card 1 */}
                        <div className="relative overflow-hidden aspect-[4/5] border-b sm:border-b-0 sm:border-r border-white/6 bg-[#050505] group" id="featBright">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/spectrax/ultra high brightness image.png"
                                    alt="Ultra High Brightness"
                                    fill
                                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/[0.02] via-black/[0.55] to-black/[0.96] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-5.5">
                                <div className="w-6 h-6 mb-2.5">
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
                                <h3 className="text-[0.82rem] font-extrabold tracking-[0.1em] text-white mb-2 leading-tight uppercase">ULTRA HIGH<br />BRIGHTNESS</h3>
                                <p className="text-[0.7rem] text-[#aaa] leading-relaxed">Brilliant visuals that stay consistent across every seat.</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="relative overflow-hidden aspect-[4/5] border-b sm:border-b-0 sm:border-r border-white/6 bg-[#050505] group" id="featBlacks">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/spectrax/deeper blacks image.png"
                                    alt="Deeper Blacks"
                                    fill
                                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/[0.02] via-black/[0.55] to-black/[0.96] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-5.5">
                                <div className="w-6 h-6 mb-2.5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 2a10 10 0 0 1 0 20" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.82rem] font-extrabold tracking-[0.1em] text-white mb-2 leading-tight uppercase">DEEPER<br />BLACKS</h3>
                                <p className="text-[0.7rem] text-[#aaa] leading-relaxed">True blacks. Unmatched depth. Stunning realism.</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="relative overflow-hidden aspect-[4/5] border-b sm:border-b-0 sm:border-r border-white/6 bg-[#050505] group" id="featNonDci">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/spectrax/non - dci flexibility image.png"
                                    alt="Non-DCI Flexibility"
                                    fill
                                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/[0.02] via-black/[0.55] to-black/[0.96] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-5.5">
                                <div className="w-6 h-6 mb-2.5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 3H8" />
                                        <path d="M12 3v4" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.82rem] font-extrabold tracking-[0.1em] text-white mb-2 leading-tight uppercase">NON-DCI<br />FLEXIBILITY</h3>
                                <p className="text-[0.7rem] text-[#aaa] leading-relaxed">Faster content deployment. Greater creative freedom.</p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="relative overflow-hidden aspect-[4/5] border-b-0 border-white/6 bg-[#050505] group" id="featLive">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/spectrax/live events & gaming ready.png"
                                    alt="Live Events & Gaming Ready"
                                    fill
                                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/[0.02] via-black/[0.55] to-black/[0.96] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-5.5">
                                <div className="w-6 h-6 mb-2.5">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <circle cx="12" cy="12" r="2" />
                                        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                                        <path d="M7.76 7.76a6 6 0 0 0 0 8.49" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.82rem] font-extrabold tracking-[0.1em] text-white mb-2 leading-tight uppercase">LIVE EVENTS &<br />GAMING READY</h3>
                                <p className="text-[0.7rem] text-[#aaa] leading-relaxed">Beyond movies. Built for the future of entertainment.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* NOT PROJECTION SECTION */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[52%_48%] min-h-[580px] lg:min-h-0 bg-black border-t border-[#C9A84C]/8" id="notProjection">
                    <div className="relative overflow-hidden w-full h-[55vw] md:h-auto">
                        <Image
                            src="/spectrax/not projection image.png"
                            alt="Spectra X Cinema Hall"
                            fill
                            sizes="(max-width: 768px) 100vw, 52vw"
                            className="object-cover"
                        />
                        <div className="absolute top-0 right-0 bottom-0 w-[30%] bg-gradient-to-l from-black to-transparent pointer-events-none hidden md:block"></div>
                    </div>
                    <div className="bg-black flex flex-col justify-center px-[15px] sm:px-[32px] md:px-[56px] py-[30px] sm:py-[44px] md:py-[64px] relative overflow-hidden">
                        <h2 className="text-[3.2rem] sm:text-[4.5rem] lg:text-[6rem] font-black leading-none tracking-[-0.03em] text-white mb-5 uppercase">
                            NOT<br />PROJECTION.<br />PURE LIGHT.
                        </h2>
                        <p className="text-[0.88rem] text-[#666] leading-relaxed max-w-[280px]">The next generation of cinematic storytelling.</p>
                    </div>
                </section>

                {/* WHY IT MATTERS */}
                <section className="max-w-[1320px] mx-auto px-[15px] sm:px-[28px] md:px-[48px] py-[45px] sm:py-[60px] md:py-[88px] bg-black" id="whyMatters">
                    <div className="flex items-center gap-5 mb-[52px]">
                        <div className="flex-1 h-[1px] bg-[#C9A84C]/20"></div>
                        <h2 className="text-[0.75rem] font-bold tracking-[0.3em] text-[#C9A84C] whitespace-nowrap uppercase">WHY IT MATTERS</h2>
                        <div className="flex-1 h-[1px] bg-[#C9A84C]/20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* card 1 */}
                        <div className="bg-[#080808] border border-[#C9A84C]/22 rounded-md overflow-hidden hover:border-[#C9A84C]/45 transition-colors duration-300 group" id="matFilmmakers">
                            <div className="flex items-center gap-3 px-5.5 pt-5 pb-3.5">
                                <div className="w-7 h-7 shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="2" y="7" width="16" height="13" rx="2" />
                                        <path d="M22 8l-5 4 5 4V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.78rem] font-extrabold tracking-[0.14em] text-white uppercase">FOR FILMMAKERS</h3>
                            </div>
                            <div className="relative w-full aspect-video overflow-hidden">
                                <Image
                                    src="/spectrax/for filmmakers image.png"
                                    alt="For Filmmakers"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover block transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <ul className="list-none px-5.5 py-6 flex flex-col gap-2.5 border-t border-[#C9A84C]/8">
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Superior visual fidelity</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Colors and contrast as intended</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Greater creative flexibility</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Future-ready delivery pipeline</li>
                            </ul>
                        </div>
                        
                        {/* card 2 */}
                        <div className="bg-[#080808] border border-[#C9A84C]/22 rounded-md overflow-hidden hover:border-[#C9A84C]/45 transition-colors duration-300 group" id="matExhibitors">
                            <div className="flex items-center gap-3 px-5.5 pt-5 pb-3.5">
                                <div className="w-7 h-7 shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5}>
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 9h18" />
                                        <path d="M9 21V9" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.78rem] font-extrabold tracking-[0.14em] text-white uppercase">FOR EXHIBITORS</h3>
                            </div>
                            <div className="relative w-full aspect-video overflow-hidden">
                                <Image
                                    src="/spectrax/for exhibitors image.png"
                                    alt="For Exhibitors"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover block transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <ul className="list-none px-5.5 py-6 flex flex-col gap-2.5 border-t border-[#C9A84C]/8">
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Lower operational complexity</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Energy efficient infrastructure</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Premium ticketing potential</li>
                                <li className="flex items-center gap-3 text-[0.77rem] text-[#ccc] tracking-wide"><span className="text-[#C9A84C] text-[0.85rem] shrink-0 font-bold">✓</span> Multi-purpose venue support</li>
                            </ul>
                        </div>
                        
                    </div>
                </section>

                {/* ENGINEERED FOR EXCELLENCE */}
                <section className="py-20 bg-black border-t border-[#C9A84C]/10" id="engineered">
                    <div className="flex items-center gap-5 mb-[52px] max-w-[1320px] mx-auto px-[15px] sm:px-[32px] lg:px-[48px]">
                        <div className="flex-1 h-[1px] bg-[#C9A84C]/20"></div>
                        <h2 className="text-[0.75rem] font-bold tracking-[0.3em] text-[#C9A84C] whitespace-nowrap uppercase">ENGINEERED FOR EXCELLENCE</h2>
                        <div className="flex-1 h-[1px] bg-[#C9A84C]/20"></div>
                    </div>
                    <div className="max-w-[1320px] mx-auto px-[15px] sm:px-[32px] lg:px-[48px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] mt-0 bg-[#C9A84C]/8">
                        
                        {/* eng card 1 */}
                        <div className="bg-black px-7 py-10 text-center hover:bg-[#080808] transition-colors duration-300" id="engLed">
                            <div className="w-[52px] h-[52px] mx-auto mb-5.5">
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
                            <h4 className="text-[0.73rem] font-extrabold tracking-[0.12em] text-white mb-3 leading-tight uppercase">ULTRA BRIGHT LED</h4>
                            <p className="text-[0.7rem] text-[#666] leading-relaxed">Next-gen LED emitters for breathtaking brightness and clarity.</p>
                        </div>
                        
                        {/* eng card 2 */}
                        <div className="bg-black px-7 py-10 text-center hover:bg-[#080808] transition-colors duration-300" id="engArch">
                            <div className="w-[52px] h-[52px] mx-auto mb-5.5">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x={8} y={24} width={32} height={16} rx={2} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={14} y={16} width={20} height={12} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                    <rect x={20} y={8} width={8} height={12} rx={1} stroke="#C9A84C" strokeWidth={1.5} />
                                </svg>
                            </div>
                            <h4 className="text-[0.73rem] font-extrabold tracking-[0.12em] text-white mb-3 leading-tight uppercase">ACTIVE LED ARCHITECTURE</h4>
                            <p className="text-[0.7rem] text-[#666] leading-relaxed">Self-emissive technology. Pixel-level precision. Zero projection loss.</p>
                        </div>
                        
                        {/* eng card 3 */}
                        <div className="bg-black px-7 py-10 text-center hover:bg-[#080808] transition-colors duration-300" id="engNonDci">
                            <div className="w-[52px] h-[52px] mx-auto mb-5.5">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <rect x={6} y={10} width={36} height={28} rx={3} stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M6 18h36" stroke="#C9A84C" strokeWidth={1.5} />
                                    <path d="M24 10v28" stroke="#C9A84C" strokeWidth={1.5} />
                                </svg>
                            </div>
                            <h4 className="text-[0.73rem] font-extrabold tracking-[0.12em] text-white mb-3 leading-tight uppercase">NON-DCI COMPATIBLE</h4>
                            <p className="text-[0.7rem] text-[#666] leading-relaxed">Open architecture. Greater compatibility. Lower barriers.</p>
                        </div>
                        
                        {/* eng card 4 */}
                        <div className="bg-black px-7 py-10 text-center hover:bg-[#080808] transition-colors duration-300" id="engImmersive">
                            <div className="w-[52px] h-[52px] mx-auto mb-5.5">
                                <svg viewBox="0 0 48 48" fill="none">
                                    <circle cx={24} cy={24} r={18} stroke="#C9A84C" strokeWidth={1.5} />
                                    <circle cx={24} cy={24} r={10} stroke="#C9A84C" strokeWidth={1.5} />
                                    <circle cx={24} cy={24} r={4} fill="#C9A84C" />
                                </svg>
                            </div>
                            <h4 className="text-[0.73rem] font-extrabold tracking-[0.12em] text-white mb-3 leading-tight uppercase">IMMERSIVE CONTRAST SYSTEM</h4>
                            <p className="text-[0.7rem] text-[#666] leading-relaxed">Deeper blacks. Richer colors. Unmatched immersion.</p>
                        </div>
                        
                    </div>
                </section>

                {/* FUTURE OF CINEMA CTA */}
                <section className="relative min-h-[480px] flex items-center justify-center text-center overflow-hidden" id="futureCta">
                    <div className="absolute inset-0">
                        <Image
                            src="/spectrax/bottom image.png"
                            alt="Spectra X Cinema"
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'cover', filter: 'brightness(0.32) saturate(1.2)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60"></div>
                    </div>
                    <div className="relative z-10 py-20 px-[15px] sm:px-[32px] md:px-0 max-w-[1320px] mx-auto w-full">
                        <h2 className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.8rem] font-black leading-[1.05] text-[#C9A84C] tracking-[-0.01em] mb-4 uppercase">
                            THE FUTURE OF CINEMA<br />STARTS HERE.
                        </h2>
                        <p className="text-[0.85rem] text-white/55 leading-[1.75] max-w-[440px] mx-auto mb-11">
                            Connplex Cinemas Limited is leading India into a brighter, bigger, and more immersive future.
                        </p>
                        <div className="flex gap-3 justify-center flex-col sm:flex-row sm:flex-wrap items-center">
                            <a href="#" className="inline-flex items-center gap-2 px-5.5 py-[13px] border border-white/18 bg-black/55 text-[#ddd] text-[0.7rem] font-bold tracking-[0.1em] rounded-[3px] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-all duration-200 backdrop-blur-md uppercase w-full sm:w-auto justify-center" id="ctaBook">
                                <svg className="w-3.75 h-3.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <rect x={3} y={4} width={18} height={18} rx={2} />
                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                                BOOK PRESENTATION
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 px-5.5 py-[13px] border border-white/18 bg-black/55 text-[#ddd] text-[0.7rem] font-bold tracking-[0.1em] rounded-[3px] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-all duration-200 backdrop-blur-md uppercase w-full sm:w-auto justify-center" id="ctaInvestor">
                                <svg className="w-3.75 h-3.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                                INVESTOR ENQUIRY
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 px-5.5 py-[13px] border border-white/18 bg-black/55 text-[#ddd] text-[0.7rem] font-bold tracking-[0.1em] rounded-[3px] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-all duration-200 backdrop-blur-md uppercase w-full sm:w-auto justify-center" id="ctaPartner">
                                <svg className="w-3.75 h-3.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
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

                <div id="technology-form">
                    <SpectraXForm />
                </div>
            </main>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default SpectraXPage;
