import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Stats } from '@/models/Stats';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const STATS_PATH = path.join(process.cwd(), 'data', 'stats.json');

async function getFallbackStats() {
  try {
    const raw = await fs.readFile(STATS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

// Public route to get current website stats
export async function GET() {
  try {
    await connectToDatabase();
    let stats = await Stats.findOne().lean();
    
    if (!stats) {
      // Fallback/Seed from local data/stats.json
      const fallback = await getFallbackStats();
      if (fallback) {
        const doc = await Stats.create(fallback);
        stats = doc.toObject();
      } else {
        // Fallback to absolute defaults if stats.json doesn't exist
        const doc = await Stats.create({});
        stats = doc.toObject();
      }
    }
    
    if (stats) {
      delete (stats as any)._id;
      delete (stats as any).__v;
      delete (stats as any).createdAt;
      delete (stats as any).updatedAt;
    }
    
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching stats from MongoDB:', error);
    // If DB is down, try to read local file as a graceful fallback
    const fallback = await getFallbackStats();
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// Secure route to update website stats (only authenticated admins)
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json().catch(() => ({}));
    
    // Quick validation to ensure body is not empty and has structural fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Update or create stats document
    const updatedStats = await Stats.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    ).lean();
    
    if (updatedStats) {
      delete (updatedStats as any)._id;
      delete (updatedStats as any).__v;
      delete (updatedStats as any).createdAt;
      delete (updatedStats as any).updatedAt;
    }
    
    return NextResponse.json({ success: true, stats: updatedStats });
  } catch (err: any) {
    console.error('Error updating stats in MongoDB:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
