import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { getDailySalesAndFnbReport } from '@/services/AhilyanagarRevenueService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const CinemaID = searchParams.get('CinemaID') || searchParams.get('cinemaId') || 'Ahilyanagar';
  const targetDate = searchParams.get('date') || searchParams.get('Date') || new Date().toISOString().split('T')[0];
  const vistaBaseUrl = searchParams.get('vistaBaseUrl') || searchParams.get('serverUrl') || undefined;

  try {
    const result = await (getDailySalesAndFnbReport as any)({
      cinemaId: CinemaID,
      date: targetDate,
      vistaBaseUrl
    });
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      Status: 'fail',
      msg: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const CinemaID = body.CinemaID || body.cinemaId || 'Ahilyanagar';
    const targetDate = body.date || body.Date || new Date().toISOString().split('T')[0];
    const vistaBaseUrl = body.vistaBaseUrl || body.serverUrl || undefined;

    const result = await (getDailySalesAndFnbReport as any)({
      cinemaId: CinemaID,
      date: targetDate,
      vistaBaseUrl
    });
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      Status: 'fail',
      msg: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}
