// ConnCloud Centralized Relational Data Engine & State Store

export interface Cinema {
  cinemaId: string;
  name: string;
  location: string;
  screens: number;
  status: 'Active' | 'Inactive';
  operatingHours: string;
}

export interface Screen {
  screenId: string;
  cinemaId: string;
  name: string;
  capacity: number;
  format: string; // 2D, 3D, IMAX, 4DX
  status: 'Healthy' | 'Warning' | 'Offline';
}

export interface Movie {
  movieId: string;
  title: string;
  language: string;
  genre: string;
  duration: number; // in mins
  certification: string; // UA, A, U
  releaseDate: string;
  poster: string;
  trailer: string;
  cast: string[];
}

export interface Show {
  showId: string;
  movieId: string;
  screenId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  capacity: number;
  ticketsSold: number;
  status: 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
}

export interface Ticket {
  bookingId: string;
  movieId: string;
  showId: string;
  screenId: string;
  seat: string;
  price: number;
  channel: 'Online' | 'Counter' | 'Kiosk';
  payment: 'UPI' | 'Card' | 'Cash' | 'Wallet';
  status: 'Confirmed' | 'Refunded' | 'Cancelled';
  date: string;
}

export interface FnBProduct {
  productId: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  stock: number;
  minStock: number;
  status: 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock';
}

export interface FnBTransaction {
  transactionId: string;
  productId: string;
  quantity: number;
  price: number;
  category: string;
  cinemaId: string;
  date: string;
}

export interface FinanceTransaction {
  transactionId: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  tax: number;
  date: string;
  cinemaId: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Paid' | 'Settled';
  vendor?: string;
  approver?: string;
  attachment?: string;
}

