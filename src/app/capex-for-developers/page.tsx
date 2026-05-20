import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './capex.css';

export const metadata = {
    title: 'Capex for Developers | Connplex Cinemas',
    description: 'Scalable cinema infrastructure designed for premium experiences and long-term growth. Explore investment models with Connplex Cinemas.',
};

const CapexPage = () => {
    return (
        <div className="capex-page">
            <Header />
            <main>
                <section className="capex-hero">
                    <div className="overlay"></div>
                    <div className="capex-content">
                        <h1 className="reveal-up">
                            <span className="capex-gold-text">CAPEX</span><br />
                            FOR THE<br />
                            FUTURE OF<br />
                            CINEMA<span className="capex-gold-dot">.</span>
                        </h1>
                        <div className="capex-divider reveal-up-delay"></div>
                        <p className="capex-subtitle reveal-up-delay">
                            Scalable cinema infrastructure designed for premium experiences and long-term growth.
                        </p>
                        <a href="mailto:franchise@connplex.com" className="capex-cta reveal-up-delay-2">
                            CONTACT US
                            <span className="arrow">↗</span>
                        </a>
                    </div>

                    <div className="capex-features-container slide-up-delay">
                        <div className="capex-features-bar">
                            <div className="capex-feature-item">
                                <div className="capex-feature-icon">
                                    <i className="fa-solid fa-gear"></i>
                                </div>
                                <div className="capex-feature-text">
                                    <span>LOW OPERATIONAL</span>
                                    <span>COMPLEXITY</span>
                                </div>
                            </div>
                            <div className="capex-feature-item">
                                <div className="capex-feature-icon">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                                <div className="capex-feature-text">
                                    <span>PREMIUM ROI</span>
                                    <span>POTENTIAL</span>
                                </div>
                            </div>
                            <div className="capex-feature-item">
                                <div className="capex-feature-icon">
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                                <div className="capex-feature-text">
                                    <span>SMART</span>
                                    <span>INFRASTRUCTURE</span>
                                </div>
                            </div>
                            <div className="capex-feature-item">
                                <div className="capex-feature-icon">
                                    <i className="fa-solid fa-expand"></i>
                                </div>
                                <div className="capex-feature-text">
                                    <span>SCALABLE</span>
                                    <span>FORMATS</span>
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

export default CapexPage;
