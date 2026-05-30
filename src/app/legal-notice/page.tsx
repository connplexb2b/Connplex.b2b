"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Shield, Lock, Gavel, Scale, AlertTriangle, Link as LinkIcon, User, Mail, Building2 } from 'lucide-react';

const legalNoticeItems = [
    {
        num: '01.',
        icon: <FileText size={28} />,
        title: 'GENERAL INFORMATION',
        text: 'This Legal Notice is issued by Connplex Cinemas Limited, formerly known as VCS Industries Limited, an entertainment and cinema exhibition company operating a chain of ultra-luxurious and smart cinemas across India.',
    },
    {
        num: '02.',
        icon: <Shield size={28} />,
        title: 'INTELLECTUAL PROPERTY RIGHTS',
        text: 'The “Connplex Cinemas” name, logos, trademarks, brand assets, and all associated intellectual property are the exclusive property of Connplex Cinemas Limited and are protected under applicable trademark, copyright, and intellectual property laws.',
    },
    {
        num: '03.',
        icon: <Lock size={28} />,
        title: 'UNAUTHORIZED USE & RESTRICTIONS',
        text: 'Any unauthorized use, reproduction, modification, distribution, publication, transmission, display, or commercial exploitation of the Connplex Cinemas brand, logo, content, or intellectual property in any form or medium is strictly prohibited without prior written consent from Connplex Cinemas Limited. This includes usage across websites, digital platforms, social media, advertisements, promotional materials, printed materials, applications, or any other public or commercial medium.',
    },
    {
        num: '04.',
        icon: <Gavel size={28} />,
        title: 'LEGAL ENFORCEMENT & REMEDIES',
        text: 'Connplex Cinemas Limited reserves the right to initiate appropriate legal proceedings against any individual, organization, entity, or third party found infringing or misusing its intellectual property rights. Such actions may include claims for damages, injunctive relief, recovery of losses, and any other remedies available under applicable laws.',
    },
    {
        num: '05.',
        icon: <Scale size={28} />,
        title: 'DISCLAIMER OF WARRANTIES',
        text: 'All materials, information, text, graphics, visuals, software, and content available on this website are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied. While Connplex Cinemas Limited makes reasonable efforts to ensure the accuracy, reliability, and timeliness of the information published on this website, no representations or warranties are made regarding the completeness, accuracy, adequacy, or reliability of such information.',
    },
    {
        num: '06.',
        icon: <AlertTriangle size={28} />,
        title: 'LIMITATION OF LIABILITY',
        text: 'Connplex Cinemas Limited disclaims all liability for any direct, indirect, incidental, consequential, technical, or financial damages arising from access to, use of, inability to use, or reliance upon this website or any linked external platforms. Connplex Cinemas Limited further does not warrant that the website, servers, or digital platforms are free from viruses, malware, interruptions, errors, or other harmful components.',
    },
    {
        num: '07.',
        icon: <FileText size={28} />,
        title: 'COPYRIGHT RESTRICTIONS',
        text: 'No part of this website or its contents may be copied, reproduced, republished, uploaded, posted, transmitted, modified, distributed, or commercially exploited without prior written permission from Connplex Cinemas Limited.',
    },
    {
        num: '08.',
        icon: <LinkIcon size={28} />,
        title: 'THIRD-PARTY LINKS',
        text: 'This website may contain links to third-party websites, applications, or services for user convenience. Connplex Cinemas Limited does not control, endorse, or assume responsibility for the content, availability, policies, or practices of such third-party platforms.',
    },
    {
        num: '09.',
        icon: <User size={28} />,
        title: 'NO INVESTMENT SOLICITATION',
        text: 'Nothing contained on this website shall be construed as an invitation, solicitation, recommendation, or offer to invest in Connplex Cinemas Limited. Any decisions made based on the information available on this website shall be solely at the user’s discretion and risk.',
    },
    {
        num: '10.',
        icon: <Gavel size={28} />,
        title: 'GOVERNING LAW & JURISDICTION',
        text: 'By accessing or using this website, users agree that any disputes arising in relation to the website, its usage, or associated matters shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.',
    },
];