export interface Staff {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface Equipment {
  equipmentId: string;
  type: 'Projector' | 'HVAC' | 'Sound' | 'Power' | 'Fire Safety';
  screenId: string;
  vendor: string;
  status: 'Healthy' | 'Warning' | 'Offline';
  health: number; // 0-100
  lastMaintenance: string;
  temperature?: number;
  lampHours?: number;
  details?: string;
}

export interface MaintenanceTicket {
  ticketId: string;
  equipmentId: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  technician: string;
  SLA: string; // e.g. "4 Hours", "24 Hours"
  status: 'New' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  date: string;
}

export interface MarketingCampaign {
  campaignId: string;
  name: string;
  movieId: string;
  cinemaId: string;
  audience: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  reach: string;
  ctr: string;
  conversions: number;
  roi: string;
}

export interface Document {
  documentId: string;
  name: string;
  category: 'Agreement' | 'Policy' | 'SOP' | 'Legal' | 'Finance' | 'Training';
  version: string;
  uploadedBy: string;
  expiryDate: string;
  permissions: string[];
}

export interface Notification {
  notificationId: string;
  type: 'Critical' | 'Warning' | 'Info' | 'Success';
  severity: string;
  message: string;
  recipient: string;
  timestamp: string;
  read: boolean;
  action: string;
}

export interface AuditEvent {
  auditId: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  object: string;
  previousValue: string;
  newValue: string;
  ip: string;
  device: string;
  result: string;
}

// Initial seed databases
const INITIAL_CINEMAS: Cinema[] = [
  { cinemaId: 'c1', name: 'Connplex Jodhpur', location: 'Jodhpur, Rajasthan', screens: 4, status: 'Active', operatingHours: '09:00 AM - 12:00 AM' },
  { cinemaId: 'c2', name: 'Connplex Jaipur', location: 'Jaipur, Rajasthan', screens: 6, status: 'Active', operatingHours: '08:30 AM - 01:00 AM' },
  { cinemaId: 'c3', name: 'Connplex Ahmedabad', location: 'Ahmedabad, Gujarat', screens: 5, status: 'Active', operatingHours: '09:00 AM - 11:30 PM' },
  { cinemaId: 'c4', name: 'Connplex Udaipur', location: 'Udaipur, Rajasthan', screens: 4, status: 'Active', operatingHours: '10:00 AM - 11:00 PM' }
];

const INITIAL_SCREENS: Screen[] = [
  { screenId: 's1', cinemaId: 'c1', name: 'Screen 1 (Gold)', capacity: 120, format: 'IMAX 3D', status: 'Healthy' },
  { screenId: 's2', cinemaId: 'c1', name: 'Screen 2', capacity: 180, format: '2D', status: 'Healthy' },
  { screenId: 's3', cinemaId: 'c1', name: 'Screen 3', capacity: 150, format: '3D', status: 'Warning' },
  { screenId: 's4', cinemaId: 'c1', name: 'Screen 4', capacity: 90, format: '2D', status: 'Healthy' },

  { screenId: 's5', cinemaId: 'c2', name: 'Screen 1 (IMAX)', capacity: 250, format: 'IMAX 3D', status: 'Healthy' },
  { screenId: 's6', cinemaId: 'c2', name: 'Screen 2', capacity: 150, format: '3D', status: 'Healthy' },
  { screenId: 's7', cinemaId: 'c2', name: 'Screen 3', capacity: 120, format: '2D', status: 'Healthy' },
  { screenId: 's8', cinemaId: 'c2', name: 'Screen 4', capacity: 120, format: '2D', status: 'Offline' },
  { screenId: 's9', cinemaId: 'c2', name: 'Screen 5', capacity: 100, format: '4DX', status: 'Healthy' },
  { screenId: 's10', cinemaId: 'c2', name: 'Screen 6', capacity: 80, format: '2D', status: 'Healthy' },

  { screenId: 's11', cinemaId: 'c3', name: 'Screen 1', capacity: 200, format: '3D', status: 'Healthy' },
  { screenId: 's12', cinemaId: 'c3', name: 'Screen 2', capacity: 160, format: '2D', status: 'Healthy' },
  { screenId: 's13', cinemaId: 'c3', name: 'Screen 3', capacity: 150, format: '2D', status: 'Healthy' },
  { screenId: 's14', cinemaId: 'c3', name: 'Screen 4', capacity: 120, format: '3D', status: 'Healthy' },
  { screenId: 's15', cinemaId: 'c3', name: 'Screen 5', capacity: 100, format: '2D', status: 'Healthy' },

  { screenId: 's16', cinemaId: 'c4', name: 'Screen 1', capacity: 150, format: '2D', status: 'Healthy' },
  { screenId: 's17', cinemaId: 'c4', name: 'Screen 2', capacity: 150, format: '3D', status: 'Healthy' },
  { screenId: 's18', cinemaId: 'c4', name: 'Screen 3', capacity: 120, format: '2D', status: 'Healthy' },
  { screenId: 's19', cinemaId: 'c4', name: 'Screen 4', capacity: 100, format: '2D', status: 'Healthy' }
];

const INITIAL_MOVIES: Movie[] = [
  { movieId: 'm1', title: 'Raftaar', language: 'Hindi', genre: 'Action / Thriller', duration: 152, certification: 'UA', releaseDate: '2026-07-28', poster: '🎬', trailer: 'https://youtube.com', cast: ['Varun Dhawan', 'Kriti Sanon'] },
  { movieId: 'm2', title: 'Cosmic Drift', language: 'English', genre: 'Sci-Fi / Adventure', duration: 145, certification: 'U', releaseDate: '2026-08-01', poster: '🚀', trailer: 'https://youtube.com', cast: ['Timothée Chalamet', 'Zendaya'] },
  { movieId: 'm3', title: 'Ishq Junction', language: 'Hindi', genre: 'Romantic Comedy', duration: 138, certification: 'UA', releaseDate: '2026-08-04', poster: '💖', trailer: 'https://youtube.com', cast: ['Kartik Aaryan', 'Rashmika Mandanna'] },
  { movieId: 'm4', title: 'Shadow Protocol', language: 'Hindi', genre: 'Spy / Action', duration: 160, certification: 'A', releaseDate: '2026-08-05', poster: '🕶️', trailer: 'https://youtube.com', cast: ['Hrithik Roshan', 'Deepika Padukone'] },
  { movieId: 'm5', title: 'Dil Ki Baazi', language: 'Hindi', genre: 'Drama', duration: 142, certification: 'UA', releaseDate: '2026-08-06', poster: '🃏', trailer: 'https://youtube.com', cast: ['Ranbir Kapoor', 'Alia Bhatt'] },
  { movieId: 'm6', title: 'The Last Circuit', language: 'English', genre: 'Thriller', duration: 128, certification: 'UA', releaseDate: '2026-08-06', poster: '⚡', trailer: 'https://youtube.com', cast: ['Cillian Murphy', 'Florence Pugh'] }
];

// Helper to generate a range of dates
function getDatesInRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// Generate relational static-like data for Shows, Tickets, F&B transactions
const generateBaseData = () => {
  const dates = getDatesInRange(30);
  const shows: Show[] = [];
  const tickets: Ticket[] = [];
  const fnbTransactions: FnBTransaction[] = [];
  const financeTransactions: FinanceTransaction[] = [];

  let showCounter = 1;
  let ticketCounter = 1;
  let fnbTxCounter = 1;
  let finTxCounter = 1;

  const showTimes = ['11:00', '14:15', '17:30', '20:45'];

  dates.forEach((dateString) => {
    INITIAL_SCREENS.forEach((screen) => {
      // Pick 2 random movies for this screen today
      const movie1 = INITIAL_MOVIES[Math.floor((parseInt(screen.screenId.replace(/\D/g, '')) + 0) % INITIAL_MOVIES.length)];
      const movie2 = INITIAL_MOVIES[Math.floor((parseInt(screen.screenId.replace(/\D/g, '')) + 1) % INITIAL_MOVIES.length)];

      showTimes.forEach((time, timeIdx) => {
        const movie = timeIdx < 2 ? movie1 : movie2;
        const cap = screen.capacity;
        
        // Base occupancy on date and time (higher on weekends, evening)
        const dateObj = new Date(dateString);
        const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 5;
        const isEvening = timeIdx >= 2;

        let baseOccupancyPercent = 40;
        if (isWeekend) baseOccupancyPercent += 25;
        if (isEvening) baseOccupancyPercent += 15;
        
        // Add minor randomness
        const randomFactor = Math.floor(Math.sin(parseInt(screen.screenId.replace(/\D/g, '')) * dayOfWeek) * 10);
        const finalPercent = Math.min(95, Math.max(10, baseOccupancyPercent + randomFactor));
        const ticketsSold = Math.floor((cap * finalPercent) / 100);

        const showId = `sh_${showCounter++}`;
        const isCompleted = new Date(`${dateString}T${time}`) < new Date();

        shows.push({
          showId,
          movieId: movie.movieId,
          screenId: screen.screenId,
          date: dateString,
          time,
          capacity: cap,
          ticketsSold,
          status: isCompleted ? 'Completed' : 'Scheduled'
        });

        // Generate consistent ticket metrics & finance income transactions
        let ticketRevenue = 0;
        let onlineCount = 0;
        let counterCount = 0;
        let kioskCount = 0;

        for (let t = 0; t < ticketsSold; t++) {
          const channelRandom = Math.random();
          const channel = channelRandom < 0.65 ? 'Online' : (channelRandom < 0.90 ? 'Counter' : 'Kiosk');
          const paymentRandom = Math.random();
          const payment = paymentRandom < 0.6 ? 'UPI' : (paymentRandom < 0.8 ? 'Card' : (paymentRandom < 0.95 ? 'Cash' : 'Wallet'));
          const price = screen.format.includes('IMAX') ? 350 : 220;
          ticketRevenue += price;

          if (channel === 'Online') onlineCount++;
          else if (channel === 'Counter') counterCount++;
          else kioskCount++;

          // Create ticket entity for deep views (only a subset to prevent memory bloating)
          if (t % 15 === 0) {
            tickets.push({
              bookingId: `bk_${ticketCounter++}`,
              movieId: movie.movieId,
              showId,
              screenId: screen.screenId,
              seat: `${String.fromCharCode(65 + Math.floor(t / 15))}${t % 15 + 1}`,
              price,
              channel,
              payment,
              status: 'Confirmed',
              date: dateString
            });
          }
        }

        // Add ticket revenue to finance transaction log
        if (ticketRevenue > 0) {
          financeTransactions.push({
            transactionId: `tx_${finTxCounter++}`,
            type: 'Income',
            category: 'Tickets',
            amount: ticketRevenue,
            tax: Math.floor(ticketRevenue * 0.18), // 18% GST
            date: dateString,
            cinemaId: screen.cinemaId,
            status: 'Settled'
          });
        }

        // Generate F&B transactions relative to admissions (e.g. SPH of ~140)
        const fnbRate = 0.6; // 60% of ticket buyers buy F&B
        const buyers = Math.floor(ticketsSold * fnbRate);
        const popcornPrice = 180;
        const sodaPrice = 120;
        let totalFnb = 0;

        if (buyers > 0) {
          const popcornQty = Math.floor(buyers * 0.5);
          const sodaQty = Math.floor(buyers * 0.6);
          const comboQty = Math.floor(buyers * 0.25);

          const items = [
            { productId: 'fb1', qty: popcornQty, price: popcornPrice, category: 'Popcorn' },
            { productId: 'fb2', qty: sodaQty, price: sodaPrice, category: 'Beverages' },
            { productId: 'fb3', qty: comboQty, price: 320, category: 'Combos' }
          ];

          items.forEach((item) => {
            if (item.qty > 0) {
              const itemTotal = item.qty * item.price;
              totalFnb += itemTotal;
              fnbTransactions.push({
                transactionId: `fbtx_${fnbTxCounter++}`,
                productId: item.productId,
                quantity: item.qty,
                price: item.price,
                category: item.category,
                cinemaId: screen.cinemaId,
                date: dateString
              });
            }
          });
        }

        if (totalFnb > 0) {
          financeTransactions.push({
            transactionId: `tx_${finTxCounter++}`,
            type: 'Income',
            category: 'Food & Beverage',
            amount: totalFnb,
            tax: Math.floor(totalFnb * 0.05), // 5% GST on F&B
            date: dateString,
            cinemaId: screen.cinemaId,
            status: 'Settled'
          });
        }
      });
    });
  });

  // Seed expenses for last 30 days
  INITIAL_CINEMAS.forEach((cinema) => {
    dates.forEach((dateString, dateIdx) => {
      // Periodic expenses: rent, electricity, maintenance
      if (dateIdx % 7 === 0) {
        financeTransactions.push({
          transactionId: `tx_${finTxCounter++}`,
          type: 'Expense',
          category: 'Electricity',
          amount: 45000 + Math.floor(Math.random() * 8000),
          tax: 8100,
          date: dateString,
          cinemaId: cinema.cinemaId,
          status: 'Paid',
          vendor: 'State Power Corporation Ltd',
          approver: 'Rakesh Patel'
        });
      }
      if (dateIdx % 10 === 0) {
        financeTransactions.push({
          transactionId: `tx_${finTxCounter++}`,
          type: 'Expense',
          category: 'Housekeeping Supplies',
          amount: 12000,
          tax: 2160,
          date: dateString,
          cinemaId: cinema.cinemaId,
          status: 'Paid',
          vendor: 'Clean Corp Ltd',
          approver: 'Rakesh Patel'
        });
      }
    });
  });

  return { shows, tickets, fnbTransactions, financeTransactions };
};

const INITIAL_FNB: FnBProduct[] = [
  { productId: 'fb1', name: 'Salted Popcorn (L)', category: 'Popcorn', price: 180, cost: 35, quantity: 240, stock: 1200, minStock: 200, status: 'Healthy' },
  { productId: 'fb2', name: 'Pepsi Soda (XL)', category: 'Beverages', price: 120, cost: 18, quantity: 450, stock: 950, minStock: 150, status: 'Healthy' },
  { productId: 'fb3', name: 'Blockbuster Combo (L Popcorn + 2 Drinks)', category: 'Combos', price: 320, cost: 70, quantity: 180, stock: 500, minStock: 80, status: 'Healthy' },
  { productId: 'fb4', name: 'Veg Cheese Samosa (2 pcs)', category: 'Snacks', price: 90, cost: 25, quantity: 80, stock: 45, minStock: 50, status: 'Low Stock' },
  { productId: 'fb5', name: 'Cheese Nachos with Salsa', category: 'Snacks', price: 150, cost: 40, quantity: 120, stock: 250, minStock: 60, status: 'Healthy' },
  { productId: 'fb6', name: 'Chocolate Lava Cake', category: 'Desserts', price: 110, cost: 30, quantity: 40, stock: 8, minStock: 15, status: 'Critical' },
  { productId: 'fb7', name: 'Paneer Burger', category: 'Meals', price: 140, cost: 45, quantity: 0, stock: 0, minStock: 20, status: 'Out of Stock' }
];

const INITIAL_STAFF: Staff[] = [
  { employeeId: 'st1', name: 'Aarav Sharma', department: 'Operations', designation: 'Duty Manager', joiningDate: '2024-05-15', status: 'Active' },
  { employeeId: 'st2', name: 'Jahnvi Gupta', department: 'Management', designation: 'Operations Manager', joiningDate: '2023-11-01', status: 'Active' },
  { employeeId: 'st3', name: 'Kabir Verma', department: 'Ticketing', designation: 'Guest Relations Executive', joiningDate: '2025-01-10', status: 'Active' },
  { employeeId: 'st4', name: 'Priya Nair', department: 'F&B', designation: 'Counter Associate', joiningDate: '2024-08-20', status: 'Active' },
  { employeeId: 'st5', name: 'Rohit Mehta', department: 'Operations', designation: 'Projectionist', joiningDate: '2022-04-12', status: 'Active' },
  { employeeId: 'st6', name: 'Sanya Malhotra', department: 'HR', designation: 'Staff Scheduler', joiningDate: '2025-03-01', status: 'Active' },
  { employeeId: 'st7', name: 'Deepak Patel', department: 'Housekeeping', designation: 'Lead Janitor', joiningDate: '2023-06-25', status: 'Active' },
  { employeeId: 'st8', name: 'Nisha Singh', department: 'F&B', designation: 'Food Manager', joiningDate: '2024-02-18', status: 'On Leave' }
];

const INITIAL_EQUIPMENT: Equipment[] = [
  { equipmentId: 'eq1', type: 'Projector', screenId: 's1', vendor: 'Barco Laser Projection India', status: 'Healthy', health: 98, lastMaintenance: '2026-07-20', temperature: 42, lampHours: 320, details: '4K Laser projector, active runtime 1800h' },
  { equipmentId: 'eq2', type: 'Projector', screenId: 's2', vendor: 'Christie Digital systems', status: 'Healthy', health: 92, lastMaintenance: '2026-07-22', temperature: 48, lampHours: 1240, details: 'Xenon Projector system, lamp lifecycle at 62%' },
  { equipmentId: 'eq3', type: 'Projector', screenId: 's3', vendor: 'Barco Laser Projection India', status: 'Warning', health: 74, lastMaintenance: '2026-06-15', temperature: 56, lampHours: 2450, details: 'Optical lens alignment skewing, temp warnings logged' },
  { equipmentId: 'eq4', type: 'Projector', screenId: 's4', vendor: 'Sony Professional', status: 'Healthy', health: 95, lastMaintenance: '2026-08-02', temperature: 38, lampHours: 110, details: 'Active 2K unit' },
  { equipmentId: 'eq5', type: 'Projector', screenId: 's8', vendor: 'Sony Professional', status: 'Offline', health: 18, lastMaintenance: '2026-05-10', temperature: 84, lampHours: 3800, details: 'Laser diode failure. Compressor overheat.' },
  { equipmentId: 'eq6', type: 'HVAC', screenId: 's1', vendor: 'Voltas Blue Star', status: 'Healthy', health: 95, lastMaintenance: '2026-07-10', details: 'Zone A Chiller system, set temp 21C' },
  { equipmentId: 'eq7', type: 'HVAC', screenId: 's3', vendor: 'Voltas Blue Star', status: 'Warning', health: 78, lastMaintenance: '2026-07-10', details: 'Compressor belt vibration. SLA maintenance queued.' },
  { equipmentId: 'eq8', type: 'Sound', screenId: 's1', vendor: 'Dolby Atmos Service', status: 'Healthy', health: 99, lastMaintenance: '2026-08-01', details: '32-channel Atmos decoder setup' },
  { equipmentId: 'eq9', type: 'Power', screenId: 's1', vendor: 'Schneider Electric', status: 'Healthy', health: 97, lastMaintenance: '2026-06-20', details: '150kVA online dual-bypass UPS system' },
  { equipmentId: 'eq10', type: 'Fire Safety', screenId: 's1', vendor: 'Minimax Systems', status: 'Healthy', health: 100, lastMaintenance: '2026-08-05', details: 'Carbon smoke telemetry, sprinkler system active' }
];

const INITIAL_MAINTENANCE: MaintenanceTicket[] = [
  { ticketId: 'mt1', equipmentId: 'eq3', issue: 'Projector lens replacement & focus recalibration', priority: 'Medium', technician: 'Subhash Chandra (Barco)', SLA: '24 Hours', status: 'Assigned', date: '2026-08-28' },
  { ticketId: 'mt2', equipmentId: 'eq7', issue: 'HVAC Compressor belt tension adjust & clean', priority: 'Medium', technician: 'Manoj Kumar (Blue Star)', SLA: '12 Hours', status: 'In Progress', date: '2026-08-29' }
];

const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  { campaignId: 'c_mp1', name: 'Monsoon Box Office Combo Blast', movieId: 'm1', cinemaId: 'c1', audience: 'All Cinegoers', budget: 12000, startDate: '2026-08-01', endDate: '2026-08-15', status: 'Active', reach: '48.2K', ctr: '4.1%', conversions: 890, roi: '18.4%' },
  { campaignId: 'c_mp2', name: 'Weekend Family Combo Bundle', movieId: 'm3', cinemaId: 'c1', audience: 'Family Segment', budget: 8500, startDate: '2026-08-05', endDate: '2026-08-20', status: 'Active', reach: '21.6K', ctr: '3.2%', conversions: 420, roi: '12.8%' },
  { campaignId: 'c_mp3', name: 'Independence Day Ticket Flash Bundle', movieId: 'm4', cinemaId: 'c1', audience: 'VIP Members', budget: 25000, startDate: '2026-08-12', endDate: '2026-08-18', status: 'Scheduled', reach: '---', ctr: '---', conversions: 0, roi: '---' }
];

