"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
    FileText, User, Ticket, RefreshCw, UserCheck, 
    Award, Link as LinkIcon, Tag, AlertTriangle, 
    Film, Lock, Sliders, Gavel, ArrowUpRight 
} from 'lucide-react';

const termsItems = [
    {
        num: '01.',
        icon: <FileText size={28} />,
        title: 'ACCEPTANCE OF TERMS',
        text: 'By accessing or using Connplex platforms, users acknowledge that they have read, understood, and agreed to these Terms & Conditions, along with our Privacy Policy and any additional guidelines or policies published by Connplex from time to time.',
    },
    {
        num: '02.',
        icon: <User size={28} />,
        title: 'ELIGIBILITY',
        text: 'Users must be legally capable of entering into binding agreements under applicable laws to use Connplex services. Users below the age of 18 are advised to use the platform under parental or guardian supervision.',
    },
    {
        num: '03.',
        icon: <Ticket size={28} />,
        title: 'TICKET BOOKING & TRANSACTIONS',
        text: 'All movie tickets booked through Connplex platforms are subject to seat availability and confirmation of payment. Once a booking is confirmed, users will receive a booking confirmation through SMS, email, or the platform interface and its sole discretion.\n\nConnplex reserves the right to refuse, cancel, or restrict bookings in cases including but not limited to suspected fraudulent transactions, technical errors, incorrect pricing, misuse of offers, or violation of these Terms & Conditions.\n\nTicket prices, convenience fees, taxes, and promotional offers are subject to change without prior notice and its sole discretion.',
    },
    {
        num: '04.',
        icon: <RefreshCw size={28} />,
        title: 'CANCELLATION & REFUND POLICY',
        text: 'Cancellation, refund, or rescheduling of tickets shall be governed by applicable cinema policies, partner policies, and booking platform rules. Convenience fees and internet handling charges may be non-refundable unless otherwise stated.\n\nRefund timelines may vary depending on payment providers, banking partners, and applicable processing timelines.',
    },
    {
        num: '05.',
        icon: <UserCheck size={28} />,
        title: 'USER CONDUCT',
        text: 'Users agree to use Connplex platforms only for lawful purposes and in a manner that does not disrupt, damage, interfere with, or compromise the functionality, security, integrity, or accessibility of the services.\n\nUsers shall not engage in any activity that violates applicable laws, infringes the rights of Connplex or third parties, or adversely affects other users’ access to the platform.\n\nWithout limitation, users are prohibited from attempting unauthorized access to systems or accounts, introducing malicious code or software, manipulating bookings or transactions, abusing promotional offers or discounts, scraping or extracting platform data, creating fake accounts, or engaging in fraudulent, deceptive, or abusive activities of any kind.',
    },
    {
        num: '06.',
        icon: <Award size={28} />,
        title: 'INTELLECTUAL PROPERTY',
        text: 'All content available on Connplex platforms including logos, branding, designs, graphics, text, videos, software, and trademarks are the exclusive property of Connplex Cinemas Limited or respective licensors and are protected under applicable intellectual property laws.\n\nNo content may be copied, reproduced, published, uploaded, transmitted, distributed, modified, displayed, sold, licensed, or otherwise commercially exploited in any form or by any means without prior written permission from Connplex. Unauthorized use of Connplex intellectual property may result in legal action under applicable laws.',
    },
    {
        num: '07.',
        icon: <LinkIcon size={28} />,
        title: 'THIRD-PARTY SERVICES & LINKS',
        text: 'Connplex platforms may contain integrations, services, advertisements, or links to third-party websites and service providers including payment gateways and promotional partners. Such third-party platforms operate independently and are not owned, managed, or controlled by Connplex. Accordingly, Connplex does not endorse, guarantee, or assume responsibility for the availability, accuracy, security, content, privacy practices, products, services, or policies of any third-party platform.\n\nUsers accessing or interacting with third-party services do so at their own discretion and are encouraged to review the applicable terms, conditions, and privacy policies of such third parties before engaging with their services.',
    },
    {
        num: '08.',
        icon: <Tag size={28} />,
        title: 'PROMOTIONS, OFFERS & COUPONS',
        text: 'Promotional campaigns, coupon codes, cashback offers, loyalty programs, and discounts provided by Connplex or partner brands are subject to specific terms applicable to each offer.\n\nConnplex reserves the right to modify, suspend, or withdraw offers at any time without prior notice in cases of misuse, technical issues, or business requirements.',
    },
    {
        num: '09.',
        icon: <AlertTriangle size={28} />,
        title: 'LIMITATION OF LIABILITY',
        text: 'To the maximum extent permitted under applicable law, Connplex, its affiliates, directors, employees, partners, licensors, and service providers shall not be liable for any direct, indirect, incidental, consequential, special, punitive, or financial damages arising out of or related to the use of, inability to use, or reliance on the platform or services.\n\nThis includes, without limitation, damages arising from booking failures, payment processing interruptions, cancellation of shows, third-party service disruptions, technical malfunctions, internet or connectivity issues, data loss, unauthorized access, system downtime, or any events beyond the reasonable control of Connplex.\n\nWhile Connplex endeavors to maintain accurate, secure, and uninterrupted services, the platform and services are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied. Connplex does not guarantee continuous availability, uninterrupted access, accuracy, completeness, or error-free operation of the platform at all times.',
    },
    {
        num: '10.',
        icon: <Film size={28} />,
        title: 'CINEMA RULES & ENTRY REGULATIONS',
        text: 'Entry into Connplex cinemas may be subject to security checks, age restrictions, applicable government regulations, and cinema-specific policies.\n\nOutside food and beverages, prohibited items, recording devices, or unlawful materials may not be permitted inside the cinema premises as per applicable policies and regulations.\n\nUsers are expected to maintain appropriate behavior within the cinema premises. Connplex reserves the right to deny admission or remove individuals involved in misconduct, disturbance, safety violations, or illegal activities.',
    },
    {
        num: '11.',
        icon: <Lock size={28} />,
        title: 'PRIVACY & DATA USAGE',
        text: 'Use of Connplex platforms is also governed by our Privacy Policy, which explains how personal information is collected, used, stored, and protected.\n\nBy using the platform, users consent to such collection and usage practices as described in the Privacy Policy.',
    },
    {
        num: '12.',
        icon: <Sliders size={28} />,
        title: 'MODIFICATION OF SERVICES',
        text: 'Connplex reserves the right to modify, suspend, discontinue, or update any part of its platforms, services, pricing, features, or policies at any time without prior notice and at its sole discretion.',
    },
    {
        num: '13.',
        icon: <Gavel size={28} />,
        title: 'GOVERNING LAW & JURISDICTION',
        text: 'These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising in connection with the use of Connplex platforms shall be subject to the jurisdiction of courts located in Ahmedabad, Gujarat.',
    },
];

