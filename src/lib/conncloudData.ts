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

// Merchandise / Store interfaces
export interface MerchandiseProduct {
  productId: string;
  name: string;
  sku: string;
  category: 'Drinkware' | 'Stationery' | 'Apparel' | 'Collectibles' | 'Tech';
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  image: string;
  salesCount: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description: string;
}

export interface MerchandiseOrder {
  orderId: string;
  date: string;
  customerName: string;
  cinemaId: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  channel: 'Counter' | 'Online' | 'Store Kiosk';
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  status: 'Fulfilled' | 'Preparing' | 'Pending';
}

// Group Booking interfaces
export interface GroupBooking {
  bookingId: string;
  clientName: string;
  organization: string;
  contactNumber: string;
  email: string;
  cinemaId: string;
  screenId: string;
  eventType: 'Corporate Screening' | 'Private Theatre Rental' | 'School Edu-Trip' | 'Birthday / Celebration' | 'Bulk Premiere';
  date: string;
  timeSlot: string;
  guestCount: number;
  movieTitle: string;
  fnbPackage: 'Silver Combo' | 'Gold VIP Combo' | 'Platinum Gourmet' | 'Custom Catering' | 'None';
  totalQuoted: number;
  advancePaid: number;
  paymentStatus: 'Pending Advance' | 'Advance Paid' | 'Fully Paid';
  status: 'Inquiry' | 'Quote Sent' | 'Confirmed' | 'Completed' | 'Cancelled';
  specialRequests?: string;
}

export interface GroupPackage {
  packageId: string;
  title: string;
  minGuests: number;
  basePrice: number;
  pricePerGuest: number;
  description: string;
  includes: string[];
}

// License & Compliance interfaces
export interface CinemaLicense {
  licenseId: string;
  cinemaId: string;
  licenseName: string;
  category: 'Cinematograph' | 'Fire Safety' | 'Food & Health (FSSAI)' | 'Structural' | 'Electrical' | 'Copyright & Performance' | 'Environmental / Pollution' | 'Municipal / Commercial';
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  renewalReminderDays: number;
  status: 'Valid' | 'Expiring Soon' | 'In Renewal' | 'Expired';
  documentUrl: string;
  officerInCharge: string;
  feePaid: number;
}

// Offers & Promotions interfaces
export interface CinemaOffer {
  offerId: string;
  code: string;
  title: string;
  description: string;
  discountType: 'Percentage' | 'Flat Amount' | 'BOGO' | 'Free F&B Combo';
  discountValue: number;
  minTicketsRequired: number;
  maxDiscountAmount?: number;
  cinemaId: string; // 'all' or specific cinemaId
  applicableDays: 'All Days' | 'Weekdays Only' | 'Weekends Only';
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  timesRedeemed: number;
  totalSavingsGranted: number;
  status: 'Active' | 'Paused' | 'Expired' | 'Draft';
  bannerColor?: string;
}

// MIS interfaces
export interface MISCinemaSummary {
  cinemaId: string;
  cinemaName: string;
  city: string;
  screens: number;
  totalFootfall: number;
  boxOfficeGross: number;
  fnbGross: number;
  merchandiseGross: number;
  groupBookingsGross: number;
  screenAdsGross: number;
  totalRevenue: number;
  distributorShare: number;
  operationalExpenses: number;
  netEbitda: number;
  ebitdaMargin: number;
  atp: number;
  sph: number;
  occupancyPercent: number;
  budgetTarget: number;
  variancePercent: number;
}

// Training & Orientation interfaces
export interface TrainingModule {
  moduleId: string;
  title: string;
  category: 'Onboarding' | 'Safety & Compliance' | 'Hospitality & Service' | 'Technical & Projection' | 'F&B Hygiene' | 'POS & Ticketing';
  durationHours: number;
  totalLessons: number;
  mandatoryFor: string[];
  passingScore: number;
  enrolledCount: number;
  completedCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  description: string;
  thumbnailIcon: string;
}

export interface StaffOrientation {
  orientationId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  joinDate: string;
  orientationBatch: string;
  mentor: string;
  progressPercent: number;
  modulesCompleted: number;
  totalModules: number;
  status: 'Completed' | 'In Progress' | 'Overdue' | 'Scheduled';
  certifiedDate?: string;
}

