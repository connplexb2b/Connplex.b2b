import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import CaseStudy from '@/models/CaseStudy';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CASE_STUDIES = [
  {
    num: '01',
    tag: 'SMART CINEMA',
    title: 'CONNPLEX<br>EXPERIENCE CENTRE',
    subtitle: 'REDEFINING THE FUTURE OF CINEMA',
    location: 'MUMBAI, MAHARASHTRA',
    img: '/img/case-study/case_study_1.png',
    desc: 'A next-gen flagship cinema featuring 7 premium auditoriums, recliners, immersive sound and intelligent automation.',
    category: 'smart-cinemas',
    order: 0,
    isActive: true
  },
  {
    num: '02',
    tag: 'PREMIUM FORMAT',
    title: 'IMAX WITH LASER<br>AT CONNPLEX',
    subtitle: 'BIGGER SCREEN. BOLDER IMPACT.',
    location: 'PUNE, MAHARASHTRA',
    img: '/img/case-study/case_study_2.png',
    desc: "India's most advanced IMAX experience with Laser projection, precision sound and wall-to-wall visuals.",
    category: 'premium-formats',
    order: 1,
    isActive: true
  },
  {
    num: '03',
    tag: 'LUXURY RECLINERS',
    title: 'THE RECLINER<br>EXPERIENCE',
    subtitle: 'COMFORT THAT ELEVATES EVERY MOMENT.',
    location: 'MULTIPLE LOCATIONS',
    img: '/img/case-study/case_study_3.png',
    desc: 'Crafted for those who expect more. Our recliner auditoriums blend luxury, privacy and unmatched comfort.',
    category: 'experience-initiatives',
    order: 2,
    isActive: true
  },
  {
    num: '04',
    tag: 'DRIVE-IN CINEMA',
    title: 'CONNPLEX<br>DRIVE-IN',
    subtitle: 'CINEMA UNDER THE STARS.',
    location: 'LONAVALA, MAHARASHTRA',
    img: '/img/case-study/case_study_4.png',
    desc: 'A nostalgic experience reimagined with crystal clear visuals, powerful sound and a magical outdoor ambience.',
    category: 'drive-in-cinemas',
    order: 3,
    isActive: true
  },
  {
    num: '05',
    tag: 'TECHNOLOGY',
    title: 'DOLBY ATMOS<br>IMMERSIVE SOUND',
    subtitle: 'SOUND THAT MOVES YOU.',
    location: 'ACROSS INDIA',
    img: '/img/case-study/case_study_5.png',
    desc: 'Immersive audio that places you at the centre of every scene with breathtaking clarity and depth.',
    category: 'premium-formats',
    order: 4,
    isActive: true
  },
  {
    num: '06',
    tag: 'EXPERIENCE INITIATIVE',
    title: 'PRIVATE SCREENING<br>EXPERIENCES',
    subtitle: 'MADE FOR MOMENTS THAT MATTER.',
    location: 'MUMBAI, DELHI, BENGALURU',
    img: '/img/case-study/case_study_6.png',
    desc: 'Curated private screenings for corporate events, premieres and celebrations with bespoke service and exclusivity.',
    category: 'experience-initiatives',
    order: 5,
    isActive: true
  }
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await CaseStudy.countDocuments();
    if (count === 0) {
      await CaseStudy.insertMany(DEFAULT_CASE_STUDIES);
    }

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    const filter = getAll ? {} : { isActive: true };
    const studies = await CaseStudy.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(studies);
  } catch (err: any) {
    console.error("MongoDB connection failed, falling back to default case studies:", err);
    // Add temporary id field mapped on default B2B case studies
    const mapped = DEFAULT_CASE_STUDIES.map((item, idx) => ({
      _id: `casestudy-fallback-${idx}`,
      ...item
    }));
    return NextResponse.json(mapped);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const study = await CaseStudy.create(body);
    return NextResponse.json(study, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
