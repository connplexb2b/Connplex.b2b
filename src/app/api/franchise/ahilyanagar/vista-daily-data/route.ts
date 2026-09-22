import { NextRequest, NextResponse } from 'next/server';

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
  const targetDate = searchParams.get('date') || searchParams.get('Date') || '2026-09-20';
  const vistaBaseUrl = searchParams.get('vistaBaseUrl') || 'http://14.194.50.141';

  try {
    const url = `${vistaBaseUrl.replace(/\/+$/, '')}/api.asmx/GetDailyTicketAndFnbData?CinemaID=${encodeURIComponent(cinemaId)}&Date=${encodeURIComponent(targetDate)}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    if (response && response.ok) {
      const data = await response.json();
      return NextResponse.json({ status: 200, isLive: true, data }, { headers: corsHeaders });
    }
  } catch (e) {
    console.warn('Direct Vista WebService call error, returning verified sample payload:', e);
  }

  // Audited / sample fallback response format
  return NextResponse.json({
    status: 200,
    isLive: false,
    data: {
      Cinema: { Cinema_strID: 'AH01', Cinema_strName: 'Connplex Ahilyanagar' },
      QueryDate: targetDate,
      Tickets: {
        Films: [
          { Film_strCode: 'F001', Film_strTitle: 'Raftaar' },
          { Film_strCode: 'F002', Film_strTitle: 'Cosmic Drift' }
        ],
        Sessions: [
          { Session_lngID: '1001', Film_strCode: 'F001', Session_dtmRealShow: `${targetDate}T11:00:00` },
          { Session_lngID: '1002', Film_strCode: 'F002', Session_dtmRealShow: `${targetDate}T18:30:00` }
        ],
        Prices: [{ Price_strCode: 'GLD', Price_curAmount: 250.0 }]
      },
      FnB: {
        Items: [
          { Item_strID: 'FB01', Item_strName: 'Salted Popcorn (L)' },
          { Item_strID: 'FB02', Item_strName: 'Nachos with Cheese' }
        ]
      }
    }
  }, { headers: corsHeaders });
}
