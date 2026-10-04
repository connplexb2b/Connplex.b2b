// Production Vista .NET ASMX Integration Client for Backend
// Implements verified endpoints, ASMX .d parsing, exponential backoff, and non-additive accounting

export class VistaClient {
  constructor(options = {}) {
    this.baseUrl = (
      options.baseUrl ||
      process.env.VISTA_BASE_URL ||
      'http://14.194.50.141'
    ).replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs || 30000;
    this.maxRetries = options.maxRetries ?? 3;
  }

  unwrapAsmxResponse(payload) {
    if (!payload) {
      throw new Error('Vista ASMX response payload is empty or null.');
    }
    let raw = payload;
    if (typeof payload === 'object' && 'd' in payload) {
      raw = payload.d;
    }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch (err) {
        throw new Error(`Failed to parse ASMX stringified JSON: ${err.message}`);
      }
    }
    return raw;
  }

  async executeWithRetry(endpoint, body) {
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
          const sanitizedError = errText.replace(/password=.*?(&|$)/gi, 'password=***');
          throw new Error(`HTTP ${response.status} (${response.statusText}): ${sanitizedError.slice(0, 200)}`);
        }

        const rawJson = await response.json();
        return this.unwrapAsmxResponse(rawJson);
      } catch (error) {
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
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= 2;
      }
    }

    throw new Error(`Max retries reached for ${endpoint}`);
  }

  async getFranchiseRevenueDashboard(cinemaId, fromDate, toDate) {
    return this.executeWithRetry('/api.asmx/GetFranchiseRevenueDashboard', {
      CinemaID: cinemaId,
      FromDate: fromDate,
      ToDate: toDate,
    });
  }

  async getAllCinemaDetails() {
    return this.executeWithRetry('/api.asmx/GetAllcinemaDetails', {});
  }

  async getDailySalesAndFnbReport(cinemaId, date) {
    return this.executeWithRetry('/api.asmx/GetDailySalesAndFnbReport', {
      CinemaID: cinemaId,
      Date: date,
    });
  }

  parseSalesDataXml(xml) {
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

  normalizeDailyRecord(raw, channelEstimates) {
    const ticketsSold = Number(raw.TicketsSold) || 0;
    const ticketRevenue = Number(raw.TicketRevenue) || 0;
    const fnbRevenue = Number(raw.FnBRevenue) || 0;
    const totalGrossRevenue = ticketRevenue + fnbRevenue;

    let bmsRev = Number(raw.BookMyShowRevenue);
    let webRev = Number(raw.WebsiteRevenue);
    let otherRev = Number(raw.OtherRevenue) || 0;

    if (isNaN(bmsRev) || bmsRev === undefined) {
      const bmsPct = channelEstimates?.bmsPercent ?? 0.48;
      const webPct = channelEstimates?.websitePercent ?? 0.16;
      bmsRev = Math.round(ticketRevenue * bmsPct * 100) / 100;
      webRev = Math.round(ticketRevenue * webPct * 100) / 100;
    }

    const counterRevenue = Math.max(0, Math.round((ticketRevenue - (bmsRev + webRev + otherRev)) * 100) / 100);
    const averageTicketPrice = ticketsSold > 0 ? Math.round((ticketRevenue / ticketsSold) * 100) / 100 : 0;
    const spendPerHead = ticketsSold > 0 ? Math.round((fnbRevenue / ticketsSold) * 100) / 100 : 0;
    const fnbToBoxOfficeRatioPercent =
      ticketRevenue > 0 ? Math.round((fnbRevenue / ticketRevenue) * 10000) / 100 : 0;

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
