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
        text: 'To process bookings and transactions, we may collect information related to your movie reservations, such as selected cinemas, show timings, seat preferences, booking history, payment references, and purchase records.\n\nWe also automatically collect certain technical and usage information, including your IP address, browser type, referral sources, operating system, app version, and interactions with our website or application. This information helps us improve platform performance, security, and user experience.\n\nWe may collect your preferences regarding promotional offers, newsletters, movie alerts, and marketing communications. We may also collect information related to reward points, coupon usage, referral programs, gift cards, or promotional campaigns.\n\nAdditionally, we may collect approximate location information to display relevant cinemas, movie listings, and location-based services.',
    },
    {
        num: '02.',
        icon: <Settings size={28} />,
        title: 'HOW WE USE YOUR INFORMATION',
        text: 'Please note that Connplex may sell, share, or transfer personally identifiable information about its customers to any successor in interest, such as in the event the Company is sold to a third party. Additionally, we may disclose your personally identifiable information where required by law or in response to requests from law enforcement authorities related to criminal investigations or from civil or administrative authorities in connection with pending cases or investigations. We use your information to personalize your cinema experience, recommend movies, process transactions, issue tickets, provide requested services, send important updates, promotional offers, and newsletters (with an option to opt out at any time), as well as to analyse user behaviour, improve our services, troubleshoot issues, and optimize the performance of CONNPLEX CINEMAS.',
    },
    {
        num: '03.',
        icon: <Cookie size={28} />,
        title: 'COOKIES & TRACKING TECHNOLOGIES',
        text: 'Connplex uses cookies, pixels, analytics tools, and similar technologies to enhance website functionality, analyze traffic, improve user experience, and personalize content and promotions. Users may disable cookies through their browser settings; however, certain features of the platform may not function properly as a result.',
    },
    {
        num: '04.',
        icon: <Lock size={28} />,
        title: 'PAYMENT SECURITY',
        text: 'We implement reasonable technical and organizational security measures to help protect transaction information and ensure secure payment processing. However, all payment transactions are subject to the privacy policies and security practices of the respective payment service providers.',
    },
    {
        num: '05.',
        icon: <Shield size={28} />,
        title: 'SHARING OF INFORMATION',
        text: 'Connplex may share information with trusted third-party service providers, including payment gateway partners, technology providers, hosting partners, analytics vendors, and marketing agencies, strictly for operational and service-related purposes. Information may also be disclosed when required by law, regulatory authorities, or in connection with business restructuring, mergers, or legal proceedings. Connplex does not sell personal information to third parties.',
    },
    {
        num: '06.',
        icon: <Settings size={28} />,
        title: 'MOBILE APPLICATION PERMISSIONS',
        text: 'The Connplex mobile application may request access to certain device permissions such as notifications, storage, camera, or location services in order to enhance platform functionality and customer experience. Users may manage or revoke such permissions through their device settings at any time.',
    },
    {
        num: '07.',
        icon: <Shield size={28} />,
        title: 'DATA SECURITY',
        text: 'Connplex follows reasonable technical, administrative, and security measures to protect user information against unauthorized access, misuse, alteration, disclosure, or destruction. These measures are designed to maintain the confidentiality, integrity, and security of personal information processed through our platform. While we strive to use commercially acceptable safeguards to protect user data, no method of electronic transmission, storage, or processing over the internet can be guaranteed to be completely secure. Accordingly, Connplex cannot guarantee absolute security of information shared through its platforms.',
    },
    {
        num: '08.',
        icon: <User size={28} />,
        title: 'YOUR RIGHTS & CHOICES',
        text: 'Users may request access to their personal information, correction of inaccurate information, deletion of data where applicable, or opt out of promotional communications and marketing messages. Such requests may be submitted using the contact details provided below.',
    },
    {
        num: '09.',
        icon: <Lock size={28} />,
        title: 'DATA RETENTION',
        text: 'Connplex retains personal information only for as long as necessary to fulfill operational, legal, regulatory, security, and business requirements.',
    },
    {
        num: '10.',
        icon: <User size={28} />,
        title: 'CHILDREN’S PRIVACY',
        text: 'Connplex services are not intended for children below the age of 13 without parental or guardian supervision. Connplex does not knowingly collect personal information from children.',
    },
    {
        num: '11.',
        icon: <LinkIcon size={28} />,
        title: 'THIRD-PARTY LINKS',
        text: 'The Connplex website or applications may contain links to third-party websites or services for user convenience. Connplex is not responsible for the privacy practices, policies, or content of such external platforms.',
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
            <section className="pt-20 pb-10 px-[5%] md:pt-[120px] md:pb-[60px] md:px-[10%] bg-black relative">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-0"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[120px] gap-y-[100px] gap-[60px]">
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
                                <p className="text-[#A0A0A0] text-[0.9rem] leading-[1.8]" style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing Statement */}
                <div className="relative z-10 mt-20 max-w-[900px] border-t border-[#c5a059]/20 pt-10 text-[#A0A0A0] text-[0.95rem] leading-[1.8]">
                    <p className="mb-6">Connplex may revise or update this Privacy Policy from time to time. Updated versions will be published on this page along with the revised effective date. Continued use of the platform after such changes constitutes acceptance of the updated policy.</p>
                    <p className="font-bold text-[#C5A059] tracking-[1.5px] uppercase font-outfit">CONNPLEX CINEMAS LIMITED</p>
                </div>
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
