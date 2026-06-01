"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tv, MapPin, Award, Users, ArrowUpRight } from 'lucide-react';

const GalleryPage = () => {
    return (
        <div className="bg-black text-white font-outfit overflow-x-hidden selection:bg-[#c5a059]/30">
            <Header />

            {/* Hero Section */}
            <section className="gallery-hero relative h-screen w-full flex items-center px-[5%] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/gallery/hero.png"
                        alt="Luxury Cinema Hall"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover', filter: 'brightness(0.4)' }}
                    />
                </div>
                <div className="relative z-10 max-w-[600px] w-full">
                    <h1 className="text-5xl sm:text-7xl lg:text-[5rem] font-bold leading-[1.1] mb-6">
                        <span className="block">THE</span>
                        <span className="block text-[#c5a059]">CONNPLEX</span>
                        <span className="block">GALLERY.</span>
                    </h1>
                    <p className="text-lg text-[#a4a4a4] mb-10 max-w-[450px]">A visual journey through luxury cinematic experiences, architecture, and storytelling.</p>
                    <a href="#gallery" className="group inline-flex items-center gap-2.5 px-8 py-4 border border-[#c5a059] text-white uppercase font-semibold tracking-wider transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] relative overflow-hidden text-sm hover:bg-[#c5a059] hover:text-black w-full sm:w-auto justify-center">
                        <span>Explore Experiences</span>
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="px-[5%] py-[60px] sm:py-[100px] bg-black" id="gallery">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 auto-rows-[300px]">

                    {/* Luxuriance — spans 8 cols, 2 rows */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-8 lg:row-span-2">
                        <Image src="/gallery/luxuriance.png" alt="Luxuriance" fill sizes="(max-width: 1024px) 100vw, 66vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Luxuriance</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Downtown — spans 4 cols, 2 rows */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-2">
                        <Image src="/gallery/downtown.png" alt="Downtown" fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Downtown</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Sky Inn — spans 4 cols, 1 row */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1">
                        <Image src="/gallery/sky_inn.png" alt="Sky Inn" fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Sky Inn</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Signature — spans 4 cols, 1 row */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1">
                        <Image src="/gallery/signature.png" alt="Signature" fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Signature</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Spectra X — spans 4 cols, 1 row */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1">
                        <Image src="/gallery/spectra_x.png" alt="Spectra X" fill sizes="(max-width: 1024px) 100vw, 33vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Spectra X</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Behind the Magic — spans 6 cols */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-6 lg:row-span-1">
                        <Image src="/gallery/behind_magic.png" alt="Behind the Magic" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Behind the Magic</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>

                    {/* Grand Openings — spans 6 cols */}
                    <div className="group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto col-span-1 md:col-span-1 lg:col-span-6 lg:row-span-1">
                        <Image src="/gallery/grand_opening.png" alt="Grand Openings" fill sizes="(max-width: 1024px) 100vw, 50vw" style={{ objectFit: 'cover' }} className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" />
                        <div className="absolute bottom-5 left-5 z-10">
                            <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">Grand Openings</h3>
                            <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                        </div>
                    </div>
                </div>

            </section>

            {/* Stats Section */}
            <section className="px-[5%] py-[60px] sm:py-[80px] flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-around items-center gap-8 sm:gap-y-12 lg:gap-0 border-y border-[#c5a059]/20">
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 sm:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <Tv size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">125+</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Screens</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 lg:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <MapPin size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">42+</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Locations</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 sm:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <Award size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">8+</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Years</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 py-4 sm:py-0">
                    <Users size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">10M</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">of Experiences</span>
                </div>
            </section>

            {/* Visual Experience Section */}
            <section className="px-[5%] py-[60px] sm:py-[100px] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[50px] items-center bg-black">
                <div>
                    <h2 className="text-4xl sm:text-5xl lg:text-[3rem] font-bold leading-[1.1] mb-6">
                        MORE THAN<br />A CINEMA.<br />
                        <span className="text-[#c5a059]">A VISUAL<br />EXPERIENCE.</span>
                    </h2>
                    <div className="w-[60px] h-0.5 bg-[#c5a059]"></div>
                </div>
                <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] overflow-hidden">
                    <Image src="/gallery/wide_experience.png" alt="Visual Experience" fill sizes="(max-width: 1024px) 100vw, 66vw" style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Footer Promo Section */}
            <section className="relative overflow-hidden min-h-[500px] flex items-center px-[5%] py-[60px] sm:py-[100px]">
                <div className="absolute inset-0 z-0">
                    <Image src="/gallery/future_entertainment.png" alt="Future Entertainment" fill sizes="100vw" style={{ objectFit: 'cover', filter: 'brightness(0.3)' }} />
                </div>
                <div className="relative z-10 max-w-[600px] w-full">
                    <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-8">
                        LET&apos;S CREATE<br />THE FUTURE<br />
                        <span className="text-[#c5a059]">OF ENTERTAINMENT.</span>
                    </h2>
                    <Link href="/contact" className="group inline-flex items-center gap-2.5 px-8 py-4 border border-[#c5a059] text-white uppercase font-semibold tracking-wider transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] relative overflow-hidden text-sm hover:bg-[#c5a059] hover:text-black w-full sm:w-auto justify-center">
                        <span>Connect with Connplex</span>
                        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default GalleryPage;
