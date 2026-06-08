import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  { key: 'bookevents', label: 'Book Event', icon: 'fa-calendar-check', color: '#8b5cf6' },
  { key: 'franchiseinquiries', label: 'Franchise Inquiry', icon: 'fa-building', color: '#c19b62' },
  { key: 'preapprovedfranchises', label: 'Pre-Approved Franchise', icon: 'fa-star', color: '#f59e0b' },
  { key: 'contactmessages', label: 'Contact Messages', icon: 'fa-envelope', color: '#3b82f6' },
  { key: 'careerapplications', label: 'Career Applications', icon: 'fa-briefcase', color: '#10b981' },
  { key: 'conneventswaitlists', label: 'ConnEvents Waitlist', icon: 'fa-ticket', color: '#ec4899' },
  { key: 'connflixsubscribers', label: 'Connflix Subscribers', icon: 'fa-play', color: '#ef4444' },
  { key: 'connmusicwaitlists', label: 'ConnMusic Waitlist', icon: 'fa-music', color: '#06b6d4' },
  { key: 'gameflixwaitlists', label: 'Gameflix Waitlist', icon: 'fa-gamepad', color: '#22c55e' },
  { key: 'studioinvitations', label: 'Studio Invitations', icon: 'fa-video', color: '#f97316' },
  { key: 'downtowninvitations', label: 'Downtown Invitations', icon: 'fa-city', color: '#a855f7' },
  { key: 'purexsubscribers', label: 'PureX Subscribers', icon: 'fa-gem', color: '#14b8a6' },
  { key: 'skyinnreservations', label: 'Sky Inn Reservations', icon: 'fa-hotel', color: '#64748b' },
  { key: 'newsletters', label: 'Newsletter Subscribers', icon: 'fa-newspaper', color: '#6366f1' },
  { key: 'vendorregistrations', label: 'Vendor Registrations', icon: 'fa-store', color: '#d97706' },
  { key: 'consultantbookings', label: 'Consultant Bookings', icon: 'fa-user-tie', color: '#0ea5e9' },
  { key: 'generalinquiries', label: 'General Inquiries', icon: 'fa-question-circle', color: '#84cc16' },
  { key: 'feedbacks', label: 'Feedback', icon: 'fa-comment', color: '#f43f5e' },
];

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse();
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB not connected');

    const results = await Promise.all(
      COLLECTIONS.map(async (col) => {
        try {
          const count = await db.collection(col.key).countDocuments();
          return { ...col, count };
        } catch {
          return { ...col, count: 0 };
        }
      })
    );

    const total = results.reduce((sum, r) => sum + r.count, 0);
    return NextResponse.json({ collections: results, total });
  } catch (err: any) {
    console.error("MongoDB connection failed for analytics, returning fallback counts:", err);
    const fallbackResults = COLLECTIONS.map(col => ({ ...col, count: 0 }));
    return NextResponse.json({ collections: fallbackResults, total: 0, isLocalFallback: true });
  }
}
