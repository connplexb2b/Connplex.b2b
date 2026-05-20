"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';

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
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo-container">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image src={logoSrc} alt="Connplex" width={150} height={40} style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        <div className="header-action">
          <div className={`burger-menu ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
          </div>
          <a href="https://theconnplex.com/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: isOpen ? 'none' : 'block' }}>Book a Call With Consultant</a>
        </div>
      </header>

      <div className={`menu-overlay ${isOpen ? 'open' : ''}`}>
        <nav className="menu-links">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`menu-link ${pathname === link.path ? 'active' : ''}`}
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
