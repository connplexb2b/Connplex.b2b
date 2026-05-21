"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductsPage = () => {
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const productsGridRef = useRef<HTMLDivElement>(null);

  const handleProductsScroll = () => {
    if (productsGridRef.current) {
      const scrollLeft = productsGridRef.current.scrollLeft;
      const width = productsGridRef.current.clientWidth;
      if (width > 0) {
        const index = Math.round(scrollLeft / width);
        setActiveProductIdx(index);
      }
    }
  };

  const scrollToProduct = (idx: number) => {
    if (productsGridRef.current) {
      const width = productsGridRef.current.clientWidth;
      productsGridRef.current.scrollTo({
        left: idx * width,
        behavior: "smooth"
      });
      setActiveProductIdx(idx);
    }
  };

  return (
    <>
      <Header />
      <main style={{ backgroundColor: '#050505', paddingTop: '120px' }}>
        <section className="products-section">
          <div className="products-header" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
            <h2 className="products-title">
              The Connplex Cinema <span className="products-title-muted">Ecosystem</span>
            </h2>
          </div>

          <div 
            className="products-grid"
            ref={productsGridRef}
            onScroll={handleProductsScroll}
          >
            <div className="product-card product-card-dark">
              <p className="product-name">Connflix</p>
              <p className="product-tagline">Stream cinema-grade originals.</p>
              <div className="product-actions">
                <Link href="/connflix">
                  <button className="product-btn-circle">Explore</button>
                </Link>
              </div>
              <div className="product-image-wrap">
                <Image src="/connflix_hero_mockup.png" alt="Connflix" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            </div>

            <div className="product-card product-card-dark">
              <p className="product-name">Conntube</p>
              <p className="product-tagline">Your channel. Your audience.</p>
              <div className="product-actions">
                <Link href="/conntube">
                  <button className="product-btn-circle">Explore</button>
                </Link>
              </div>
              <div className="product-image-wrap">
                <Image src="/conntube_hero_mockup.png" alt="Conntube" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            </div>

            <div className="product-card product-card-dark">
              <p className="product-name">SpectraX</p>
              <p className="product-tagline">Experience beyond the screen.</p>
              <div className="product-actions">
                <Link href="/spectra-x">
                  <button className="product-btn-circle">Explore</button>
                </Link>
              </div>
              <div className="product-image-wrap">
                <Image src="/spectra-x-hero.png" alt="SpectraX" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            </div>

            <div className="product-card product-card-dark">
              <p className="product-name">DownTown</p>
              <p className="product-tagline">Design for modern crowd.</p>
              <div className="product-actions">
                <Link href="/downtown">
                  <button className="product-btn-circle">Explore</button>
                </Link>
              </div>
              <div className="product-image-wrap">
                <Image src="/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png" alt="DownTown" fill style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            </div>

            <div className="product-card product-card-dark">
              <p className="product-name">PureX</p>
              <p className="product-tagline">Breathe cinema-grade air.</p>
              <div className="product-actions">
                <Link href="/pure-x">
                  <button className="product-btn-circle">Explore</button>
                </Link>
              </div>
              <div className="product-image-wrap">
                <Image src="/purex_landscape_hero.png" alt="PureX Air Purifier" fill style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
            </div>
          </div>

          <div className="products-nav">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                className={`products-dot ${idx === activeProductIdx ? 'products-dot-active' : ''}`}
                onClick={() => scrollToProduct(idx)}
                aria-label={`Go to product ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;