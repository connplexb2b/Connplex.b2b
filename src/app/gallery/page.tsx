"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tv, MapPin, Award, Users, ArrowUpRight } from 'lucide-react';
import { useStats } from '@/hooks/useStats';

const DEFAULT_GALLERY_ITEMS = [
    {
        id: "gallery-default-1",
        title: "Luxuriance",
        imagePath: "/gallery/luxuriance.png",
    },
    {
        id: "gallery-default-2",
        title: "Downtown",
        imagePath: "/gallery/downtown.png",
    },
    {
        id: "gallery-default-3",
        title: "Sky Inn",
        imagePath: "/gallery/sky_inn.png",
    },
    {
        id: "gallery-default-4",
        title: "Signature",
        imagePath: "/gallery/signature.png",
    },
    {
        id: "gallery-default-5",
        title: "Spectra X",
        imagePath: "/gallery/spectra_x.png",
    },
    {
        id: "gallery-default-6",
        title: "Behind the Magic",
        imagePath: "/gallery/behind_magic.png",
    },
    {
        id: "gallery-default-7",
        title: "Grand Openings",
        imagePath: "/gallery/grand_opening.png",
    }
];

const getGridClass = (idx: number) => {
    switch (idx) {
        case 0: return 'col-span-1 md:col-span-1 lg:col-span-8 lg:row-span-2';
        case 1: return 'col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-2';
        case 2: return 'col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1';
        case 3: return 'col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1';
        case 4: return 'col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1';
        case 5: return 'col-span-1 md:col-span-1 lg:col-span-6 lg:row-span-1';
        case 6: return 'col-span-1 md:col-span-1 lg:col-span-6 lg:row-span-1';
        default: return 'col-span-1 md:col-span-1 lg:col-span-4 lg:row-span-1';
    }
};

const getSizes = (idx: number) => {
    switch (idx) {
        case 0: return '(max-width: 1024px) 100vw, 66vw';
        case 1: return '(max-width: 1024px) 100vw, 33vw';
        case 5:
        case 6: return '(max-width: 1024px) 100vw, 50vw';
        default: return '(max-width: 1024px) 100vw, 33vw';
    }
};

const GalleryPage = () => {
    const { stats } = useStats();
    const [galleryItems, setGalleryItems] = useState<any[]>(DEFAULT_GALLERY_ITEMS);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch('/api/admin/gallery');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setGalleryItems(data.filter((item: any) => item.isActive));
                    }
                }
            } catch (err) {
                console.error("Error fetching gallery:", err);
            }
        };
        fetchGallery();
    }, []);

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
                    {galleryItems.map((item, idx) => (
                        <div key={item.id || idx} className={`group relative overflow-hidden cursor-pointer h-[300px] lg:h-auto ${getGridClass(idx)}`}>
                            <Image 
                                src={item.imagePath} 
                                alt={item.title || 'Gallery Image'} 
                                fill 
                                sizes={getSizes(idx)} 
                                style={{ objectFit: 'cover' }} 
                                className="transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105 group-hover:brightness-[0.6]" 
                            />
                            <div className="absolute bottom-5 left-5 z-10">
                                <h3 className="text-lg text-white tracking-widest uppercase mb-1.5">{item.title}</h3>
                                <div className="w-10 h-0.5 bg-[#c5a059]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-[5%] py-[60px] sm:py-[80px] flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-around items-center gap-8 sm:gap-y-12 lg:gap-0 border-y border-[#c5a059]/20">
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 sm:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <Tv size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">{stats.galleryPage.screens}</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Screens</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 lg:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <MapPin size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">{stats.galleryPage.locations}</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Locations</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 border-b sm:border-b-0 sm:border-r border-[#c5a059]/20 last:border-0 py-4 sm:py-0">
                    <Award size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">{stats.galleryPage.years}</span>
                    <span className="text-xs uppercase tracking-widest text-[#c5a059]">Years</span>
                </div>
                <div className="text-center px-10 relative w-full sm:w-1/2 lg:w-1/4 py-4 sm:py-0">
                    <Users size={28} className="text-[#c5a059] mx-auto mb-2.5" />
                    <span className="text-4xl font-bold text-white block">{stats.galleryPage.experiences}</span>
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
