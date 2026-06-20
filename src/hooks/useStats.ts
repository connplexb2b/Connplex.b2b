import { useState, useEffect } from 'react';

export interface HomepageStats {
  annualFootfall: string;
  premiumScreens: string;
  citiesCovered: string;
  experiencesDelivered: string;
}

export interface AboutPageStats {
  screens: string;
  franchiseLocations: string;
  yearsOfExcellence: string;
  vision: string;
  happyMoviegoers: string;
}

export interface AdvertisePageStats {
  ageRange: string;
  premiumIncome: string;
  frequentMoviegoers: string;
  engagementRate: string;
  cities: string;
  screens: string;
}

export interface FranchisePageStats {
  cinemasNationwide: string;
  happyMoviegoers: string;
  citiesCovered: string;
  partnerSatisfaction: string;
}

export interface BookEventPageStats {
  iconicVenues: string;
  premiumSpaces: string;
  possibilities: string;
}

export interface CaseStudiesPageStats {
  smartCinemas: string;
  screensDeployed: string;
  guestsImpressed: string;
  citiesAcrossIndia: string;
  yearsOfExcellence: string;
}

export interface GalleryPageStats {
  screens: string;
  locations: string;
  years: string;
  experiences: string;
}

export interface WebsiteStats {
  homepage: HomepageStats;
  aboutPage: AboutPageStats;
  advertisePage: AdvertisePageStats;
  franchisePage: FranchisePageStats;
  bookEventPage: BookEventPageStats;
  caseStudiesPage: CaseStudiesPageStats;
  galleryPage: GalleryPageStats;
}

// Complete default fallback stats aligned with existing hardcoded values
export const DEFAULT_STATS: WebsiteStats = {
  homepage: {
    annualFootfall: "10M+",
    premiumScreens: "125+",
    citiesCovered: "Metros &\nTier 1, 2, 3",
    experiencesDelivered: "Immersive"
  },
  aboutPage: {
    screens: "125+",
    franchiseLocations: "43+",
    yearsOfExcellence: "8+",
    vision: "1",
    happyMoviegoers: "10M+"
  },
  advertisePage: {
    ageRange: "70%",
    premiumIncome: "65%",
    frequentMoviegoers: "80%",
    engagementRate: "4.7/5",
    cities: "50+",
    screens: "125+"
  },
  franchisePage: {
    cinemasNationwide: "43+",
    happyMoviegoers: "10M+",
    citiesCovered: "50+",
    partnerSatisfaction: "100%"
  },
  bookEventPage: {
    iconicVenues: "43+",
    premiumSpaces: "125+",
    possibilities: "∞"
  },
  caseStudiesPage: {
    smartCinemas: "43+",
    screensDeployed: "125+",
    guestsImpressed: "10M+",
    citiesAcrossIndia: "50+",
    yearsOfExcellence: "8+"
  },
  galleryPage: {
    screens: "125+",
    locations: "43+",
    years: "8+",
    experiences: "10M"
  }
};

export function useStats() {
  const [stats, setStats] = useState<WebsiteStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to load stats');
        }
        const data = await response.json();
        if (isMounted && data && !data.error) {
          // Merge fetched data with DEFAULT_STATS in case some fields are missing
          const mergedStats: WebsiteStats = {
            homepage: { ...DEFAULT_STATS.homepage, ...data.homepage },
            aboutPage: { ...DEFAULT_STATS.aboutPage, ...data.aboutPage },
            advertisePage: { ...DEFAULT_STATS.advertisePage, ...data.advertisePage },
            franchisePage: { ...DEFAULT_STATS.franchisePage, ...data.franchisePage },
            bookEventPage: { ...DEFAULT_STATS.bookEventPage, ...data.bookEventPage },
            caseStudiesPage: { ...DEFAULT_STATS.caseStudiesPage, ...data.caseStudiesPage },
            galleryPage: { ...DEFAULT_STATS.galleryPage, ...data.galleryPage }
          };
          setStats(mergedStats);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error fetching stats');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, loading, error };
}