export interface TrainingCertification {
  certId: string;
  staffName: string;
  employeeId: string;
  moduleTitle: string;
  score: number;
  issuedDate: string;
  validUntil: string;
  certificateNumber: string;
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

const INITIAL_MERCHANDISE: MerchandiseProduct[] = [
  { productId: 'mp1', name: 'PREMIUM TUMBLER', sku: 'CX-DRK-01', category: 'Drinkware', price: 899, costPrice: 320, stock: 48, minStock: 15, image: '/merchandise/icon_1.png', salesCount: 142, status: 'In Stock', description: 'Stainless steel with matte black finish and gold detailing.' },
  { productId: 'mp2', name: "FOUNDER'S SCRIPT", sku: 'CX-STN-02', category: 'Stationery', price: 649, costPrice: 210, stock: 35, minStock: 10, image: '/merchandise/icon_2.png', salesCount: 88, status: 'In Stock', description: 'A story worth watching. Plan. Build. Inspire.' },
  { productId: 'mp3', name: 'ACRYLIC CLAPPERBOARD', sku: 'CX-COL-03', category: 'Collectibles', price: 1299, costPrice: 450, stock: 18, minStock: 10, image: '/merchandise/icon_3.png', salesCount: 95, status: 'In Stock', description: 'Mark every milestone. Your story in motion.' },
  { productId: 'mp4', name: 'MINI DIRECTOR SPOTLIGHT', sku: 'CX-TCH-04', category: 'Tech', price: 1899, costPrice: 680, stock: 6, minStock: 10, image: '/merchandise/icon_4.png', salesCount: 52, status: 'Low Stock', description: 'Lights that inspire. Perfect for any executive desk.' },
  { productId: 'mp5', name: 'SCRIPT PLANNER', sku: 'CX-STN-05', category: 'Stationery', price: 499, costPrice: 140, stock: 62, minStock: 20, image: '/merchandise/icon_5.png', salesCount: 210, status: 'In Stock', description: 'Every vision starts with a script. Leatherette hardbound.' },
  { productId: 'mp6', name: 'FOUNDER CARD (NFC)', sku: 'CX-TCH-06', category: 'Tech', price: 999, costPrice: 280, stock: 24, minStock: 15, image: '/merchandise/icon_6.png', salesCount: 116, status: 'In Stock', description: 'Smart contactless metal VIP club card with NFC chip.' },
  { productId: 'mp7', name: 'PREMIUM METAL PEN', sku: 'CX-STN-07', category: 'Stationery', price: 399, costPrice: 90, stock: 110, minStock: 30, image: '/merchandise/icon_7.png', salesCount: 340, status: 'In Stock', description: 'Crafted for leaders. Weighted tungsten core, built to last.' },
  { productId: 'mp8', name: 'FILM REEL CHOCOLATE BOX', sku: 'CX-COL-08', category: 'Collectibles', price: 599, costPrice: 180, stock: 0, minStock: 15, image: '/merchandise/icon_8.png', salesCount: 195, status: 'Out of Stock', description: 'Artisanal dark chocolate rounds packed in authentic tin reel.' },
  { productId: 'mp9', name: 'ACRYLIC FILM STRIP NAMEPLATE', sku: 'CX-COL-09', category: 'Collectibles', price: 799, costPrice: 240, stock: 14, minStock: 10, image: '/merchandise/icon_9.png', salesCount: 73, status: 'In Stock', description: 'A desk title worth displaying. 35mm optical cut style.' },
  { productId: 'mp10', name: 'METAL TICKET BOX', sku: 'CX-COL-10', category: 'Collectibles', price: 849, costPrice: 290, stock: 32, minStock: 12, image: '/merchandise/icon_10.png', salesCount: 84, status: 'In Stock', description: 'Embossed vintage tin container for keeping ticket stubs.' }
];

const INITIAL_MERCHANDISE_ORDERS: MerchandiseOrder[] = [
  { orderId: 'MO-8841', date: '2026-08-30 19:42', customerName: 'Arjun Singhal', cinemaId: 'c1', items: [{ productId: 'mp1', name: 'PREMIUM TUMBLER', quantity: 2, price: 899 }, { productId: 'mp7', name: 'PREMIUM METAL PEN', quantity: 1, price: 399 }], totalAmount: 2197, channel: 'Counter', paymentMethod: 'UPI', status: 'Fulfilled' },
  { orderId: 'MO-8840', date: '2026-08-30 18:15', customerName: 'Megha Dave', cinemaId: 'c2', items: [{ productId: 'mp3', name: 'ACRYLIC CLAPPERBOARD', quantity: 1, price: 1299 }], totalAmount: 1299, channel: 'Store Kiosk', paymentMethod: 'Card', status: 'Fulfilled' },
  { orderId: 'MO-8839', date: '2026-08-30 15:30', customerName: 'Rohan Deshmukh', cinemaId: 'c1', items: [{ productId: 'mp6', name: 'FOUNDER CARD (NFC)', quantity: 1, price: 999 }, { productId: 'mp5', name: 'SCRIPT PLANNER', quantity: 1, price: 499 }], totalAmount: 1498, channel: 'Online', paymentMethod: 'UPI', status: 'Fulfilled' },
  { orderId: 'MO-8838', date: '2026-08-29 20:10', customerName: 'Vikram Joshi', cinemaId: 'c3', items: [{ productId: 'mp4', name: 'MINI DIRECTOR SPOTLIGHT', quantity: 1, price: 1899 }], totalAmount: 1899, channel: 'Counter', paymentMethod: 'Card', status: 'Fulfilled' },
  { orderId: 'MO-8837', date: '2026-08-29 17:05', customerName: 'Pooja Agarwal', cinemaId: 'c4', items: [{ productId: 'mp5', name: 'SCRIPT PLANNER', quantity: 2, price: 499 }, { productId: 'mp7', name: 'PREMIUM METAL PEN', quantity: 2, price: 399 }], totalAmount: 1796, channel: 'Online', paymentMethod: 'UPI', status: 'Preparing' },
  { orderId: 'MO-8836', date: '2026-08-28 14:20', customerName: 'Devang Solanki', cinemaId: 'c2', items: [{ productId: 'mp10', name: 'METAL TICKET BOX', quantity: 1, price: 849 }], totalAmount: 849, channel: 'Store Kiosk', paymentMethod: 'Cash', status: 'Fulfilled' }
];

const INITIAL_GROUP_PACKAGES: GroupPackage[] = [
  { packageId: 'pkg1', title: 'Executive Corporate Screening', minGuests: 50, basePrice: 25000, pricePerGuest: 350, description: 'Auditorium private rental, high-res presentation hookup, cordless wireless mic & podium, executive popcorn & drink combo.', includes: ['Full Audi Exclusive Rental (3h)', 'AV & HDMI Presentation Sync', 'Wireless Mics & Sound Control', 'Gourmet Popcorn + Cold Beverage', 'Reserved Priority Parking'] },
  { packageId: 'pkg2', title: 'Birthday Cinema Bash', minGuests: 30, basePrice: 15000, pricePerGuest: 299, description: 'Private auditorium celebration, custom on-screen photo slideshow, dedicated cake cutting corner, and snack boxes.', includes: ['Private Auditorium for 2.5h', 'Custom Screen Birthday Video Reel', 'Cake Table Setup & Lighting', 'Medium Popcorn & Soda Combo', 'Connplex Kids Merchandise Gift'] },
  { packageId: 'pkg3', title: 'Student Edu-Tour Screening', minGuests: 80, basePrice: 20000, pricePerGuest: 199, description: 'Educational or blockbuster screening, behind-the-scenes projection room tech walkthrough, and junior snack pack.', includes: ['Exclusive School Morning Show', 'Projection Room Guided Tour', 'Q&A with Cinema Chief Engineer', 'Mini Salted Popcorn + Juice Box', 'Teacher / Chaperone Free Access'] },
  { packageId: 'pkg4', title: 'Private Gold Class Soiree', minGuests: 25, basePrice: 30000, pricePerGuest: 599, description: 'Luxury VIP recliner screen takeover, butler service, 3-course warm finger food, mocktails, and personalized welcome.', includes: ['VIP Gold Class Auditorium', 'Plush Pushback Recliner Seating', 'Dedicated In-Audi Butler Service', '3-Course Hot Finger Food Menu', 'Artisanal Mocktail Welcome'] }
];

const INITIAL_GROUP_BOOKINGS: GroupBooking[] = [
  { bookingId: 'GB-1024', clientName: 'Sanjay Rawat', organization: 'Infosys BPM Technologies', contactNumber: '9820144911', email: 'sanjay.r@infosys.com', cinemaId: 'c1', screenId: 's1', eventType: 'Corporate Screening', date: '2026-09-12', timeSlot: '10:00 AM - 01:30 PM', guestCount: 110, movieTitle: 'Raftaar + Quarterly All-Hands Presentation', fnbPackage: 'Gold VIP Combo', totalQuoted: 68500, advancePaid: 35000, paymentStatus: 'Advance Paid', status: 'Confirmed', specialRequests: 'Need HDMI connection to IMAX projector for 45 min presentation before film starts.' },
  { bookingId: 'GB-1025', clientName: 'Sister Mary Therese', organization: 'Delhi Public School, Jaipur', contactNumber: '9840321098', email: 'principal@dpsjaipur.edu.in', cinemaId: 'c2', screenId: 's5', eventType: 'School Edu-Trip', date: '2026-09-15', timeSlot: '09:00 AM - 12:00 PM', guestCount: 220, movieTitle: 'Cosmic Drift (Science Edu-Screening)', fnbPackage: 'Silver Combo', totalQuoted: 95000, advancePaid: 50000, paymentStatus: 'Advance Paid', status: 'Confirmed', specialRequests: 'Include 15 min projection room walkthrough for class 10 students.' },
  { bookingId: 'GB-1026', clientName: 'Tarun Mathur', organization: 'Tata Consultancy Services', contactNumber: '9910874512', email: 'tarun.m@tcs.com', cinemaId: 'c3', screenId: 's11', eventType: 'Corporate Screening', date: '2026-09-22', timeSlot: '02:00 PM - 05:30 PM', guestCount: 175, movieTitle: 'Ishq Junction', fnbPackage: 'Silver Combo', totalQuoted: 82000, advancePaid: 0, paymentStatus: 'Pending Advance', status: 'Quote Sent', specialRequests: 'Awaiting corporate purchase order sign-off from procurement.' },
  { bookingId: 'GB-1027', clientName: 'Ananya Singhania', organization: 'Singhania Jewels Family', contactNumber: '9829011223', email: 'ananya@singhaniajewels.com', cinemaId: 'c1', screenId: 's4', eventType: 'Birthday / Celebration', date: '2026-09-18', timeSlot: '06:00 PM - 09:30 PM', guestCount: 75, movieTitle: 'Dil Ki Baazi', fnbPackage: 'Platinum Gourmet', totalQuoted: 52000, advancePaid: 52000, paymentStatus: 'Fully Paid', status: 'Confirmed', specialRequests: 'Champagne style mocktails and custom happy birthday slide with spotlight.' },
  { bookingId: 'GB-1028', clientName: 'Harsh Vardhan Goel', organization: 'Reliance Retail Dealer Network', contactNumber: '9876543201', email: 'h.goel@relianceretail.com', cinemaId: 'c2', screenId: 's9', eventType: 'Bulk Premiere', date: '2026-09-25', timeSlot: '07:30 PM - 11:00 PM', guestCount: 95, movieTitle: 'Shadow Protocol (4DX VIP)', fnbPackage: 'Gold VIP Combo', totalQuoted: 65000, advancePaid: 30000, paymentStatus: 'Advance Paid', status: 'Confirmed', specialRequests: 'Red carpet photo booth setup in foyer.' },
  { bookingId: 'GB-1029', clientName: 'Dr. Vivek Saxena', organization: 'Rotary Club of Mewar', contactNumber: '9414088921', email: 'rotary.mewar@gmail.com', cinemaId: 'c4', screenId: 's17', eventType: 'Private Theatre Rental', date: '2026-10-02', timeSlot: '11:00 AM - 02:00 PM', guestCount: 130, movieTitle: 'The Last Circuit', fnbPackage: 'Silver Combo', totalQuoted: 48000, advancePaid: 0, paymentStatus: 'Pending Advance', status: 'Inquiry', specialRequests: 'Charity fundraiser premiere with banners in lobby.' }
];

const INITIAL_LICENSES: CinemaLicense[] = [
  { licenseId: 'lic1', cinemaId: 'c1', licenseName: 'Cinematograph Screen Operations License', category: 'Cinematograph', licenseNumber: 'DM/JODH/CINE-2026/04', issuingAuthority: 'District Magistrate & Cinema Licensing Officer, Jodhpur', issueDate: '2026-01-01', expiryDate: '2026-12-31', renewalReminderDays: 45, status: 'Valid', documentUrl: '/docs/cinematograph_jodhpur.pdf', officerInCharge: 'Rakesh Patel', feePaid: 45000 },
  { licenseId: 'lic2', cinemaId: 'c1', licenseName: 'Fire Safety NOC & Hydrant Compliance', category: 'Fire Safety', licenseNumber: 'FS-RAJ-JDH-8921', issuingAuthority: 'Rajasthan State Fire & Emergency Services', issueDate: '2025-11-15', expiryDate: '2026-11-14', renewalReminderDays: 30, status: 'Valid', documentUrl: '/docs/fire_noc_jodhpur.pdf', officerInCharge: 'Aarav Sharma', feePaid: 28000 },
  { licenseId: 'lic3', cinemaId: 'c1', licenseName: 'FSSAI Central Food Safety License (F&B)', category: 'Food & Health (FSSAI)', licenseNumber: 'FSSAI-12224019000312', issuingAuthority: 'Food Safety and Standards Authority of India (FSSAI)', issueDate: '2025-10-22', expiryDate: '2026-10-21', renewalReminderDays: 20, status: 'Expiring Soon', documentUrl: '/docs/fssai_jodhpur.pdf', officerInCharge: 'Nisha Singh', feePaid: 15000 },
  { licenseId: 'lic4', cinemaId: 'c1', licenseName: 'PPL Public Performance Music License', category: 'Copyright & Performance', licenseNumber: 'PPL-W-CIN-9921', issuingAuthority: 'Phonographic Performance Limited (PPL India)', issueDate: '2026-04-01', expiryDate: '2027-03-31', renewalReminderDays: 60, status: 'Valid', documentUrl: '/docs/ppl_license.pdf', officerInCharge: 'Jahnvi Gupta', feePaid: 65000 },
  { licenseId: 'lic5', cinemaId: 'c1', licenseName: 'IPRS Society Music Public Performance License', category: 'Copyright & Performance', licenseNumber: 'IPRS-RJ-2026-44', issuingAuthority: 'Indian Performing Right Society Ltd (IPRS)', issueDate: '2026-04-01', expiryDate: '2027-03-31', renewalReminderDays: 60, status: 'Valid', documentUrl: '/docs/iprs_license.pdf', officerInCharge: 'Jahnvi Gupta', feePaid: 58000 },
  { licenseId: 'lic6', cinemaId: 'c1', licenseName: 'Electrical Substation & DG Set Safety Approval', category: 'Electrical', licenseNumber: 'CEA-RAJ-INSP-5502', issuingAuthority: 'Chief Electrical Inspectorate, Govt of Rajasthan', issueDate: '2025-08-10', expiryDate: '2028-08-09', renewalReminderDays: 90, status: 'Valid', documentUrl: '/docs/electrical_clearance.pdf', officerInCharge: 'Rohit Mehta', feePaid: 32000 },
  { licenseId: 'lic7', cinemaId: 'c1', licenseName: 'Building Structural Stability & Load Certificate', category: 'Structural', licenseNumber: 'JDA-STR-BLDG-1102', issuingAuthority: 'Jodhpur Development Authority (JDA)', issueDate: '2024-03-15', expiryDate: '2029-03-14', renewalReminderDays: 120, status: 'Valid', documentUrl: '/docs/structural_safety.pdf', officerInCharge: 'Sanjay Jain', feePaid: 50000 },
  { licenseId: 'lic8', cinemaId: 'c1', licenseName: 'RSPCB Consent to Operate (CTO) & DG Emission NOC', category: 'Environmental / Pollution', licenseNumber: 'RSPCB-AIR-NOC-4482', issuingAuthority: 'Rajasthan State Pollution Control Board', issueDate: '2025-01-15', expiryDate: '2027-01-14', renewalReminderDays: 45, status: 'Valid', documentUrl: '/docs/pollution_noc.pdf', officerInCharge: 'Aarav Sharma', feePaid: 22000 },

  // Jaipur branch licenses
  { licenseId: 'lic9', cinemaId: 'c2', licenseName: 'Cinematograph Screen Operations License', category: 'Cinematograph', licenseNumber: 'DM/JPR/CINE-2026/09', issuingAuthority: 'District Magistrate Office, Jaipur', issueDate: '2026-02-01', expiryDate: '2027-01-31', renewalReminderDays: 45, status: 'Valid', documentUrl: '/docs/cinematograph_jaipur.pdf', officerInCharge: 'Rakesh Patel', feePaid: 65000 },
  { licenseId: 'lic10', cinemaId: 'c2', licenseName: 'Fire Safety NOC (Screen 1-6 & Foyer)', category: 'Fire Safety', licenseNumber: 'FS-RAJ-JPR-7714', issuingAuthority: 'Jaipur Fire Municipal Department', issueDate: '2025-09-01', expiryDate: '2026-08-31', renewalReminderDays: 15, status: 'In Renewal', documentUrl: '/docs/fire_noc_jaipur.pdf', officerInCharge: 'K. S. Rathore', feePaid: 35000 },
  { licenseId: 'lic11', cinemaId: 'c2', licenseName: 'FSSAI Central Food Safety License', category: 'Food & Health (FSSAI)', licenseNumber: 'FSSAI-12224019000881', issuingAuthority: 'Food Safety and Standards Authority of India (FSSAI)', issueDate: '2026-01-10', expiryDate: '2027-01-09', renewalReminderDays: 30, status: 'Valid', documentUrl: '/docs/fssai_jaipur.pdf', officerInCharge: 'Priya Nair', feePaid: 18000 }
];

const INITIAL_OFFERS: CinemaOffer[] = [
  { offerId: 'off1', code: 'CONNPLEX50', title: '50% Off on Second Ticket', description: 'Book any 2 tickets for current running blockbusters and receive flat 50% discount on the second ticket.', discountType: 'Percentage', discountValue: 50, minTicketsRequired: 2, maxDiscountAmount: 180, cinemaId: 'all', applicableDays: 'Weekdays Only', validFrom: '2026-08-01', validUntil: '2026-09-30', usageLimit: 1000, timesRedeemed: 412, totalSavingsGranted: 61800, status: 'Active', bannerColor: 'from-blue-600 to-indigo-700' },
  { offerId: 'off2', code: 'STUDENTPASS', title: 'Flat ₹150 Student Tickets', description: 'Exclusive student pricing on presenting valid college ID card at counter or during online verification.', discountType: 'Flat Amount', discountValue: 80, minTicketsRequired: 1, maxDiscountAmount: 80, cinemaId: 'all', applicableDays: 'Weekdays Only', validFrom: '2026-08-10', validUntil: '2026-10-31', usageLimit: 1500, timesRedeemed: 680, totalSavingsGranted: 54400, status: 'Active', bannerColor: 'from-emerald-600 to-teal-700' },
  { offerId: 'off3', code: 'FAMILYFEAST', title: 'Free Popcorn Combo on 4+ Tickets', description: 'Book 4 or more tickets for any evening family show and receive complimentary Large Tub + 2 Pepsi.', discountType: 'Free F&B Combo', discountValue: 320, minTicketsRequired: 4, maxDiscountAmount: 320, cinemaId: 'all', applicableDays: 'All Days', validFrom: '2026-08-05', validUntil: '2026-09-25', usageLimit: 500, timesRedeemed: 245, totalSavingsGranted: 78400, status: 'Active', bannerColor: 'from-amber-600 to-orange-700' },
  { offerId: 'off4', code: 'HDFCFRIDAY', title: 'HDFC BOGO Weekend Special', description: 'Buy 1 Ticket and Get 1 Free on all HDFC Bank Diners Club, Regalia and Infinia Credit Cards.', discountType: 'BOGO', discountValue: 100, minTicketsRequired: 2, maxDiscountAmount: 250, cinemaId: 'all', applicableDays: 'Weekends Only', validFrom: '2026-07-01', validUntil: '2026-12-31', usageLimit: 800, timesRedeemed: 310, totalSavingsGranted: 77500, status: 'Active', bannerColor: 'from-purple-600 to-pink-700' },
  { offerId: 'off5', code: 'CORPORATE20', title: '20% Corporate Privilege Discount', description: 'Special corporate tie-up discount on presentation of registered corporate email / company badge.', discountType: 'Percentage', discountValue: 20, minTicketsRequired: 2, maxDiscountAmount: 200, cinemaId: 'all', applicableDays: 'Weekdays Only', validFrom: '2026-08-01', validUntil: '2026-11-30', usageLimit: 600, timesRedeemed: 180, totalSavingsGranted: 21600, status: 'Active', bannerColor: 'from-cyan-600 to-blue-700' },
  { offerId: 'off6', code: 'MONSOONMAGIC', title: 'Flat 25% Off on Morning Shows', description: 'Super Saver morning shows before 1:00 PM get an instant 25% reduction on standard ticket prices.', discountType: 'Percentage', discountValue: 25, minTicketsRequired: 1, maxDiscountAmount: 75, cinemaId: 'all', applicableDays: 'Weekdays Only', validFrom: '2026-07-15', validUntil: '2026-08-31', usageLimit: 1200, timesRedeemed: 520, totalSavingsGranted: 46800, status: 'Expired', bannerColor: 'from-gray-600 to-gray-700' }
];

const INITIAL_MIS_SUMMARIES: MISCinemaSummary[] = [
  {
    cinemaId: 'c1',
    cinemaName: 'Connplex Jodhpur',
    city: 'Jodhpur, Rajasthan',
    screens: 4,
    totalFootfall: 48200,
    boxOfficeGross: 10845000,
    fnbGross: 4420000,
    merchandiseGross: 640000,
    groupBookingsGross: 1450000,
    screenAdsGross: 780000,
    totalRevenue: 18135000,
    distributorShare: 5422500,
    operationalExpenses: 6520000,
    netEbitda: 6192500,
    ebitdaMargin: 34.1,
    atp: 225,
    sph: 92,
    occupancyPercent: 68.4,
    budgetTarget: 17000000,
    variancePercent: 6.7
  },
  {
    cinemaId: 'c2',
    cinemaName: 'Connplex Jaipur',
    city: 'Jaipur, Rajasthan',
    screens: 6,
    totalFootfall: 72500,
    boxOfficeGross: 18560000,
    fnbGross: 7830000,
    merchandiseGross: 980000,
    groupBookingsGross: 2210000,
    screenAdsGross: 1240000,
    totalRevenue: 30820000,
    distributorShare: 9280000,
    operationalExpenses: 10640000,
    netEbitda: 10900000,
    ebitdaMargin: 35.4,
    atp: 256,
    sph: 108,
    occupancyPercent: 71.2,
    budgetTarget: 29000000,
    variancePercent: 6.3
  },
  {
    cinemaId: 'c3',
    cinemaName: 'Connplex Ahmedabad',
    city: 'Ahmedabad, Gujarat',
    screens: 5,
    totalFootfall: 58100,
    boxOfficeGross: 13944000,
    fnbGross: 5810000,
    merchandiseGross: 720000,
    groupBookingsGross: 1680000,
    screenAdsGross: 960000,
    totalRevenue: 23114000,
    distributorShare: 6972000,
    operationalExpenses: 8150000,
    netEbitda: 7992000,
    ebitdaMargin: 34.6,
    atp: 240,
    sph: 100,
    occupancyPercent: 67.8,
    budgetTarget: 22500000,
    variancePercent: 2.7
  },
  {
    cinemaId: 'c4',
    cinemaName: 'Connplex Udaipur',
    city: 'Udaipur, Rajasthan',
    screens: 4,
    totalFootfall: 36400,
    boxOfficeGross: 8008000,
    fnbGross: 3276000,
    merchandiseGross: 450000,
    groupBookingsGross: 1120000,
    screenAdsGross: 540000,
    totalRevenue: 13394000,
    distributorShare: 4004000,
    operationalExpenses: 4980000,
    netEbitda: 4410000,
    ebitdaMargin: 32.9,
    atp: 220,
    sph: 90,
    occupancyPercent: 62.5,
    budgetTarget: 13000000,
    variancePercent: 3.0
  }
];

const INITIAL_TRAINING_MODULES: TrainingModule[] = [
  { moduleId: 'tm1', title: 'Connplex Gold Class Hospitality & VIP Etiquette', category: 'Hospitality & Service', durationHours: 4, totalLessons: 6, mandatoryFor: ['Guest Relations', 'Duty Managers', 'Box Office'], passingScore: 85, enrolledCount: 42, completedCount: 38, status: 'Active', description: 'Comprehensive training on patron greeting standards, VIP recliner service protocols, dispute de-escalation, and wheelchair accessibility assistance.', thumbnailIcon: 'fa-bell-concierge' },
  { moduleId: 'tm2', title: 'Barco 4K Laser Projector Operation & Emergency Lamp Protocol', category: 'Technical & Projection', durationHours: 8, totalLessons: 10, mandatoryFor: ['Projectionists', 'Duty Managers'], passingScore: 90, enrolledCount: 14, completedCount: 12, status: 'Active', description: 'Operating digital cinema packages (DCP), KDM licensing key loading, lens focus alignment, Christie/Barco cooling system maintenance, and laser safety shutoff.', thumbnailIcon: 'fa-video' },
  { moduleId: 'tm3', title: 'FSSAI Food Hygiene, Popcorn Dispensing & Temperature Log', category: 'F&B Hygiene', durationHours: 3, totalLessons: 5, mandatoryFor: ['F&B Associates', 'Food Managers'], passingScore: 80, enrolledCount: 36, completedCount: 34, status: 'Active', description: 'Food safety protocols complying with FSSAI regulations, heated display cabinet temperatures, kettle cleaning SOP, syrup bib replacement, and allergen warnings.', thumbnailIcon: 'fa-utensils' },
  { moduleId: 'tm4', title: 'Emergency Fire Evacuation & Crowd Panic Mitigation Drill', category: 'Safety & Compliance', durationHours: 5, totalLessons: 7, mandatoryFor: ['All Departments'], passingScore: 100, enrolledCount: 65, completedCount: 59, status: 'Active', description: 'Auditorium fire alarm procedure, panic bar door operations, fire hydrant usage, safe muster point coordination, and emergency power backup protocol.', thumbnailIcon: 'fa-fire-extinguisher' },
  { moduleId: 'tm5', title: 'Box Office POS, Web Voucher Redemptions & Kiosk Management', category: 'POS & Ticketing', durationHours: 4, totalLessons: 6, mandatoryFor: ['Ticketing Associates', 'Duty Managers'], passingScore: 85, enrolledCount: 28, completedCount: 26, status: 'Active', description: 'ConnCloud POS terminal workflows, handling offline ticketing mode, promo voucher code applications, Razorpay UPI reconciliation, and paper roll replacements.', thumbnailIcon: 'fa-cash-register' },
  { moduleId: 'tm6', title: 'Cinema Employee Code of Conduct & ConnCloud Security Protocol', category: 'Onboarding', durationHours: 2, totalLessons: 4, mandatoryFor: ['All Departments'], passingScore: 80, enrolledCount: 55, completedCount: 52, status: 'Active', description: 'Franchise corporate policies, uniform standards, punctuality guidelines, biometric attendance procedures, and customer data confidentiality.', thumbnailIcon: 'fa-user-shield' }
];

const INITIAL_STAFF_ORIENTATIONS: StaffOrientation[] = [
  { orientationId: 'so1', employeeId: 'st3', employeeName: 'Kabir Verma', department: 'Ticketing', role: 'Guest Relations Executive', joinDate: '2025-01-10', orientationBatch: 'Cohort 2025-Q1', mentor: 'Jahnvi Gupta', progressPercent: 100, modulesCompleted: 6, totalModules: 6, status: 'Completed', certifiedDate: '2025-01-24' },
  { orientationId: 'so2', employeeId: 'st4', employeeName: 'Priya Nair', department: 'F&B', role: 'Counter Associate', joinDate: '2024-08-20', orientationBatch: 'Cohort 2024-Q3', mentor: 'Nisha Singh', progressPercent: 100, modulesCompleted: 6, totalModules: 6, status: 'Completed', certifiedDate: '2024-09-04' },
  { orientationId: 'so3', employeeId: 'st5', employeeName: 'Rohit Mehta', department: 'Operations', role: 'Projectionist', joinDate: '2022-04-12', orientationBatch: 'Cohort 2022-Q2', mentor: 'Aarav Sharma', progressPercent: 100, modulesCompleted: 6, totalModules: 6, status: 'Completed', certifiedDate: '2022-04-28' },
  { orientationId: 'so4', employeeId: 'st9', employeeName: 'Tarun Joshi', department: 'F&B', role: 'F&B Associate Trainee', joinDate: '2026-08-15', orientationBatch: 'Cohort 2026-Aug', mentor: 'Nisha Singh', progressPercent: 65, modulesCompleted: 4, totalModules: 6, status: 'In Progress' },
  { orientationId: 'so5', employeeId: 'st10', employeeName: 'Manisha Chauhan', department: 'Ticketing', role: 'Box Office Trainee', joinDate: '2026-08-20', orientationBatch: 'Cohort 2026-Aug', mentor: 'Kabir Verma', progressPercent: 50, modulesCompleted: 3, totalModules: 6, status: 'In Progress' },
  { orientationId: 'so6', employeeId: 'st11', employeeName: 'Vicky Bhati', department: 'Housekeeping', role: 'Janitorial Associate', joinDate: '2026-08-01', orientationBatch: 'Cohort 2026-Aug', mentor: 'Deepak Patel', progressPercent: 30, modulesCompleted: 2, totalModules: 6, status: 'Overdue' }
];

const INITIAL_TRAINING_CERTIFICATIONS: TrainingCertification[] = [
  { certId: 'tc1', staffName: 'Kabir Verma', employeeId: 'st3', moduleTitle: 'Connplex Gold Class Hospitality & VIP Etiquette', score: 94, issuedDate: '2025-01-24', validUntil: '2027-01-24', certificateNumber: 'CX-CERT-9021' },
  { certId: 'tc2', staffName: 'Priya Nair', employeeId: 'st4', moduleTitle: 'FSSAI Food Hygiene, Popcorn Dispensing & Temperature Log', score: 92, issuedDate: '2024-09-04', validUntil: '2026-09-04', certificateNumber: 'CX-CERT-8842' },
  { certId: 'tc3', staffName: 'Rohit Mehta', employeeId: 'st5', moduleTitle: 'Barco 4K Laser Projector Operation & Emergency Lamp Protocol', score: 98, issuedDate: '2022-04-28', validUntil: '2026-12-31', certificateNumber: 'CX-CERT-7719' },
  { certId: 'tc4', staffName: 'Aarav Sharma', employeeId: 'st1', moduleTitle: 'Emergency Fire Evacuation & Crowd Panic Mitigation Drill', score: 100, issuedDate: '2024-05-30', validUntil: '2026-05-30', certificateNumber: 'CX-CERT-8104' }
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
  private static merchandiseProducts: MerchandiseProduct[] = [];
  private static merchandiseOrders: MerchandiseOrder[] = [];
  private static groupBookings: GroupBooking[] = [];
  private static groupPackages: GroupPackage[] = [];
  private static licenses: CinemaLicense[] = [];
  private static offers: CinemaOffer[] = [];
  private static misSummaries: MISCinemaSummary[] = [];
  private static trainingModules: TrainingModule[] = [];
  private static staffOrientations: StaffOrientation[] = [];
  private static certifications: TrainingCertification[] = [];

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
    this.merchandiseProducts = cacheOrSeed('merchandiseProducts', INITIAL_MERCHANDISE);
    this.merchandiseOrders = cacheOrSeed('merchandiseOrders', INITIAL_MERCHANDISE_ORDERS);
    this.groupBookings = cacheOrSeed('groupBookings', INITIAL_GROUP_BOOKINGS);
    this.groupPackages = cacheOrSeed('groupPackages', INITIAL_GROUP_PACKAGES);
    this.licenses = cacheOrSeed('licenses', INITIAL_LICENSES);
    this.offers = cacheOrSeed('offers', INITIAL_OFFERS);
    this.misSummaries = cacheOrSeed('misSummaries', INITIAL_MIS_SUMMARIES);
    this.trainingModules = cacheOrSeed('trainingModules', INITIAL_TRAINING_MODULES);
    this.staffOrientations = cacheOrSeed('staffOrientations', INITIAL_STAFF_ORIENTATIONS);
    this.certifications = cacheOrSeed('certifications', INITIAL_TRAINING_CERTIFICATIONS);

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
  public static getMerchandiseProducts() { this.init(); return this.merchandiseProducts; }
  public static getMerchandiseOrders() { this.init(); return this.merchandiseOrders; }
  public static getGroupBookings() { this.init(); return this.groupBookings; }
  public static getGroupPackages() { this.init(); return this.groupPackages; }
  public static getLicenses() { this.init(); return this.licenses; }
  public static getOffers() { this.init(); return this.offers; }
  public static getMISData() { this.init(); return this.misSummaries; }
  public static getTrainingModules() { this.init(); return this.trainingModules; }
  public static getStaffOrientations() { this.init(); return this.staffOrientations; }
  public static getCertifications() { this.init(); return this.certifications; }

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

  // Merchandise mutations
  public static addMerchandiseProduct(prod: Omit<MerchandiseProduct, 'productId' | 'salesCount'>) {
    this.init();
    const newProd: MerchandiseProduct = {
      ...prod,
      productId: `mp_${Date.now()}`,
      salesCount: 0
    };
    this.merchandiseProducts.unshift(newProd);
    this.save('merchandiseProducts', this.merchandiseProducts);
    return newProd;
  }

  public static updateMerchandiseStock(productId: string, newStock: number) {
    this.init();
    const p = this.merchandiseProducts.find(item => item.productId === productId);
    if (p) {
      p.stock = newStock;
      p.status = newStock === 0 ? 'Out of Stock' : (newStock <= p.minStock ? 'Low Stock' : 'In Stock');
      this.save('merchandiseProducts', this.merchandiseProducts);
      return true;
    }
    return false;
  }

  public static createMerchandiseOrder(order: Omit<MerchandiseOrder, 'orderId'>) {
    this.init();
    const newOrder: MerchandiseOrder = {
      ...order,
      orderId: `MO-${Math.floor(1000 + Math.random() * 9000)}`
    };
    this.merchandiseOrders.unshift(newOrder);
    this.save('merchandiseOrders', this.merchandiseOrders);
    return newOrder;
  }

  // Group Booking mutations
  public static addGroupBooking(booking: Omit<GroupBooking, 'bookingId'>) {
    this.init();
    const newBooking: GroupBooking = {
      ...booking,
      bookingId: `GB-${Math.floor(1000 + Math.random() * 9000)}`
    };
    this.groupBookings.unshift(newBooking);
    this.save('groupBookings', this.groupBookings);
    return newBooking;
  }

  public static updateGroupBookingStatus(bookingId: string, status: GroupBooking['status'], paymentStatus?: GroupBooking['paymentStatus']) {
    this.init();
    const b = this.groupBookings.find(item => item.bookingId === bookingId);
    if (b) {
      b.status = status;
      if (paymentStatus) b.paymentStatus = paymentStatus;
      this.save('groupBookings', this.groupBookings);
      return true;
    }
    return false;
  }

  // License mutations
  public static addLicense(license: Omit<CinemaLicense, 'licenseId'>) {
    this.init();
    const newLicense: CinemaLicense = {
      ...license,
      licenseId: `lic_${Date.now()}`
    };
    this.licenses.unshift(newLicense);
    this.save('licenses', this.licenses);
    return newLicense;
  }

  public static renewLicense(licenseId: string, newExpiryDate: string) {
    this.init();
    const lic = this.licenses.find(l => l.licenseId === licenseId);
    if (lic) {
      lic.expiryDate = newExpiryDate;
      lic.status = 'Valid';
      this.save('licenses', this.licenses);
      return true;
    }
    return false;
  }

  public static updateLicenseStatus(licenseId: string, status: CinemaLicense['status']) {
    this.init();
    const lic = this.licenses.find(l => l.licenseId === licenseId);
    if (lic) {
      lic.status = status;
      this.save('licenses', this.licenses);
      return true;
    }
    return false;
  }

  // Offer mutations
  public static addOffer(offer: Omit<CinemaOffer, 'offerId' | 'timesRedeemed' | 'totalSavingsGranted'>) {
    this.init();
    const newOffer: CinemaOffer = {
      ...offer,
      offerId: `off_${Date.now()}`,
      timesRedeemed: 0,
      totalSavingsGranted: 0
    };
    this.offers.unshift(newOffer);
    this.save('offers', this.offers);
    return newOffer;
  }

  public static toggleOfferStatus(offerId: string) {
    this.init();
    const off = this.offers.find(o => o.offerId === offerId);
    if (off) {
      off.status = off.status === 'Active' ? 'Paused' : 'Active';
      this.save('offers', this.offers);
      return off.status;
    }
    return null;
  }

  // Training mutations
  public static addTrainingModule(mod: Omit<TrainingModule, 'moduleId' | 'enrolledCount' | 'completedCount'>) {
    this.init();
    const newMod: TrainingModule = {
      ...mod,
      moduleId: `tm_${Date.now()}`,
      enrolledCount: 0,
      completedCount: 0
    };
    this.trainingModules.unshift(newMod);
    this.save('trainingModules', this.trainingModules);
    return newMod;
  }

  public static enrollStaffInOrientation(orient: Omit<StaffOrientation, 'orientationId' | 'progressPercent' | 'modulesCompleted' | 'status'>) {
    this.init();
    const newOrient: StaffOrientation = {
      ...orient,
      orientationId: `so_${Date.now()}`,
      progressPercent: 0,
      modulesCompleted: 0,
      status: 'In Progress'
    };
    this.staffOrientations.unshift(newOrient);
    this.save('staffOrientations', this.staffOrientations);
    return newOrient;
  }

  public static updateOrientationProgress(orientationId: string, completedIncrement: number) {
    this.init();
    const o = this.staffOrientations.find(item => item.orientationId === orientationId);
    if (o) {
      o.modulesCompleted = Math.min(o.totalModules, o.modulesCompleted + completedIncrement);
      o.progressPercent = Math.round((o.modulesCompleted / o.totalModules) * 100);
      if (o.progressPercent >= 100) {
        o.status = 'Completed';
        o.certifiedDate = new Date().toISOString().split('T')[0];
      }
      this.save('staffOrientations', this.staffOrientations);
      return true;
    }
    return false;
  }

  public static issueCertification(cert: Omit<TrainingCertification, 'certId'>) {
    this.init();
    const newCert: TrainingCertification = {
      ...cert,
      certId: `tc_${Date.now()}`
    };
    this.certifications.unshift(newCert);
    this.save('certifications', this.certifications);
    return newCert;
  }
}
