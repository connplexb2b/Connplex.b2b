'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-black py-16 px-6 sm:px-[5%] border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                <div className="col-span-1 sm:col-span-2 lg:col-span-1 max-w-full lg:max-w-[280px]">
                    <div className="mb-6">
                        <Image src="/logo.png" alt="Connplex Cinemas" width={150} height={50} style={{ objectFit: "contain", height: "auto" }} />
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        A premium cinema network for advertising, experiential marketing, and brand events.
                    </p>
                </div>

                <div className="flex flex-col">
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                        <li><Link href="/contact" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Contact Us</Link></li>
                        <li><Link href="/advertise" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Advertise With Us</Link></li>
                        <li><Link href="/franchise-with-us" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Franchise in 20 Minutes</Link></li>
                        <li><Link href="/ecosystem" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Connplex Ecosystem</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                        <li><Link href="/feedback" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Feedback</Link></li>
                        <li><Link href="/capex" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Capex</Link></li>
                        <li><Link href="/news" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">News & Upcoming Promotions</Link></li>
                        <li><Link href="/book-event" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Book an event</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                        <li><Link href="/investors" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white" title="Investors">Investor Section</Link></li>
                        <li><Link href="/privacy-policy" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Privacy Policy</Link></li>
                        <li><Link href="/terms-and-conditions" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Terms & Conditions</Link></li>
                        <li><Link href="/legal-notice" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Legal Notice</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                        <li><Link href="/faq" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">FAQ</Link></li>
                        <li><Link href="/career" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Career</Link></li>
                        <li><Link href="/gallery" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Gallery</Link></li>
                        <li><Link href="/franchise-with-us" className="text-[0.85rem] text-text-secondary transition-colors duration-300 hover:text-white">Franchise Section</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/30 gap-6 sm:gap-0 max-w-7xl mx-auto">
                <p>&copy; {new Date().getFullYear()} Connplex Cinemas. All rights reserved.</p>
                <div className="flex gap-6 sm:gap-8 max-[480px]:flex-col max-[480px]:items-center max-[480px]:gap-3">
                    <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                    <Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
                    <Link href="/refund-policy" className="hover:text-white transition-colors duration-300">Refund Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;