const INITIAL_DOCS: Document[] = [
  { documentId: 'doc1', name: 'Connplex Corporate Franchise Agreement.pdf', category: 'Agreement', version: 'V4.2', uploadedBy: 'S. K. Singhal (VP Law)', expiryDate: '2031-12-31', permissions: ['Super Admin', 'Corporate Admin', 'Franchise Owner'] },
  { documentId: 'doc2', name: 'Standard Operational Policy (SOP) - Screen Health.pdf', category: 'SOP', version: 'V8.0', uploadedBy: 'Sanjay Jain (Ops)', expiryDate: '2028-06-30', permissions: ['All Managers'] },
  { documentId: 'doc3', name: 'GST Filing Report - FY 2025-26.xlsx', category: 'Finance', version: 'V1.0', uploadedBy: 'Anil Gupta (CA)', expiryDate: '2027-04-30', permissions: ['Franchise Owner', 'Finance Manager'] }
];

const INITIAL_NOTIFS: Notification[] = [
  { notificationId: 'nt1', type: 'Critical', severity: 'High', message: 'Screen 4 Projector offline: Laser diode failure. Request technician.', recipient: 'All', timestamp: '12 mins ago', read: false, action: '/conncloud/operations/equipment' },
  { notificationId: 'nt2', type: 'Warning', severity: 'Medium', message: 'Veg Cheese Samosa stock has dropped below the threshold (45 left).', recipient: 'F&B Manager', timestamp: '1h ago', read: false, action: '/conncloud/fnb/inventory' },
  { notificationId: 'nt3', type: 'Success', severity: 'Low', message: 'Record weekend revenue threshold surpassed: ₹12.5L collected in 48h.', recipient: 'Owner', timestamp: '1d ago', read: true, action: '/conncloud/finance/revenue' }
];

