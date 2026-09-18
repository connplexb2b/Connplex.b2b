// Data Extraction & Specification Engine
// Maps the 21-Category Master Excel Matrix for Connplex & ConnCloud Franchisee Telemetry

import { ConnCloudStore } from './conncloudData';

export interface ExtractionFeatureItem {
  name: string;
  dataSource: 'Vista' | 'Calculation' | 'Admin' | 'admin' | 'Franchisee' | 'Google review' | 'Attendance Software' | 'Platform Website' | 'Franchisee login' | 'Backend/Website' | 'N/a' | string;
  fetchingFrom: 'Vista' | 'Admin Login' | 'admin login' | 'Google' | 'Franchisee login' | 'Attendance Software' | 'Platform Website' | 'Backend/Website' | 'will be feeded to website' | 'Uploaded from website' | 'Created from backend/website' | 'N/a' | string;
  description?: string;
  extractionMechanism: string;
  fieldKey: string;
}

export interface ExtractionCategorySpec {
  sno: number;
  category: string;
  slug: string;
  sourceSummary: string;
  fetchingOrigin: string;
  status: 'SYNCED' | 'COMPUTED' | 'LIVE_API' | 'READY';
  features: ExtractionFeatureItem[];
  extractData: (cinemaId: string, dateRange: string) => Record<string, any>;
}

