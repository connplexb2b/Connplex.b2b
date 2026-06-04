"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

                {/* Content Section */}
                <section className="py-20 bg-black relative px-[5%] md:px-[10%]">
                    <div className="max-w-[900px] mx-auto w-full text-white/80 font-light text-[1rem] sm:text-[1.1rem] leading-[1.8] space-y-8">
                        <p>
                            This Legal Notice is issued by Connplex Cinemas Limited, formerly known as VCS Industries Limited, an entertainment and cinema exhibition company operating a chain of ultra-luxurious and smart cinemas across India.
                        </p>
                        <p>
                            The “Connplex Cinemas” name, logos, trademarks, brand assets, and all associated intellectual property are the exclusive property of Connplex Cinemas Limited and are protected under applicable trademark, copyright, and intellectual property laws.
                        </p>
                        <p>
                            Any unauthorized use, reproduction, modification, distribution, publication, transmission, display, or commercial exploitation of the Connplex Cinemas brand, logo, content, or intellectual property in any form or medium is strictly prohibited without prior written consent from Connplex Cinemas Limited. This includes usage across websites, digital platforms, social media, advertisements, promotional materials, printed materials, applications, or any other public or commercial medium.
                        </p>
                        <p>
                            Connplex Cinemas Limited reserves the right to initiate appropriate legal proceedings against any individual, organization, entity, or third party found infringing or misusing its intellectual property rights. Such actions may include claims for damages, injunctive relief, recovery of losses, and any other remedies available under applicable laws.
                        </p>
                        <p>
                            All materials, information, text, graphics, visuals, software, and content available on this website are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied. While Connplex Cinemas Limited makes reasonable efforts to ensure the accuracy, reliability, and timeliness of the information published on this website, no representations or warranties are made regarding the completeness, accuracy, adequacy, or reliability of such information.
                        </p>
                        <p>
                            Connplex Cinemas Limited disclaims all liability for any direct, indirect, incidental, consequential, technical, or financial damages arising from access to, use of, inability to use, or reliance upon this website or any linked external platforms. Connplex Cinemas Limited further does not warrant that the website, servers, or digital platforms are free from viruses, malware, interruptions, errors, or other harmful components.
                        </p>
                        <p>
                            No part of this website or its contents may be copied, reproduced, republished, uploaded, posted, transmitted, modified, distributed, or commercially exploited without prior written permission from Connplex Cinemas Limited.
                        </p>
                        <p>
                            This website may contain links to third-party websites, applications, or services for user convenience. Connplex Cinemas Limited does not control, endorse, or assume responsibility for the content, availability, policies, or practices of such third-party platforms.
                        </p>
                        <p>
                            Nothing contained on this website shall be construed as an invitation, solicitation, recommendation, or offer to invest in Connplex Cinemas Limited. Any decisions made based on the information available on this website shall be solely at the user’s discretion and risk.
                        </p>
                        <p>
                            By accessing or using this website, users agree that any disputes arising in relation to the website, its usage, or associated matters shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.
                        </p>

                        <div className="pt-10 border-t border-[#d5b263]/20 mt-12">
                            <p className="font-semibold text-white mb-2">
                                For inquiries regarding the use of Connplex Cinemas trademarks, brand assets, logos, content, or intellectual property, please contact:
                            </p>
                            <div className="text-[0.95rem] sm:text-[1rem] text-[#d5b263] font-medium leading-[1.6] mt-4 space-y-1">
                                <p className="text-white font-semibold">Legal Department</p>
                                <p className="text-white/80">Connplex Cinemas Limited</p>
                                <p className="pt-2">
                                    Email: <a href="mailto:legal@theconnplex.com" className="text-[#d5b263] underline transition-colors duration-300 hover:text-white">legal@theconnplex.com</a>
                                </p>
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