const INITIAL_AUDITS: AuditEvent[] = [
  { auditId: 'aud1', timestamp: '2026-08-30 14:22:15', user: 'Rakesh Patel', role: 'Franchise Partner', action: 'Approved Expense', object: 'Power utility invoice (tx_821)', previousValue: 'Pending', newValue: 'Approved', ip: '103.88.22.4', device: 'Chrome on Windows 11', result: 'Success' },
  { auditId: 'aud2', timestamp: '2026-08-30 16:05:40', user: 'Rakesh Patel', role: 'Franchise Partner', action: 'Updated Movie Allocation', object: 'Raftaar Screen 1 scheduling', previousValue: '2 shows', newValue: '4 shows', ip: '103.88.22.4', device: 'Chrome on Windows 11', result: 'Success' }
];

// Master data loader & manager (In-memory cache with LocalStorage synchronization)
export class ConnCloudStore {
  private static isInitialized = false;

  private static cinemas: Cinema[] = [];
  private static screens: Screen[] = [];
  private static movies: Movie[] = [];
  private static shows: Show[] = [];
  private static tickets: Ticket[] = [];
  private static fnbProducts: FnBProduct[] = [];
  private static fnbTransactions: FnBTransaction[] = [];
  private static financeTransactions: FinanceTransaction[] = [];
  private static staff: Staff[] = [];
  private static equipment: Equipment[] = [];
  private static maintenance: MaintenanceTicket[] = [];
  private static campaigns: MarketingCampaign[] = [];
  private static documents: Document[] = [];
  private static notifications: Notification[] = [];
  private static auditLogs: AuditEvent[] = [];