const TermsAndConditionsPage = () => {
    return (
        <div className="min-h-screen bg-black text-white font-outfit leading-relaxed overflow-x-hidden antialiased">
            <style>{`
                @keyframes ppFadeIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
            
            <Header />

            {/* Hero Section */}
            <section className="relative flex flex-col justify-center h-screen px-[5%] md:px-[10%] overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/terms-hero.png"
                        alt="Connplex Terms & Conditions"
                        fill
                        priority
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div 
                    className="absolute inset-0 z-[1]" 
                    style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.82) 100%)' }}
                />
                <div className="relative z-10">
                    <div className="text-[0.8rem] text-[#A0A0A0] mb-[30px] tracking-[2px] font-medium uppercase">
                        HOME / <span className="text-[#C5A059]">TERMS & CONDITIONS</span>
                    </div>
                    <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] font-extrabold leading-[0.85] mb-10 uppercase tracking-[2px]">
                        <span 
                            className="text-[#C5A059] block brightness-125"
                            style={{ textShadow: '0 0 20px rgba(197, 160, 89, 0.4)' }}
                        >
                            TERMS &
                        </span>
                        CONDITIONS
                    </h1>
                    <div 
                        className="max-w-[550px] text-[#A0A0A0] text-[0.95rem] min-[481px]:text-[1.05rem] leading-[1.8] border-l-2 border-[#C5A059] pl-[15px] min-[481px]:pl-[30px]"
                        style={{ animation: 'ppFadeIn 1s ease-out 0.5s both' }}
                    >
                        <p>By accessing, browsing, or using our website, mobile application, ticket booking platform, or any related services, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.</p>
                    </div>
                </div>
            </section>

            {/* Terms Items Grid */}
            <section className="pt-20 pb-10 px-[5%] md:pt-[120px] md:pb-[60px] md:px-[10%] bg-black relative">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-0"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[120px] gap-y-[100px] gap-[60px]">
                    {termsItems.map((item) => (
                        <div className="flex flex-col min-[481px]:flex-row gap-[15px] min-[481px]:gap-[35px] transition-transform duration-400 ease hover:-translate-y-1.25 group z-10" key={item.num}>
                            <div 
                                className="min-w-[60px] h-[60px] min-[481px]:min-w-[80px] min-[481px]:h-[80px] rounded-full border border-[rgba(197,160,89,0.2)] flex items-center justify-center text-[#C5A059] shadow-[inset_0_0_15px_rgba(197,160,89,0.1)] transition-all duration-300 shrink-0 group-hover:border-[#C5A059] group-hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] group-hover:scale-105"
                                style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, rgba(0,0,0,0) 100%)' }}
                            >
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[1.1rem] font-bold mb-5 text-white tracking-[1.5px] uppercase transition-colors duration-300 group-hover:text-[#C5A059]">
                                    <span className="text-[#C5A059] mr-2.5">{item.num}</span> {item.title}
                                </h3>
                                <p className="text-[#A0A0A0] text-[0.9rem] leading-[1.8]" style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Statement */}
                <div className="relative z-10 mt-20 max-w-[900px] border-t border-[#c5a059]/20 pt-10 text-[#A0A0A0] text-[0.95rem] leading-[1.8]">
                    <p className="mb-6">Connplex may revise or update these Terms & Conditions from time to time. Updated versions will be published on this page. Continued use of the platform after such changes constitutes acceptance of the updated terms.</p>
                    <p className="font-bold text-[#C5A059] tracking-[1.5px] uppercase font-outfit">CONNPLEX CINEMAS LIMITED</p>
                </div>
            </section>

            {/* Help / Contact Section */}
            <section className="mx-[5%] my-10 md:mx-[10%] md:my-[80px] mb-[80px] md:mb-[120px] px-5 py-10 md:px-10 md:py-20 bg-black">
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
