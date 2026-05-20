'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './ecosystem.css';

interface EcosystemCardProps {
  id: string;
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

const cards: EcosystemCardProps[] = [
  {
    id: 'connflix',
    title: 'CONNFLIX',
    description: 'Stream cinema-grade originals & exclusives.',
    link: '/connflix',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    ),
  },

  {
    id: 'conntube',
    title: 'CONNTUBE',
    description: 'Your space to watch, create & share.',
    link: '/conntube',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
  },
  {
    id: 'purex',
    title: 'PUREX',
    description: 'Breathe different. Advanced air purification for premium spaces.',
    link: '/pure-x',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
      </svg>
    ),
  },
  {
    id: 'spectrax',
    title: 'SPECTRAX',
    description: 'The future of smart screens.',
    link: '/spectra-x',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
  {
    id: 'downtown',
    title: 'DOWNTOWN',
    description: 'Luxury cinemas. Redefined.',
    link: '/downtown',
    icon: <span className="custom-icon">D</span>,
  },
  {
    id: 'skyinn',
    title: 'SKY INN',
    description: 'Drive-in cinema. Under the stars.',
    link: '/sky-inn',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
      </svg>
    ),
  },
  {
    id: 'connplex-studio',
    title: 'CONNPLEX STUDIO',
    description: 'Stories. Crafted to perfection.',
    link: '/connplex-studio',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="15" height="12" rx="2" ry="2"></rect>
        <path d="M22 19l-5-5 5-5v10z"></path>
        <circle cx="9" cy="12" r="3"></circle>
      </svg>
    ),
  },
];

export default function EcosystemPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-init');
    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ecosystem-page">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="container hero-content">
            <p className="subtitle">ONE UNIVERSE. ENDLESS EXPERIENCES.</p>
            <h1>
              <span>CONNPLEX</span> ECOSYSTEM
            </h1>
            <p className="description">
              Explore our interconnected apps and platforms.
              <br />
              Each one crafted to elevate the way you experience entertainment.
            </p>
          </div>
        </section>

        {/* Grid Section */}
        <section className="ecosystem-grid container">
          {cards.map((card) => (
            <Link key={card.id} href={card.link}>
              <div className="ecosystem-card reveal-init" id={card.id}>
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="explore-link">
                  Explore Now <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Banner Section */}
        <section className="banner container">
          <div className="banner-content reveal-init">
            <div className="banner-left">
              <div className="interlocking-rings">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="banner-text">
                <p className="banner-subtitle">CONNECTED BY INNOVATION</p>
                <h2>One ecosystem. Infinite possibilities.</h2>
                <p>Seamless integration. Personalized experiences. All powered by CONNPLEX.</p>
              </div>
            </div>
            <Link href="/about" className="btn-learn-more">
              Learn More About Us <span className="arrow">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
