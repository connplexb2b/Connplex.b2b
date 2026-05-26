"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, User, FileText, ArrowUpRight } from 'lucide-react';
import Footer from '@/components/Footer';

const TermsAndConditionsPage = () => {
    return (
        <div className="min-h-screen bg-black text-white font-outfit leading-relaxed">
            <nav className="fixed top-0 w-full z-[1000] bg-black/80 backdrop-blur-[10px] px-5 py-[20px] md:px-10">
                <div className="flex justify-between items-center max-w-[1200px] mx-auto">
                    <Link href="/">
                        <Image src="/logo.png" alt="Connplex Logo" width={150} height={45} style={{ objectFit: 'contain', height: 'auto' }} />
                    </Link>
                </div>
            </nav>

            <header className="relative h-screen w-full flex items-center bg-[url('/terms-hero.png')] bg-center bg-cover bg-no-repeat">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 pointer-events-none z-0"></div>
                
                <div className="relative z-10 max-w-[800px] pl-5 md:pl-20">
                    <div className="flex items-center gap-[15px] mb-5">
                        <div className="w-10 h-px bg-[#c5a059]"></div>
                        <span className="text-[#c5a059] uppercase tracking-[3px] text-sm font-semibold">Legal Framework</span>
                    </div>
                    <h1 className="text-[32px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-none uppercase mb-[30px] font-bold tracking-[-2px]">
                        Terms & <br />Conditions
                    </h1>
                    <p className="text-[#a0a0a0] text-sm sm:text-[18px] max-w-[450px]">
                        These terms govern your access, use of our platforms and services, and your experience with Connplex Cinemas.
                    </p>
                </div>
            </header>

            <section className="bg-black py-20 md:py-[120px]">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-[#0d0d0d] rounded-[20px] overflow-hidden border border-[#c5a059]/10">
                        <div className="px-5 py-10 lg:px-10 lg:py-[60px] text-center border-b border-[#c5a059]/10 lg:border-b-0 lg:border-r lg:border-[#c5a059]/10 last:border-b-0 last:border-r-0 transition-all duration-300 ease hover:bg-[#c5a059]/5 group">
                            <div className="w-20 h-20 border border-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-[30px] transition-all duration-300 group-hover:bg-[#c5a059]">
                                <Shield size={35} className="text-[#c5a059] transition-all duration-300 group-hover:text-black" />
                            </div>
                            <h3 className="text-[#c5a059] uppercase tracking-[2px] mb-5 text-[18px]">Our Commitment</h3>
                            <p className="text-[#a0a0a0] text-[15px]">We are committed to clarity, fairness, and transparency in all our interactions.</p>
                        </div>
                        <div className="px-5 py-10 lg:px-10 lg:py-[60px] text-center border-b border-[#c5a059]/10 lg:border-b-0 lg:border-r lg:border-[#c5a059]/10 last:border-b-0 last:border-r-0 transition-all duration-300 ease hover:bg-[#c5a059]/5 group">
                            <div className="w-20 h-20 border border-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-[30px] transition-all duration-300 group-hover:bg-[#c5a059]">
                                <User size={35} className="text-[#c5a059] transition-all duration-300 group-hover:text-black" />
                            </div>
                            <h3 className="text-[#c5a059] uppercase tracking-[2px] mb-5 text-[18px]">User Responsibility</h3>
                            <p className="text-[#a0a0a0] text-[15px]">Users agree to use our platforms responsibly and in compliance with applicable laws.</p>
                        </div>
                        <div className="px-5 py-10 lg:px-10 lg:py-[60px] text-center border-b border-[#c5a059]/10 lg:border-b-0 lg:border-r lg:border-[#c5a059]/10 last:border-b-0 last:border-r-0 transition-all duration-300 ease hover:bg-[#c5a059]/5 group">
                            <div className="w-20 h-20 border border-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-[30px] transition-all duration-300 group-hover:bg-[#c5a059]">
                                <FileText size={35} className="text-[#c5a059] transition-all duration-300 group-hover:text-black" />
                            </div>
                            <h3 className="text-[#c5a059] uppercase tracking-[2px] mb-5 text-[18px]">Agreements</h3>
                            <p className="text-[#a0a0a0] text-[15px]">These terms create a binding agreement between you and Connplex Cinemas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-5 py-10 md:px-10 md:py-20 bg-black">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="bg-[url('/terms-help-bg.png')] bg-center bg-cover bg-no-repeat rounded-[15px] sm:rounded-[30px] overflow-hidden relative min-h-[400px] sm:min-h-[600px] flex items-center border border-[#c5a059]/20">
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none z-0"></div>
                        
                        <div className="relative z-10 max-w-[500px] pl-5 md:pl-20">
                            <div className="flex items-center gap-[15px] mb-5">
                                <div className="w-10 h-px bg-[#c5a059]"></div>
                                <span className="text-[#c5a059] uppercase tracking-[3px] text-sm font-semibold">Need Clarification?</span>
                            </div>
                            <h2 className="text-[28px] sm:text-[40px] md:text-[56px] mb-[30px] leading-[1.1]">We&apos;re here to help.</h2>
                            <p className="text-[#a0a0a0] mb-10">For any questions or concerns regarding these Terms & Conditions, reach out to our team.</p>
                            <Link href="/contact" className="inline-flex items-center gap-[15px] px-[35px] py-[15px] border border-[#c5a059] text-white no-underline uppercase tracking-[2px] text-sm transition-all duration-300 hover:bg-[#c5a059] hover:text-black group">
                                Contact Us
                                <ArrowUpRight size={20} className="-rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsAndConditionsPage;
