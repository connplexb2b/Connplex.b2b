'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './merchandise.css';

const MerchandisePage = () => {
    // Array of 10 items in the collection cut
    const collectionItems = [
        {
            id: 1,
            title: 'PREMIUM TUMBLER',
            description: 'Stainless steel with matte black finish and gold detailing.',
            image: '/merchandise/icon_1.png'
        },
        {
            id: 2,
            title: "FOUNDER'S SCRIPT",
            description: 'A story worth watching. Plan. Build. Inspire.',
            image: '/merchandise/icon_2.png'
        },
        {
            id: 3,
            title: 'ACRYLIC CLAPPERBOARD',
            description: 'Mark every milestone. Your story in motion.',
            image: '/merchandise/icon_3.png'
        },
        {
            id: 4,
            title: 'MINI DIRECTOR SPOTLIGHT',
            description: 'Lights that inspire. Perfect for any space.',
            image: '/merchandise/icon_4.png'
        },
        {
            id: 5,
            title: 'SCRIPT PLANNER',
            description: 'Every vision starts with a script.',
            image: '/merchandise/icon_5.png'
        },
        {
            id: 6,
            title: 'FOUNDER CARD (NFC)',
            description: 'Tap to unlock the experience.',
            image: '/merchandise/icon_6.png'
        },
        {
            id: 7,
            title: 'PREMIUM METAL PEN',
            description: 'Crafted for leaders. Built to last.',
            image: '/merchandise/icon_7.png'
        },
        {
            id: 8,
            title: 'FILM REEL CHOCOLATE BOX',
            description: 'Sweet success stories in every bite.',
            image: '/merchandise/icon_8.png'
        },
        {
            id: 9,
            title: 'ACRYLIC FILM STRIP NAMEPLATE',
            description: 'A title worth displaying.',
            image: '/merchandise/icon_9.png'
        },
        {
            id: 10,
            title: 'METAL TICKET BOX',
            description: 'For memories that last.',
            image: '/merchandise/icon_10.png'
        }
    ];

    return (
        <div className="merchandise-page">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="container hero-container">
                        <div className="hero-content">
                            <span className="badge">PREMIUM MERCHANDISE</span>
                            <h1 className="hero-title">
                                CARRY THE<br />
                                <span className="gold-text">EXPERIENCE</span>
                            </h1>
                            <p className="hero-desc">
                                Curated collectibles and premium merchandise<br />
                                inspired by the world of CONNPLEX.
                            </p>

                            <a href="#" className="btn-explore">
                                Explore Collection &nbsp;{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>

                            <div className="hero-features">
                                <div className="feature">
                                    <div className="icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <polyline points="9 12 11 14 15 10"></polyline>
                                        </svg>
                                    </div>
                                    <h4>Premium Quality</h4>
                                    <p>Finest materials<br />and craftsmanship</p>
                                </div>
                                <div className="feature-divider"></div>
                                <div className="feature">
                                    <div className="icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <h4>Exclusive Designs</h4>
                                    <p>Limited edition<br />and collector's items</p>
                                </div>
                                <div className="feature-divider"></div>
                                <div className="feature">
                                    <div className="icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <h4>Worldwide Shipping</h4>
                                    <p>Delivered to your<br />doorstep</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Collection Section */}
                <section className="collection">
                    <div className="container">
                        <div className="section-header text-center">
                            <h2 className="section-title">THE FOUNDER'S CUT COLLECTION</h2>
                        </div>

                        <div className="collection-grid">
                            {collectionItems.map((item) => (
                                <div className="collection-card" key={item.id}>
                                    <div className="card-image">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={140}
                                            height={140}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div className="card-content">
                                        <h3>{item.title}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bonus Inclusions & Features Section */}
                <section className="bonus-features-section">
                    <div className="container">
                        {/* Bonus Inclusions Box */}
                        <div className="bonus-box border-gold-subtle">
                            <div className="bonus-left">
                                <Image
                                    src="/merchandise/bottom_image.png"
                                    alt="Golden Ticket"
                                    width={280}
                                    height={200}
                                    className="golden-ticket-img"
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <div className="bonus-right">
                                <div className="bonus-header">
                                    <span className="line"></span>
                                    <h3>BONUS INCLUSIONS</h3>
                                    <span className="line"></span>
                                </div>
                                <div className="bonus-grid-3">
                                    <div className="bonus-item">
                                        <div className="bonus-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4>GOLDEN TICKET<br />INVITATION</h4>
                                            <p>Your entry to exclusive<br />premieres and events.</p>
                                        </div>
                                    </div>
                                    <div className="bonus-item">
                                        <div className="bonus-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4>WELCOME LETTER<br />FROM FOUNDER</h4>
                                            <p>A personal note<br />of gratitude.</p>
                                        </div>
                                    </div>
                                    <div className="bonus-item">
                                        <div className="bonus-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                            </svg>
                                        </div>
                                        <div className="bonus-text">
                                            <h4>EXCLUSIVE FRANCHISE<br />BROCHURE</h4>
                                            <p>Discover the future<br />we're building together.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features Box */}
                        <div className="features-box border-gold-subtle mt-4">
                            <div className="bonus-grid-3">
                                <div className="bonus-item">
                                    <div className="bonus-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4>EXCLUSIVE ACCESS</h4>
                                        <p>Owners get invited to<br />special events.</p>
                                    </div>
                                </div>
                                <div className="bonus-item">
                                    <div className="bonus-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <circle cx="12" cy="11" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4>LIMITED QUANTITY</h4>
                                        <p>Collector's items in<br />limited supply.</p>
                                    </div>
                                </div>
                                <div className="bonus-item">
                                    <div className="bonus-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a365" strokeWidth="1.5">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <div className="bonus-text">
                                        <h4>PREMIUM PACKAGING</h4>
                                        <p>Elegantly packaged for<br />a memorable unboxing.</p>
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

export default MerchandisePage;
