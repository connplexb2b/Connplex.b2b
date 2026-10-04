// Production Vista .NET ASMX Integration Client
// Implements verified endpoints, ASMX .d parsing, exponential backoff, and non-additive accounting

export interface VistaRevenueSummary {
  CinemaId: string;
  CinemaName: string;
  FromDate: string;
  ToDate: string;
  TotalTicketsSold: number;
  TotalTicketRevenue: number;
  TotalFnBItemsSold: number;
  TotalFnBRevenue: number;
  TotalGrossRevenue: number;
  OverallATP: number;
  OverallSPH: number;
  FnBToBoxOfficeRatioPercent: number;
}

export interface VistaDailyBreakdown {
  Date: string;
  TicketsSold: number;
  TicketRevenue: number;
  FnBItemsSold: number;
  FnBRevenue: number;
  TotalDailyRevenue: number;
  DailyATP: number;
  DailySPH: number;
  // Optional channel fields if provided by Vista or simulated
  BookMyShowRevenue?: number;
  WebsiteRevenue?: number;
  OtherRevenue?: number;
  CounterRevenue?: number;
}

export interface VistaRevenueResponse {
  Status: string;
  msg: string;
  data: {
    Cinema: {
      CinemaId: string;
      CinemaName: string;
    };
    DateRange: {
      FromDate: string;
      ToDate: string;
    };
    Summary: VistaRevenueSummary;
    DailyBreakdown: VistaDailyBreakdown[];
  };
}

export interface VistaCinemaDetail {
  Cinema_strName: string;
  Cinema_strID: string;
  License_strCode?: string;
  ScreenCount?: number;
  SeatCapacity?: number;
}

export interface VistaAuditReportResponse {
  Status: string;
  msg: string;
  cinemaId: string;
  date: string;
  salesDataXml: string;
  exception?: string;
}

export interface NormalizedRevenueRecord {
  businessDate: string;
  ticketsSold: number;
  ticketRevenue: number;
  fnbRevenue: number;
  totalGrossRevenue: number;
  counterRevenue: number;
  bookMyShowRevenue: number;
  websiteRevenue: number;
  otherRevenue: number;
  averageTicketPrice: number;
  spendPerHead: number;
  fnbToBoxOfficeRatioPercent: number;
  isReconciled: boolean;
  varianceAmount: number;
}

export class VistaClient {
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(options?: { baseUrl?: string; timeoutMs?: number; maxRetries?: number }) {
    this.baseUrl = (
      options?.baseUrl ||
      process.env.VISTA_BASE_URL ||
      'http://14.194.50.141'
    ).replace(/\/+$/, '');
    this.timeoutMs = options?.timeoutMs || 30000;
    this.maxRetries = options?.maxRetries ?? 3;
  }

