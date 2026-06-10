import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SLIDES = [
  {
    eyebrow: "Luxury Cinema Experience.",
    title: "Luxury Cinema\nExperience",
    tags: "Recliners · Gourmet F&B · VIP Service",
    description: "Plush recliners, curated menus, and white glove service. Every detail crafted for indulgence. Host premieres, VIP screenings, and private events in true luxury. This is cinema as an event intimate, indulgent, unforgettable.",
    imagePath: "/img/LUX.jpeg",
    link: "/franchise-with-us",
    linkText: "Know More",
    order: 0,
    isActive: true,
  },
  {
    eyebrow: "Where Style Meets the Screen.",
    title: "Signature\nExperience",
    tags: "Technology · Design · Immersion",
    description: "Sleek interiors, cutting edge technology, and an atmosphere that pulls you in from the moment you walk through the door. Cinema elevated for the modern audience.",
    imagePath: "/img/SIG.jpeg",
    link: "/franchise-with-us",
    linkText: "Know More",
    order: 1,
    isActive: true,
  },
  {
    eyebrow: "Strong Network of Cinemas for Every City.",
    title: "Smart Cinema\nNetwork",
    tags: "Comfort · Quality · Community",
    description: "Thoughtfully designed spaces, quality screens, and a comfortable atmosphere. Smart makes every visit feel easy, enjoyable and just right.",
    imagePath: "/img/SMART.jpeg",
    link: "/franchise-with-us",
    linkText: "Explore",
    order: 2,
    isActive: true,
  },
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed if empty
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
      await HeroSlide.insertMany(DEFAULT_SLIDES);
    }

    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    const filter = getAll ? {} : { isActive: true };
    const slides = await HeroSlide.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(slides);
  } catch (err: any) {
    console.error("MongoDB connection failed, falling back to default slides:", err);
    return NextResponse.json(DEFAULT_SLIDES);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const slide = await HeroSlide.create(body);
    return NextResponse.json(slide, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