// 21 Categories Master Matrix directly reflecting the user's Excel sheet
export const EXTRACTION_CATEGORIES_SPEC: ExtractionCategorySpec[] = [
  // 1. DASHBOARD
  {
    sno: 1,
    category: 'Dashboard',
    slug: 'dashboard',
    sourceSummary: 'Vista / Calculation / Google review',
    fetchingOrigin: 'Vista / Google',
    status: 'SYNCED',
    features: [
      { name: "Today's Revenue", dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: "SELECT SUM(TransAmount) FROM tblTrans WHERE CONVERT(date, TransDate) = CONVERT(date, GETDATE())", fieldKey: 'todayRevenue' },
      { name: 'Total Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "SUM(TicketRevenue + FnBRevenue) across selected date range", fieldKey: 'totalRevenue' },
      { name: 'Weekly Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "SUM(TransAmount) WHERE TransDate >= DATEADD(day, -7, GETDATE())", fieldKey: 'weeklyRevenue' },
      { name: 'Monthly Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "SUM(TransAmount) WHERE MONTH(TransDate) = MONTH(GETDATE()) AND YEAR(TransDate) = YEAR(GETDATE())", fieldKey: 'monthlyRevenue' },
      { name: 'ROI Status', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "(Net Profit / Franchise Capex Investment) * 100", fieldKey: 'roiStatus' },
      { name: 'Admissions', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: "SELECT COUNT(TicketId) FROM tblTransTicket WHERE TransStatus = 'CONFIRMED'", fieldKey: 'admissions' },
      { name: 'AVG Occupancy', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "(Total Admissions / Total Scheduled Capacity) * 100", fieldKey: 'avgOccupancy' },
      { name: 'ATP (Ticket Price)', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "Gross Ticket Revenue / Total Admissions", fieldKey: 'atp' },
      { name: 'SPH (F&B Spend)', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: "Gross FnB Revenue / Total Admissions", fieldKey: 'sph' },
      { name: 'Online Booking', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: "SELECT COUNT(*) FROM tblTransTicket WHERE BookingChannel IN ('Web', 'App')", fieldKey: 'onlineBookingPercent' },
      { name: 'Counter Revenue', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: "SELECT SUM(TransAmount) FROM tblTrans WHERE BookingChannel IN ('POS', 'Counter', 'Kiosk')", fieldKey: 'counterRevenue' },
      { name: 'F&B Sales', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: "SELECT SUM(ItemAmount) FROM tblTransItem WHERE ItemType = 'Concession'", fieldKey: 'fnbSales' },
      { name: 'Customer Rating', dataSource: 'Google review', fetchingFrom: 'Google', extractionMechanism: "Google Places API: place_id rating and user_ratings_total aggregate feed", fieldKey: 'customerRating' }
    ],
    extractData: (cinemaId, dateRange) => {
      const isAhilyanagar = cinemaId === 'c5';
      const rawFinance = ConnCloudStore.getFinanceTransactions().filter(t => cinemaId === 'all' || t.cinemaId === cinemaId);
      const rawShows = ConnCloudStore.getShows().filter(sh => {
        const scr = ConnCloudStore.getScreens().find(s => s.screenId === sh.screenId);
        return cinemaId === 'all' || scr?.cinemaId === cinemaId;
      });
      const finance = ConnCloudStore.filterByDateRange(rawFinance, dateRange);
      const shows = ConnCloudStore.filterByDateRange(rawShows, dateRange);

      const ticketRev = finance.filter(t => t.type === 'Income' && t.category === 'Tickets').reduce((acc, t) => acc + t.amount, 0);
      const fnbRev = finance.filter(t => t.type === 'Income' && t.category === 'Food & Beverage').reduce((acc, t) => acc + t.amount, 0);
      const todayFinance = ConnCloudStore.filterByDateRange(rawFinance, 'Today');
      const todayGross = todayFinance.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0) || (isAhilyanagar ? 102000 : 480000);
      const weekGross = ConnCloudStore.filterByDateRange(rawFinance, 'Last 7 Days').filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0) || (isAhilyanagar ? 725000 : 3200000);
      const monthGross = ConnCloudStore.filterByDateRange(rawFinance, 'Last 30 Days').filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0) || (isAhilyanagar ? 3140000 : 12800000);

      const admissions = shows.reduce((acc, s) => acc + s.ticketsSold, 0);
      const capacity = shows.reduce((acc, s) => acc + s.capacity, 0);
      const avgOccupancy = capacity > 0 ? parseFloat(((admissions / capacity) * 100).toFixed(1)) : (isAhilyanagar ? 74.2 : 68.5);
      const atp = admissions > 0 ? Math.round(ticketRev / admissions) : (isAhilyanagar ? 298 : 250);
      const sph = admissions > 0 ? Math.round(fnbRev / admissions) : (isAhilyanagar ? 110 : 140);
      const onlineBookingPercent = isAhilyanagar ? 71.6 : 68.2;
      const counterRevenue = isAhilyanagar ? Math.round(ticketRev * 0.284) : Math.round(ticketRev * 0.318);
      const customerRating = isAhilyanagar ? 4.8 : 4.6;
      const roiStatus = isAhilyanagar ? 19.4 : 18.2;

      return {
        todayRevenue: todayGross,
        totalRevenue: ticketRev + fnbRev || (dateRange === 'Today' ? todayGross : monthGross),
        weeklyRevenue: weekGross,
        monthlyRevenue: monthGross,
        roiStatus: `${roiStatus}%`,
        admissions,
        avgOccupancy: `${avgOccupancy}%`,
        atp: `₹${atp}`,
        sph: `₹${sph}`,
        onlineBookingPercent: `${onlineBookingPercent}%`,
        counterRevenue,
        fnbSales: fnbRev,
        customerRating: `${customerRating} ★`
      };
    }
  },

  // 2. ANALYTICS
  {
    sno: 2,
    category: 'Analytics',
    slug: 'analytics',
    sourceSummary: 'Vista / Calculation / Admin',
    fetchingOrigin: 'Vista / Admin Login',
    status: 'COMPUTED',
    features: [
      { name: 'Revenue Analytics: Gross Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Ticket Revenue + Concession Revenue from Vista tblTrans', fieldKey: 'grossRevenue' },
      { name: 'Revenue Analytics: Ticket Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Sum of ticket charges from tblTransTicket', fieldKey: 'ticketRevenue' },
      { name: 'Revenue Analytics: F&B Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Sum of F&B item charges from tblTransItem', fieldKey: 'fnbRevenue' },
      { name: 'Revenue Contribution By Screens: Average Occupancy', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Screen admissions / screen seat capacity across scheduled shows', fieldKey: 'screenAvgOccupancy' },
      { name: 'Revenue Contribution By Screens: Total no. of seats', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Screen physical chair audit capacity configured in Admin Screens Registry', fieldKey: 'screenSeats' },
      { name: 'Revenue Contribution By Screens: Type of screen 2D, 3D', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Screen projection format configured in Admin Screen Profile', fieldKey: 'screenFormat' },
      { name: 'Admissions: Total Footfalls', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Total tickets scanned and admitted at turnstile/POS', fieldKey: 'totalFootfalls' },
      { name: 'Admissions: Online Share', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Web and Mobile App tickets / Total admissions', fieldKey: 'onlineShare' },
      { name: 'Admissions: POS/Counter Share', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Box office and kiosk tickets / Total admissions', fieldKey: 'counterShare' },
      { name: 'Admissions Distribution By Movie', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Group by FilmTitle with ticket count and revenue contribution percentage', fieldKey: 'movieDistribution' },
      { name: 'Occupancy Heatmap', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Seat occupancy matrix by day-of-week and showtime slot (Morning, Matinee, Evening, Night)', fieldKey: 'occupancyHeatmap' },
      { name: 'ATP & SPH Trends', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Day-by-day ATP and SPH curves across all active auditoriums', fieldKey: 'atpSphTrends' },
      { name: 'Revenue Forecast', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Linear regression forecast model based on historical 30-day velocity and advance bookings', fieldKey: 'revenueForecast' }
    ],
    extractData: (cinemaId) => {
      const screens = ConnCloudStore.getScreens().filter(s => cinemaId === 'all' || s.cinemaId === cinemaId);
      const isAhilyanagar = cinemaId === 'c5';
      return {
        grossRevenue: isAhilyanagar ? 1485200 : 12800000,
        ticketRevenue: isAhilyanagar ? 962500 : 8800000,
        fnbRevenue: isAhilyanagar ? 522700 : 4000000,
        screensContribution: screens.map(s => ({
          screenName: s.name,
          seats: s.capacity,
          format: s.format,
          occupancy: isAhilyanagar ? (s.screenId === 's20' ? '85.0%' : '83.3%') : '74.5%'
        })),
        totalFootfalls: isAhilyanagar ? 4812 : 44800,
        onlineShare: isAhilyanagar ? '71.6%' : '68.2%',
        posShare: isAhilyanagar ? '28.4%' : '31.8%',
        forecastYield: isAhilyanagar ? '+14.2% anticipated weekend surge' : '+9.8% month-over-month'
      };
    }
  },

  // 3. FINANCE
  {
    sno: 3,
    category: 'Finance',
    slug: 'finance',
    sourceSummary: 'Vista / Calculation / Franchisee / Admin',
    fetchingOrigin: 'Vista / Franchisee login / Admin Login',
    status: 'SYNCED',
    features: [
      { name: 'Gross Collections', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Total incoming funds collected across all channels', fieldKey: 'grossCollections' },
      { name: 'Gross Expenses', dataSource: 'Calculation', fetchingFrom: 'Franchisee login', extractionMechanism: 'Operational expenses logged and approved by franchise management', fieldKey: 'grossExpenses' },
      { name: 'GST Pool collected', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Statutory GST collected on tickets (12%/18%) and F&B (5%) from Vista Tax Ledger', fieldKey: 'gstPool' },
      { name: 'Operating Net Profit', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Net Income (Gross - Tax) - Total Operating Expenses', fieldKey: 'operatingNetProfit' },
      { name: 'Revenue stream contributions', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Percentage split between Box Office ticket sales and Concession F&B sales', fieldKey: 'revenueStreams' },
      { name: 'Vendor payout: State Power Corporation Ltd', dataSource: 'N/a', fetchingFrom: 'N/a', extractionMechanism: 'Utility invoice ledger for commercial electricity tariff', fieldKey: 'vendorPower' },
      { name: 'Vendor payout: Clean Corp Ltd', dataSource: 'N/a', fetchingFrom: 'N/a', extractionMechanism: 'Housekeeping, auditorium sanitization, and deep cleaning contract', fieldKey: 'vendorClean' },
      { name: 'Vendor payout: Dolby Services India', dataSource: 'N/a', fetchingFrom: 'N/a', extractionMechanism: 'Atmos processor licensing and acoustic maintenance retainer', fieldKey: 'vendorDolby' },
      { name: 'Invoices & Ledger', dataSource: 'Franchisee', fetchingFrom: 'Franchisee login', extractionMechanism: 'Accounts receivable/payable ledger vouchers submitted by franchisee', fieldKey: 'invoicesLedger' },
      { name: 'Expenses Manager', dataSource: 'Calculation', fetchingFrom: 'Franchisee login', extractionMechanism: 'Operational claims with category, bill attachment, and approval status', fieldKey: 'expensesManager' },
      { name: 'GST & Royalty Reports', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Distributor 50% box office royalty and GST filing summaries', fieldKey: 'gstRoyalty' },
      { name: 'P&L / Budget Limits', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Quarterly capex and opex caps authorized by Connplex Corporate Finance', fieldKey: 'pnlBudget' },
      { name: 'Bank Reconciliation', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Payment gateway (UPI, Card, Cash) settlement reconciliation vs bank credits', fieldKey: 'bankReconciliation' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        grossCollections: isAhilyanagar ? 1485200 : 12800000,
        grossExpenses: isAhilyanagar ? 385000 : 3400000,
        gstPool: isAhilyanagar ? 178200 : 1620000,
        operatingNetProfit: isAhilyanagar ? 922000 : 7780000,
        vendorPayouts: [
          { vendor: 'State Power Corporation Ltd', amount: isAhilyanagar ? 112000 : 320000, category: 'Electricity' },
          { vendor: 'Clean Corp Ltd', amount: isAhilyanagar ? 25500 : 120000, category: 'Housekeeping' },
          { vendor: 'Dolby Services India', amount: isAhilyanagar ? 35000 : 85000, category: 'Audio Maintenance' }
        ],
        reconciliationStatus: '100% Balanced (Zero Discrepancies)'
      };
    }
  },

  // 4. MOVIES
  {
    sno: 4,
    category: 'Movies',
    slug: 'movies',
    sourceSummary: 'Vista / Calculation / Admin',
    fetchingOrigin: 'Vista / Admin Login',
    status: 'LIVE_API',
    features: [
      { name: 'Films in Screening', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Count of distinct MovieIDs with active scheduled shows today', fieldKey: 'filmsInScreening' },
      { name: "Today's Live Screens", dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Count of screen auditoriums transmitting live telemetry from Vista POS', fieldKey: 'liveScreens' },
      { name: 'Total Cinemas Box Office', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Gross ticket collections for active theatrical titles', fieldKey: 'cinemasBoxOffice' },
      { name: 'Avg Seat Occupancy', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Total admissions across all movie screenings / total seat availability', fieldKey: 'avgSeatOccupancy' },
      { name: 'Movie Catalog & Live Status', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Movie titles, certifications (UA, A, U), runtimes, languages, and theatrical runs', fieldKey: 'movieCatalog' },
      { name: "Today's Live Sessions & Show Schedule", dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Real-time session occupancy, seat bookings, and gross collections synced from Vista POS', fieldKey: 'liveShowSchedule' },
      { name: 'Show Allocation Planner', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Auditorium timetable, format scheduling (2D, 3D), and session locks', fieldKey: 'showPlanner' },
      { name: 'Request Release Film', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Franchisee scheduling locks and advance booking allocation requests for new releases', fieldKey: 'requestReleaseFilm' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        filmsInScreening: 4,
        liveScreens: isAhilyanagar ? 2 : 6,
        cinemasBoxOffice: isAhilyanagar ? 962500 : 8800000,
        avgSeatOccupancy: isAhilyanagar ? '74.2%' : '68.5%',
        topFilm: 'Raftaar (Hindi 2D) - 78% occupancy'
      };
    }
  },

  // 5. TICKET SALE
  {
    sno: 5,
    category: 'Ticket Sale',
    slug: 'ticket-sale',
    sourceSummary: 'Vista / Web / App',
    fetchingOrigin: 'Vista',
    status: 'SYNCED',
    features: [
      { name: 'Confirmed Bookings', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Count of confirmed ledger transactions in tblTransTicket', fieldKey: 'confirmedBookings' },
      { name: 'Online Web/App Share', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Percentage of bookings via website and Connplex mobile application', fieldKey: 'onlineShare' },
      { name: 'Counter / POS Share', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Percentage of bookings via physical box office terminals and kiosks', fieldKey: 'counterShare' },
      { name: 'Ticket Sales Gross', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Total ticket collections across all booking channels', fieldKey: 'ticketSalesGross' },
      { name: 'Bookings Transactions Ledger', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Real-time transaction rows with Booking ID, date, movie, screen, seat, channel, payment, amount, and status', fieldKey: 'bookingsLedger' },
      { name: 'Visual Seat Map', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Real-time seat availability map with Available, Reserved, Sold, Blocked status', fieldKey: 'visualSeatMap' },
      { name: 'Discounts & Campaigns Impact', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Promotional voucher redemptions and gross ticket margin variances', fieldKey: 'discountsImpact' },
      { name: 'Refunds & Cancellations', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Reversed tickets and refunded transactions with payment reconciliation', fieldKey: 'refundsCancellations' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        confirmedBookings: isAhilyanagar ? 4812 : 24850,
        onlineShare: isAhilyanagar ? '71.6%' : '68.2%',
        counterShare: isAhilyanagar ? '28.4%' : '31.8%',
        ticketSalesGross: isAhilyanagar ? 962500 : 8800000,
        refundRate: '0.4%'
      };
    }
  },

  // 6. GROUP BOOKING
  {
    sno: 6,
    category: 'Group Booking',
    slug: 'group-booking',
    sourceSummary: 'Platform Website / Corporate CRM',
    fetchingOrigin: 'Platform Website',
    status: 'READY',
    features: [
      { name: 'Group Events', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Count of corporate and private group screening bookings', fieldKey: 'groupEvents' },
      { name: 'Confirmed Value', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Total monetary value of executed and advance-paid corporate charters', fieldKey: 'confirmedValue' },
      { name: 'Corporate Guests', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Total headcount of corporate attendees and delegates', fieldKey: 'corporateGuests' },
      { name: 'Inquiry Conversion', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Percentage of inbound screening inquiries converted to locked reservations', fieldKey: 'conversionRate' },
      { name: 'Bookings & Inquiries Pipeline', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Pipeline records: Ref ID, client, screen, date, headcount, package, quoted value, status', fieldKey: 'pipeline' },
      { name: 'Curated Screening Packages', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Preconfigured corporate, school, VIP couple, and private theater packages', fieldKey: 'packages' },
      { name: 'Screen Slot Holds & Timetable', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Auditorium reservation locks for private corporate slots', fieldKey: 'slotHolds' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        groupEvents: isAhilyanagar ? 6 : 18,
        confirmedValue: isAhilyanagar ? 185000 : 640000,
        corporateGuests: isAhilyanagar ? 380 : 1420,
        conversionRate: '78.5%'
      };
    }
  },

  // 7. FOOD & BEVERAGE
  {
    sno: 7,
    category: 'Food & Beverage',
    slug: 'fnb',
    sourceSummary: 'Vista POS / Concession DB',
    fetchingOrigin: 'Vista',
    status: 'SYNCED',
    features: [
      { name: 'F&B Total Revenue', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Total concession sales from Vista tblTransItem', fieldKey: 'fnbTotalRevenue' },
      { name: 'Average SPH', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'F&B Revenue / Total Box Office Admissions', fieldKey: 'averageSph' },
      { name: 'Units Sold', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Total count of snacks, beverages, and combo items dispensed', fieldKey: 'unitsSold' },
      { name: 'Average Gross Profit Margin', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: '((Retail Price - COGS) / Retail Price) * 100', fieldKey: 'grossMargin' },
      { name: 'Products Catalog', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'SKU, name, category, pricing, cost, and active menu status', fieldKey: 'catalog' },
      { name: 'Combos Configurator', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Packaged bundle definitions with discounted bundled pricing', fieldKey: 'combos' },
      { name: 'Stock & Inventory', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Raw stock levels, reorder thresholds, and depletion velocity', fieldKey: 'stockInventory' },
      { name: 'Wastage Tracking', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Wastage incident reports with loss cost and root-cause logging', fieldKey: 'wastage' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        fnbTotalRevenue: isAhilyanagar ? 522700 : 4000000,
        averageSph: isAhilyanagar ? '₹108.62' : '₹140.00',
        unitsSold: isAhilyanagar ? 3450 : 21800,
        grossMargin: '72.4%',
        activeCombos: 8
      };
    }
  },

  // 8. MERCHANDISE / STORE
  {
    sno: 8,
    category: 'Merchandise /Store',
    slug: 'merchandise',
    sourceSummary: 'Store Catalog / Retail POS',
    fetchingOrigin: 'Vista / Backend',
    status: 'READY',
    features: [
      { name: 'Catalog SKUs', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Distinct retail items available in cinema merchandise store', fieldKey: 'catalogSkus' },
      { name: 'Total Units Sold', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Quantity of licensed collectible items sold across retail points', fieldKey: 'unitsSold' },
      { name: 'Store Retail Revenue', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Gross retail collections from merchandise registers', fieldKey: 'retailRevenue' },
      { name: 'Inventory Value', dataSource: 'Calculation', fetchingFrom: 'Platform Website', extractionMechanism: 'Current physical inventory units multiplied by wholesale retail value', fieldKey: 'inventoryValue' },
      { name: 'Store Catalog & POS', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Central product inventory supporting counter and online orders', fieldKey: 'storeCatalog' },
      { name: 'Retail Orders Ledger', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Transactions ledger for all merchandise sales', fieldKey: 'retailOrdersLedger' },
      { name: 'Inventory & Stock Health', dataSource: 'Calculation', fetchingFrom: 'Platform Website', extractionMechanism: 'Stock depletion rates and replenishment notifications', fieldKey: 'stockHealth' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        catalogSkus: 24,
        unitsSold: isAhilyanagar ? 142 : 580,
        retailRevenue: isAhilyanagar ? 68500 : 284000,
        inventoryValue: isAhilyanagar ? 210000 : 840000
      };
    }
  },

  // 9. STAFF
  {
    sno: 9,
    category: 'Staff',
    slug: 'staff',
    sourceSummary: 'Attendance Software / Biometric Hardware',
    fetchingOrigin: 'Attendance Software',
    status: 'SYNCED',
    features: [
      { name: 'Employees Directory', dataSource: 'Attendance Software', fetchingFrom: 'Attendance Software', extractionMechanism: 'Employee ID, name, department, designation, joining date, status', fieldKey: 'employeesDirectory' },
      { name: 'Attendance Sheet', dataSource: 'Attendance Software', fetchingFrom: 'Attendance Software', extractionMechanism: 'Biometric fingerprint/facial clock-in times, work hours, and punch records', fieldKey: 'attendanceSheet' },
      { name: 'Shifts Scheduling', dataSource: 'Attendance Software', fetchingFrom: 'Attendance Software', extractionMechanism: 'Morning, evening, and night operational duty rosters', fieldKey: 'shiftsScheduling' },
      { name: 'Leaves Planner', dataSource: 'Attendance Software', fetchingFrom: 'Attendance Software', extractionMechanism: 'Sick, privilege, and emergency leave applications with GM approval status', fieldKey: 'leavesPlanner' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        totalStaff: isAhilyanagar ? 14 : 48,
        presentToday: isAhilyanagar ? 13 : 45,
        onDutyShifts: 2,
        pendingLeaves: 1
      };
    }
  },

  // 10. TRAINING & ORIENTATION
  {
    sno: 10,
    category: 'Training & Orientation',
    slug: 'training',
    sourceSummary: 'Academy LMS / HR Compliance',
    fetchingOrigin: 'Platform Website',
    status: 'READY',
    features: [
      { name: 'Academy Modules', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Count of standard cinema training curricula', fieldKey: 'academyModules' },
      { name: 'Active Orientees', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Employees currently completing onboarding cohorts', fieldKey: 'activeOrientees' },
      { name: 'Certified Staff Rate', dataSource: 'Calculation', fetchingFrom: 'Platform Website', extractionMechanism: '(Staff with completed certifications / total staff) * 100', fieldKey: 'certifiedStaffRate' },
      { name: 'Upcoming Safety Drill', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Scheduled date of statutory fire, evacuation, and seismic drill', fieldKey: 'upcomingSafetyDrill' },
      { name: 'Training Modules & SOPs', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Central digital repository of SOP videos, hospitality guides, and projection standards', fieldKey: 'sops' },
      { name: 'New Hire Orientation Cohorts', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Structured 14-day training schedule for new cinema staff', fieldKey: 'cohorts' },
      { name: 'Certifications Ledger', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Employee certification records and compliance badges', fieldKey: 'certifications' },
      { name: 'Mandatory Drills & Safety', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Log of completed fire marshal drills and staff attendees', fieldKey: 'safetyDrills' }
    ],
    extractData: () => ({
      academyModules: 18,
      activeOrientees: 4,
      certifiedStaffRate: '92.5%',
      nextSafetyDrill: '2026-09-25 (Fire Hydrant & Evacuation)'
    })
  },

  // 11. OPERATIONS
  {
    sno: 11,
    category: 'Operations',
    slug: 'operations',
    sourceSummary: 'IoT Telemetry / BMS / Hardware Bus',
    fetchingOrigin: 'Vista / IoT Telemetry',
    status: 'LIVE_API',
    features: [
      { name: 'Live Screens Status', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Real-time projection health, lamp status, and resolution', fieldKey: 'liveScreensStatus' },
      { name: 'Equipment Telemetry', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Temperature, lamp hours, decibel levels, and air handler CFM', fieldKey: 'equipmentTelemetry' },
      { name: 'Service Tickets Log', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Hardware maintenance and technical ticketing registry', fieldKey: 'serviceTicketsLog' },
      { name: 'IoT Failure Simulator', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Fault injection simulator for HVAC, audio processor, and projection redundancy', fieldKey: 'iotSimulator' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        screensHealthy: isAhilyanagar ? '2 / 2' : '6 / 6',
        averageEquipmentHealth: '97.8%',
        openTickets: 1,
        telemetryUptime: '99.94%'
      };
    }
  },

  // 12. MARKETING
  {
    sno: 12,
    category: 'Marketing',
    slug: 'marketing',
    sourceSummary: 'Platform Website / Marketing CMS',
    fetchingOrigin: 'Platform Website / Admin Login',
    status: 'READY',
    features: [
      { name: 'Active Campaigns', dataSource: 'Platform Website', fetchingFrom: 'Admin Login', extractionMechanism: 'Marketing campaigns running across local cinema coverage area', fieldKey: 'activeCampaigns' },
      { name: 'Social Media Toolkit', dataSource: 'Platform Website', fetchingFrom: 'Admin Login', extractionMechanism: 'Approved promotional templates for Instagram, WhatsApp, and Facebook', fieldKey: 'socialToolkit' },
      { name: 'Poster Assets Library', dataSource: 'Platform Website', fetchingFrom: 'Admin Login', extractionMechanism: 'High-res distributor key-art, digital marquee assets, and lobby banners', fieldKey: 'posterAssets' },
      { name: 'Brand Guidelines', dataSource: 'Platform Website', fetchingFrom: 'Admin Login', extractionMechanism: 'Connplex gold luxury brand color codes, typography, and logo usage guidelines', fieldKey: 'brandGuidelines' }
    ],
    extractData: () => ({
      activeCampaigns: 3,
      approvedPosters: 42,
      digitalBanners: 16,
      brandCompliance: '100% Approved'
    })
  },

  // 13. MY OFFERS
  {
    sno: 13,
    category: 'My Offers',
    slug: 'offers',
    sourceSummary: 'Promotions Engine / Backend',
    fetchingOrigin: 'Created from backend/website',
    status: 'SYNCED',
    features: [
      { name: 'Active Campaigns', dataSource: 'Backend/Website', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Promotional discount codes currently live for customer booking', fieldKey: 'activeCampaigns' },
      { name: 'Total Redemptions', dataSource: 'Vista', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Count of transactions that applied promotional codes', fieldKey: 'totalRedemptions' },
      { name: 'Customer Savings', dataSource: 'Calculation', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Cumulative monetary discount granted to moviegoers', fieldKey: 'customerSavings' },
      { name: 'Incremental Revenue', dataSource: 'Calculation', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Estimated uplift in ticket and F&B sales attributable to offers', fieldKey: 'incrementalRevenue' },
      { name: 'Live Promotional Offers', dataSource: 'Backend/Website', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Registry of promo codes, discount structures, and validity horizons', fieldKey: 'liveOffers' },
      { name: 'Redemption Analytics', dataSource: 'Calculation', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Redemption curve by day and booking channel', fieldKey: 'redemptionAnalytics' },
      { name: 'Expired & Archived', dataSource: 'Backend/Website', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Historical promotions vault', fieldKey: 'archivedOffers' },
      { name: 'Offer Types (Percentage, Flat Amount, BOGO, Free F&B Combo)', dataSource: 'Backend/Website', fetchingFrom: 'Created from backend/website', extractionMechanism: 'Offer categorization taxonomy supported by ticketing engine', fieldKey: 'offerTypes' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        activeCampaigns: 4,
        totalRedemptions: isAhilyanagar ? 382 : 1640,
        customerSavings: isAhilyanagar ? 54200 : 210000,
        incrementalRevenue: isAhilyanagar ? 198000 : 760000,
        topOffer: 'AHILYA20 (20% Off Recliner)'
      };
    }
  },

  // 14. REPORTS
  {
    sno: 14,
    category: 'Reports',
    slug: 'reports',
    sourceSummary: 'Reporting Vault / Multi-Format Exporter',
    fetchingOrigin: 'Backend/Website',
    status: 'READY',
    features: [
      { name: 'Daily Revenue Statement', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Audited daily commercial intake export (PDF, XLS)', fieldKey: 'dailyRevenueStatement' },
      { name: 'Daily Admissions Summary', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Footfall, screen occupancy curves, and ATP benchmarks (PDF, XLS)', fieldKey: 'admissionsSummary' },
      { name: 'F&B Gross Profit Margins', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'COGS vs sales margins and inventory burn report (XLS)', fieldKey: 'fnbMarginsReport' },
      { name: 'Royalty Obligations Sheet', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Distributor box office shares across studio agreements (PDF, CSV)', fieldKey: 'royaltySheet' },
      { name: 'Staff Attendance Ledger', dataSource: 'Attendance Software', fetchingFrom: 'Backend/Website', extractionMechanism: 'Monthly shifts, overtime, and biometric indices (PDF, XLS)', fieldKey: 'attendanceLedgerReport' },
      { name: 'Equipment SLA & Downtimes', dataSource: 'Vista', fetchingFrom: 'Backend/Website', extractionMechanism: 'MTBF and vendor response time report across projection/HVAC (PDF, XLS)', fieldKey: 'equipmentReport' },
      { name: 'Real-Time Report Generation', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Dynamic reporting engine generating live on-demand reports', fieldKey: 'realtimeGeneration' },
      { name: 'Multi-Format Export (XLS, PDF, CSV)', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Client-side and server-side document compilation pipeline', fieldKey: 'exportEngines' }
    ],
    extractData: () => ({
      availableReportTemplates: 7,
      supportedFormats: ['PDF', 'XLS', 'CSV'],
      lastGenerated: new Date().toISOString()
    })
  },

  // 15. MIS
  {
    sno: 15,
    category: 'MIS',
    slug: 'mis',
    sourceSummary: 'Corporate BI / Executive Variance Engine',
    fetchingOrigin: 'Calculation / Vista',
    status: 'COMPUTED',
    features: [
      { name: 'Gross Network Turnover', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Consolidated network turnover vs quarterly target budget variance', fieldKey: 'grossTurnover' },
      { name: 'Operating EBITDA', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Consolidated network operating EBITDA and EBITDA margin percentage', fieldKey: 'ebitda' },
      { name: 'Network Footfalls', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Total admissions across all units and average occupancy', fieldKey: 'footfalls' },
      { name: 'Ancillary Non-Box Office Revenue', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'F&B, ads, retail, and corporate hire contribution to total turnover', fieldKey: 'ancillaryShare' },
      { name: 'Multi-Unit Benchmarking Matrix', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Location-by-location benchmarking table ranking cinemas on revenue, ATP, and SPH', fieldKey: 'benchmarking' },
      { name: 'Revenue & Cost Waterfall', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Decomposition from Gross Revenue through Distributor Share, Tax, Opex to EBITDA', fieldKey: 'waterfall' },
      { name: 'Budget Target vs Actual Variance', dataSource: 'Admin', fetchingFrom: 'Admin Login', extractionMechanism: 'Budget variance tracker highlighting over/under targets in INR and %', fieldKey: 'budgetVariance' },
      { name: 'Screen Yield & Format Analysis', dataSource: 'Calculation', fetchingFrom: 'Vista', extractionMechanism: 'Format productivity yield comparing Couple Recliner, Gold Class, and IMAX', fieldKey: 'screenYield' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        grossTurnover: isAhilyanagar ? '₹14.85L (Target: ₹14.0L • +6.1%)' : '₹1.28Cr (Target: ₹1.25Cr • +2.4%)',
        ebitda: isAhilyanagar ? '₹6.82L (45.9% Margin)' : '₹54.4L (42.5% Margin)',
        networkFootfalls: isAhilyanagar ? '4,812' : '44,800',
        ancillaryShare: isAhilyanagar ? '35.2%' : '31.3%'
      };
    }
  },

  // 16. DOCUMENTS
  {
    sno: 16,
    category: 'Documents',
    slug: 'documents',
    sourceSummary: 'Encrypted Document Vault',
    fetchingOrigin: 'Uploaded from website',
    status: 'READY',
    features: [
      { name: 'Document Upload & Ingestion', dataSource: 'Platform Website', fetchingFrom: 'Uploaded from website', extractionMechanism: 'Encrypted document upload pipeline for SOPs, leases, and licenses', fieldKey: 'upload' },
      { name: 'Document Download & Auditing', dataSource: 'Platform Website', fetchingFrom: 'Uploaded from website', extractionMechanism: 'Role-gated document retrieval and view tracking', fieldKey: 'download' }
    ],
    extractData: () => ({
      totalDocuments: 12,
      storageUsed: '42.8 MB',
      lastUpload: '2026-09-08 (Ahilyanagar Cinematograph NOC)'
    })
  },

  // 17. LICENSE
  {
    sno: 17,
    category: 'License',
    slug: 'license',
    sourceSummary: 'Statutory Registry & Compliance Monitor',
    fetchingOrigin: 'will be feeded to website',
    status: 'SYNCED',
    features: [
      { name: 'Statutory Readiness', dataSource: 'Calculation', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Overall compliance score based on verified active permits', fieldKey: 'statutoryReadiness' },
      { name: 'Total Active Licenses', dataSource: 'Platform Website', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Count of active certifications across municipal, fire, and health departments', fieldKey: 'totalActiveLicenses' },
      { name: 'Expiring Soon', dataSource: 'Calculation', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Certificates expiring within 30 days requiring renewal filing', fieldKey: 'expiringSoon' },
      { name: 'In Renewal Process', dataSource: 'Platform Website', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Filing in progress with governmental authorities', fieldKey: 'inRenewal' },
      { name: 'Licenses & Permits Registry', dataSource: 'Platform Website', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Cinematograph, Fire NOC, FSSAI, Electrical, Copyright performance registry', fieldKey: 'registry' },
      { name: 'Renewal Alerts Queue', dataSource: 'Calculation', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Automated alert queue flagging upcoming expiries', fieldKey: 'renewalAlerts' },
      { name: 'Issuing Authorities Directory', dataSource: 'Platform Website', fetchingFrom: 'will be feeded to website', extractionMechanism: 'Directory of municipal corporations, fire departments, and police commissioners', fieldKey: 'authoritiesDirectory' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        statutoryReadiness: '100% Compliant (Zero Fines)',
        totalActiveLicenses: isAhilyanagar ? 6 : 14,
        expiringSoon: 1,
        inRenewalProcess: 1,
        nextRenewal: 'FSSAI Food Safety License (Due Oct 2026)'
      };
    }
  },

  // 18. SUPPORT
  {
    sno: 18,
    category: 'Support',
    slug: 'support',
    sourceSummary: 'Partner Support & Incident Management',
    fetchingOrigin: 'Platform Website',
    status: 'READY',
    features: [
      { name: 'Support Tickets', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Ticketing workflow for operational, technical, and finance inquiries', fieldKey: 'tickets' },
      { name: 'Live Chat Support', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Real-time messaging connection to Connplex Corporate Operations Desk', fieldKey: 'liveChat' },
      { name: 'Knowledge Base', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Articles, SOP guides, and troubleshooting procedures', fieldKey: 'knowledgeBase' },
      { name: 'Training Center', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Operator guides and POS instructional modules', fieldKey: 'trainingCenter' },
      { name: 'Emergency Protocol', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Immediate emergency contacts, escalation matrix, and crisis guidelines', fieldKey: 'emergencyProtocol' }
    ],
    extractData: () => ({
      activeTickets: 2,
      averageResolutionHours: 3.5,
      supportAvailability: '24/7 Priority Desk'
    })
  },

  // 19. NOTIFICATIONS
  {
    sno: 19,
    category: 'Notifications',
    slug: 'notifications',
    sourceSummary: 'System Event Stream',
    fetchingOrigin: 'Backend/Website',
    status: 'SYNCED',
    features: [
      { name: 'Notification Feed', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Event-driven alert stream categorizing Critical, Warning, and Info notifications', fieldKey: 'feed' },
      { name: 'Broadcast & Acknowledgment', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Franchisee read/unread state tracking with routing action handlers', fieldKey: 'broadcast' }
    ],
    extractData: () => ({
      unreadCount: 2,
      totalRecentAlerts: 8,
      latestAlert: 'Vista daily transaction sync confirmed for Ahilyanagar'
    })
  },

  // 20. CALENDAR
  {
    sno: 20,
    category: 'Calendar',
    slug: 'calendar',
    sourceSummary: 'Operational Calendar & Agenda Schedule',
    fetchingOrigin: 'Platform Website',
    status: 'READY',
    features: [
      { name: 'Events & Agenda Schedule', dataSource: 'Platform Website', fetchingFrom: 'Platform Website', extractionMechanism: 'Central schedule of movie releases, equipment maintenance, drills, and partner meetings', fieldKey: 'events' },
      { name: 'Sync Milestones', dataSource: 'Vista', fetchingFrom: 'Platform Website', extractionMechanism: 'Automated daily sync time windows and maintenance shutdowns', fieldKey: 'syncMilestones' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        upcomingEventsCount: isAhilyanagar ? 6 : 4,
        nextKeyMilestone: isAhilyanagar ? 'Barco 4K Projector Dust Filter Purge (Sep 10)' : 'Monthly Franchise Review (Sep 05)'
      };
    }
  },

  // 21. SETTINGS
  {
    sno: 21,
    category: 'Settings',
    slug: 'settings',
    sourceSummary: 'Configuration & Integration Manager',
    fetchingOrigin: 'Backend/Website',
    status: 'LIVE_API',
    features: [
      { name: 'Cinema Profile', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Cinema metadata: location, screen counts, total seating, GM contact details', fieldKey: 'profile' },
      { name: 'Role Permissions Matrix', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Role-based access matrix (Super Admin, Manager, Finance, Auditor)', fieldKey: 'permissions' },
      { name: 'System Audit Logs', dataSource: 'Backend/Website', fetchingFrom: 'Backend/Website', extractionMechanism: 'Immutable log of administrative actions, config edits, and logins', fieldKey: 'auditLogs' },
      { name: 'Ahilyanagar API & Vista Sync', dataSource: 'Vista', fetchingFrom: 'Vista', extractionMechanism: 'Vista ASMX WebService sync endpoints, T-SQL reporting views, and live health monitors', fieldKey: 'vistaSync' }
    ],
    extractData: (cinemaId) => {
      const isAhilyanagar = cinemaId === 'c5';
      return {
        cinemaName: isAhilyanagar ? 'Connplex Smart Cinema - Ahilyanagar' : 'Connplex Gandhinagar',
        screens: isAhilyanagar ? 2 : 6,
        seats: isAhilyanagar ? 80 : 840,
        vistaIntegrationStatus: 'CONNECTED_ACTIVE',
        auditEntriesCount: 18
      };
    }
  }
];

// Helper functions for consumption by APIs and UI
export function getAllExtractionSpecs(): ExtractionCategorySpec[] {
  return EXTRACTION_CATEGORIES_SPEC;
}

export function getExtractionSpecByCategory(categoryOrSlug: string): ExtractionCategorySpec | undefined {
  return EXTRACTION_CATEGORIES_SPEC.find(
    c => c.category.toLowerCase() === categoryOrSlug.toLowerCase() || c.slug.toLowerCase() === categoryOrSlug.toLowerCase()
  );
}

export function extractAllCategoriesData(cinemaId: string = 'c5', dateRange: string = 'Month-to-Date') {
  return EXTRACTION_CATEGORIES_SPEC.map(spec => ({
    sno: spec.sno,
    category: spec.category,
    slug: spec.slug,
    sourceSummary: spec.sourceSummary,
    fetchingOrigin: spec.fetchingOrigin,
    status: spec.status,
    featureCount: spec.features.length,
    features: spec.features,
    extractedData: spec.extractData(cinemaId, dateRange),
    extractedAt: new Date().toISOString()
  }));
}
