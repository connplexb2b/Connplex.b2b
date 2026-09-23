import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { databaseSync } from '@/services/AhilyanagarRevenueService';

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
  const strCinemaId = searchParams.get('strCinemaId') || searchParams.get('cinemaId') || searchParams.get('CinemaID') || 'Ahilyanagar';
  const vistaBaseUrl = searchParams.get('vistaBaseUrl') || searchParams.get('serverUrl') || undefined;

  try {
    const result = await (databaseSync as any)({
      cinemaId: strCinemaId,
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
    const strCinemaId = body.strCinemaId || body.cinemaId || body.CinemaID || 'Ahilyanagar';
    const vistaBaseUrl = body.vistaBaseUrl || body.serverUrl || undefined;

    const result = await (databaseSync as any)({
      cinemaId: strCinemaId,
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
