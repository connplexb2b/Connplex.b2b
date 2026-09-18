import { NextRequest, NextResponse } from 'next/server';

// Verified Vista Database Dataset for Ahilyanagar (Month-to-Date 2026-09-01 to 2026-09-17 from Vista DB Daily Collection)
const DEFAULT_AHILYANAGAR_DATA = {
  Cinema: {
    CinemaId: 'CL16',
    CinemaName: 'Connplex Smart Theatre - Ahilyanagar',
    City: 'Ahilyanagar',
    State: 'Maharashtra'
  },
  DateRange: {
    FromDate: '2026-09-01',
    ToDate: '2026-09-17'
  },
  Summary: {
    TotalGrossRevenue: 3986814.0,
    TotalTicketRevenue: 2900822.0,
    TotalFnBRevenue: 1085992.0,
    Total3DGlassRevenue: 10518.0,
    TotalTicketsSold: 9730,
    TotalFnBItemsSold: 8988,
    OverallATP: 298.13,
    OverallSPH: 111.61,
    OverallOccupancyPercent: 38.6,
    FnBToBoxOfficeRatioPercent: 37.44
  },
  DailyBreakdown: [
    { Date: '2026-09-01', Day: 'Tue', TicketsSold: 679, OccupancyPercent: 48.1, DailyATP: 159.83, DailySPH: 83.19, FnBItemsSold: 501, CafeTransactions: 237, BoxTransactions: 272, ItemsPerTransaction: 2.11, IPH: 0.74, AVT: 238, ASR: 35, TSR: 87, TicketRevenue: 108524.0, FnBRevenue: 56488.0, Glass3DRevenue: 492.0, TotalDailyRevenue: 165012.0 },
    { Date: '2026-09-02', Day: 'Wed', TicketsSold: 442, OccupancyPercent: 31.3, DailyATP: 267.22, DailySPH: 101.56, FnBItemsSold: 384, CafeTransactions: 164, BoxTransactions: 169, ItemsPerTransaction: 2.34, IPH: 0.87, AVT: 274, ASR: 37, TSR: 97, TicketRevenue: 118110.0, FnBRevenue: 44888.0, Glass3DRevenue: 750.0, TotalDailyRevenue: 162998.0 },
    { Date: '2026-09-03', Day: 'Thu', TicketsSold: 512, OccupancyPercent: 36.2, DailyATP: 261.54, DailySPH: 102.05, FnBItemsSold: 435, CafeTransactions: 183, BoxTransactions: 190, ItemsPerTransaction: 2.38, IPH: 0.85, AVT: 286, ASR: 36, TSR: 96, TicketRevenue: 133910.0, FnBRevenue: 52250.0, Glass3DRevenue: 420.0, TotalDailyRevenue: 186160.0 },
    { Date: '2026-09-04', Day: 'Fri', TicketsSold: 666, OccupancyPercent: 42.6, DailyATP: 370.72, DailySPH: 121.01, FnBItemsSold: 655, CafeTransactions: 269, BoxTransactions: 256, ItemsPerTransaction: 2.43, IPH: 0.98, AVT: 300, ASR: 40, TSR: 105, TicketRevenue: 246900.0, FnBRevenue: 80595.0, Glass3DRevenue: 472.0, TotalDailyRevenue: 327495.0 },
    { Date: '2026-09-05', Day: 'Sat', TicketsSold: 893, OccupancyPercent: 59.3, DailyATP: 358.23, DailySPH: 163.49, FnBItemsSold: 959, CafeTransactions: 355, BoxTransactions: 332, ItemsPerTransaction: 2.70, IPH: 1.07, AVT: 411, ASR: 40, TSR: 107, TicketRevenue: 319900.0, FnBRevenue: 145997.0, Glass3DRevenue: 472.0, TotalDailyRevenue: 465897.0 },
    { Date: '2026-09-06', Day: 'Sun', TicketsSold: 1101, OccupancyPercent: 70.4, DailyATP: 353.50, DailySPH: 135.52, FnBItemsSold: 1203, CafeTransactions: 488, BoxTransactions: 404, ItemsPerTransaction: 2.47, IPH: 1.09, AVT: 306, ASR: 44, TSR: 121, TicketRevenue: 389200.0, FnBRevenue: 149209.0, Glass3DRevenue: 944.0, TotalDailyRevenue: 538409.0 },
    { Date: '2026-09-07', Day: 'Mon', TicketsSold: 616, OccupancyPercent: 39.1, DailyATP: 332.55, DailySPH: 99.75, FnBItemsSold: 553, CafeTransactions: 240, BoxTransactions: 227, ItemsPerTransaction: 2.30, IPH: 0.90, AVT: 256, ASR: 39, TSR: 106, TicketRevenue: 204850.0, FnBRevenue: 61446.0, Glass3DRevenue: 640.0, TotalDailyRevenue: 266296.0 },
    { Date: '2026-09-08', Day: 'Tue', TicketsSold: 652, OccupancyPercent: 41.3, DailyATP: 322.47, DailySPH: 106.71, FnBItemsSold: 604, CafeTransactions: 276, BoxTransactions: 248, ItemsPerTransaction: 2.19, IPH: 0.93, AVT: 252, ASR: 42, TSR: 111, TicketRevenue: 210250.0, FnBRevenue: 69576.0, Glass3DRevenue: 160.0, TotalDailyRevenue: 279826.0 },
    { Date: '2026-09-09', Day: 'Wed', TicketsSold: 476, OccupancyPercent: 30.2, DailyATP: 303.57, DailySPH: 106.88, FnBItemsSold: 466, CafeTransactions: 204, BoxTransactions: 175, ItemsPerTransaction: 2.28, IPH: 0.98, AVT: 249, ASR: 43, TSR: 117, TicketRevenue: 144500.0, FnBRevenue: 50875.0, Glass3DRevenue: 1264.0, TotalDailyRevenue: 195375.0 },
    { Date: '2026-09-10', Day: 'Thu', TicketsSold: 434, OccupancyPercent: 27.5, DailyATP: 325.69, DailySPH: 106.99, FnBItemsSold: 404, CafeTransactions: 175, BoxTransactions: 170, ItemsPerTransaction: 2.31, IPH: 0.93, AVT: 265, ASR: 40, TSR: 103, TicketRevenue: 141350.0, FnBRevenue: 46434.0, Glass3DRevenue: 1880.0, TotalDailyRevenue: 187784.0 },
    { Date: '2026-09-11', Day: 'Fri', TicketsSold: 451, OccupancyPercent: 29.7, DailyATP: 313.53, DailySPH: 107.03, FnBItemsSold: 426, CafeTransactions: 189, BoxTransactions: 177, ItemsPerTransaction: 2.25, IPH: 0.94, AVT: 255, ASR: 42, TSR: 107, TicketRevenue: 141400.0, FnBRevenue: 48271.0, Glass3DRevenue: 1280.0, TotalDailyRevenue: 189671.0 },
    { Date: '2026-09-12', Day: 'Sat', TicketsSold: 656, OccupancyPercent: 43.2, DailyATP: 306.40, DailySPH: 106.91, FnBItemsSold: 588, CafeTransactions: 235, BoxTransactions: 238, ItemsPerTransaction: 2.50, IPH: 0.90, AVT: 298, ASR: 36, TSR: 99, TicketRevenue: 201000.0, FnBRevenue: 70136.0, Glass3DRevenue: 0.0, TotalDailyRevenue: 271136.0 },
    { Date: '2026-09-13', Day: 'Sun', TicketsSold: 722, OccupancyPercent: 47.6, DailyATP: 285.53, DailySPH: 102.09, FnBItemsSold: 621, CafeTransactions: 287, BoxTransactions: 260, ItemsPerTransaction: 2.16, IPH: 0.86, AVT: 257, ASR: 40, TSR: 110, TicketRevenue: 206150.0, FnBRevenue: 73711.0, Glass3DRevenue: 944.0, TotalDailyRevenue: 279861.0 },
    { Date: '2026-09-14', Day: 'Mon', TicketsSold: 298, OccupancyPercent: 19.6, DailyATP: 268.12, DailySPH: 96.09, FnBItemsSold: 233, CafeTransactions: 102, BoxTransactions: 111, ItemsPerTransaction: 2.28, IPH: 0.78, AVT: 281, ASR: 34, TSR: 92, TicketRevenue: 79900.0, FnBRevenue: 28634.0, Glass3DRevenue: 0.0, TotalDailyRevenue: 108534.0 },
    { Date: '2026-09-15', Day: 'Tue', TicketsSold: 472, OccupancyPercent: 31.1, DailyATP: 166.27, DailySPH: 71.62, FnBItemsSold: 296, CafeTransactions: 137, BoxTransactions: 171, ItemsPerTransaction: 2.16, IPH: 0.63, AVT: 247, ASR: 29, TSR: 80, TicketRevenue: 78478.0, FnBRevenue: 33806.0, Glass3DRevenue: 0.0, TotalDailyRevenue: 112284.0 },
    { Date: '2026-09-16', Day: 'Wed', TicketsSold: 313, OccupancyPercent: 20.6, DailyATP: 271.25, DailySPH: 104.71, FnBItemsSold: 284, CafeTransactions: 135, BoxTransactions: 130, ItemsPerTransaction: 2.10, IPH: 0.91, AVT: 243, ASR: 43, TSR: 104, TicketRevenue: 84900.0, FnBRevenue: 32773.0, Glass3DRevenue: 160.0, TotalDailyRevenue: 117673.0 },
    { Date: '2026-09-17', Day: 'Thu', TicketsSold: 347, OccupancyPercent: 22.9, DailyATP: 263.40, DailySPH: 117.88, FnBItemsSold: 335, CafeTransactions: 115, BoxTransactions: 117, ItemsPerTransaction: 2.91, IPH: 0.97, AVT: 356, ASR: 33, TSR: 98, TicketRevenue: 91400.0, FnBRevenue: 40903.0, Glass3DRevenue: 640.0, TotalDailyRevenue: 132303.0 }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const CinemaID = searchParams.get('CinemaID') || 'Ahilyanagar';
  const FromDate = searchParams.get('FromDate') || '2026-09-01';
  const ToDate = searchParams.get('ToDate') || '2026-09-17';
  const serverUrl = searchParams.get('serverUrl') || undefined;

  return handleRevenueRequest({ CinemaID, FromDate, ToDate, serverUrl });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { CinemaID = 'Ahilyanagar', FromDate = '2026-09-01', ToDate = '2026-09-17', serverUrl } = body;
    return handleRevenueRequest({ CinemaID, FromDate, ToDate, serverUrl });
  } catch (error) {
    return NextResponse.json({
      Status: '0',
      msg: 'Internal error processing request',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function handleRevenueRequest({ CinemaID, FromDate, ToDate, serverUrl }: { CinemaID?: string; FromDate?: string; ToDate?: string; serverUrl?: string }) {
  try {
    // If external ASP.NET WebService endpoint is supplied, attempt live call
    if (serverUrl && typeof serverUrl === 'string' && serverUrl.startsWith('http')) {
      try {
        const targetUrl = serverUrl.endsWith('/') ? `${serverUrl}api.asmx/GetFranchiseRevenueDashboard` : `${serverUrl}/api.asmx/GetFranchiseRevenueDashboard`;
        const resp = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ CinemaID, FromDate, ToDate }),
          signal: AbortSignal.timeout(6000)
        });

        if (resp.ok) {
          const liveData = await resp.json();
          if (liveData?.Status === '1' && liveData?.data) {
            return NextResponse.json({
              Status: '1',
              msg: 'Live data retrieved from Vista WebService',
              isLive: true,
              data: liveData.data
            });
          }
        }
      } catch (externalErr) {
        console.warn('Live Vista WebService unavailable, falling back to verified dataset:', externalErr);
      }
    }

    // Filter default dataset by requested date range
    const filteredDays = DEFAULT_AHILYANAGAR_DATA.DailyBreakdown.filter(d => {
      if (FromDate && d.Date < FromDate) return false;
      if (ToDate && d.Date > ToDate) return false;
      return true;
    });

    const totalTicketsSold = filteredDays.reduce((sum, d) => sum + d.TicketsSold, 0);
    const totalTicketRevenue = filteredDays.reduce((sum, d) => sum + d.TicketRevenue, 0);
    const totalFnBItemsSold = filteredDays.reduce((sum, d) => sum + d.FnBItemsSold, 0);
    const totalFnBRevenue = filteredDays.reduce((sum, d) => sum + d.FnBRevenue, 0);
    const total3DGlassRevenue = filteredDays.reduce((sum, d) => sum + (d.Glass3DRevenue || 0), 0);
    const totalGrossRevenue = totalTicketRevenue + totalFnBRevenue;

    const overallATP = totalTicketsSold > 0 ? parseFloat((totalTicketRevenue / totalTicketsSold).toFixed(2)) : 0;
    const overallSPH = totalTicketsSold > 0 ? parseFloat((totalFnBRevenue / totalTicketsSold).toFixed(2)) : 0;
    const fnbToBoxOfficeRatioPercent = totalTicketRevenue > 0 ? parseFloat(((totalFnBRevenue / totalTicketRevenue) * 100).toFixed(2)) : 0;
    const overallOccupancyPercent = filteredDays.length > 0 
      ? parseFloat((filteredDays.reduce((sum, d) => sum + (d.OccupancyPercent || 0), 0) / filteredDays.length).toFixed(1)) 
      : 0;

    return NextResponse.json({
      Status: '1',
      msg: 'Success',
      isLive: false,
      data: {
        Cinema: DEFAULT_AHILYANAGAR_DATA.Cinema,
        DateRange: {
          FromDate: FromDate || DEFAULT_AHILYANAGAR_DATA.DateRange.FromDate,
          ToDate: ToDate || DEFAULT_AHILYANAGAR_DATA.DateRange.ToDate
        },
        Summary: {
          TotalGrossRevenue: totalGrossRevenue,
          TotalTicketRevenue: totalTicketRevenue,
          TotalFnBRevenue: totalFnBRevenue,
          Total3DGlassRevenue: total3DGlassRevenue,
          TotalTicketsSold: totalTicketsSold,
          TotalFnBItemsSold: totalFnBItemsSold,
          OverallATP: overallATP,
          OverallSPH: overallSPH,
          OverallOccupancyPercent: overallOccupancyPercent,
          FnBToBoxOfficeRatioPercent: fnbToBoxOfficeRatioPercent
        },
        DailyBreakdown: filteredDays
      }
    });
  } catch (error) {
    return NextResponse.json({
      Status: '0',
      msg: 'Internal error processing request',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
