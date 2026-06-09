import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import NewsArticle from '@/models/NewsArticle';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const articles = await NewsArticle.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(articles);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const body = await request.json().catch(() => ({}));
    await connectToDatabase();
    const article = await NewsArticle.create(body);
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
