"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProductsPage = () => {
  const products = [
    {
      name: "Connflix",
      tagline: "Stream cinema-grade originals.",
      href: "/connflix",
      img: "/connflix_hero_mockup.png",
      alt: "Connflix Mockup"
    },
    {
      name: "Conntube",
      tagline: "Your channel. Your audience.",
      href: "/conntube",
      img: "/conntube_hero_mockup.png",
      alt: "Conntube Mockup"
    },
    {
      name: "SpectraX",
      tagline: "Experience beyond the screen.",
      href: "/spectra-x",
      img: "/spectra-x-hero.png",
      alt: "SpectraX Screen"
    },
    {
      name: "DownTown",
      tagline: "Design for modern crowd.",
      href: "/downtown",
      img: "/img/363ae3a1-9296-45b4-8a62-e84d026b07f6.png",
      alt: "DownTown District"
    },
    {
      name: "PureX",
      tagline: "Breathe cinema-grade air.",
      href: "/pure-x",
      img: "/purex_landscape_hero.png",
      alt: "PureX Air Purifier"
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-[#050505] pt-32 pb-24 px-4 sm:px-6 md:px-10 lg:px-20 min-h-screen">
        <section className="max-w-[1600px] mx-auto w-full">
          <div className="text-center mb-16 md:mb-24">
            <span className="block font-outfit text-[11px] md:text-xs font-semibold tracking-[0.2em] text-text-secondary mb-3.5 uppercase">OUR ENTERTAINMENT PRODUCTS</span>
            <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wide text-white">
              The Connplex Cinema <span className="text-[#c19b62] font-normal">Ecosystem</span>
            </h2>
            <div className="w-10 h-[2px] bg-[#c19b62] mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
            {products.map((p) => (
              <div 
                key={p.name}
                className="relative flex flex-col items-center pt-12 px-6 pb-0 min-h-[500px] overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-[#c19b62] rounded-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(193,155,98,0.15)] group"
              >
                <p className="text-2xl font-bold text-white text-center mb-2 font-outfit uppercase group-hover:text-[#c19b62] transition-colors duration-300">{p.name}</p>
                <p className="text-sm text-text-secondary text-center mb-6 min-h-[40px] px-2">{p.tagline}</p>
                <div className="flex items-center gap-5 mb-8">
                  <Link href={p.href}>
                    <button className="bg-white text-black hover:bg-[#c19b62] hover:text-black rounded-full px-6 py-2.5 text-[0.88rem] font-semibold transition-all duration-300 hover:scale-105 cursor-pointer">
                      Explore
                    </button>
                  </Link>
                </div>
                <div className="relative w-full flex-1 min-h-[280px] rounded-t-xl overflow-hidden mt-auto">
                  <Image 
                    src={p.img} 
                    alt={p.alt} 
                    fill 
                    style={{ objectFit: "cover", objectPosition: p.name === "PureX" ? "center" : "top" }} 
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;