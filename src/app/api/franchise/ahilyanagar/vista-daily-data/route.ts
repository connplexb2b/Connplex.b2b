import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { fetchDailyTicketAndFnbFromVista } from '@/services/AhilyanagarRevenueService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cinemaId = searchParams.get('cinemaId') || searchParams.get('CinemaID') || 'Ahilyanagar';
  const targetDate = searchParams.get('date') || searchParams.get('Date') || new Date().toISOString().split('T')[0];
  const vistaBaseUrl = searchParams.get('vistaBaseUrl') || 'http://14.194.50.141';

  try {
    const result = await (fetchDailyTicketAndFnbFromVista as any)({
      date: targetDate,
      cinemaId,
      vistaBaseUrl,
    });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

