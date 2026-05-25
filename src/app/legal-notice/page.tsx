"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Shield, User, Link as LinkIcon, AlertTriangle, Gavel, Scale, Mail, Building2, Phone, MapPin } from 'lucide-react';

const LegalNoticePage = () => {
    return (
        <div className="bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#020202_100%)] text-white font-outfit leading-relaxed min-h-screen">
            <Header logoSrc="/img/Connplex Cinemas Gradient logo-02.png" />
            <main>
                <section className="relative h-[60vh] md:h-[90vh] min-h-[400px] md:min-h-[700px] flex items-center justify-start text-left px-6 md:px-12 lg:px-20 overflow-hidden bg-black">
                    <div className="relative z-10 max-w-[700px] text-left self-center">
                        <h1 className="text-5xl md:text-7xl lg:text-[110px] font-extralight tracking-[6px] md:tracking-[10px] mb-5 leading-[0.9] uppercase text-left">
                            <span className="text-[#d5b263] font-medium">LEGAL</span> NOTICE
                        </h1>
                        <p className="text-lg text-white/70 font-light max-w-[650px] mt-3 text-left">
                            Welcome to Connplex Private Limited. By accessing or using our website, you agree to comply with and be bound by the following terms.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-full md:w-[65%] h-full z-[1] opacity-40 md:opacity-100">
                        <Image
                            src="/legal-notice-hero-v2.png"
                            alt="Legal Gavel and Scales"
                            fill
                            style={{ 
                                objectFit: 'cover',
                                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)',
                                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)'
                            }}
                            priority
                        />
                    </div>
                </section>

                <section className="py-20 relative">
                    <div className="max-w-[1400px] mx-auto px-5 w-full">
                        {/* 01 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-01">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <FileText size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">01</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">GENERAL INFORMATION</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">This website is owned and operated by Connplex Private Limited ("Connplex", "we", "us", or "our"). The content on this website is provided for general information purposes only.</p>
                            </div>
                        </div>

                        {/* 02 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-02">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <Shield size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">02</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">INTELLECTUAL PROPERTY</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">All content, including text, graphics, logos, images, videos, and design, is the property of Connplex Private Limited and is protected by applicable copyright, trademark, and other intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
                            </div>
                        </div>

                        {/* 03 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-03">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <User size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">03</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">USE OF WEBSITE</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.</p>
                            </div>
                        </div>

                        {/* 04 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-04">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <LinkIcon size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">04</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">THIRD-PARTY LINKS</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">Our website may contain links to third-party websites for your convenience. Connplex is not responsible for the content, policies, or practices of any third-party websites.</p>
                            </div>
                        </div>

                        {/* 05 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-05">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">05</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">DISCLAIMER</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">The content on this website is provided "as is" without any warranties, express or implied. Connplex does not warrant that the website will be error-free, secure, or available at all times.</p>
                            </div>
                        </div>

                        {/* 06 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-06">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <Gavel size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">06</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">LIMITATION OF LIABILITY</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">Connplex Private Limited shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website.</p>
                            </div>
                        </div>

                        {/* 07 */}
                        <div className="flex md:flex-row flex-col items-start py-12 border-b border-white/5 transition-all duration-500 ease-out group" id="item-07">
                            <div className="flex items-center gap-6 mr-10 shrink-0 mb-4 md:mb-0">
                                <div className="w-[65px] h-[65px] border border-[#d5b263] rounded-full flex items-center justify-center text-[#d5b263] text-xl transition-all duration-500 group-hover:bg-[#d5b263] group-hover:text-[#020202]">
                                    <Scale size={24} />
                                </div>
                                <div className="text-2xl font-medium text-[#d5b263] tracking-wide">07</div>
                            </div>
                            <div className="grow">
                                <h3 className="text-xl md:text-2xl font-semibold tracking-wider mb-4 text-white uppercase">GOVERNING LAW</h3>
                                <p className="text-base text-white/60 font-light max-w-[850px] leading-relaxed">This Legal Notice shall be governed by and construed in accordance with the laws of India. Any disputes arising in relation to this website shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.</p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="mt-24 border border-[#d5b263]/30 p-8 md:p-16 flex md:flex-row flex-col gap-12 relative overflow-hidden bg-gradient-to-br from-[#d5b263]/5 to-transparent rounded-[4px]">
                            <div className="w-20 h-20 border border-[#d5b263] rounded-full flex items-center justify-center shrink-0 text-3xl text-[#d5b263]">
                                <Mail size={32} />
                            </div>
                            <div className="grow">
                                <h3 className="text-[26px] font-semibold text-[#d5b263] tracking-[3px] mb-4 uppercase">CONTACT US</h3>
                                <p className="text-base text-white/70 mb-10 font-light">If you have any questions or concerns about this Legal Notice, please contact us at:</p>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Building2 size={18} className="text-[#d5b263] shrink-0" />
                                        <span>Connplex Private <span className="text-[#d5b263]">Limited</span></span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Mail size={18} className="text-[#d5b263] shrink-0" />
                                        <a href="mailto:info@connplex.com" className="text-white hover:text-[#d5b263] transition-all">info@connplex.com</a>
                                    </div>
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Phone size={18} className="text-[#d5b263] shrink-0" />
                                        <a href="tel:+912249704158" className="text-white hover:text-[#d5b263] transition-all">+91 22 4970 4158</a>
                                    </div>
                                    <div className="flex items-center gap-4 text-[15px] text-white lg:col-span-3">
                                        <MapPin size={18} className="text-[#d5b263] shrink-0" />
                                        <span>Connplex House, Andheri (W), Mumbai — 400053, India</span>
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

export default LegalNoticePage;