  public static init() {
    if (typeof window === 'undefined') return;
    if (this.isInitialized) return;

    // Load from localStorage or seed
    const cacheOrSeed = <T>(key: string, initial: T[]): T[] => {
      const stored = localStorage.getItem(`cc_${key}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(`Failed parsing storage for key ${key}, reseeding...`);
        }
      }
      localStorage.setItem(`cc_${key}`, JSON.stringify(initial));
      return initial;
    };

    this.cinemas = cacheOrSeed('cinemas', INITIAL_CINEMAS);
    this.screens = cacheOrSeed('screens', INITIAL_SCREENS);
    this.movies = cacheOrSeed('movies', INITIAL_MOVIES);
    this.fnbProducts = cacheOrSeed('fnbProducts', INITIAL_FNB);
    this.staff = cacheOrSeed('staff', INITIAL_STAFF);
    this.equipment = cacheOrSeed('equipment', INITIAL_EQUIPMENT);
    this.maintenance = cacheOrSeed('maintenance', INITIAL_MAINTENANCE);
    this.campaigns = cacheOrSeed('campaigns', INITIAL_CAMPAIGNS);
    this.documents = cacheOrSeed('documents', INITIAL_DOCS);
    this.notifications = cacheOrSeed('notifications', INITIAL_NOTIFS);
    this.auditLogs = cacheOrSeed('auditLogs', INITIAL_AUDITS);

    // Relational relational collections (large)
    const storedBase = localStorage.getItem('cc_relational_base');
    if (storedBase) {
      try {
        const parsed = JSON.parse(storedBase);
        this.shows = parsed.shows;
        this.tickets = parsed.tickets;
        this.fnbTransactions = parsed.fnbTransactions;
        this.financeTransactions = parsed.financeTransactions;
      } catch (e) {
        this.seedRelational();
      }
    } else {
      this.seedRelational();
    }

    this.isInitialized = true;
    this.checkAutomations();
  }

  private static seedRelational() {
    const base = generateBaseData();
    this.shows = base.shows;
    this.tickets = base.tickets;
    this.fnbTransactions = base.fnbTransactions;
    this.financeTransactions = base.financeTransactions;
    this.saveRelational();
  }

  private static save(key: string, data: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`cc_${key}`, JSON.stringify(data));
  }

  private static saveRelational() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cc_relational_base', JSON.stringify({
      shows: this.shows,
      tickets: this.tickets,
      fnbTransactions: this.fnbTransactions,
      financeTransactions: this.financeTransactions
    }));
  }

  // Automation rules engine
  public static checkAutomations() {
    let changed = false;

    // 1. Inventory Warnings
    this.fnbProducts.forEach((product) => {
      const stock = product.stock;
      const min = product.minStock;
      let newStatus: FnBProduct['status'] = 'Healthy';

      if (stock === 0) newStatus = 'Out of Stock';
      else if (stock <= min * 0.4) newStatus = 'Critical';
      else if (stock <= min) newStatus = 'Low Stock';

      if (product.status !== newStatus) {
        product.status = newStatus;
        changed = true;

        if (newStatus === 'Low Stock' || newStatus === 'Critical' || newStatus === 'Out of Stock') {
          // Trigger notification
          const severity = newStatus === 'Low Stock' ? 'Medium' : 'High';
          const type = newStatus === 'Low Stock' ? 'Warning' : 'Critical';
          this.notifications.unshift({
            notificationId: `nt_auto_${Date.now()}_${Math.random()}`,
            type,
            severity,
            message: `AUTOMATION: ${product.name} is ${newStatus} (${stock} units left). Request reorder.`,
            recipient: 'Inventory Desk',
            timestamp: 'Just now',
            read: false,
            action: '/conncloud/fnb/inventory'
          });
        }
      }
    });

    // 2. Equipment failure automations
    this.equipment.forEach((eq) => {
      if (eq.status === 'Offline' && eq.health <= 20) {
        // Check if there is already an open maintenance ticket for this equipment
        const hasOpenTicket = this.maintenance.some(
          (t) => t.equipmentId === eq.equipmentId && t.status !== 'Closed' && t.status !== 'Resolved'
        );

        if (!hasOpenTicket) {
          const ticketId = `mt_auto_${this.maintenance.length + 1}`;
          this.maintenance.unshift({
            ticketId,
            equipmentId: eq.equipmentId,
            issue: `AUTOMATED SYSTEM TICKET: Urgent service for screen projector (${eq.details}). Diagnostic: Critical device failure.`,
            priority: 'Critical',
            technician: 'Suresh Kumar (Sony Auto-dispatch)',
            SLA: '2 Hours',
            status: 'New',
            date: new Date().toISOString().split('T')[0]
          });

          // Log Audit Event
          this.auditLogs.unshift({
            auditId: `aud_auto_${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: 'ConnCloud IoT System',
            role: 'System Agent',
            action: 'Created Maintenance Ticket',
            object: `Automated maintenance dispatch for ${eq.equipmentId}`,
            previousValue: 'None',
            newValue: ticketId,
            ip: '127.0.0.1',
            device: 'ConnCloud IoT Telemetry Daemon',
            result: 'Success'
          });

          // Show Notification
          this.notifications.unshift({
            notificationId: `nt_auto_eq_${Date.now()}`,
            type: 'Critical',
            severity: 'High',
            message: `CRITICAL IoT ALERT: Equipment ${eq.equipmentId} went offline. Auto-dispatched Service Ticket ${ticketId}.`,
            recipient: 'Operations Manager',
            timestamp: 'Just now',
            read: false,
            action: '/conncloud/operations/maintenance'
          });

          changed = true;
        }
      }
    });

    if (changed) {
      this.save('fnbProducts', this.fnbProducts);
      this.save('maintenance', this.maintenance);
      this.save('notifications', this.notifications);
      this.save('auditLogs', this.auditLogs);
    }
  }

  // Getters
  public static getCinemas() { this.init(); return this.cinemas; }
  public static getScreens() { this.init(); return this.screens; }
  public static getMovies() { this.init(); return this.movies; }
  public static getShows() { this.init(); return this.shows; }
  public static getTickets() { this.init(); return this.tickets; }
  public static getFnBProducts() { this.init(); return this.fnbProducts; }
  public static getFnBTransactions() { this.init(); return this.fnbTransactions; }
  public static getFinanceTransactions() { this.init(); return this.financeTransactions; }
  public static getStaff() { this.init(); return this.staff; }
  public static getEquipment() { this.init(); return this.equipment; }
  public static getMaintenanceTickets() { this.init(); return this.maintenance; }
  public static getCampaigns() { this.init(); return this.campaigns; }
  public static getDocuments() { this.init(); return this.documents; }
  public static getNotifications() { this.init(); return this.notifications; }
  public static getAuditLogs() { this.init(); return this.auditLogs; }

  // Mutation commands
  public static addExpense(tx: Omit<FinanceTransaction, 'transactionId' | 'status'> & { vendor: string }) {
    this.init();
    const newTx: FinanceTransaction = {
      ...tx,
      transactionId: `tx_${Date.now()}`,
      status: 'Pending'
    };
    this.financeTransactions.unshift(newTx);
    this.saveRelational();

    this.auditLogs.unshift({
      auditId: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Rakesh Patel',
      role: 'Franchise Partner',
      action: 'Created Expense',
      object: `Expense for ${tx.category} - ₹${tx.amount}`,
      previousValue: 'None',
      newValue: 'Pending approval',
      ip: '103.88.22.4',
      device: 'Chrome on Windows 11',
      result: 'Success'
    });
    this.save('auditLogs', this.auditLogs);
    return newTx;
  }

  public static approveTransaction(transactionId: string, approverName: string) {
    this.init();
    const tx = this.financeTransactions.find(t => t.transactionId === transactionId);
    if (tx) {
      const prev = tx.status;
      tx.status = 'Approved';
      tx.approver = approverName;
      this.saveRelational();

      this.auditLogs.unshift({
        auditId: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: approverName,
        role: 'Franchise Partner',
        action: 'Approved Expense',
        object: `Expense record ${transactionId}`,
        previousValue: prev,
        newValue: 'Approved',
        ip: '103.88.22.4',
        device: 'Chrome on Windows 11',
        result: 'Success'
      });
      this.save('auditLogs', this.auditLogs);
      return true;
    }
    return false;
  }

  public static addMaintenanceTicket(ticket: Omit<MaintenanceTicket, 'ticketId' | 'date'>) {
    this.init();
    const newTicket: MaintenanceTicket = {
      ...ticket,
      ticketId: `mt_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.maintenance.unshift(newTicket);
    this.save('maintenance', this.maintenance);

    this.auditLogs.unshift({
      auditId: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Rakesh Patel',
      role: 'Franchise Partner',
      action: 'Created Maintenance Ticket',
      object: `Service request for ${ticket.equipmentId}`,
      previousValue: 'None',
      newValue: newTicket.ticketId,
      ip: '103.88.22.4',
      device: 'Chrome on Windows 11',
      result: 'Success'
    });
    this.save('auditLogs', this.auditLogs);
    return newTicket;
  }

  public static updateEquipmentStatus(equipmentId: string, status: Equipment['status'], health: number) {
    this.init();
    const eq = this.equipment.find(e => e.equipmentId === equipmentId);
    if (eq) {
      const prev = eq.status;
      eq.status = status;
      eq.health = health;
      this.save('equipment', this.equipment);
      
      this.checkAutomations(); // Re-trigger automations in case it fell to offline/critical
      return true;
    }
    return false;
  }

  public static addCampaign(campaign: Omit<MarketingCampaign, 'campaignId' | 'reach' | 'ctr' | 'conversions' | 'roi'>) {
    this.init();
    const newCamp: MarketingCampaign = {
      ...campaign,
      campaignId: `c_mp_${Date.now()}`,
      reach: '---',
      ctr: '---',
      conversions: 0,
      roi: '---'
    };
    this.campaigns.unshift(newCamp);
    this.save('campaigns', this.campaigns);

    this.auditLogs.unshift({
      auditId: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Rakesh Patel',
      role: 'Franchise Partner',
      action: 'Publish Campaign',
      object: `Campaign: ${campaign.name}`,
      previousValue: 'None',
      newValue: 'Active',
      ip: '103.88.22.4',
      device: 'Chrome on Windows 11',
      result: 'Success'
    });
    this.save('auditLogs', this.auditLogs);
    return newCamp;
  }

  public static updateProductStock(productId: string, newStock: number) {
    this.init();
    const prod = this.fnbProducts.find(p => p.productId === productId);
    if (prod) {
      const prev = prod.stock;
      prod.stock = newStock;
      this.save('fnbProducts', this.fnbProducts);
      this.checkAutomations(); // Trigger stock alert check
      return true;
    }
    return false;
  }

  public static addDocument(doc: Omit<Document, 'documentId'>) {
    this.init();
    const newDoc: Document = {
      ...doc,
      documentId: `doc_${Date.now()}`
    };
    this.documents.unshift(newDoc);
    this.save('documents', this.documents);
    return newDoc;
  }

  public static addAuditEvent(event: Omit<AuditEvent, 'auditId' | 'timestamp' | 'ip' | 'device' | 'result'>) {
    this.init();
    const newEvent: AuditEvent = {
      ...event,
      auditId: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: '103.88.22.4',
      device: 'Chrome on Windows 11',
      result: 'Success'
    };
    this.auditLogs.unshift(newEvent);
    this.save('auditLogs', this.auditLogs);
    return newEvent;
  }
}
