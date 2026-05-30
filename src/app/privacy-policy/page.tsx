"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Settings, Shield, Cookie, Lock, Link as LinkIcon, PenLine, Building2, Mail, Phone, MapPin } from 'lucide-react';

const policyItems = [
    {
        num: '01.',
        icon: <User size={28} />,
        title: 'INFORMATION WE COLLECT',
        text: 'We may collect personal information that you voluntarily provide to us, such as your name, email address, phone number, and any other details you submit through our contact forms or inquiries.',
    },
    {
        num: '02.',
        icon: <Settings size={28} />,
        title: 'HOW WE USE YOUR INFORMATION',
        text: 'The information we collect is used to respond to your inquiries, provide requested services, improve our website, and communicate with you about our services, projects, or updates.',
    },
    {
        num: '03.',
        icon: <Shield size={28} />,
        title: 'INFORMATION SHARING',
        text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to trusted service providers who assist us in operating our website.',
    },
    {
        num: '04.',
        icon: <Cookie size={28} />,
        title: 'COOKIES & TRACKING TECHNOLOGIES',
        text: 'Our website may use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can choose to disable cookies through your browser settings.',
    },
    {
        num: '05.',
        icon: <Lock size={28} />,
        title: 'DATA SECURITY',
        text: 'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
    },
    {
        num: '06.',
        icon: <User size={28} />,
        title: 'YOUR RIGHTS',
        text: 'You have the right to access, update, or delete your personal information. If you wish to exercise any of these rights, please contact us using the details provided below.',
    },
    {
        num: '07.',
        icon: <LinkIcon size={28} />,
        title: 'THIRD-PARTY LINKS',
        text: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.',
    },
    {
        num: '08.',
        icon: <PenLine size={28} />,
        title: 'CHANGES TO THIS POLICY',
        text: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.',
    },
];

const PrivacyPolicyPage = () => {
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
            <section className="relative flex flex-col justify-center h-screen px-[5%] md:px-[10%] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/privacy-hero.png"
                        alt="Connplex Cinema"
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
                        HOME / <span className="text-[#C5A059]">PRIVACY POLICY</span>
                    </div>
                    <h1 className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] font-extrabold leading-[0.85] mb-10 uppercase tracking-[2px]">
                        <span 
                            className="text-[#C5A059] block brightness-125"
                            style={{ textShadow: '0 0 20px rgba(197, 160, 89, 0.4)' }}
                        >
                            PRIVACY
                        </span>
                        POLICY
                    </h1>
                    <div 
                        className="max-w-[550px] text-[#A0A0A0] text-[0.95rem] min-[481px]:text-[1.05rem] leading-[1.8] border-l-2 border-[#C5A059] pl-[15px] min-[481px]:pl-[30px]"
                        style={{ animation: 'ppFadeIn 1s ease-out 0.5s both' }}
                    >
                        <p>At Connplex Private Limited, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
                    </div>
                </div>
            </section>

            {/* Policy Items Grid */}
            <section className="py-20 px-[5%] md:py-[120px] md:px-[10%] grid grid-cols-1 lg:grid-cols-2 gap-x-[120px] gap-y-[100px] gap-[60px] bg-black relative">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-0"></div>
                {policyItems.map((item) => (
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
                            <p className="text-[#A0A0A0] text-[0.9rem] leading-[1.8]">{item.text}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Contact Banner */}
            <section className="mx-[5%] my-10 md:mx-[10%] md:my-[80px] mb-[80px] md:mb-[120px] p-5 min-[481px]:p-[30px] md:p-20 border border-[rgba(197,160,89,0.2)] rounded bg-[#0A0A0A] flex flex-col md:flex-row items-start md:items-center relative overflow-hidden shadow-[0_0_50px_rgba(197,160,89,0.05)]">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/privacy-contact-bg.png"
                        alt="Contact Background"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div 
                    className="absolute inset-0 z-[1]"
                    style={{ background: 'linear-gradient(90deg, #0A0A0A 40%, rgba(10,10,10,0.2) 70%, rgba(10,10,10,0.9) 100%)' }}
                />
                <div className="relative z-10 w-full md:max-w-[65%]">
                    <h2 className="text-[#C5A059] text-[1.2rem] font-bold mb-[15px] tracking-[4px] uppercase">HAVE QUESTIONS?</h2>
                    <h3 className="text-[1.8rem] min-[481px]:text-[2.8rem] font-extrabold mb-[25px] uppercase tracking-[2px] leading-[1.1]">
                        WE&apos;RE HERE<br />TO HELP.
                    </h3>
                    <p className="text-[#A0A0A0] text-[1rem] mb-10">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                    <div className="flex flex-col gap-[25px]">
                        <div className="flex items-center gap-[20px] text-white text-base">
                            <Building2 size={20} className="text-[#C5A059] shrink-0" />
                            <span className="font-medium">Connplex Private Limited</span>
                        </div>
                        <div className="flex items-center gap-[20px] text-white text-base">
                            <Mail size={20} className="text-[#C5A059] shrink-0" />
                            <a href="mailto:info@connplex.com" className="text-white no-underline transition-colors duration-300 hover:text-[#C5A059]">info@connplex.com</a>
                        </div>
                        <div className="flex items-center gap-[20px] text-white text-base">
                            <Phone size={20} className="text-[#C5A059] shrink-0" />
                            <a href="tel:+912249704158" className="text-white no-underline transition-colors duration-300 hover:text-[#C5A059]">+91 22 4970 4158</a>
                        </div>
                        <div className="flex items-center gap-[20px] text-white text-base">
                            <MapPin size={20} className="text-[#C5A059] shrink-0" />
                            <span className="font-medium">Connplex House, Andheri (W), Mumbai — 400053, India</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
