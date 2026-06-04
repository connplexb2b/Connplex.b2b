import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { readInvestors } from '@/lib/admin-investors';
import { formatDate, formatFileSize } from '@/lib/media-utils';
import Link from 'next/link';

export default async function InvestorDocumentsPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const yearFilter = resolvedSearchParams?.year as string | undefined;
    const investors = await readInvestors();

    // Find all investors matching the slug
    const matchingInvestors = investors.filter(
        inv => inv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );

    // Collect all files from these investors
    let allFiles = matchingInvestors.flatMap(inv =>
        inv.files.map(f => ({
            ...f,
            investorTitle: inv.title,
            updatedAt: inv.updatedAt
        }))
    );

    // Sort files by latest first
    allFiles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Apply year filter
    if (yearFilter) {
        allFiles = allFiles.filter(f => new Date(f.updatedAt).getFullYear().toString() === yearFilter);
    }

    const pageTitle = yearFilter ? `${matchingInvestors[0]?.title || slug} (${yearFilter})` : (matchingInvestors.length > 0 ? matchingInvestors[0].title : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

    return (
        <div className="investor-page">
            <Header />
            <section className="section-padding" style={{ minHeight: '60vh', marginTop: '80px', background: '#0a0a0a' }}>
                <div className="container">
                    <div style={{ marginBottom: '2rem' }}>
                        <Link href="/investors" style={{ color: '#d4af37', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'all 0.2s' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Back
                        </Link>
                    </div>
                    <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
                        <h1 style={{ color: '#d4af37', fontSize: '2.5rem', fontWeight: 700 }}>{pageTitle}</h1>
                        <p style={{ color: '#888', marginTop: '1rem' }}>Documents & Files</p>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link href={`/investor-documents/${slug}`} style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid #d4af37', color: !yearFilter ? '#000' : '#d4af37', textDecoration: 'none', fontWeight: 500, background: !yearFilter ? '#d4af37' : 'transparent' }}>All</Link>
                            <Link href={`/investor-documents/${slug}?year=2024`} style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid #d4af37', color: yearFilter === '2024' ? '#000' : '#d4af37', textDecoration: 'none', fontWeight: 500, background: yearFilter === '2024' ? '#d4af37' : 'transparent' }}>2024</Link>
                            <Link href={`/investor-documents/${slug}?year=2025`} style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid #d4af37', color: yearFilter === '2025' ? '#000' : '#d4af37', textDecoration: 'none', fontWeight: 500, background: yearFilter === '2025' ? '#d4af37' : 'transparent' }}>2025</Link>
                            <Link href={`/investor-documents/${slug}?year=2026`} style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid #d4af37', color: yearFilter === '2026' ? '#000' : '#d4af37', textDecoration: 'none', fontWeight: 500, background: yearFilter === '2026' ? '#d4af37' : 'transparent' }}>2026</Link>
                        </div>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111', borderRadius: '12px', padding: '2rem', border: '1px solid #333' }}>
                        {allFiles.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {allFiles.map(file => (
                                    <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #222' }}>
                                        <div>
                                            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                                {file.originalName}
                                            </h3>
                                            <div style={{ color: '#888', fontSize: '0.85rem', display: 'flex', gap: '1.5rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    {formatDate(file.updatedAt)}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#d4af37', color: '#000', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, textDecoration: 'none' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                                <p>No documents uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
