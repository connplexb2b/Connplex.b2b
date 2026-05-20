'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="global-footer-grid">
                <div className="footer-col footer-brand">
                    <div className="logo-box logo-footer">
                        <Image src="/logo.png" alt="Connplex Cinemas" width={150} height={50} style={{ objectFit: "contain" }} />
                    </div>
                    <p className="footer-desc">
                        A premium cinema network for advertising, experiential marketing, and brand events.
                    </p>
                </div>

                <div className="footer-col">

                    <ul className="footer-list">
                        <li><Link href="/investor-section">Inverstors Section</Link></li>
                        <li><Link href="/franchise">Apply For Franchise</Link></li>
                        <li><a href="#">Franchisee Section</a></li>
                        <li><Link href="/capex-for-developers">CAPEX for Developer</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <ul className="footer-list">
                        <li><a href="#">Feedback</a></li>
                        <li><a href="#">News & Upcoming Promotions</a></li>
                        <li><a href="#">20 Minutes Franchise</a></li>
                        <li><Link href="/gallery">Gallery</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <ul className="footer-list">
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/advertise">Advertise With Us</Link></li>
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <ul className="footer-list">
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Career</a></li>
                        <li><Link href="/legal-notice">Legal Notice</Link></li>
                        <li><Link href="/book-event">Book an event</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Connplex Cinemas. All rights reserved.</p>
                <div className="footer-legal">
                    <Link href="/privacy-policy">Privacy Policy</Link>
                    <Link href="/terms-and-conditions">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;