import { NextRequest, NextResponse } from 'next/server';

const VISTA_DC_ENGINE_URL = process.env.VISTA_DC_ENGINE_URL || 'http://103.129.101.135/WSVistaDCEngine/DCEngineService.asmx';
const VISTA_ENDPOINT_SERVER_ID = process.env.VISTA_ENDPOINT_SERVER_ID || '192.168.110.2';

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
  const CinemaID = searchParams.get('CinemaID') || 'Ahilyanagar';
  const FromDate = searchParams.get('FromDate') || '2026-11-01';
  const ToDate = searchParams.get('ToDate') || new Date().toISOString().split('T')[0];

  return handleRevenueRequest({ CinemaID, FromDate, ToDate });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      CinemaID = 'Ahilyanagar', 
      FromDate = '2026-11-01', 
      ToDate = new Date().toISOString().split('T')[0] 
    } = body;
    return handleRevenueRequest({ CinemaID, FromDate, ToDate });
  } catch (error) {
    return NextResponse.json({
      Status: '0',
      msg: 'Internal error processing request',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500, headers: corsHeaders });
  }
}

/**
 * Executes a SQL command directly on the Cinema POS database via Vista DCEngineService SOAP
 */
async function queryVistaDCEngine(sqlCmd: string): Promise<string> {
  const soapPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetList xmlns="http://vista.co.nz/WSVistaDCEngine">
      <cinfo>
        <AppId>CircuitStats</AppId>
        <Stateful>false</Stateful>
        <EndpointServerId>${VISTA_ENDPOINT_SERVER_ID}</EndpointServerId>
      </cinfo>
      <cmd>${sqlCmd.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</cmd>
    </GetList>
  </soap:Body>
</soap:Envelope>`;

  const response = await fetch(VISTA_DC_ENGINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://vista.co.nz/WSVistaDCEngine/GetList',
    },
    body: soapPayload,
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`DCEngine HTTP Error: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parses XML diffgram tables from DCEngine response
 */
function parseDiffgramTables(xmlStr: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const tableRegex = /<Table\b[^>]*>([\s\S]*?)<\/Table>/gi;
  let match;

  while ((match = tableRegex.exec(xmlStr)) !== null) {
    const tableContent = match[1];
    const rowObj: Record<string, string> = {};
    const fieldRegex = /<([a-zA-Z0-9_]+)>([^<]*)<\/\1>/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
      rowObj[fieldMatch[1]] = fieldMatch[2];
    }

    if (Object.keys(rowObj).length > 0) {
      rows.push(rowObj);
    }
  }

  return rows;
}

async function handleRevenueRequest({
  CinemaID,
  FromDate,
  ToDate,
}: {
  CinemaID?: string;
  FromDate?: string;
  ToDate?: string;
}) {
  const from = FromDate || '2026-11-01';
  const to = ToDate || new Date().toISOString().split('T')[0];

  try {
    // 1. Fetch exact ticket transactions directly from Vista POS (tblTrans_Ticket)
    const ticketSql = `
      SELECT 
        CONVERT(VARCHAR(10), CAST(TransT_dtmDateTime AS DATE), 120) as [Date],
        COUNT(CASE WHEN TransT_strStatus != 'R' THEN 1 END) as TotalTickets,
        SUM(CASE WHEN TransT_strStatus != 'R' THEN TransT_curValueEach ELSE -TransT_curValueEach END) as GrossRevenue,
        SUM(CASE WHEN TransT_strStatus != 'R' THEN ISNULL(TransT_curTaxAmount,0) + ISNULL(TransT_curTaxAmount2,0) ELSE 0 END) as TotalTax
      FROM tblTrans_Ticket WITH (NOLOCK)
      WHERE CAST(TransT_dtmDateTime AS DATE) BETWEEN '${from}' AND '${to}'
      GROUP BY CAST(TransT_dtmDateTime AS DATE)
      ORDER BY [Date] ASC
    `;

    // 2. Fetch exact Café concessions transactions directly from Vista POS (tblTrans_Inventory)
    const cafeSql = `
      SELECT 
        CONVERT(VARCHAR(10), CAST(TransI_dtmDateTime AS DATE), 120) as [Date],
        COUNT(DISTINCT CASE WHEN Workstation_strCode LIKE '%C%' THEN TransI_lgnNumber END) as CafeTransactions,
        SUM(CASE WHEN Workstation_strCode LIKE '%C%' THEN TransI_decNoOfItems ELSE 0 END) as CafeItems,
        SUM(CASE WHEN Workstation_strCode LIKE '%C%' THEN TransI_curValueEach * TransI_decNoOfItems ELSE 0 END) as CafeRevenue
      FROM tblTrans_Inventory WITH (NOLOCK)
      WHERE CAST(TransI_dtmDateTime AS DATE) BETWEEN '${from}' AND '${to}'
      GROUP BY CAST(TransI_dtmDateTime AS DATE)
      ORDER BY [Date] ASC
    `;

    const [ticketXml, cafeXml] = await Promise.all([
      queryVistaDCEngine(ticketSql).catch((err) => {
        console.warn('Failed querying Vista POS ticket engine:', err);
        return '';
      }),
      queryVistaDCEngine(cafeSql).catch((err) => {
        console.warn('Failed querying Vista POS cafe engine:', err);
        return '';
      }),
    ]);

    const ticketRows = parseDiffgramTables(ticketXml);
    const cafeRows = parseDiffgramTables(cafeXml);

    const cafeMap = new Map<string, { CafeTransactions: number; CafeItems: number; CafeRevenue: number }>();
    for (const c of cafeRows) {
      if (c.Date) {
        cafeMap.set(c.Date, {
          CafeTransactions: parseInt(c.CafeTransactions, 10) || 0,
          CafeItems: Math.round(parseFloat(c.CafeItems) || 0),
          CafeRevenue: Math.round(parseFloat(c.CafeRevenue) || 0),
        });
      }
    }

    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyBreakdown = ticketRows.map((t) => {
      const dStr = t.Date;
      const dayName = dayOfWeekNames[new Date(dStr).getDay()] || 'Mon';
      const tickets = parseInt(t.TotalTickets, 10) || 0;
      const grossRev = parseFloat(t.GrossRevenue) || 0;
      const tax = parseFloat(t.TotalTax) || 0;
      const netTicketRev = Math.max(0, grossRev - tax);

      const cafeInfo = cafeMap.get(dStr) || { CafeTransactions: 0, CafeItems: 0, CafeRevenue: 0 };
      const fnbRev = cafeInfo.CafeRevenue;
      const totalDailyRev = grossRev + fnbRev;

      const dailyATP = tickets > 0 ? parseFloat((grossRev / tickets).toFixed(2)) : 0;
      const dailySPH = tickets > 0 ? parseFloat((fnbRev / tickets).toFixed(2)) : 0;
      const occuPercent = parseFloat(((tickets / 299) * 100).toFixed(1)); // 299 seats total across 4 screens

      return {
        Date: dStr,
        Day: dayName,
        TicketsSold: tickets,
        OccupancyPercent: Math.min(100, occuPercent),
        DailyATP: dailyATP,
        DailySPH: dailySPH,
        FnBItemsSold: cafeInfo.CafeItems,
        CafeTransactions: cafeInfo.CafeTransactions,
        BoxTransactions: tickets,
        TicketRevenue: grossRev,
        NetTicketRevenue: netTicketRev,
        FnBRevenue: fnbRev,
        Glass3DRevenue: 0,
        TotalDailyRevenue: totalDailyRev,
        isLiveVista: true,
      };
    });

    const totalTicketsSold = dailyBreakdown.reduce((sum, d) => sum + d.TicketsSold, 0);
    const totalTicketRevenue = dailyBreakdown.reduce((sum, d) => sum + d.TicketRevenue, 0);
    const totalFnBItemsSold = dailyBreakdown.reduce((sum, d) => sum + d.FnBItemsSold, 0);
    const totalFnBRevenue = dailyBreakdown.reduce((sum, d) => sum + d.FnBRevenue, 0);
    const totalGrossRevenue = totalTicketRevenue + totalFnBRevenue;

    const overallATP = totalTicketsSold > 0 ? parseFloat((totalTicketRevenue / totalTicketsSold).toFixed(2)) : 0;
    const overallSPH = totalTicketsSold > 0 ? parseFloat((totalFnBRevenue / totalTicketsSold).toFixed(2)) : 0;
    const fnbToBoxOfficeRatioPercent =
      totalTicketRevenue > 0 ? parseFloat(((totalFnBRevenue / totalTicketRevenue) * 100).toFixed(2)) : 0;

    return NextResponse.json(
      {
        Status: '1',
        msg: 'Live data fetched directly from Ahilyanagar Vista POS Server (103.129.101.135)',
        isLive: true,
        source: 'Vista POS DCEngineService (Ahilyanagar Live Database)',
        data: {
          Cinema: {
            CinemaId: 'CN01',
            CinemaName: 'Connplex Smart Theatre - Ahilyanagar (Kohinoor)',
            City: 'Ahilyanagar',
            State: 'Maharashtra',
          },
          DateRange: {
            FromDate: from,
            ToDate: to,
          },
          Summary: {
            TotalGrossRevenue: totalGrossRevenue,
            TotalTicketRevenue: totalTicketRevenue,
            TotalFnBRevenue: totalFnBRevenue,
            Total3DGlassRevenue: 0,
            TotalTicketsSold: totalTicketsSold,
            TotalFnBItemsSold: totalFnBItemsSold,
            OverallATP: overallATP,
            OverallSPH: overallSPH,
            FnBToBoxOfficeRatioPercent: fnbToBoxOfficeRatioPercent,
          },
          DailyBreakdown: dailyBreakdown,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        Status: '0',
        msg: 'Failed connecting to Vista POS Server',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
