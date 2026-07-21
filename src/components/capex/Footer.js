'use strict';
'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 px-6 sm:px-[6%] border-t border-white/5 font-montserrat">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col leading-none">
            <span className="font-outfit font-extrabold text-[1.4rem] tracking-[3px] text-primary-gold">
              CONNPLEX
            </span>
            <span className="font-outfit font-bold text-[0.65rem] tracking-[8.5px] text-[#D4AF37] mt-0.5 self-start">
              CINEMAS
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mt-2">
            Building India's most innovative and premium cinema network through partnerships and world-class infrastructure solutions.
          </p>
        </div>

        {/* Column 2: CAPEX PARTNERSHIP */}
        <div className="flex flex-col">
          <h4 className="text-primary-gold font-bold text-xs uppercase tracking-[2px] mb-4 font-outfit">CAPEX PARTNERSHIP</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            <li>
              <a href="#why-connplex" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Why Connplex
              </a>
            </li>
            <li>
              <a href="#real-estate-benefits" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Real Estate Benefits
              </a>
            </li>
            <li>
              <a href="#capex-partnership" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Partnership Model
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: PARTNERS */}
        <div className="flex flex-col">
          <h4 className="text-primary-gold font-bold text-xs uppercase tracking-[2px] mb-4 font-outfit">PARTNERS</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            <li>
              <a href="#property-requirements" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Property Requirements
              </a>
            </li>
            <li>
              <a href="#trust" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Trust Factors
              </a>
            </li>
            <li>
              <a href="#proposal-form" className="text-xs text-text-secondary transition-colors duration-300 hover:text-white">
                Free Assessment
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: CONNECT */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-primary-gold font-bold text-xs uppercase tracking-[2px] mb-1 font-outfit">CONNECT</h4>
          <div className="flex items-center gap-2.5 text-xs text-text-secondary">
            <i className="fa-regular fa-envelope text-primary-gold w-4"></i>
            <a href="mailto:info@connplex.com" className="hover:text-white transition-colors">info@connplex.com</a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-text-secondary">
            <i className="fa-solid fa-phone text-primary-gold w-4"></i>
            <a href="tel:+919579542010" className="hover:text-white transition-colors">+91 95795 42010</a>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary-gold hover:text-white transition-colors">
              <i className="fa-brands fa-linkedin-in text-base"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary-gold hover:text-white transition-colors">
              <i className="fa-brands fa-instagram text-base"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-primary-gold hover:text-white transition-colors">
              <i className="fa-brands fa-youtube text-base"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/30 gap-4 max-w-7xl mx-auto font-outfit tracking-wider">
        <p>© {currentYear} Connplex Cinemas. All Rights Reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors duration-300">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
