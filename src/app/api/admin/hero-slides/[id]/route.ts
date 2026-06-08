import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true });
    if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(slide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    await connectToDatabase();
    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