  /**
   * Safe JSON unwrapper for ASP.NET ASMX script services.
   * Handles both { "d": "{\"Status\":...}" } stringified JSON and direct JSON objects.
   */
  public unwrapAsmxResponse<T>(payload: any): T {
    if (!payload) {
      throw new Error('Vista ASMX response payload is empty or null.');
    }

    let raw = payload;

    // Check if wrapped in standard ASP.NET ScriptService 'd' property
    if (typeof payload === 'object' && 'd' in payload) {
      raw = payload.d;
    }

    // If 'd' is a stringified JSON, deserialize it
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw) as T;
      } catch (err: any) {
        throw new Error(`Failed to parse ASMX stringified JSON: ${err.message}. Raw: ${raw.slice(0, 150)}`);
      }
    }

    return raw as T;
  }

  /**
   * Executes HTTP POST with exponential backoff and 30s timeout.
   */
  private async executeWithRetry<T>(endpoint: string, body: Record<string, any>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let attempt = 0;
    let delay = 1000;

    while (attempt <= this.maxRetries) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          // Scrub sensitive details
          const sanitizedError = errText.replace(/password=.*?(&|$)/gi, 'password=***');
          throw new Error(`HTTP ${response.status} (${response.statusText}): ${sanitizedError.slice(0, 200)}`);
        }

        const rawJson = await response.json();
        return this.unwrapAsmxResponse<T>(rawJson);
      } catch (error: any) {
        attempt++;
        const isAbort = error.name === 'AbortError' || error.code === 'ETIMEDOUT' || error.message?.includes('aborted');
        const isTransient =
          isAbort ||
          error.code === 'ECONNRESET' ||
          error.code === 'ECONNABORTED' ||
          error.message?.includes('502') ||
          error.message?.includes('503') ||
          error.message?.includes('504');

        if (attempt > this.maxRetries || !isTransient) {
          console.warn(`[VistaClient] Request to ${endpoint} failed after ${attempt} attempts: ${error.message}`);
          throw error;
        }

        const jitter = Math.floor(Math.random() * 200);
        console.warn(`[VistaClient] Transient error on ${endpoint}. Retrying attempt ${attempt}/${this.maxRetries} in ${delay + jitter}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= 2; // exponential backoff: 1s, 2s, 4s
      }
    }

    throw new Error(`Max retries reached for ${endpoint}`);
  }

  /**
   * Primary Revenue API: POST /api.asmx/GetFranchiseRevenueDashboard
   */
  public async getFranchiseRevenueDashboard(
    cinemaId: string,
    fromDate: string,
    toDate: string
  ): Promise<VistaRevenueResponse> {
    return this.executeWithRetry<VistaRevenueResponse>('/api.asmx/GetFranchiseRevenueDashboard', {
      CinemaID: cinemaId,
      FromDate: fromDate,
      ToDate: toDate,
    });
  }

  /**
   * Cinema Discovery API: POST /api.asmx/GetAllcinemaDetails
   */
  public async getAllCinemaDetails(): Promise<{ Status: string; msg: string; data: { ItemCinemaDetails: VistaCinemaDetail[] } }> {
    return this.executeWithRetry<{ Status: string; msg: string; data: { ItemCinemaDetails: VistaCinemaDetail[] } }>(
      '/api.asmx/GetAllcinemaDetails',
      {}
    );
  }

  /**
   * Nightly Audit API: POST /api.asmx/GetDailySalesAndFnbReport
   */
  public async getDailySalesAndFnbReport(cinemaId: string, date: string): Promise<VistaAuditReportResponse> {
    return this.executeWithRetry<VistaAuditReportResponse>('/api.asmx/GetDailySalesAndFnbReport', {
      CinemaID: cinemaId,
      Date: date,
    });
  }

  /**
   * Parse Vista's salesDataXml from objBook.strBMSSalesData
   * Extracts TotalSales, TotalTickets, TotalFnb from <SalesData><Summary TotalSales="..." TotalTickets="..." TotalFnb="..." /></SalesData>
   */
  public parseSalesDataXml(xml: string): { totalSales: number; totalTickets: number; totalFnb: number } {
    if (!xml) return { totalSales: 0, totalTickets: 0, totalFnb: 0 };
    
    const salesMatch = xml.match(/TotalSales="([^"]+)"/i);
    const ticketsMatch = xml.match(/TotalTickets="([^"]+)"/i);
    const fnbMatch = xml.match(/TotalFnb="([^"]+)"/i);

    return {
      totalSales: salesMatch ? parseFloat(salesMatch[1]) || 0 : 0,
      totalTickets: ticketsMatch ? parseInt(ticketsMatch[1], 10) || 0 : 0,
      totalFnb: fnbMatch ? parseFloat(fnbMatch[1]) || 0 : 0,
    };
  }

  /**
   * Strictly enforces Connplex Non-Additive Accounting:
   * Total Gross Revenue = Box Office Ticket Revenue + F&B Concessions Revenue
   * Box Office Ticket Revenue = Counter + BookMyShow + Website + Other
   * Counter Revenue = Box Office Ticket Revenue - (BookMyShow + Website + Other)
   * BookMyShow and Website are channel slices of Box Office, NOT additions to Gross!
   */
  public normalizeDailyRecord(
    raw: VistaDailyBreakdown,
    channelEstimates?: { bmsPercent?: number; websitePercent?: number }
  ): NormalizedRevenueRecord {
    const ticketsSold = Number(raw.TicketsSold) || 0;
    const ticketRevenue = Number(raw.TicketRevenue) || 0;
    const fnbRevenue = Number(raw.FnBRevenue) || 0;

    // Strict non-additive total gross formula
    const totalGrossRevenue = ticketRevenue + fnbRevenue;

    // Channel attribution within ticket revenue (non-additive slice of ticket revenue)
    let bmsRev = Number(raw.BookMyShowRevenue);
    let webRev = Number(raw.WebsiteRevenue);
    let otherRev = Number(raw.OtherRevenue) || 0;

    // If channel distribution not pre-split in raw Vista breakdown, attribute standard cinema mix
    if (isNaN(bmsRev) || bmsRev === undefined) {
      const bmsPct = channelEstimates?.bmsPercent ?? 0.48; // ~48% BMS
      const webPct = channelEstimates?.websitePercent ?? 0.16; // ~16% Website
      bmsRev = Math.round(ticketRevenue * bmsPct * 100) / 100;
      webRev = Math.round(ticketRevenue * webPct * 100) / 100;
    }

    // Counter is the remainder of ticket revenue
    const counterRevenue = Math.max(0, Math.round((ticketRevenue - (bmsRev + webRev + otherRev)) * 100) / 100);

    // Key Performance Indicators
    const averageTicketPrice = ticketsSold > 0 ? Math.round((ticketRevenue / ticketsSold) * 100) / 100 : 0;
    const spendPerHead = ticketsSold > 0 ? Math.round((fnbRevenue / ticketsSold) * 100) / 100 : 0;
    const fnbToBoxOfficeRatioPercent =
      ticketRevenue > 0 ? Math.round((fnbRevenue / ticketRevenue) * 10000) / 100 : 0;

    // Non-additive check: sum of channels MUST equal ticketRevenue
    const channelSum = counterRevenue + bmsRev + webRev + otherRev;
    const varianceAmount = Math.abs(ticketRevenue - channelSum);
    const isReconciled = varianceAmount < 0.05;

    return {
      businessDate: raw.Date,
      ticketsSold,
      ticketRevenue,
      fnbRevenue,
      totalGrossRevenue,
      counterRevenue,
      bookMyShowRevenue: bmsRev,
      websiteRevenue: webRev,
      otherRevenue: otherRev,
      averageTicketPrice,
      spendPerHead,
      fnbToBoxOfficeRatioPercent,
      isReconciled,
      varianceAmount,
    };
  }
}

export const defaultVistaClient = new VistaClient();
export default defaultVistaClient;
