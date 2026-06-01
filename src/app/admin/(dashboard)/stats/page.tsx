'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_STATS, type WebsiteStats } from '@/hooks/useStats';

export default function AdminStatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<WebsiteStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleChange = (
    page: keyof WebsiteStats,
    field: string,
    value: string
  ) => {
    setStats((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });

      if (!res.ok) {
        throw new Error('Failed to save stats. Invalid session or connection issue.');
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving stats.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-empty">Loading stats database…</div>;
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Website Stats Control Panel</h1>
        <p style={{ color: 'var(--admin-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
          Update statistics across 7 different pages in a single click.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', paddingBottom: '2.5rem' }}>
        {error && <div className="admin-error" style={{ padding: '1rem', borderRadius: '4px' }}>{error}</div>}
        {success && (
          <div className="admin-success" style={{ padding: '1rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', fontWeight: 'semibold' }}>
            🎉 Website statistics successfully updated across all pages!
          </div>
        )}

        {/* 1. HOMEPAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏠</span> Homepage Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Annual Footfall</label>
              <input
                type="text"
                className="admin-input"
                value={stats.homepage.annualFootfall}
                onChange={(e) => handleChange('homepage', 'annualFootfall', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Premium Screens</label>
              <input
                type="text"
                className="admin-input"
                value={stats.homepage.premiumScreens}
                onChange={(e) => handleChange('homepage', 'premiumScreens', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cities Covered</label>
              <input
                type="text"
                className="admin-input"
                value={stats.homepage.citiesCovered}
                onChange={(e) => handleChange('homepage', 'citiesCovered', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Experiences Delivered</label>
              <input
                type="text"
                className="admin-input"
                value={stats.homepage.experiencesDelivered}
                onChange={(e) => handleChange('homepage', 'experiencesDelivered', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 2. ABOUT PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>ℹ️</span> About Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Screens Operational</label>
              <input
                type="text"
                className="admin-input"
                value={stats.aboutPage.screens}
                onChange={(e) => handleChange('aboutPage', 'screens', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Franchise Locations</label>
              <input
                type="text"
                className="admin-input"
                value={stats.aboutPage.franchiseLocations}
                onChange={(e) => handleChange('aboutPage', 'franchiseLocations', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Years of Excellence</label>
              <input
                type="text"
                className="admin-input"
                value={stats.aboutPage.yearsOfExcellence}
                onChange={(e) => handleChange('aboutPage', 'yearsOfExcellence', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Vision Value</label>
              <input
                type="text"
                className="admin-input"
                value={stats.aboutPage.vision}
                onChange={(e) => handleChange('aboutPage', 'vision', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Happy Moviegoers</label>
              <input
                type="text"
                className="admin-input"
                value={stats.aboutPage.happyMoviegoers}
                onChange={(e) => handleChange('aboutPage', 'happyMoviegoers', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 3. ADVERTISE PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📺</span> Advertise Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Age Range (18-45)</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.ageRange}
                onChange={(e) => handleChange('advertisePage', 'ageRange', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Premium Income</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.premiumIncome}
                onChange={(e) => handleChange('advertisePage', 'premiumIncome', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Frequent Moviegoers</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.frequentMoviegoers}
                onChange={(e) => handleChange('advertisePage', 'frequentMoviegoers', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Engagement Rate</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.engagementRate}
                onChange={(e) => handleChange('advertisePage', 'engagementRate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cities</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.cities}
                onChange={(e) => handleChange('advertisePage', 'cities', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Screens</label>
              <input
                type="text"
                className="admin-input"
                value={stats.advertisePage.screens}
                onChange={(e) => handleChange('advertisePage', 'screens', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 4. FRANCHISE PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span> Franchise Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cinemas Nationwide</label>
              <input
                type="text"
                className="admin-input"
                value={stats.franchisePage.cinemasNationwide}
                onChange={(e) => handleChange('franchisePage', 'cinemasNationwide', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Happy Moviegoers</label>
              <input
                type="text"
                className="admin-input"
                value={stats.franchisePage.happyMoviegoers}
                onChange={(e) => handleChange('franchisePage', 'happyMoviegoers', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cities Covered</label>
              <input
                type="text"
                className="admin-input"
                value={stats.franchisePage.citiesCovered}
                onChange={(e) => handleChange('franchisePage', 'citiesCovered', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Partner Satisfaction</label>
              <input
                type="text"
                className="admin-input"
                value={stats.franchisePage.partnerSatisfaction}
                onChange={(e) => handleChange('franchisePage', 'partnerSatisfaction', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 5. BOOK EVENT PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span> Book Event Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Iconic Venues</label>
              <input
                type="text"
                className="admin-input"
                value={stats.bookEventPage.iconicVenues}
                onChange={(e) => handleChange('bookEventPage', 'iconicVenues', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Premium Spaces</label>
              <input
                type="text"
                className="admin-input"
                value={stats.bookEventPage.premiumSpaces}
                onChange={(e) => handleChange('bookEventPage', 'premiumSpaces', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Unlimited Possibilities</label>
              <input
                type="text"
                className="admin-input"
                value={stats.bookEventPage.possibilities}
                onChange={(e) => handleChange('bookEventPage', 'possibilities', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 6. CASE STUDIES PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span> Case Studies Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Smart Cinemas Delivered</label>
              <input
                type="text"
                className="admin-input"
                value={stats.caseStudiesPage.smartCinemas}
                onChange={(e) => handleChange('caseStudiesPage', 'smartCinemas', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Screens Deployed</label>
              <input
                type="text"
                className="admin-input"
                value={stats.caseStudiesPage.screensDeployed}
                onChange={(e) => handleChange('caseStudiesPage', 'screensDeployed', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Guests Impressed</label>
              <input
                type="text"
                className="admin-input"
                value={stats.caseStudiesPage.guestsImpressed}
                onChange={(e) => handleChange('caseStudiesPage', 'guestsImpressed', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cities Across India</label>
              <input
                type="text"
                className="admin-input"
                value={stats.caseStudiesPage.citiesAcrossIndia}
                onChange={(e) => handleChange('caseStudiesPage', 'citiesAcrossIndia', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Years of Cinematic Excellence</label>
              <input
                type="text"
                className="admin-input"
                value={stats.caseStudiesPage.yearsOfExcellence}
                onChange={(e) => handleChange('caseStudiesPage', 'yearsOfExcellence', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 7. GALLERY PAGE SECTION */}
        <div className="admin-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--admin-gold)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🖼️</span> Gallery Page Stats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Screens</label>
              <input
                type="text"
                className="admin-input"
                value={stats.galleryPage.screens}
                onChange={(e) => handleChange('galleryPage', 'screens', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Locations</label>
              <input
                type="text"
                className="admin-input"
                value={stats.galleryPage.locations}
                onChange={(e) => handleChange('galleryPage', 'locations', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Years</label>
              <input
                type="text"
                className="admin-input"
                value={stats.galleryPage.years}
                onChange={(e) => handleChange('galleryPage', 'years', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="admin-form-label" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--admin-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>Experiences</label>
              <input
                type="text"
                className="admin-input"
                value={stats.galleryPage.experiences}
                onChange={(e) => handleChange('galleryPage', 'experiences', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 1-CLICK SAVE BUTTON */}
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          style={{
            alignSelf: 'center',
            padding: '1rem 3rem',
            fontSize: '1rem',
            justifyContent: 'center',
            fontWeight: 'bold',
            borderRadius: '50px',
            boxShadow: '0 0 25px rgba(201,159,74,0.3)',
            marginBottom: '4rem',
            cursor: 'pointer',
          }}
          disabled={saving}
        >
          {saving ? 'Updating Website Stats…' : 'Update Website Stats (1-Click)'}
        </button>
      </form>
    </>
  );
}
