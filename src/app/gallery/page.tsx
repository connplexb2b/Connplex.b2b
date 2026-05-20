"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tv, MapPin, Award, Users, ArrowUpRight } from 'lucide-react';
import './gallery.css';

const GalleryPage = () => {
    return (
        <div className="gallery-page-container">
            <Header />

            {/* Hero Section */}
            <section className="gallery-hero">
                <div className="gallery-hero-bg">
                    <Image
                        src="/gallery/hero.png"
                        alt="Luxury Cinema Hall"
                        fill
                        priority
                        style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
                    />
                </div>
                <div className="gallery-hero-content">
                    <h1>
                        <span>THE</span>
                        <span className="gallery-gold-text">CONNPLEX</span>
                        <span>GALLERY.</span>
                    </h1>
                    <p>A visual journey through luxury cinematic experiences, architecture, and storytelling.</p>
                    <a href="#gallery" className="gallery-btn-primary">
                        <span>Explore Experiences</span>
                        <ArrowUpRight size={18} />
                    </a>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery-section-content" id="gallery">
                <div className="gallery-grid">

                    {/* Luxuriance — spans 8 cols, 2 rows */}
                    <div className="gallery-item gallery-item-luxuriance">
                        <Image src="/gallery/luxuriance.png" alt="Luxuriance" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Luxuriance</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Downtown — spans 4 cols, 2 rows */}
                    <div className="gallery-item gallery-item-downtown">
                        <Image src="/gallery/downtown.png" alt="Downtown" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Downtown</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Sky Inn — spans 4 cols, 1 row */}
                    <div className="gallery-item gallery-item-sky-inn">
                        <Image src="/gallery/sky_inn.png" alt="Sky Inn" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Sky Inn</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Signature — spans 4 cols, 1 row */}
                    <div className="gallery-item gallery-item-signature">
                        <Image src="/gallery/signature.png" alt="Signature" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Signature</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Spectra X — spans 4 cols, 1 row */}
                    <div className="gallery-item gallery-item-spectra-x">
                        <Image src="/gallery/spectra_x.png" alt="Spectra X" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Spectra X</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Behind the Magic — spans 6 cols */}
                    <div className="gallery-item gallery-item-behind-magic">
                        <Image src="/gallery/behind_magic.png" alt="Behind the Magic" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Behind the Magic</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>

                    {/* Grand Openings — spans 6 cols */}
                    <div className="gallery-item gallery-item-grand-opening">
                        <Image src="/gallery/grand_opening.png" alt="Grand Openings" fill style={{ objectFit: 'cover' }} />
                        <div className="gallery-overlay">
                            <h3>Grand Openings</h3>
                            <div className="gallery-line"></div>
                        </div>
                    </div>
                </div>

                {/* Small Thumbnails */}
                <div className="gallery-small-thumbs">
                    {[
                        { src: '/gallery/luxuriance.png', alt: 'Luxuriance' },
                        { src: '/gallery/downtown.png', alt: 'Downtown' },
                        { src: '/gallery/sky_inn.png', alt: 'Sky Inn' },
                        { src: '/gallery/signature.png', alt: 'Signature' },
                        { src: '/gallery/spectra_x.png', alt: 'Spectra X' },
                    ].map((item) => (
                        <div key={item.alt} className="gallery-thumb-item">
                            <Image src={item.src} alt={item.alt} width={300} height={150} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="gallery-stats-section">
                <div className="gallery-stat-box">
                    <Tv size={28} className="gallery-stat-icon" />
                    <span className="gallery-stat-number">115+</span>
                    <span className="gallery-stat-label">Screens</span>
                </div>
                <div className="gallery-stat-box">
                    <MapPin size={28} className="gallery-stat-icon" />
                    <span className="gallery-stat-number">40+</span>
                    <span className="gallery-stat-label">Locations</span>
                </div>
                <div className="gallery-stat-box">
                    <Award size={28} className="gallery-stat-icon" />
                    <span className="gallery-stat-number">8+</span>
                    <span className="gallery-stat-label">Years</span>
                </div>
                <div className="gallery-stat-box">
                    <Users size={28} className="gallery-stat-icon" />
                    <span className="gallery-stat-number">10M</span>
                    <span className="gallery-stat-label">of Experiences</span>
                </div>
            </section>

            {/* Visual Experience Section */}
            <section className="gallery-visual-experience">
                <div className="gallery-experience-text">
                    <h2>
                        MORE THAN<br />A CINEMA.<br />
                        <span className="gallery-gold-text">A VISUAL<br />EXPERIENCE.</span>
                    </h2>
                    <div className="gallery-line"></div>
                </div>
                <div className="gallery-experience-img">
                    <Image src="/gallery/wide_experience.png" alt="Visual Experience" fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Footer Promo Section */}
            <section className="gallery-footer-section">
                <div className="gallery-footer-bg">
                    <Image src="/gallery/future_entertainment.png" alt="Future Entertainment" fill style={{ objectFit: 'cover', filter: 'brightness(0.3)' }} />
                </div>
                <div className="gallery-footer-content">
                    <h2>
                        LET&apos;S CREATE<br />THE FUTURE<br />
                        <span className="gallery-gold-text">OF ENTERTAINMENT.</span>
                    </h2>
                    <Link href="/contact" className="gallery-btn-primary">
                        <span>Connect with Connplex</span>
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GalleryPage;
