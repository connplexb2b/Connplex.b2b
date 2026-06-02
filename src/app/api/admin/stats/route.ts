import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAdminAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const STATS_PATH = path.join(process.cwd(), 'data', 'stats.json');

// Public route to get current website stats
export async function GET() {
  try {
    const raw = await fs.readFile(STATS_PATH, 'utf-8');
    const stats = JSON.parse(raw);
    return NextResponse.json(stats);
  } catch (error) {
    // If stats.json doesn't exist yet, return a 404 or empty object
    return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
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

    // Ensure the data directory exists
    await fs.mkdir(path.dirname(STATS_PATH), { recursive: true });
    
    // Save stats to json file
    await fs.writeFile(STATS_PATH, JSON.stringify(body, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, stats: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
