'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './investor.css';

interface InvestorPDF {
  originalname: string;
  fileName: string;
  _id: string;
  mimeType?: string;
  size?: number;
}

interface InvestorCategoryChild {
  _id: string;
  title: string;
  type: string;
  parent: string;
  investorsPdfs?: InvestorPDF[];
  content?: string;
}

interface InvestorCategory {
  parent: string;
  title?: string;
  children?: InvestorCategoryChild[];
}

interface InvestorPageData {
  title: string;
  subTitle: string;
  investorHeading: string;
  investorSubHeading: string;
  email_one: string;
  email_two: string;
  email_three: string;
}

const BASE_API_URL = 'https://webadmin.theconnplex.com/api';
const FILE_URL = 'https://webadmin.theconnplex.com/api/file';

export default function InvestorRelationsPage() {
  const [categories, setCategories] = useState<InvestorCategory[]>([]);
  const [pageData, setPageData] = useState<InvestorPageData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeDetails, setActiveDetails] = useState<InvestorCategoryChild | null>(null);
  const [openParent, setOpenParent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch initial layout settings and categories list
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch hero subtitle, grienvances titles and email configurations
        const titleRes = await fetch(`${BASE_API_URL}/user/investor-title`);
        const titleJSON = await titleRes.json();
        if (titleJSON && titleJSON.status === 200) {
          setPageData(titleJSON.data);
        }

        // Fetch accordion list
        const categoriesRes = await fetch(`${BASE_API_URL}/user/get-all-investors-by-user`);
        const categoriesJSON = await categoriesRes.json();
        if (categoriesJSON && categoriesJSON.status === 200) {
          setCategories(categoriesJSON.data);
          
          // Auto-select first item
          const firstCat = categoriesJSON.data[0];
          if (firstCat) {
            if (firstCat.parent && firstCat.children && firstCat.children.length > 0) {
              setOpenParent(firstCat.parent);
              const firstChild = firstCat.children[0];
              if (firstChild) {
                setActiveCategory(firstChild.title);
              }
            } else if (firstCat.title) {
              setActiveCategory(firstCat.title);
            }
          }
        }
      } catch (err) {
        console.error('Error loading live investor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch category documents list whenever activeCategory changes
  useEffect(() => {
    if (!activeCategory) return;

    const fetchCategoryDetails = async () => {
      try {
        setDetailsLoading(true);
        const res = await fetch(`${BASE_API_URL}/user/get-single-investor-by-user?title=${encodeURIComponent(activeCategory)}`);
        const json = await res.json();
        let data = (json && json.status === 200) ? json.data : null;

        const isOtherAnnouncement = 
          activeCategory.toLowerCase() === 'other announcements' || 
          activeCategory.toLowerCase() === 'other announcement' ||
          activeCategory.toLowerCase() === 'other annoucment';
        
        if (isOtherAnnouncement) {
          if (!data) {
            data = {
              _id: '4887120f-272d-4780-852b-9620e1f4e1ef',
              title: activeCategory,
              type: 'pdf',
              parent: 'Announcements',
              investorsPdfs: []
            };
          }
          if (!data.investorsPdfs) {
            data.investorsPdfs = [];
          }
          
          // Check if 30.06.2026 already exists
          const exists30 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 30.06.2026.pdf'
          );
          if (!exists30) {
            data.investorsPdfs.unshift({
              _id: 'da37e2c9-95e2-411a-8fcd-a9b0e12d45c6',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 30.06.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/c0326e08-9df2-421e-a4b5-12cfcf5b2c9a.pdf',
              mimeType: 'application/pdf',
              size: 555811
            });
          }

          // Check if 01.07.2026 already exists (should be at the very top, so unshift last)
          const exists01 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 01.07.2026.pdf'
          );
          if (!exists01) {
            data.investorsPdfs.unshift({
              _id: 'e2c03d04-1b79-4cfc-b179-c8c362089df2',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 01.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/e2c03d04-1b79-4cfc-b179-c8c362089df2.pdf',
              mimeType: 'application/pdf',
              size: 602926
            });
          }

          // Check if 04.07.2026 already exists (should be at the very top, so unshift last)
          const exists04 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 04.07.2026.pdf'
          );
          if (!exists04) {
            data.investorsPdfs.unshift({
              _id: '8f9fc3db-2548-4fc2-ab6a-a0a20540ff62',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 04.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/0181d7f9-7af7-45d3-b53d-0ebcadf11fc3.pdf',
              mimeType: 'application/pdf',
              size: 1288332
            });
          }

          // Check if 11.07.2026 already exists (should be at the very top, so unshift last)
          const exists11 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 11.07.2026.pdf'
          );
          if (!exists11) {
            data.investorsPdfs.unshift({
              _id: '6dda9d3f-52ed-42e5-8650-e161c00b38db',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 11.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/66d9e3bc-6241-4968-8c20-250f9f3e4e14.pdf',
              mimeType: 'application/pdf',
              size: 1645
            });
          }

          // Check if 21.07.2026 already exists (should be at the very top, so unshift last)
          const exists21 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 21.07.2026.pdf'
          );
          if (!exists21) {
            data.investorsPdfs.unshift({
              _id: 'f7d8c0b5-7af7-45d3-b53d-0ebcadf11fc3',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 21.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/f7d8c0b5-7af7-45d3-b53d-0ebcadf11fc3.pdf',
              mimeType: 'application/pdf',
              size: 1469538
            });
          }

          // Check if 29.07.2026 already exists (should be at the very top, so unshift last)
          const exists29 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 29.07.2026.pdf'
          );
          if (!exists29) {
            data.investorsPdfs.unshift({
              _id: 'b8a92b23-3a1d-4001-8b43-982ee33df716',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 29.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/b8a92b23-3a1d-4001-8b43-982ee33df716.pdf',
              mimeType: 'application/pdf',
              size: 1645
            });
          }

          // Check if 31.07.2026 already exists (should be at the very top, so unshift last)
          const exists31 = data.investorsPdfs.some(
            (f: any) => f.originalname === 'Intimation under Regulation 30 of SEBI(LODR) - 31.07.2026.pdf'
          );
          if (!exists31) {
            data.investorsPdfs.unshift({
              _id: 'a3b92b23-3a1d-4001-8b43-982ee33df718',
              originalname: 'Intimation under Regulation 30 of SEBI(LODR) - 31.07.2026.pdf',
              fileName: '/uploads/investors/4887120f-272d-4780-852b-9620e1f4e1ef/a3b92b23-3a1d-4001-8b43-982ee33df718.pdf',
              mimeType: 'application/pdf',
              size: 1624
            });
          }
        }

        // Fetch local database details to merge uploads
        try {
          const localRes = await fetch('/api/investors');
          if (localRes.ok) {
            const localData = await localRes.json();
            const localMatching = localData.find(
              (inv: any) =>
                inv.title.toLowerCase().trim() === activeCategory.toLowerCase().trim() ||
                (activeCategory.toLowerCase() === 'other announcements' && inv.title.toLowerCase() === 'other annoucment') ||
                (activeCategory.toLowerCase() === 'other announcement' && inv.title.toLowerCase() === 'other annoucment') ||
                (activeCategory.toLowerCase() === 'other annoucment' && inv.title.toLowerCase() === 'other annoucment')
            );
            
            if (localMatching && localMatching.files && localMatching.files.length > 0) {
              if (!data) {
                data = {
                  _id: localMatching.id,
                  title: activeCategory,
                  type: localMatching.type,
                  parent: localMatching.parent,
                  investorsPdfs: []
                };
              }
              if (!data.investorsPdfs) {
                data.investorsPdfs = [];
              }
              
              localMatching.files.forEach((f: any) => {
                const exists = data.investorsPdfs.some(
                  (existing: any) =>
                    existing._id === f.id ||
                    existing.originalname === f.originalName ||
                    existing.fileName === f.url
                );
                if (!exists) {
                  data.investorsPdfs.push({
                    _id: f.id,
                    originalname: f.originalName,
                    fileName: f.url,
                    mimeType: f.mimeType,
                    size: f.size
                  });
                }
              });
            }
          }
        } catch (localErr) {
          console.error('Error fetching local investors:', localErr);
        }

        if (data && data.investorsPdfs && data.investorsPdfs.length > 0) {
          // Parse date from originalname (format like DD.MM.YYYY or DD-MM-YYYY)
          const parseDate = (name: string): Date => {
            if (!name) return new Date(0);
            const match = name.match(/(\d{2})[.-](\d{2})[.-](\d{4})/);
            if (match) {
              const day = parseInt(match[1], 10);
              const month = parseInt(match[2], 10);
              const year = parseInt(match[3], 10);
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month - 1, day);
              }
            }
            return new Date(0);
          };

          // Sort PDFs in chronological order (newest first, e.g. 2026, 2025)
          data.investorsPdfs.sort((a: any, b: any) => {
            const dateA = parseDate(a.originalname || '').getTime();
            const dateB = parseDate(b.originalname || '').getTime();
            if (dateB !== dateA) {
              return dateB - dateA;
            }
            return (a.originalname || '').localeCompare(b.originalname || '');
          });
        }

        setActiveDetails(data);
      } catch (err) {
        console.error('Error loading category details:', err);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [activeCategory]);

  const toggleParent = (parentName: string) => {
    setOpenParent(prev => prev === parentName ? null : parentName);
  };

  const selectCategory = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
  };

  // Navigates and opens a specific category from the hero button triggers
  const handleScrollToCategory = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
    
    // Find parent group (e.g. Announcements, Policies) containing this child to expand accordion
    const parentCat = categories.find(cat => 
      cat.children && cat.children.some(child => child.title === categoryTitle)
    );
    if (parentCat) {
      setOpenParent(parentCat.parent);
    } else {
      setOpenParent(null);
    }

    // Scroll to documents accordion container
    const element = document.getElementById('investor-docs-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="investor-page bg-black min-h-screen text-white font-sans">
      <Header />

      {/* Hero Image Banner (aligned to the left matching the live site) */}
      <section className="relative min-h-[85vh] flex items-center justify-start overflow-hidden bg-black pt-[80px]" style={{
        backgroundImage: "url('/img/contact/hero_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Deep linear gradient overlay from the left to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-1"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-1"></div>
        
        <div className="container mx-auto px-6 sm:px-[5%] relative z-10 text-left max-w-6xl w-full flex flex-col items-start">
          <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.15] mb-6 tracking-tight font-sans text-white max-w-3xl uppercase">
            Building India's<br />
            Most <span className="text-[#fac400]">Premium</span><br />
            Cinema Network.
          </h1>
          
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mb-10 leading-relaxed font-sans font-light">
            Connplex Cinemas Limited is committed to delivering world-class cinematic experiences through innovation, operational excellence and a scalable franchise model.
          </p>
          
          {/* Functional Banner CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center w-full">
            <a 
              href="https://webadmin.theconnplex.com/api/file//1778582332703-877641406.pdf?_gl=1*mcahn2*_ga*MTgwOTQ1NjYwMi4xNzgxNzg0Mzg2*_ga_GH3360Q98K*czE3ODE3ODQzODUkbzEkZzEkdDE3ODE3ODQ0MjQkajIxJGwwJGg1MDE5MTQwMjE." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#fac400] hover:bg-[#e0b400] text-black font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:shadow-[0_5px_15px_rgba(250,196,0,0.3)] hover:-translate-y-0.5"
              title="Download Investor Presentation PDF"
            >
              Investor Presentation
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            
            <button 
              onClick={() => handleScrollToCategory('Annual Report')}
              className="bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/10 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            >
              Annual Reports
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>
            
            <button 
              onClick={() => handleScrollToCategory('Financial Results')}
              className="bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/10 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            >
              Financial Filings
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>
            
            <Link 
              href="/contact" 
              className="bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/10 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Accordion Document Section */}
      <section id="investor-docs-section" className="investor-sec py-16 bg-[#161619] scroll-mt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="text-center py-20 text-[#d4af37] font-semibold text-lg">Loading investor portal...</div>
          ) : (
            <div className="inevestor-flex flex flex-col md:flex-row gap-6">
              
              {/* Left Accordion Column */}
              <div className="inevestor-left-main w-full md:w-[30%] bg-[#23211e] rounded-xl overflow-hidden border border-white/5">
                <div className="inevestor-list-main w-full">
                  <ul className="acc-main-ul">
                    {categories.map((p, g) => {
                      const isGroup = p.parent && p.children && p.children.length > 0;
                      if (isGroup) {
                        const isOpen = openParent === p.parent;
                        return (
                          <li key={`group-${g}`} className="investor-accordion-item border-b border-white/5">
                            <div
                              className={`investor-accordion-header ${isOpen ? 'open' : ''}`}
                              onClick={() => toggleParent(p.parent)}
                            >
                              <span>{p.parent}</span>
                              <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                            <div className={`investor-accordion-body ${isOpen ? 'show' : ''}`}>
                              <ul>
                                {p.children!.map((y, b) => (
                                  <li key={b}>
                                    <a
                                      onClick={() => selectCategory(y.title)}
                                      className={activeCategory === y.title ? 'active' : ''}
                                    >
                                      {y.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        );
                      } else {
                        const displayName = p.parent || p.title || '';
                        return (
                          <li key={`single-${g}`} className="border-b border-white/5">
                            <a
                              onClick={() => selectCategory(p.title || '')}
                              className={activeCategory === p.title ? 'active' : ''}
                            >
                              {displayName}
                            </a>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>

              {/* Right Details Column */}
              <div className="inevestor-right-main w-full md:w-[70%] bg-[#23211e] rounded-xl p-8 border border-white/5 min-h-[420px]">
                {detailsLoading ? (
                  <div className="text-center py-20 text-[#d4af37]">Loading details...</div>
                ) : activeDetails ? (
                  <div>
                    <h3 className="inestor-page-title text-xl text-[#eab308] font-bold mb-6">
                      {activeDetails.title}
                    </h3>
                    
                    {/* Render HTML content if it exists */}
                    {activeDetails.content && (
                      <div
                        className="investor-html-content text-gray-200 mb-6"
                        dangerouslySetInnerHTML={{ __html: activeDetails.content }}
                      />
                    )}
                    
                    {/* Render PDF/Audio files if they exist */}
                    {activeDetails.investorsPdfs && activeDetails.investorsPdfs.length > 0 && (
                      <div className="investor-pdf-list">
                        <div className="investor-card-main-flex flex flex-col gap-4">
                          {activeDetails.investorsPdfs.map((file, idx) => {
                            const isAudio = file.fileName.endsWith('.mp3') || file.fileName.endsWith('.wav');
                            const displayName = file.originalname.replace(/\.pdf$/i, '').replace(/\.mp3$/i, '');
                            return (
                              <a
                                key={idx}
                                className="investor-card flex justify-between items-center p-5 bg-[#1a1816] hover:bg-[#131110] border border-white/5 rounded-lg transition-all duration-300"
                                target="_blank"
                                href={file.fileName.startsWith('/') || file.fileName.startsWith('http') ? file.fileName : `${FILE_URL}//${file.fileName}?_gl=1*mcahn2*_ga*MTgwOTQ1NjYwMi4xNzgxNzg0Mzg2*_ga_GH3360Q98K*czE3ODE3ODQzODUkbzEkZzEkdDE3ODE3ODQ0MjQkajIxJGwwJGg1MDE5MTQwMjE.`}
                                rel="noopener noreferrer"
                                title={`Download ${displayName} ${isAudio ? 'Audio' : 'PDF'}`}
                              >
                                <div className="investor-content-flex flex justify-between items-center w-full">
                                  <div className="flex items-center gap-3">
                                    {isAudio ? (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                        <path d="M9 18V5l12-2v13" />
                                        <circle cx="6" cy="18" r="3" />
                                        <circle cx="18" cy="16" r="3" />
                                      </svg>
                                    ) : (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                      </svg>
                                    )}
                                    <p className="investor-card-title text-sm font-semibold uppercase tracking-wider text-white">
                                      {displayName}
                                    </p>
                                  </div>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" className="investor-card-icon">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fallback if neither content nor PDFs exist */}
                    {!activeDetails.content && (!activeDetails.investorsPdfs || activeDetails.investorsPdfs.length === 0) && (
                      <p className="text-gray-400">No content available.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-20">Select a section from the left navigation panel.</p>
                )}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Investor Grievances/Emails Strip at the bottom */}
      <section className="investors-section py-20 bg-[#161619] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="investors-title text-2xl font-bold text-[#fac400] mb-3 uppercase tracking-wider">
            {pageData?.investorHeading || 'Investor Grievances'}
          </h2>
          <p className="investors-description text-gray-300 text-sm mb-10">
            {pageData?.investorSubHeading || 'For any investor complaints/grievances, kindly mail us on:'}
          </p>
          <div className="investors-email-list-flex grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Email 1 */}
            <div className="investors-email-box flex items-center gap-4 bg-[#23211e] p-6 rounded-xl border border-white/5">
              <div className="investors-email-icon-box flex items-center justify-center h-12 w-12 rounded-full bg-[#fac400] text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs text-[#fac400] font-bold uppercase tracking-wider">Registrar Support</span>
                <a href={`mailto:${pageData?.email_one || 'connplex.smeipo@linkintime.co.in'}`} className="investors-email hover:text-[#fac400] transition-colors text-sm font-semibold break-all text-white">
                  {pageData?.email_one || 'connplex.smeipo@linkintime.co.in'}
                </a>
              </div>
            </div>

            {/* Email 2 */}
            <div className="investors-email-box flex items-center gap-4 bg-[#23211e] p-6 rounded-xl border border-white/5">
              <div className="investors-email-icon-box flex items-center justify-center h-12 w-12 rounded-full bg-[#fac400] text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs text-[#fac400] font-bold uppercase tracking-wider">Investor Support</span>
                <a href={`mailto:${pageData?.email_two || 'investor@connplex.com'}`} className="investors-email hover:text-[#fac400] transition-colors text-sm font-semibold break-all text-white">
                  {pageData?.email_two || 'investor@connplex.com'}
                </a>
              </div>
            </div>

            {/* Email 3 */}
            <div className="investors-email-box flex items-center gap-4 bg-[#23211e] p-6 rounded-xl border border-white/5">
              <div className="investors-email-icon-box flex items-center justify-center h-12 w-12 rounded-full bg-[#fac400] text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs text-[#fac400] font-bold uppercase tracking-wider">Grievances Email</span>
                <a href={`mailto:${pageData?.email_three || 'grievance@theconnplex.com'}`} className="investors-email hover:text-[#fac400] transition-colors text-sm font-semibold break-all text-white">
                  {pageData?.email_three || 'grievance@theconnplex.com'}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}