import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import FAQItem from '@/models/FAQItem';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const faq = await FAQItem.findByIdAndUpdate(id, body, { new: true });
    if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(faq);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    await connectToDatabase();
    const faq = await FAQItem.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
