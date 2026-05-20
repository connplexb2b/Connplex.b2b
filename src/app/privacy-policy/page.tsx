"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Settings, Shield, Cookie, Lock, Link as LinkIcon, PenLine, Building2, Mail, Phone, MapPin } from 'lucide-react';
import './privacy-policy.css';

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
        <div className="privacy-policy-page">
            <Header />

            {/* Hero Section */}
            <section className="pp-hero">
                <div className="pp-hero-bg">
                    <Image
                        src="/privacy-hero.png"
                        alt="Connplex Cinema"
                        fill
                        priority
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div className="pp-hero-overlay" />
                <div className="pp-hero-content">
                    <div className="pp-breadcrumb">
                        HOME / <span>PRIVACY POLICY</span>
                    </div>
                    <h1>
                        <span className="pp-gold">PRIVACY</span>
                        POLICY
                    </h1>
                    <div className="pp-hero-text">
                        <p>At Connplex Private Limited, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
                    </div>
                </div>
            </section>

            {/* Policy Items Grid */}
            <section className="pp-sections">
                {policyItems.map((item) => (
                    <div className="pp-item" key={item.num}>
                        <div className="pp-icon-box">
                            {item.icon}
                        </div>
                        <div className="pp-content">
                            <h3><span>{item.num}</span> {item.title}</h3>
                            <p>{item.text}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Contact Banner */}
            <section className="pp-contact-banner">
                <div className="pp-contact-bg">
                    <Image
                        src="/privacy-contact-bg.png"
                        alt="Contact Background"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div className="pp-contact-overlay" />
                <div className="pp-contact-info">
                    <h2>HAVE QUESTIONS?</h2>
                    <h3>WE&apos;RE HERE<br />TO HELP.</h3>
                    <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                    <div className="pp-contact-details">
                        <div className="pp-detail-item">
                            <Building2 size={20} className="pp-detail-icon" />
                            <span>Connplex Private Limited</span>
                        </div>
                        <div className="pp-detail-item">
                            <Mail size={20} className="pp-detail-icon" />
                            <a href="mailto:info@connplex.com">info@connplex.com</a>
                        </div>
                        <div className="pp-detail-item">
                            <Phone size={20} className="pp-detail-icon" />
                            <a href="tel:+912249704158">+91 22 4970 4158</a>
                        </div>
                        <div className="pp-detail-item">
                            <MapPin size={20} className="pp-detail-icon" />
                            <span>Connplex House, Andheri (W), Mumbai — 400053, India</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
