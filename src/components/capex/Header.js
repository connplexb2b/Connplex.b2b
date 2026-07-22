'use strict';
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { label: 'WHY CONNPLEX', href: '#why-connplex' },
    { label: 'BENEFITS', href: '#real-estate-benefits' },
    { label: 'CAPEX PARTNERSHIP', href: '#capex-partnership' },
    { label: 'REQUIREMENTS', href: '#property-requirements' },
    { label: 'TRUST FACTORS', href: '#trust' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-[6%] z-[1000] transition-all duration-300 bg-black/90 backdrop-blur-md h-[90px] border-b border-white/5">
        <div className="flex items-center">
          <Link href="/capex-for-developers">
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-extrabold text-[1.4rem] tracking-[3px] text-primary-gold">
                CONNPLEX
              </span>
              <span className="font-outfit font-bold text-[0.65rem] tracking-[8.5px] text-[#D4AF37] mt-0.5 self-start">
                CINEMAS
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-[30px]">
          {navLinks.map((link, idx) => (
            <a 
              key={idx}
              href={link.href}
              className="text-xs font-bold tracking-[1.5px] text-white hover:text-primary-gold transition-colors duration-300 font-outfit"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Button / Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a 
            href="#proposal-form" 
            className="hidden sm:inline-block border border-primary-gold text-primary-gold font-bold uppercase tracking-[1.5px] text-xs px-6 py-3 rounded-none transition-all duration-300 hover:bg-primary-gold hover:text-black font-outfit"
          >
            GET IN TOUCH
          </a>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={toggleMenu}
            className="md:hidden w-10 h-10 flex items-center justify-center relative z-[1001] bg-transparent text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-[24px] h-[16px] flex flex-col justify-between">
              <span className={`w-full h-[2px] bg-white transition-all duration-300 origin-left ${menuOpen ? 'rotate-45 translate-x-[3px] -translate-y-[1px]' : ''}`}></span>
              <span className={`w-full h-[2px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-[2px] bg-white transition-all duration-300 origin-left ${menuOpen ? '-rotate-45 translate-x-[3px] translate-y-[1px]' : ''}`}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-black/95 flex items-start justify-center transition-all duration-500 cubic-bezier(0.77, 0, 0.175, 1) z-[999] overflow-y-auto pt-32 pb-12 ${
          menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <nav className="flex flex-col items-center justify-center gap-8 w-full max-w-[90%] mx-auto text-center">
          {navLinks.map((link, idx) => (
            <a 
              key={idx}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-bold tracking-wider uppercase font-outfit transition-colors duration-300 hover:text-primary-gold text-white"
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#proposal-form" 
            onClick={() => setMenuOpen(false)}
            className="border border-primary-gold text-primary-gold font-bold uppercase tracking-[1.5px] text-sm px-8 py-3.5 rounded-none w-full max-w-[250px] transition-all duration-300 hover:bg-primary-gold hover:text-black mt-4 font-outfit"
          >
            GET IN TOUCH
          </a>
        </nav>
      </div>
    </>
  );
}