const LegalNoticePage = () => {
    return (
        <div className="bg-[radial-gradient(circle_at_20%_20%,#1a1a1a_0%,#020202_100%)] text-white font-outfit leading-relaxed min-h-screen overflow-x-hidden antialiased">
            <style>{`
                @keyframes lnFadeIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
            
            <Header logoSrc="/img/Connplex Cinemas Gradient logo-02.png" />
            
            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] md:h-[90vh] min-h-[400px] md:min-h-[700px] flex items-center justify-start text-left px-[5%] md:px-[10%] overflow-hidden bg-black">
                    <div className="relative z-10 max-w-[700px] text-left self-center">
                        <div className="text-[0.8rem] text-white/50 mb-[30px] tracking-[2px] font-medium uppercase">
                            HOME / <span className="text-[#d5b263]">LEGAL NOTICE</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-[110px] font-extralight tracking-[6px] md:tracking-[10px] mb-5 leading-[0.9] uppercase text-left">
                            <span className="text-[#d5b263] font-medium">LEGAL</span> NOTICE
                        </h1>
                        <div 
                            className="text-lg text-white/70 font-light max-w-[650px] mt-3 text-left border-l-2 border-[#d5b263] pl-[15px] md:pl-[30px]"
                            style={{ animation: 'lnFadeIn 1s ease-out 0.5s both' }}
                        >
                            <p>Official legal notifications, terms of brand usage, intellectual property frameworks, and jurisdictional parameters governing Connplex Cinemas.</p>
                        </div>
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

                {/* Items Grid */}
                <section className="py-20 relative px-[5%] md:px-[10%]">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[120px] gap-y-[100px] gap-[60px]">
                            {legalNoticeItems.map((item) => (
                                <div className="flex flex-col min-[481px]:flex-row gap-[15px] min-[481px]:gap-[35px] transition-transform duration-400 ease hover:-translate-y-1.25 group z-10" key={item.num} id={`item-${item.num.replace('.', '')}`}>
                                    <div 
                                        className="min-w-[60px] h-[60px] min-[481px]:min-w-[80px] min-[481px]:h-[80px] rounded-full border border-[rgba(213,178,99,0.2)] flex items-center justify-center text-[#d5b263] shadow-[inset_0_0_15px_rgba(213,178,99,0.1)] transition-all duration-300 shrink-0 group-hover:border-[#d5b263] group-hover:shadow-[0_0_20px_rgba(213,178,99,0.4)] group-hover:scale-105"
                                        style={{ background: 'radial-gradient(circle, rgba(213,178,99,0.05) 0%, rgba(0,0,0,0) 100%)' }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[1.1rem] font-bold mb-5 text-white tracking-[1.5px] uppercase transition-colors duration-300 group-hover:text-[#d5b263]">
                                            <span className="text-[#d5b263] mr-2.5">{item.num}</span> {item.title}
                                        </h3>
                                        <p className="text-white/60 text-[0.9rem] leading-[1.8] font-light" style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <div className="mt-24 border border-[#d5b263]/30 p-8 md:p-16 flex md:flex-row flex-col gap-12 relative overflow-hidden bg-gradient-to-br from-[#d5b263]/5 to-transparent rounded-[4px] z-10">
                            <div className="w-20 h-20 border border-[#d5b263] rounded-full flex items-center justify-center shrink-0 text-3xl text-[#d5b263]">
                                <Mail size={32} />
                            </div>
                            <div className="grow">
                                <h3 className="text-[26px] font-semibold text-[#d5b263] tracking-[3px] mb-4 uppercase">INQUIRIES</h3>
                                <p className="text-base text-white/70 mb-10 font-light">For inquiries regarding the use of Connplex Cinemas trademarks, brand assets, logos, content, or intellectual property, please contact:</p>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Building2 size={18} className="text-[#d5b263] shrink-0" />
                                        <span>Legal Department</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Building2 size={18} className="text-[#d5b263] shrink-0" />
                                        <span>Connplex Cinemas <span className="text-[#d5b263]">Limited</span></span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[15px] text-white">
                                        <Mail size={18} className="text-[#d5b263] shrink-0" />
                                        <a href="mailto:legal@theconnplex.com" className="text-white hover:text-[#d5b263] transition-all">legal@theconnplex.com</a>
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
