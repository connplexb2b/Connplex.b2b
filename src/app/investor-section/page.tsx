'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './investor.css';

const InvestorRelationsPage = () => {
    // Accordion active state tracking by ID or title
    const [activeDoc, setActiveDoc] = useState<string | null>(null);

    const toggleDoc = (docTitle: string) => {
        if (activeDoc === docTitle) {
            setActiveDoc(null);
        } else {
            setActiveDoc(docTitle);
        }
    };

    return (
        <div className="investor-page">
            <Header />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <div className="hero-text-block">
                        <span className="hero-label">INVESTOR RELATIONS</span>
                        <h1 className="hero-title">
                            Building India's<br />
                            Most <span className="highlight">Premium</span><br />
                            Cinema Network.
                        </h1>
                        <p className="hero-description">
                            Connplex Cinemas Limited is committed to delivering world-class cinematic experiences through innovation, operational excellence and a scalable franchise model.
                        </p>
                        <div className="hero-buttons">
                            <a href="#" className="btn-gold">
                                Investor Presentation{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </a>
                            <a href="#" className="btn-outline">
                                Annual Reports{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </a>
                            <a href="#" className="btn-outline">
                                Financial Filings{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </a>
                            <a href="/contact" className="btn-outline">
                                Contact Us{' '}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                                </svg>
                            </div>
                            <h3>2019</h3>
                            <p>Founded</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                    <circle cx="12" cy="10" r="3" />
                                    <line x1="6" y1="10" x2="6.01" y2="10" />
                                </svg>
                            </div>
                            <h3>125+</h3>
                            <p>Screens</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <h3>50+</h3>
                            <p>Cities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h3>35%+</h3>
                            <p>Revenue Growth<br />YoY (FY24)</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3>41+</h3>
                            <p>Franchise Partners<br />Across India</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                                    <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
                                </svg>
                            </div>
                            <h3>Multiple</h3>
                            <p>Premium Formats</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h3>Strong</h3>
                            <p>Expansion<br />Pipeline</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Highlights Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">INVESTMENT HIGHLIGHTS</span>
                        <h2 className="section-title">Strong Fundamentals. Scalable Future.</h2>
                    </div>

                    <div className="highlights-grid">
                        <div className="highlight-card">
                            <div className="card-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <circle cx="12" cy="10" r="3" />
                                    <line x1="6" y1="10" x2="6.01" y2="10" />
                                </svg>
                            </div>
                            <h4>Premium Cinema Network</h4>
                            <p>Expanding high-quality cinema experiences across high-growth markets with modern formats.</p>
                        </div>
                        <div className="highlight-card">
                            <div className="card-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h4>Asset-Light Franchise Model</h4>
                            <p>Capital-efficient franchise approach enabling rapid scale with lower risk and higher returns.</p>
                        </div>
                        <div className="highlight-card">
                            <div className="card-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                            </div>
                            <h4>Robust Financial Performance</h4>
                            <p>Consistent growth in revenue, improving profitability and strong balance sheet.</p>
                        </div>
                        <div className="highlight-card">
                            <div className="card-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                            </div>
                            <h4>Long-Term Value Creation</h4>
                            <p>Focused on sustainable growth, operational excellence and shareholder value.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Financial Highlights Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">FINANCIAL HIGHLIGHTS (CONSOLIDATED)</span>
                    </div>

                    <div className="financials-grid">
                        {/* Revenue */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <span className="chart-title">Revenue (₹ Cr)</span>
                                <div className="chart-value">
                                    229.60{' '}
                                    <span className="trend-up">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        3.35 (1.75%)
                                    </span>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="y-axis">
                                    <span>300</span>
                                    <span>200</span>
                                    <span>100</span>
                                    <span>0</span>
                                </div>
                                <div className="bars-area">
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '55%' }} />
                                        <span className="x-label">FY21</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '65%' }} />
                                        <span className="x-label">FY22</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '75%' }} />
                                        <span className="x-label">FY23</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '80%' }} />
                                        <span className="x-label">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EBITDA */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <span className="chart-title">EBITDA (₹ Cr)</span>
                                <div className="chart-value">
                                    28.64{' '}
                                    <span className="trend-up">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        12.41%
                                    </span>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="y-axis">
                                    <span>40</span>
                                    <span>30</span>
                                    <span>20</span>
                                    <span>10</span>
                                    <span>0</span>
                                </div>
                                <div className="bars-area">
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '40%' }} />
                                        <span className="x-label">FY21</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '50%' }} />
                                        <span className="x-label">FY22</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '65%' }} />
                                        <span className="x-label">FY23</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '80%' }} />
                                        <span className="x-label">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAT */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <span className="chart-title">PAT (₹ Cr)</span>
                                <div className="chart-value">
                                    2.32{' '}
                                    <span className="trend-up">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        26.52%
                                    </span>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="y-axis">
                                    <span>3</span>
                                    <span>2</span>
                                    <span>1</span>
                                    <span>0</span>
                                </div>
                                <div className="bars-area">
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '20%' }} />
                                        <span className="x-label">FY21</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '40%' }} />
                                        <span className="x-label">FY22</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '60%' }} />
                                        <span className="x-label">FY23</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '85%' }} />
                                        <span className="x-label">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Occupancy */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <span className="chart-title">Occupancy (%)</span>
                                <div className="chart-value">
                                    28.64%{' '}
                                    <span className="trend-up">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                                        </svg>{' '}
                                        4.82%
                                    </span>
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="y-axis">
                                    <span>40%</span>
                                    <span>30%</span>
                                    <span>20%</span>
                                    <span>10%</span>
                                    <span>0%</span>
                                </div>
                                <div className="bars-area">
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '75%' }} />
                                        <span className="x-label">FY21</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '75%' }} />
                                        <span className="x-label">FY22</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '70%' }} />
                                        <span className="x-label">FY23</span>
                                    </div>
                                    <div className="bar-group">
                                        <div className="bar" style={{ height: '80%' }} />
                                        <span className="x-label">FY24</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="chart-disclaimer">Financials as per Consolidated Financial Statements for FY24. Figures are rounded off.</p>
                </div>
            </section>

            {/* Documents Accordion Section */}
            <section className="section-padding docs-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-label">INVESTOR DOCUMENTS</span>
                    </div>

                    <div className="docs-grid">
                        <div className="docs-column">
                            {/* Annual Reports */}
                            {/* NSE Filings */}
                            <div className={`doc-item ${activeDoc === 'NSE Filings' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('NSE Filings')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Announcements
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className="doc-content">
                                    <ul className="doc-list">

                                        <li><Link href="/investor-documents/board-meeting">Board Meeting</Link></li>
                                        <li><Link href="/investor-documents/general-meeting">General Meeting</Link></li>
                                        <li><Link href="/investor-documents/other-announcements">Other Announcements</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className={`doc-item ${activeDoc === 'Quarterly Results' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Quarterly Results')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                        Annual Report
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className="doc-content">
                                    <ul className="doc-list">
                                        <li><a href="#">FY 2023-24</a></li>
                                        <li><a href="#">FY 2022-23</a></li>
                                        <li><a href="#">FY 2021-22</a></li>

                                    </ul>
                                </div>
                            </div>

                            {/* Annual Returns */}
                            <div className={`doc-item ${activeDoc === 'Annual Returns' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Annual Returns')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Annual Returns
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/annual-returns">View Documents</Link></li></ul></div>
                            </div>

                            {/* Board Of Directors */}
                            <div className={`doc-item ${activeDoc === 'Board Of Directors' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Board Of Directors')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Board Of Directors
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/board-of-directors">View Documents</Link></li></ul></div>
                            </div>

                            {/* Policies */}
                            <div className={`doc-item ${activeDoc === 'Policies' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Policies')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Policies
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content">
                                    <ul className="doc-list">
                                        <li><Link href="/investor-documents/posh-policy">POSH Policy</Link></li>
                                        <li><Link href="/investor-documents/moa-aoa">MOA AOA</Link></li>
                                        <li><Link href="/investor-documents/vigil-mechanism-whistle-blower-policy">Vigil Mechanism(Whistle Blower) Policy</Link></li>
                                        <li><Link href="/investor-documents/policy-on-related-party-transaction">Policy on Related Party Transaction</Link></li>
                                        <li><Link href="/investor-documents/policy-for-determination-of-materiality">Policy for Determination of Materiality</Link></li>
                                        <li><Link href="/investor-documents/policies-on-payments-to-non-executive-directors">Policies on Payments to Non-Executive Directors</Link></li>
                                        <li><Link href="/investor-documents/nrc-policy">NRC Policy</Link></li>
                                        <li><Link href="/investor-documents/familarisation-programme">Familarisation Programme</Link></li>
                                        <li><Link href="/investor-documents/dividend-distribution-policy">Dividend Distribution Policy</Link></li>
                                        <li><Link href="/investor-documents/csr-policy">CSR Policy</Link></li>
                                        <li><Link href="/investor-documents/code-of-practices-and-procedures-for-fair-disclosure">CODE OF PRACTICES AND PROCEDURES FOR FAIR DISCLOSURE OF UNPUBLISHED PRICE SENSITIVE INFORMATION</Link></li>
                                        <li><Link href="/investor-documents/coc-for-dir-kmp">COC for Dir_KMP</Link></li>
                                        <li><Link href="/investor-documents/board-diversity-policy">Board Diversity Policy</Link></li>
                                        <li><Link href="/investor-documents/brief-profile-of-board-of-directors">Brief Profile of Board of Directors including Directorship</Link></li>
                                        <li><Link href="/investor-documents/code-of-conduct-for-prevention-of-insider-trading">Code of conduct for prevention of Insider Trading</Link></li>
                                        <li><Link href="/investor-documents/code-of-conduct-independent-director">Code of Conduct Independent Director</Link></li>
                                        <li><Link href="/investor-documents/code-of-conduct-of-employee">Code of Conduct of Employee</Link></li>
                                        <li><Link href="/investor-documents/leak-of-upsi">Leak of UPSI</Link></li>
                                        <li><Link href="/investor-documents/policy-for-determining-material-subsidiary">Policy for determining Material Subsidiary</Link></li>
                                        <li><Link href="/investor-documents/policy-of-preservation-of-documents">Policy of Preservation of Documents</Link></li>
                                        <li><Link href="/investor-documents/term-condition-of-appointment-of-id">Term Condition of Appointment of ID</Link></li>
                                        <li><Link href="/investor-documents/website-content-archival-policy">Website Content Archival Policy</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Committees */}
                            <div className={`doc-item ${activeDoc === 'Committees' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Committees')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Committees
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content">
                                    <ul className="doc-list">
                                        <li><Link href="/investor-documents/posh">POSH</Link></li>
                                        <li><Link href="/investor-documents/various-commitee-for-board">VARIOUS COMMITEE FOR BOARD</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Financial Results */}
                            <div className={`doc-item ${activeDoc === 'Financial Results' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Financial Results')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Financial Results
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/financial-results">View Documents</Link></li></ul></div>
                            </div>

                            {/* Initial Public Offer */}
                            <div className={`doc-item ${activeDoc === 'Initial Public Offer' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Initial Public Offer')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Initial Public Offer
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content">
                                    <ul className="doc-list">
                                        <li><Link href="/investor-documents/draft-red-herring-prospectus">Draft Red Herring Prospectus</Link></li>
                                        <li><Link href="/investor-documents/redherring-prospectus">RedHerring Prospectus</Link></li>
                                        <li><Link href="/investor-documents/pre-issue-advertisement">Pre-Issue Advertisement</Link></li>
                                        <li><Link href="/investor-documents/prospectus">Prospectus</Link></li>
                                        <li><Link href="/investor-documents/gid-general-issue-disclosures">GID (General issue Disclosures)</Link></li>
                                        <li><Link href="/investor-documents/abridged-prospectus">Abridged Prospectus</Link></li>
                                        <li><Link href="/investor-documents/basis-of-allotment-advertisement">Basis Of Allotment Advertisement</Link></li>
                                        <li><Link href="/investor-documents/ipo-application-form">IPO Application Form</Link></li>
                                        <li><Link href="/investor-documents/material-contracts-to-the-issue">Material Contracts To The Issue</Link></li>
                                        <li><Link href="/investor-documents/material-documents">Material Documents</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="docs-column">
                            {/* investor Grievances */}
                            <div className={`doc-item ${activeDoc === 'investor Grievances' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('investor Grievances')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        investor Grievances
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/investor-grievances">View Documents</Link></li></ul></div>
                            </div>

                            {/* Shareholding Patterns */}
                            <div className={`doc-item ${activeDoc === 'Shareholding Patterns' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Shareholding Patterns')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Shareholding Patterns
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/shareholding-patterns">View Documents</Link></li></ul></div>
                            </div>

                            {/* Meetings */}
                            <div className={`doc-item ${activeDoc === 'Meetings' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Meetings')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Meetings
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/meetings">View Documents</Link></li></ul></div>
                            </div>

                            {/* CSR */}
                            <div className={`doc-item ${activeDoc === 'CSR' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('CSR')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        CSR
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/csr">View Documents</Link></li></ul></div>
                            </div>

                            {/* Advice to Shareholders */}
                            <div className={`doc-item ${activeDoc === 'Advice to Shareholders' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Advice to Shareholders')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Advice to Shareholders
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/advice-to-shareholders">View Documents</Link></li></ul></div>
                            </div>

                            {/* Link to ODR */}
                            <div className={`doc-item ${activeDoc === 'Link to ODR' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Link to ODR')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Link to ODR
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/link-to-odr">View Documents</Link></li></ul></div>
                            </div>

                            {/* PR/MEDIA */}
                            <div className={`doc-item ${activeDoc === 'PR/MEDIA' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('PR/MEDIA')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        PR/MEDIA
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/pr-media">View Documents</Link></li></ul></div>
                            </div>

                            {/* ESOP */}
                            <div className={`doc-item ${activeDoc === 'ESOP' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('ESOP')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        ESOP
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/esop">View Documents</Link></li></ul></div>
                            </div>

                            {/* Monitoring Agency Report */}
                            <div className={`doc-item ${activeDoc === 'Monitoring Agency Report' ? 'active' : ''}`}>
                                <div className="doc-header" onClick={() => toggleDoc('Monitoring Agency Report')}>
                                    <div className="doc-title">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                        Monitoring Agency Report
                                    </div>
                                    <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </div>
                                <div className="doc-content"><ul className="doc-list"><li><Link href="/investor-documents/monitoring-agency-report">View Documents</Link></li></ul></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="contact-card">
                        <div className="section-header text-center mb-4">
                            <span className="section-label">INVESTOR RELATIONS</span>
                        </div>
                        <div className="contact-grid">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div className="contact-info">
                                    <span className="contact-label">Email</span>
                                    <a href="mailto:ir@connplex.com" className="contact-value">ir@connplex.com</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div className="contact-info">
                                    <span className="contact-label">Phone</span>
                                    <span className="contact-value">+91 79 4711 7000</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                                        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                                    </svg>
                                </div>
                                <div className="contact-info">
                                    <span className="contact-label">Registered Office</span>
                                    <span className="contact-value">Connplex Cinemas Limited,<br />Krish Cubical, Block C: (1001 to 1008), 10th Floor, Opp. Avalon<br /> Hotel Road, SBR -Sindhu Bhavan Marg, Thaltej, Ahmedabad,Gujarat - 380059</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InvestorRelationsPage;