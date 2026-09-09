import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import NewsArticle from '@/models/NewsArticle';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function cleanArticleBody(html?: string): string {
  if (!html) return '';
  return html
    .replace(/color\s*:\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|black)[^;"']*/gi, 'color: #ffffff')
    .replace(/background(-color)?\s*:\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|white|black)[^;"']*/gi, 'background-color: transparent')
    .replace(/<font([^>]*?)color=["']?[^"'\s>]+["']?([^>]*?)>/gi, '<font$1color="#ffffff"$2>');
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    if (body.body) {
      body.body = cleanArticleBody(body.body);
    }
    await connectToDatabase();
    const article = await NewsArticle.findByIdAndUpdate(id, body, { new: true });
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { id } = await params;
    await connectToDatabase();
    const article = await NewsArticle.findByIdAndDelete(id);
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
