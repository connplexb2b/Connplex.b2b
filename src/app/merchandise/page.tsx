'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MerchandisePage = () => {
    // Array of 10 items in the collection cut
    const collectionItems = [
        {
            id: 1,
            title: 'PREMIUM TUMBLER',
            description: 'Stainless steel with matte black finish and gold detailing.',
            image: '/merchandise/icon_1.png'
        },
        {
            id: 2,
            title: "FOUNDER'S SCRIPT",
            description: 'A story worth watching. Plan. Build. Inspire.',
            image: '/merchandise/icon_2.png'
        },
        {
            id: 3,
            title: 'ACRYLIC CLAPPERBOARD',
            description: 'Mark every milestone. Your story in motion.',
            image: '/merchandise/icon_3.png'
        },
        {
            id: 4,
            title: 'MINI DIRECTOR SPOTLIGHT',
            description: 'Lights that inspire. Perfect for any space.',
            image: '/merchandise/icon_4.png'
        },
        {
            id: 5,
            title: 'SCRIPT PLANNER',
            description: 'Every vision starts with a script.',
            image: '/merchandise/icon_5.png'
        },
        {
            id: 6,
            title: 'FOUNDER CARD (NFC)',
            description: 'Tap to unlock the experience.',
            image: '/merchandise/icon_6.png'
        },
        {
            id: 7,
            title: 'PREMIUM METAL PEN',
            description: 'Crafted for leaders. Built to last.',
            image: '/merchandise/icon_7.png'
        },
        {
            id: 8,
            title: 'FILM REEL CHOCOLATE BOX',
            description: 'Sweet success stories in every bite.',
            image: '/merchandise/icon_8.png'
        },
        {
            id: 9,
            title: 'ACRYLIC FILM STRIP NAMEPLATE',
            description: 'A title worth displaying.',
            image: '/merchandise/icon_9.png'
        },
        {
            id: 10,
            title: 'METAL TICKET BOX',
            description: 'For memories that last.',
            image: '/merchandise/icon_10.png'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-outfit leading-relaxed overflow-x-hidden antialiased">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative flex items-center min-h-[700px] md:min-h-[700px] bg-[#0b0a08] overflow-hidden py-20 md:py-[120px]">
                    {/* Desktop Background Image & Gradient */}
                    <div 
                        className="absolute inset-0 bg-no-repeat bg-right-top md:bg-right-center hidden md:block" 
                        style={{ 
                            backgroundImage: "linear-gradient(to right, #0b0a08 35%, rgba(11, 10, 8, 0.8) 45%, transparent 60%), url('/merchandise/top_image.png')",
                            backgroundSize: '100% 100%, auto 100%' 
                        }} 
                    />
                    {/* Mobile Background Image & Gradient */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden" 
                        style={{ 
                            backgroundImage: "linear-gradient(to bottom, rgba(11, 10, 8, 0.9) 0%, #0b0a08 100%), url('/merchandise/top_image.png')" 
                        }} 
                    />

                    <div className="max-w-[1200px] w-full mx-auto px-5 relative z-10 flex items-center md:flex-row flex-col">
                        <div className="flex-1 max-w-[500px] w-full">
                            <span className="text-[#c9a365] text-xs font-semibold tracking-[2px] uppercase block mb-5">PREMIUM MERCHANDISE</span>
                            <h1 className="text-[36px] md:text-[56px] leading-[1.1] font-bold mb-5 text-white">
                                CARRY THE<br />
                                <span className="text-[#c9a365]">EXPERIENCE</span>
                            </h1>
                            <p className="text-[#8a8a8a] text-[15px] mb-10">
                                Curated collectibles and premium merchandise<br />
                                inspired by the world of CONNPLEX.
                            </p>

                            <a href="#" className="inline-flex items-center px-6 py-3 border border-[#c9a365] text-[#c9a365] rounded bg-transparent text-sm font-medium transition-all duration-300 hover:bg-[#c9a365] hover:text-black mb-[60px] no-underline">
                                Explore Collection &nbsp;{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[30px]">
                                <div className="flex flex-col gap-2.5">
                                    <div className="w-6 h-6 mb-1.25">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <polyline points="9 12 11 14 15 10"></polyline>
                                        </svg>
                                    </div>
                                    <h4 className="text-xs text-white font-medium">Premium Quality</h4>
                                    <p className="text-[11px] text-[#8a8a8a] leading-[1.4]">Finest materials<br />and craftsmanship</p>
                                </div>
                                <div className="hidden sm:block w-px h-10 bg-[rgba(201,163,101,0.2)] opacity-50"></div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="w-6 h-6 mb-1.25">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <h4 className="text-xs text-white font-medium">Exclusive Designs</h4>
                                    <p className="text-[11px] text-[#8a8a8a] leading-[1.4]">Limited edition<br />and collector's items</p>
                                </div>
                                <div className="hidden sm:block w-px h-10 bg-[rgba(201,163,101,0.2)] opacity-50"></div>
                                <div className="flex flex-col gap-2.5">
                                    <div className="w-6 h-6 mb-1.25">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <h4 className="text-xs text-white font-medium">Worldwide Shipping</h4>
                                    <p className="text-[11px] text-[#8a8a8a] leading-[1.4]">Delivered to your<br />doorstep</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collection Section */}
                <section className="py-20 bg-black">
                    <div className="max-w-[1200px] mx-auto px-5">
                        <div className="mb-[50px] text-center">
                            <h2 className="flex items-center justify-center gap-5 text-base text-[#c9a365] tracking-[3px] font-medium uppercase">
                                <span className="hidden sm:block w-[150px] h-px bg-[rgba(201,163,101,0.2)]"></span>
                                THE FOUNDER'S CUT COLLECTION
                                <span className="hidden sm:block w-[150px] h-px bg-[rgba(201,163,101,0.2)]"></span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                            {collectionItems.map((item) => (
                                <div className="bg-black border border-[rgba(201,163,101,0.2)] rounded-md p-5 text-center transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-between hover:border-[#c9a365] hover:bg-[#080808] hover:-translate-y-1.25 hover:shadow-[0_10px_30px_rgba(201,163,101,0.08)]" key={item.id}>
                                    <div className="h-[160px] flex items-center justify-center mb-5 relative">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={140}
                                            height={140}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <div className="absolute inset-0 shadow-[inset_0_0_25px_20px_#000000] pointer-events-none"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-end">
                                        <h3 className="text-[11px] text-[#c9a365] mb-2.5 tracking-[1px] uppercase">{item.title}</h3>
                                        <p className="text-[11px] text-[#8a8a8a] leading-[1.4]" dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bonus Inclusions & Features Section */}
                <section className="pt-10 pb-20 bg-black">
                    <div className="max-w-[1200px] mx-auto px-5">
                        {/* Bonus Inclusions Box */}
                        <div className="flex flex-col md:flex-row items-stretch border border-[rgba(201,163,101,0.2)] rounded-lg bg-[#0b0a08]">
                            <div className="flex-[0_0_35%] flex items-center justify-center p-[30px] relative border-b border-[rgba(201,163,101,0.1)] md:border-b-0 md:border-r">
                                <Image
                                    src="/merchandise/bottom_image.png"
                                    alt="Golden Ticket"
                                    width={280}
                                    height={200}
                                    className="max-w-full h-auto relative z-10"
                                    style={{ objectFit: 'contain' }}
                                />
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_40px_#0b0a08] pointer-events-none"></div>
                            </div>
                            <div className="flex-1 p-5 min-[481px]:p-10 flex flex-col">
                                <div className="flex items-center justify-center gap-[15px] mb-10">
                                    <span className="w-[30px] h-px bg-[#c9a365]"></span>
                                    <h3 className="text-[13px] text-[#c9a365] tracking-[2px] uppercase">BONUS INCLUSIONS</h3>
                                    <span className="w-[30px] h-px bg-[#c9a365]"></span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
                                    <div className="flex gap-[15px]">
                                        <div className="shrink-0 mt-1.25">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">GOLDEN TICKET<br />INVITATION</h4>
                                            <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">Your entry to exclusive<br />premieres and events.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-[15px]">
                                        <div className="shrink-0 mt-1.25">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">WELCOME LETTER<br />FROM FOUNDER</h4>
                                            <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">A personal note<br />of gratitude.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-[15px]">
                                        <div className="shrink-0 mt-1.25">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">EXCLUSIVE FRANCHISE<br />BROCHURE</h4>
                                            <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">Discover the future<br />we're building together.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Box */}
                        <div className="border border-[rgba(201,163,101,0.2)] rounded-lg bg-[#0b0a08] p-5 min-[481px]:py-[30px] min-[481px]:px-10 mt-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
                                <div className="flex gap-[15px]">
                                    <div className="shrink-0 mt-1.25">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">EXCLUSIVE ACCESS</h4>
                                        <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">Owners get invited to<br />special events.</p>
                                    </div>
                                </div>
                                <div className="flex gap-[15px]">
                                    <div className="shrink-0 mt-1.25">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <circle cx="12" cy="11" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">LIMITED QUANTITY</h4>
                                        <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">Collector's items in<br />limited supply.</p>
                                    </div>
                                </div>
                                <div className="flex gap-[15px]">
                                    <div className="shrink-0 mt-1.25">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4 className="text-xs text-white mb-1.25 tracking-[1px] uppercase">PREMIUM PACKAGING</h4>
                                        <p className="text-[11px] text-[#8a8a8a] leading-[1.5]">Elegantly packaged for<br />a memorable unboxing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MerchandisePage;
