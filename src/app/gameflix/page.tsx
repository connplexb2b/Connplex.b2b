import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Gameflix | Connplex Cinemas',
    description: 'Experience the future of gaming with Gameflix by Connplex. Stream, compete, and connect on the next-gen gaming platform.',
};

const GameflixPage = () => {
    return (
        <div className="bg-black text-white font-outfit min-h-screen overflow-x-hidden selection:bg-[#c5a059]/30">
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="pt-36 pb-24 relative overflow-hidden">
                    <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] items-center gap-8">
                        {/* Left: Text Content */}
                        <div className="relative z-10 text-center md:text-left">
                            <span className="text-[#c5a059] text-[1.1rem] tracking-[6px] font-normal mb-6 block uppercase">GAMEFLIX</span>
                            <h1 className="text-[2.8rem] sm:text-[3.5rem] md:text-5xl lg:text-[7.5rem] font-extrabold leading-[0.95] mb-8 uppercase text-white">
                                COMING <br />
                                <span className="text-[#c5a059]">SOON</span>
                            </h1>
                            <hr className="w-[60px] h-0.5 bg-[#c5a059] border-none mb-6 mx-auto md:mx-0" />
                            <p className="text-[1.1rem] tracking-[8px] font-normal mb-6 text-white uppercase">PLAY BEYOND LIMITS.</p>
                            <p className="text-base text-[#a0a0a0] max-w-[420px] mb-12 leading-relaxed mx-auto md:mx-0">
                                Gameflix is the next-gen gaming platform by Connplex. Stream. Compete. Connect. The future of gaming starts here.
                            </p>
                            <a href="#" className="group inline-flex items-center justify-center gap-6 px-9 py-3 border border-[#c5a059] rounded-[4px] bg-transparent text-[#c5a059] font-medium text-[1.1rem] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:bg-[#c5a059]/10 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] mx-auto md:mx-0" id="notifyBtn">
                                <span>Notify Me</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:translate-x-1.5">
                                    <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>

                        {/* Right: Hero Image */}
                        <div className="relative flex w-full md:w-[135%] md:-ml-[25%] md:-mr-[10%] md:-my-[5%] z-1 mt-8 md:mt-0">
                            <Image
                                src="/gameflix/hero.png"
                                alt="Gameflix Gaming Setup"
                                className="w-full h-auto block [mask-image:radial-gradient(ellipse_closest-side,black_40%,transparent_100%)]"
                                width={900}
                                height={700}
                                priority
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="py-16 border-t border-white/5" id="features">
                    <div className="max-w-[1200px] mx-auto px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 bg-white/[0.02] p-8 sm:p-12 border border-white/5 rounded-[20px]">
                            {/* Cloud Gaming */}
                            <div className="text-center p-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2.5" id="featCloud">
                                <div className="text-[#c5a059] mb-6 flex justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 12L3 12C2.44772 12 2 11.5523 2 11V7C2 6.44772 2.44772 6 3 6H6M18 12L21 12C21.5523 12 22 11.5523 22 11V7C22 6.44772 21.5523 6 21 6H18M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6M9 18V20C9 20.5523 9.44772 21 10 21H14C14.5523 21 15 20.5523 15 20V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="10" cy="11" r="1" fill="currentColor" />
                                        <circle cx="14" cy="11" r="1" fill="currentColor" />
                                        <path d="M10 14.5C10 14.5 11 15.5 12 15.5C13 15.5 14 14.5 14 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.9rem] tracking-wider mb-3 text-[#c5a059] uppercase">CLOUD GAMING</h3>
                                <p className="text-[0.8rem] text-[#a0a0a0] leading-snug">High-performance gaming, anytime, anywhere.</p>
                            </div>

                            {/* Play Together */}
                            <div className="text-center p-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2.5" id="featPlay">
                                <div className="text-[#c5a059] mb-6 flex justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2522 22.1614 16.5523C21.6184 15.8524 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.9rem] tracking-wider mb-3 text-[#c5a059] uppercase">PLAY TOGETHER</h3>
                                <p className="text-[0.8rem] text-[#a0a0a0] leading-snug">Connect, compete, and build your squad.</p>
                            </div>

                            {/* Ultra Immersive */}
                            <div className="text-center p-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2.5" id="featImmersive">
                                <div className="text-[#c5a059] mb-6 flex justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M7 20H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M9 17L10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M15 17L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M8 9H10V11H8V9Z" fill="currentColor" />
                                        <path d="M11 9H13V13H11V9Z" fill="currentColor" />
                                        <path d="M14 9H16V13H14V9Z" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.9rem] tracking-wider mb-3 text-[#c5a059] uppercase">ULTRA IMMERSIVE</h3>
                                <p className="text-[0.8rem] text-[#a0a0a0] leading-snug">4K gaming with next-gen visuals and sound.</p>
                            </div>

                            {/* Compete & Win */}
                            <div className="text-center p-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2.5" id="featCompete">
                                <div className="text-[#c5a059] mb-6 flex justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9H18M6 9V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V9M6 9C6 11.2091 7.79086 13 10 13H14C16.2091 13 18 11.2091 18 9M12 13V17M12 17H8M12 17H16M8 21H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.9rem] tracking-wider mb-3 text-[#c5a059] uppercase">COMPETE &amp; WIN</h3>
                                <p className="text-[0.8rem] text-[#a0a0a0] leading-snug">Tournaments, rewards, and global leaderboards.</p>
                            </div>

                            {/* Built For All */}
                            <div className="text-center p-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2.5" id="featAll">
                                <div className="text-[#c5a059] mb-6 flex justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5 19C18.4281 19 19.3406 18.7773 20.1659 18.3496C20.9911 17.9219 21.7042 17.2991 22.25 16.53C22.7958 15.7609 23.1593 14.866 23.313 13.9142C23.4667 12.9624 23.4063 11.9806 23.136 11.0438C22.8658 10.1069 22.3929 9.23964 21.7533 8.50854C21.1137 7.77744 20.3248 7.20235 19.4468 6.82737C18.5688 6.4524 17.6253 6.28741 16.6888 6.34493C15.7524 6.40245 14.8488 6.6809 14.047 7.1591C13.2452 7.6373 12.5614 8.30328 12.0468 9.1085C11.5322 9.91372 11.199 10.8354 11.0734 11.8021C10.9478 12.7687 11.033 13.7535 11.3214 14.6811C11.6099 15.6088 12.0941 16.4539 12.7317 17.1506C13.3693 17.8473 14.143 18.3768 14.993 18.7001C15.843 19.0234 16.7461 19.1314 17.6334 19.016" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11.8021C11.75 10.0021 11 8.5021 9.5 7.5021C8 6.5021 6.5 6.0021 4.5 6.5021C2.5 7.0021 1.5 8.5021 1.07341 10.5021C0.64682 12.5021 1 14.5021 2.5 16.0021C4 17.5021 6 18.5021 8.5 18.5021C11 18.5021 12.7317 17.1506 12.7317 17.1506" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-[0.9rem] tracking-wider mb-3 text-[#c5a059] uppercase">BUILT FOR ALL</h3>
                                <p className="text-[0.8rem] text-[#a0a0a0] leading-snug">From casual players to pro gamers.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GameflixPage;
