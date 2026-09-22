import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { getAhilyanagarDailyRevenue } from '@/services/AhilyanagarRevenueService';

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
  const cinemaId = searchParams.get('cinemaId') || searchParams.get('CinemaID') || 'Ahilyanagar';
  const fromDate = searchParams.get('fromDate') || searchParams.get('FromDate');
  const toDate = searchParams.get('toDate') || searchParams.get('ToDate');
  const preset = searchParams.get('preset');
  const serverUrl = searchParams.get('serverUrl') || undefined;

  return handleRevenueRequest({ cinemaId, fromDate, toDate, preset, serverUrl });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cinemaId = body.cinemaId || body.CinemaID || 'Ahilyanagar';
    const fromDate = body.fromDate || body.FromDate;
    const toDate = body.toDate || body.ToDate;
    const preset = body.preset;
    const serverUrl = body.serverUrl;

    return handleRevenueRequest({ cinemaId, fromDate, toDate, preset, serverUrl });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

async function handleRevenueRequest({ cinemaId, fromDate, toDate, preset, serverUrl }: {
  cinemaId?: string;
  fromDate?: string | null;
  toDate?: string | null;
  preset?: string | null;
  serverUrl?: string;
}) {
  try {
    const result = await (getAhilyanagarDailyRevenue as any)({
      cinemaId,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      preset: preset || undefined,
      serverUrl
    });

    return NextResponse.json({
      status: 200,
      message: result.msg || 'Success',
      isLive: result.isLive ?? false,
      source: result.isLive ? 'Vista ASMX Live Service (14.194.50.141)' : 'Audited MTD Dataset',
      data: result.data
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

