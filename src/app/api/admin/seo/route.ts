import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import SEOPage from '@/models/SEOPage';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGES = [
  {
    pageSlug: '/',
    pageLabel: 'Home',
    metaTitle: "Connplex Cinemas | Premium Cinema Chain in India",
    metaDescription: "Welcome to Connplex Cinemas, India's fastest-growing premium next-gen cinema chain. Explore premium smart cinema screens and B2B cinema screen partnerships, redefining entertainment.",
    keywords: "cinema, franchise, luxury, India",
    ogImage: ""
  },
  {
    pageSlug: '/about',
    pageLabel: 'About',
    metaTitle: "About Connplex Cinemas | Founders Anish Patel & Rahul Dhyani",
    metaDescription: "Learn about Connplex Cinemas, founded by Rahul Dhyani & Anish Patel. Discover our vision of scaling premium cinema experiences in Metro + Tier 1, 2, 3 cities.",
    keywords: "Anish Patel, Rahul Dhyani, Founders",
    ogImage: ""
  },
  {
    pageSlug: '/franchise-with-us',
    pageLabel: 'Franchise',
    metaTitle: "smart cinema & Cinema Franchise Cost in India | Connplex",
    metaDescription: "Own a high-profit smart cinema franchise in India. Explore Connplex FOCO/FOFO franchise cost, premium cinema setup investment, and profit models.",
    keywords: "FOCO, FOFO, cinema franchise",
    ogImage: ""
  },
  {
    pageSlug: '/advertise',
    pageLabel: 'Advertise',
    metaTitle: "On Screen cinema Ads & Cinema Advertising Rates | Connplex",
    metaDescription: "Advertise on India's most premium cinema screens. Get cost-effective on-screen ads, digital lobby branding, and high-recall cinema marketing rates.",
    keywords: "cinema advertising, cinema ads rates",
    ogImage: ""
  },
  {
    pageSlug: '/contact',
    pageLabel: 'Contact',
    metaTitle: "Contact Connplex Cinemas | cinema Corporate Office & Inquiries",
    metaDescription: "Get in touch for cinema franchise details, brand advertisement slots, or private cinema booking. Contact our corporate team for official support.",
    keywords: "corporate office, contact connplex",
    ogImage: ""
  },
  {
    pageSlug: '/gallery',
    pageLabel: 'Gallery',
    metaTitle: "The Connplex Gallery | Premium Cinema Experiences",
    metaDescription: "A visual journey through luxury cinematic experiences, architecture, and storytelling.",
    keywords: "gallery, cinema experience, luxury",
    ogImage: ""
  },
  {
    pageSlug: '/news',
    pageLabel: 'News & Promotions',
    metaTitle: "News & Promotions | Connplex Cinemas",
    metaDescription: "Stay updated with the latest news, announcements, press releases, and promotions from Connplex Cinemas.",
    keywords: "news, press release, promotions",
    ogImage: ""
  },
  {
    pageSlug: '/faq',
    pageLabel: 'FAQ',
    metaTitle: "Frequently Asked Questions (FAQ) | Connplex Cinemas Franchise",
    metaDescription: "Find answers to frequently asked questions about starting a Connplex Cinemas franchise, location requirements, returns, investments, and expansion support.",
    keywords: "faq, franchise questions",
    ogImage: ""
  },
  {
    pageSlug: '/career',
    pageLabel: 'Career',
    metaTitle: "Careers at Connplex Cinemas | Join the Revolution",
    metaDescription: "Explore job openings and career opportunities at Connplex Cinemas. Join India's fastest-growing premium next-gen cinema chain.",
    keywords: "careers, jobs",
    ogImage: ""
  },
  {
    pageSlug: '/investors',
    pageLabel: 'Investors',
    metaTitle: "Investors Relations | Connplex Cinemas",
    metaDescription: "Investor reports, company financial announcements, and corporate growth disclosures for Connplex B2B partners.",
    keywords: "investors, finance",
    ogImage: ""
  },
  {
    pageSlug: '/book-event',
    pageLabel: 'Book an Event',
    metaTitle: "Rent Movie Screen for Corporate Event & Private Screenings",
    metaDescription: "Book a premium cinema screen hall for corporate presentations, private screenings, VIP previews, or brand launches. Contact Connplex for slots.",
    keywords: "corporate event, rent cinema screen",
    ogImage: ""
  },
  {
    pageSlug: '/case-studies',
    pageLabel: 'Case Studies',
    metaTitle: "B2B Case Studies | Connplex Cinemas",
    metaDescription: "Success stories, branding case studies, and business impact analysis of Connplex Cinemas screen B2B models.",
    keywords: "case studies, branding, B2B",
    ogImage: ""
  },
  {
    pageSlug: '/ecosystem',
    pageLabel: 'Ecosystem',
    metaTitle: "The Connplex B2B Ecosystem | Next-Gen Entertainment",
    metaDescription: "A complete entertainment ecosystem consisting of luxury screens, drive-ins, Active LED technology, gaming arenas, and media streaming.",
    keywords: "ecosystem, next-gen entertainment",
    ogImage: ""
  },
  {
    pageSlug: '/feedback',
    pageLabel: 'Feedback',
    metaTitle: "Share Your Feedback | Connplex Cinemas",
    metaDescription: "We value your opinion. Share your feedback, suggestions, or complaints with the Connplex corporate team.",
    keywords: "feedback, customer review",
    ogImage: ""
  },
  {
    pageSlug: '/connflix',
    pageLabel: 'Connflix',
    metaTitle: "Connflix | Premium Originals & Video Streaming by Connplex",
    metaDescription: "Stream premium cinematic originals, indie films, and exclusive entertainment curated by Connplex.",
    keywords: "connflix, streaming, originals",
    ogImage: ""
  },
  {
    pageSlug: '/conntube',
    pageLabel: 'ConnTube',
    metaTitle: "ConnTube | Share and Stream Video Content by Connplex",
    metaDescription: "Share your voice and stream high-quality user-generated video content on Connplex's premium video platform.",
    keywords: "conntube, video sharing",
    ogImage: ""
  },
  {
    pageSlug: '/connmusic',
    pageLabel: 'ConnMusic',
    metaTitle: "ConnMusic | Cinema-Grade Audio & Music Streaming",
    metaDescription: "Immerse in cinema-grade audio tracks, album releases, and seamless music streaming on ConnMusic.",
    keywords: "connmusic, audio streaming, music",
    ogImage: ""
  },
  {
    pageSlug: '/downtown',
    pageLabel: 'Downtown',
    metaTitle: "Downtown Lounge | Premium Cinema & Dining Experience",
    metaDescription: "Experience luxury movie cinemas with ultra-premium reclining seats, gourmet food, and fine dining at Downtown.",
    keywords: "downtown lounge, dining cinema",
    ogImage: ""
  },
  {
    pageSlug: '/sky-inn',
    pageLabel: 'Sky Inn',
    metaTitle: "Sky Inn | Open-Air Drive-In Cinema Experience",
    metaDescription: "Fabulous open-air drive-in cinema experience under the beautiful night sky, presented by Connplex.",
    keywords: "sky inn, drive-in cinema, open-air",
    ogImage: ""
  },
  {
    pageSlug: '/spectra-x',
    pageLabel: 'Spectra X',
    metaTitle: "Connplex | Spectra X – India's First Active LED Cinema Technology",
    metaDescription: "Spectra X by Connplex Cinemas – India's first patented Active LED Cinema Technology. Government of India granted patent. 20 years patent protection.",
    keywords: "Spectra X, active LED cinema, patent",
    ogImage: ""
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    const existing = await SEOPage.find().lean();
    const existingMap: Record<string, any> = {};
    existing.forEach((e: any) => { existingMap[e.pageSlug] = e; });
    
    const merged = DEFAULT_PAGES.map(p => {
      const dbEntry = existingMap[p.pageSlug];
      return {
        pageSlug: p.pageSlug,
        pageLabel: p.pageLabel,
        metaTitle: dbEntry?.metaTitle !== undefined ? dbEntry.metaTitle : p.metaTitle,
        metaDescription: dbEntry?.metaDescription !== undefined ? dbEntry.metaDescription : p.metaDescription,
        keywords: dbEntry?.keywords !== undefined ? dbEntry.keywords : p.keywords,
        ogImage: dbEntry?.ogImage !== undefined ? dbEntry.ogImage : p.ogImage
      };
    });
    
    return NextResponse.json(merged);
  } catch (err: any) {
    console.error("MongoDB connection failed, falling back to default SEO pages:", err);
    return NextResponse.json(DEFAULT_PAGES);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.pageSlug) return NextResponse.json({ error: 'pageSlug required' }, { status: 400 });
    await connectToDatabase();
    const updated = await SEOPage.findOneAndUpdate(
      { pageSlug: body.pageSlug },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
