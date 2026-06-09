import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const ALLOWED_COLLECTIONS = [
  'bookevents', 'franchiseinquiries', 'preapprovedfranchises', 'contactmessages',
  'careerapplications', 'conneventswaitlists', 'connflixsubscribers', 'connmusicwaitlists',
  'gameflixwaitlists', 'studioinvitations', 'downtowninvitations', 'purexsubscribers',
  'skyinnreservations', 'newsletters', 'vendorregistrations', 'consultantbookings',
  'generalinquiries', 'feedbacks',
];

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'contactmessages';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB not connected');

    const col = db.collection(collection);
    const query = search
      ? { $or: [ { email: { $regex: search, $options: 'i' } }, { fullName: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } } ] }
      : {};

    const total = await col.countDocuments(query);
    const docs = await col.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();

    return NextResponse.json({ docs, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    console.error("MongoDB connection failed for form-submissions, returning empty fallback:", err);
    return NextResponse.json({ docs: [], total: 0, page: 1, limit, pages: 0, isLocalFallback: true });
  }
}
