'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const InvestorRelationsPage = () => {
    // Accordion active state tracking by ID or title
    const [activeDoc, setActiveDoc] = useState<string | null>(null);

    const toggleDoc = (docTitle: string) => {
        if (activeDoc === docTitle) {
            setActiveDoc(null);
        } else {
            setActiveDoc(docTitle);
        }
    };

    return (
        <div className="font-outfit bg-[#050505] text-white leading-relaxed overflow-x-hidden antialiased">
            <Header />

            {/* Hero Section */}
            <section className="relative py-32 bg-cover bg-[right_center] bg-no-repeat min-h-[80vh] flex items-center bg-[url('/investors/hero.png')]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/80 to-[#050505]/20 z-[1]"></div>
                <div className="max-w-[1200px] mx-auto px-8 w-full relative z-[2]">
                    <div className="max-w-[600px]">
                        <span className="text-[#d4af37] text-[0.85rem] tracking-[4px] font-medium mb-6 block uppercase">INVESTOR RELATIONS</span>
                        <h1 className="text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] font-normal mb-6 text-white">
                            Building India's<br />
                            Most <span className="text-[#d4af37] italic font-serif font-medium">Premium</span><br />
                            Cinema Network.
                        </h1>
                        <p className="text-base text-[#a0a0a0] mb-12 leading-relaxed max-w-[500px]">
                            Connplex Cinemas Limited is committed to delivering world-class cinematic experiences through innovation, operational excellence and a scalable franchise model.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#d4af37] text-black border border-[#d4af37] text-[0.9rem] font-medium transition-all duration-300 hover:bg-[#b5952f]">
                                Investor Presentation{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-transparent text-[#a0a0a0] border border-white/8 text-[0.9rem] font-medium transition-all duration-300 hover:border-[#d4af37] hover:text-[#d4af37]">
                                Annual Reports{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-transparent text-[#a0a0a0] border border-white/8 text-[0.9rem] font-medium transition-all duration-300 hover:border-[#d4af37] hover:text-[#d4af37]">
                                Financial Filings{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </a>
                            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded bg-transparent text-[#a0a0a0] border border-white/8 text-[0.9rem] font-medium transition-all duration-300 hover:border-[#d4af37] hover:text-[#d4af37]">
                                Contact Us{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div className="relative z-10 -mt-16">
                <div className="max-w-[1200px] mx-auto px-8 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-[#0a0a0a] border border-white/8 rounded-lg py-8 px-4 gap-y-6 lg:gap-y-0">
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">2011</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Founded</p>
                        </div>
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                    <circle cx="12" cy="10" r="3" />
                                    <line x1="6" y1="10" x2="6.01" y2="10" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">115+</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Screens</p>
                        </div>
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">50+</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Cities</p>
                        </div>
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">35%+</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Revenue Growth<br />YoY (FY24)</p>
                        </div>
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">41+</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Franchise Partners<br />Across India</p>
                        </div>
                        <div className="text-center px-4 border-b border-white/8 sm:border-b-0 sm:border-r last:border-0 border-r-0 lg:border-r lg:last:border-r-0 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                                    <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">Multiple</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Premium Formats</p>
                        </div>
                        <div className="text-center px-4 pb-4 sm:pb-0">
                            <div className="text-[#d4af37] mb-4 flex justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h3 className="text-lg md:text-xl lg:text-[1.2rem] text-[#d4af37] mb-2 font-medium">Strong</h3>
                            <p className="text-xs text-[#a0a0a0] leading-normal">Expansion<br />Pipeline</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Highlights Section */}
            <section className="py-20">
                <div className="max-w-[1200px] mx-auto px-8 w-full">
                    <div className="mb-12 text-center">
                        <span className="text-[#d4af37] text-[0.8rem] tracking-[3px] font-medium mb-4 block uppercase">INVESTMENT HIGHLIGHTS</span>
                        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-normal text-white">Strong Fundamentals. Scalable Future.</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-10 text-center transition-all duration-300 hover:border-[#d4af37] hover:-translate-y-1">
                            <div className="text-[#d4af37] mb-6 flex justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <circle cx="12" cy="10" r="3" />
                                    <line x1="6" y1="10" x2="6.01" y2="10" />
                                </svg>
                            </div>
                            <h4 className="text-base text-[#d4af37] mb-4 font-medium">Premium Cinema Network</h4>
                            <p className="text-[0.85rem] text-[#a0a0a0] leading-relaxed">Expanding high-quality cinema experiences across high-growth markets with modern formats.</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-10 text-center transition-all duration-300 hover:border-[#d4af37] hover:-translate-y-1">
                            <div className="text-[#d4af37] mb-6 flex justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h4 className="text-base text-[#d4af37] mb-4 font-medium">Asset-Light Franchise Model</h4>
                            <p className="text-[0.85rem] text-[#a0a0a0] leading-relaxed">Capital-efficient franchise approach enabling rapid scale with lower risk and higher returns.</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-10 text-center transition-all duration-300 hover:border-[#d4af37] hover:-translate-y-1">
                            <div className="text-[#d4af37] mb-6 flex justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                            </div>
                            <h4 className="text-base text-[#d4af37] mb-4 font-medium">Robust Financial Performance</h4>
                            <p className="text-[0.85rem] text-[#a0a0a0] leading-relaxed">Consistent growth in revenue, improving profitability and strong balance sheet.</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-10 text-center transition-all duration-300 hover:border-[#d4af37] hover:-translate-y-1">
                            <div className="text-[#d4af37] mb-6 flex justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h4 className="text-base text-[#d4af37] mb-4 font-medium">Long-Term Value Creation</h4>
                            <p className="text-[0.85rem] text-[#a0a0a0] leading-relaxed">Focused on sustainable growth, operational excellence and shareholder value.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Highlights Section */}
            <section className="py-20">
                <div className="max-w-[1200px] mx-auto px-8 w-full">
                    <div className="mb-12 text-center">
                        <span className="text-[#d4af37] text-[0.8rem] tracking-[3px] font-medium mb-4 block uppercase">FINANCIAL HIGHLIGHTS (CONSOLIDATED)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Revenue */}
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
                            <div className="mb-8">
                                <span className="block text-[0.85rem] text-[#a0a0a0] mb-2">Revenue (₹ Cr)</span>
                                <div className="text-2xl md:text-[1.8rem] font-medium flex items-center gap-2 text-white">
                                    229.60{' '}
                                    <span className="text-[0.75rem] text-[#4CAF50] inline-flex items-center gap-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        3.35 (1.75%)
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-[150px] gap-4">
                                <div className="flex flex-col justify-between text-[0.6rem] text-[#a0a0a0] w-[25px]">
                                    <span>300</span>
                                    <span>200</span>
                                    <span>100</span>
                                    <span>0</span>
                                </div>
                                <div className="grow flex justify-between items-end border-b border-white/8 pb-1 relative h-full">
                                    {/* Grid Lines */}
                                    <div className="absolute left-0 right-0 bottom-[25%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[50%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[75%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '55%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY21</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '65%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY22</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '75%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY23</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '80%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EBITDA */}
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
                            <div className="mb-8">
                                <span className="block text-[0.85rem] text-[#a0a0a0] mb-2">EBITDA (₹ Cr)</span>
                                <div className="text-2xl md:text-[1.8rem] font-medium flex items-center gap-2 text-white">
                                    28.64{' '}
                                    <span className="text-[0.75rem] text-[#4CAF50] inline-flex items-center gap-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        12.41%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-[150px] gap-4">
                                <div className="flex flex-col justify-between text-[0.6rem] text-[#a0a0a0] w-[25px]">
                                    <span>40</span>
                                    <span>30</span>
                                    <span>20</span>
                                    <span>10</span>
                                    <span>0</span>
                                </div>
                                <div className="grow flex justify-between items-end border-b border-white/8 pb-1 relative h-full">
                                    {/* Grid Lines */}
                                    <div className="absolute left-0 right-0 bottom-[25%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[50%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[75%] h-[1px] bg-white/[0.04] z-[1]"></div>

                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '40%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY21</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '50%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY22</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '65%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY23</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '80%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAT */}
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
                            <div className="mb-8">
                                <span className="block text-[0.85rem] text-[#a0a0a0] mb-2">PAT (₹ Cr)</span>
                                <div className="text-2xl md:text-[1.8rem] font-medium flex items-center gap-2 text-white">
                                    2.32{' '}
                                    <span className="text-[0.75rem] text-[#4CAF50] inline-flex items-center gap-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        26.52%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-[150px] gap-4">
                                <div className="flex flex-col justify-between text-[0.6rem] text-[#a0a0a0] w-[25px]">
                                    <span>3</span>
                                    <span>2</span>
                                    <span>1</span>
                                    <span>0</span>
                                </div>
                                <div className="grow flex justify-between items-end border-b border-white/8 pb-1 relative h-full">
                                    {/* Grid Lines */}
                                    <div className="absolute left-0 right-0 bottom-[25%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[50%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[75%] h-[1px] bg-white/[0.04] z-[1]"></div>

                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '20%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY21</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '40%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY22</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '60%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY23</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '85%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Occupancy */}
                        <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
                            <div className="mb-8">
                                <span className="block text-[0.85rem] text-[#a0a0a0] mb-2">Occupancy (%)</span>
                                <div className="text-2xl md:text-[1.8rem] font-medium flex items-center gap-2 text-white">
                                    28.64%{' '}
                                    <span className="text-[0.75rem] text-[#4CAF50] inline-flex items-center gap-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        4.82%
                                    </span>
                                </div>
                            </div>
                            <div className="flex h-[150px] gap-4">
                                <div className="flex flex-col justify-between text-[0.6rem] text-[#a0a0a0] w-[25px]">
                                    <span>40%</span>
                                    <span>30%</span>
                                    <span>20%</span>
                                    <span>10%</span>
                                    <span>0%</span>
                                </div>
                                <div className="grow flex justify-between items-end border-b border-white/8 pb-1 relative h-full">
                                    {/* Grid Lines */}
                                    <div className="absolute left-0 right-0 bottom-[25%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[50%] h-[1px] bg-white/[0.04] z-[1]"></div>
                                    <div className="absolute left-0 right-0 bottom-[75%] h-[1px] bg-white/[0.04] z-[1]"></div>

                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '75%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY21</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '75%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY22</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '70%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY23</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 h-full justify-end z-[2] w-[20%] relative">
                                        <div className="w-full bg-gradient-to-t from-[#8b7355] to-[#d4af37] rounded-t-sm transition-all duration-300 hover:opacity-80" style={{ height: '80%' }} />
                                        <span className="text-[0.6rem] text-[#a0a0a0] absolute bottom-[-20px] whitespace-nowrap">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[0.75rem] text-[#a0a0a0] opacity-70 mt-4">Financials as per Consolidated Financial Statements for FY24. Figures are rounded off.</p>
                </div>
            </section>

            {/* Documents Accordion Section */}
            <section className="py-20 bg-[#080808] border-y border-white/8">
                <div className="max-w-[1200px] mx-auto px-8 w-full">
                    <div className="mb-12 text-center">
                        <span className="text-[#d4af37] text-[0.8rem] tracking-[3px] font-medium mb-4 block uppercase">INVESTOR DOCUMENTS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
                        <div className="flex flex-col gap-4">
                            {/* Annual Reports */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Annual Reports' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Annual Reports')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Annual Reports
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Annual Reports' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Annual Reports' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">FY 2023-24</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">FY 2022-23</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">FY 2021-22</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Quarterly Results */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Quarterly Results' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Quarterly Results')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Quarterly Results
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Quarterly Results' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Quarterly Results' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Q4 FY24</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Q3 FY24</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Q2 FY24</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Q1 FY24</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Financial Statements */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Financial Statements' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Financial Statements')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Financial Statements
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Financial Statements' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Financial Statements' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">FY 2023-24</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">FY 2022-23</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Investor Presentations */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Investor Presentations' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Investor Presentations')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Investor Presentations
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Investor Presentations' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Investor Presentations' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Corporate Deck 2024</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Investor Deck FY24</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Corporate Governance */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Corporate Governance' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Corporate Governance')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Corporate Governance
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Corporate Governance' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Corporate Governance' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Board of Directors</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Committees</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Policies</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Shareholder Information */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Shareholder Information' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Shareholder Information')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Shareholder Information
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Shareholder Information' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Shareholder Information' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">AGM Details</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Shareholding Pattern</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* NSE Filings */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'NSE Filings' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('NSE Filings')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        NSE Filings &amp; Disclosures
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'NSE Filings' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'NSE Filings' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Stock Exchange Filings</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Material Events</a></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Notices & Announcements */}
                            <div className={`bg-[#0a0a0a] border rounded-[6px] transition-all duration-300 overflow-hidden ${activeDoc === 'Notices' ? 'border-[#d4af37]' : 'border-white/8'}`}>
                                <div className="flex justify-between items-center p-4 cursor-pointer select-none" onClick={() => toggleDoc('Notices')}>
                                    <div className="flex items-center gap-4 text-[0.95rem] text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Notices &amp; Announcements
                                    </div>
                                    <svg className={`transition-all duration-300 text-[#a0a0a0] ${activeDoc === 'Notices' ? 'rotate-180 text-[#d4af37]' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className={`transition-[max-height] duration-300 ease-out overflow-hidden ${activeDoc === 'Notices' ? 'max-h-[300px]' : 'max-h-0'}`}>
                                    <ul className="list-none pl-14 pr-4 pb-4 m-0">
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Board Meeting Notice</a></li>
                                        <li className="mb-2 last:mb-0"><a href="#" className="text-decoration-none text-[#a0a0a0] text-[0.85rem] transition-all duration-300 hover:text-[#d4af37]">Dividend Announcements</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20">
                <div className="max-w-[1200px] mx-auto px-8 w-full">
                    <div className="border border-[#d4af37] rounded-lg p-6 md:p-12 bg-gradient-to-b from-[#d4af37]/5 to-transparent">
                        <div className="mb-8 text-center">
                            <span className="text-[#d4af37] text-[0.8rem] tracking-[3px] font-medium mb-4 block uppercase">INVESTOR RELATIONS</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 text-[#d4af37]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="block text-[0.8rem] text-[#d4af37] mb-1 uppercase">Email</span>
                                    <a href="mailto:ir@connplex.com" className="text-[0.85rem] text-white text-decoration-none leading-[1.5]">ir@connplex.com</a>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 text-[#d4af37]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="block text-[0.8rem] text-[#d4af37] mb-1 uppercase">Phone</span>
                                    <span className="text-[0.85rem] text-white leading-[1.5]">+91 79 4711 7000</span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 text-[#d4af37]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="block text-[0.8rem] text-[#d4af37] mb-1 uppercase">Registered Office</span>
                                    <span className="text-[0.85rem] text-white leading-[1.5]">Connplex Cinemas Limited,<br />Krish Cubical, Block C: (1001 to 1008), 10th Floor, Opp. Avalon<br /> Hotel Road, SBR -Sindhu Bhavan Marg, Thaltej, Ahmedabad,Gujarat - 380059</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InvestorRelationsPage;