import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DATA_PATH = path.join(process.cwd(), 'data', 'gallery.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');

async function readGallery() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeGallery(items: any[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const items = await readGallery();
    const item = items.find((i: any) => i.id === id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (item.storedName) {
      await fs.rm(path.join(UPLOAD_DIR, item.storedName), { force: true });
    }
    await writeGallery(items.filter((i: any) => i.id !== id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const items = await readGallery();
    const idx = items.findIndex((i: any) => i.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    items[idx] = { ...items[idx], ...body };
    await writeGallery(items);
    return NextResponse.json(items[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
