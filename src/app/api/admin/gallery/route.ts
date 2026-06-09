import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'gallery.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');

const DEFAULT_GALLERY_ITEMS = [
  {
    id: "gallery-default-1",
    title: "Luxuriance",
    caption: "",
    category: "Cinemas",
    imagePath: "/gallery/luxuriance.png",
    order: 0,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-2",
    title: "Downtown",
    caption: "",
    category: "Cinemas",
    imagePath: "/gallery/downtown.png",
    order: 1,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-3",
    title: "Sky Inn",
    caption: "",
    category: "Experience",
    imagePath: "/gallery/sky_inn.png",
    order: 2,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-4",
    title: "Signature",
    caption: "",
    category: "Cinemas",
    imagePath: "/gallery/signature.png",
    order: 3,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-5",
    title: "Spectra X",
    caption: "",
    category: "Experience",
    imagePath: "/gallery/spectra_x.png",
    order: 4,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-6",
    title: "Behind the Magic",
    caption: "",
    category: "Behind the Scenes",
    imagePath: "/gallery/behind_magic.png",
    order: 5,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  },
  {
    id: "gallery-default-7",
    title: "Grand Openings",
    caption: "",
    category: "Events",
    imagePath: "/gallery/grand_opening.png",
    order: 6,
    isActive: true,
    createdAt: "2026-06-08T00:00:00.000Z"
  }
];

async function readGallery() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}

  // Seed default gallery items if empty or file doesn't exist
  await writeGallery(DEFAULT_GALLERY_ITEMS);
  return DEFAULT_GALLERY_ITEMS;
}

async function writeGallery(items: any[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const items = await readGallery();
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const title = (formData.get('title') as string) || 'Untitled';
    const caption = (formData.get('caption') as string) || '';
    const category = (formData.get('category') as string) || 'General';

    if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const storedName = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, storedName), buffer);

    const items = await readGallery();
    const newItem = {
      id: randomUUID(),
      title,
      caption,
      category,
      imagePath: `/uploads/gallery/${storedName}`,
      storedName,
      order: items.length,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    await writeGallery(items);
    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
