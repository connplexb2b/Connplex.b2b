import { NextResponse } from 'next/server';
import { readInvestors } from '@/lib/admin-investors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const investors = await readInvestors();
    return NextResponse.json(investors);
  } catch (error) {
    console.error('Error reading investors:', error);
    return NextResponse.json({ error: 'Failed to read investors' }, { status: 500 });
  }
}
