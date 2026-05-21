"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ logoSrc = '/logo.png' }: { logoSrc?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Advertise', path: '/advertise' },
    { name: 'Apply For Franchise', path: '/franchise' },
    { name: 'Book an Event', path: '/book-event' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full flex items-center justify-between px-[4%] sm:px-[5%] z-[1000] transition-all duration-300 ${isScrolled ? 'bg-black/90 h-[70px] backdrop-blur-md' : 'bg-transparent h-[90px]'}`}>
        <div className="flex items-center">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <div className="relative w-[110px] h-[30px] sm:w-[150px] sm:h-[40px]">
              <Image 
                src={logoSrc} 
                alt="Connplex" 
                fill 
                sizes="(max-width: 640px) 110px, 150px" 
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Hamburger Menu Toggle with 44px minimum tap target */}
          <button 
            className="w-11 h-11 flex items-center justify-center relative z-[1001] bg-transparent text-white focus:outline-none cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-[30px] h-[20px] flex flex-col justify-between">
              <span className={`w-full h-[2px] bg-white transition-all duration-300 origin-center ${isOpen ? 'transform translate-y-[9px] rotate-45' : ''}`}></span>
              <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-[2px] bg-white transition-all duration-300 origin-center ${isOpen ? 'transform -translate-y-[9px] -rotate-45' : ''}`}></span>
            </div>
          </button>

          <a 
            href="https://theconnplex.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`bg-white text-[#050505] font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:scale-[1.02] text-center whitespace-nowrap text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 ${isOpen ? 'hidden' : 'block'}`}
          >
            <span className="hidden sm:inline">Book a Call With Consultant</span>
            <span className="inline sm:hidden">Book a Call</span>
          </a>
        </div>
      </header>

      {/* Navigation Overlay Menu */}
      <div className={`fixed inset-0 w-full h-screen bg-black/95 flex items-center justify-center transition-transform duration-500 cubic-bezier(0.77, 0, 0.175, 1) z-[999] overflow-y-auto py-24 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col items-center justify-center gap-6 sm:gap-[30px] w-full max-w-[90%] mx-auto text-center">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-lg sm:text-[1.8rem] font-semibold tracking-wider uppercase font-outfit transition-colors duration-300 hover:text-primary-gold ${pathname === link.path ? 'text-primary-gold' : 'text-white'}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
