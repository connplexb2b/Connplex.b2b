"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Shield, User, Link as LinkIcon, AlertTriangle, Gavel, Scale, Mail, Building2, Phone, MapPin } from 'lucide-react';
import './legal-notice.css';

const LegalNoticePage = () => {
    return (
        <div className="legal-notice-page">
            <Header logoSrc="/img/Connplex Cinemas Gradient logo-02.png" />
            <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1><span className="gold">LEGAL</span> NOTICE</h1>
                        <p className="intro-text">
                            Welcome to Connplex Private Limited. By accessing or using our website, you agree to comply with and be bound by the following terms.
                        </p>
                    </div>
                    <div className="hero-image">
                        <Image
                            src="/legal-notice-hero-v2.png"
                            alt="Legal Gavel and Scales"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                </section>

                <section className="legal-items">
                    <div className="container">
                        {/* 01 */}
                        <div className="legal-item" id="item-01">
                            <div className="item-left">
                                <div className="item-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="item-number">01</div>
                            </div>
                            <div className="item-text">
                                <h3>GENERAL INFORMATION</h3>
                                <p>This website is owned and operated by Connplex Private Limited ("Connplex", "we", "us", or "our"). The content on this website is provided for general information purposes only.</p>
                            </div>
                        </div>

                        {/* 02 */}
                        <div className="legal-item" id="item-02">
                            <div className="item-left">
                                <div className="item-icon">
                                    <Shield size={24} />
                                </div>
                                <div className="item-number">02</div>
                            </div>
                            <div className="item-text">
                                <h3>INTELLECTUAL PROPERTY</h3>
                                <p>All content, including text, graphics, logos, images, videos, and design, is the property of Connplex Private Limited and is protected by applicable copyright, trademark, and other intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
                            </div>
                        </div>

                        {/* 03 */}
                        <div className="legal-item" id="item-03">
                            <div className="item-left">
                                <div className="item-icon">
                                    <User size={24} />
                                </div>
                                <div className="item-number">03</div>
                            </div>
                            <div className="item-text">
                                <h3>USE OF WEBSITE</h3>
                                <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.</p>
                            </div>
                        </div>

                        {/* 04 */}
                        <div className="legal-item" id="item-04">
                            <div className="item-left">
                                <div className="item-icon">
                                    <LinkIcon size={24} />
                                </div>
                                <div className="item-number">04</div>
                            </div>
                            <div className="item-text">
                                <h3>THIRD-PARTY LINKS</h3>
                                <p>Our website may contain links to third-party websites for your convenience. Connplex is not responsible for the content, policies, or practices of any third-party websites.</p>
                            </div>
                        </div>

                        {/* 05 */}
                        <div className="legal-item" id="item-05">
                            <div className="item-left">
                                <div className="item-icon">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="item-number">05</div>
                            </div>
                            <div className="item-text">
                                <h3>DISCLAIMER</h3>
                                <p>The content on this website is provided "as is" without any warranties, express or implied. Connplex does not warrant that the website will be error-free, secure, or available at all times.</p>
                            </div>
                        </div>

                        {/* 06 */}
                        <div className="legal-item" id="item-06">
                            <div className="item-left">
                                <div className="item-icon">
                                    <Gavel size={24} />
                                </div>
                                <div className="item-number">06</div>
                            </div>
                            <div className="item-text">
                                <h3>LIMITATION OF LIABILITY</h3>
                                <p>Connplex Private Limited shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website.</p>
                            </div>
                        </div>

                        {/* 07 */}
                        <div className="legal-item" id="item-07">
                            <div className="item-left">
                                <div className="item-icon">
                                    <Scale size={24} />
                                </div>
                                <div className="item-number">07</div>
                            </div>
                            <div className="item-text">
                                <h3>GOVERNING LAW</h3>
                                <p>This Legal Notice shall be governed by and construed in accordance with the laws of India. Any disputes arising in relation to this website shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.</p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="contact-box">
                            <div className="contact-icon-main">
                                <Mail size={32} />
                            </div>
                            <div className="contact-info">
                                <h3>CONTACT US</h3>
                                <p>If you have any questions or concerns about this Legal Notice, please contact us at:</p>
                                <div className="contact-details">
                                    <div className="detail-item">
                                        <Building2 size={18} />
                                        <span>Connplex Private <span className="gold-text">Limited</span></span>
                                    </div>
                                    <div className="detail-item">
                                        <Mail size={18} />
                                        <a href="mailto:info@connplex.com">info@connplex.com</a>
                                    </div>
                                    <div className="detail-item">
                                        <Phone size={18} />
                                        <a href="tel:+912249704158">+91 22 4970 4158</a>
                                    </div>
                                    <div className="detail-item full-width">
                                        <MapPin size={18} />
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
