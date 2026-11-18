const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://connplexb2b_db_user:Jahnvi04@cluster0.bdbdo1c.mongodb.net/connplex_b2b?retryWrites=true&w=majority";

const FranchiseExpenseSchema = new mongoose.Schema(
  {
    cinemaId: { type: String, required: true },
    expenseId: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    category: { type: String, required: true },
    vendor: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    gstRate: { type: Number, default: 18 },
    date: { type: String, required: true },
    status: { type: String, default: 'Approved' },
    approver: { type: String, default: 'Vikram Shinde' },
    approvedAt: { type: Date, default: () => new Date() },
    attachment: { type: String, default: '' },
    description: { type: String, default: '' },
    createdBy: { type: String, default: 'Franchise Manager' }
  },
  { timestamps: true }
);

const FranchiseExpense = mongoose.models.FranchiseExpense || mongoose.model('FranchiseExpense', FranchiseExpenseSchema, 'franchise_expenses');

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  const existing = await FranchiseExpense.countDocuments({ cinemaId: { $in: ['c5', 'CN01', 'Ahilyanagar'] } });
  if (existing > 0) {
    console.log(`Already have ${existing} expenses in database.`);
    await mongoose.disconnect();
    return;
  }

  const initialExpenses = [
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10001',
      title: 'Monthly Commercial Electricity Bill',
      category: 'Electricity & Utilities',
      vendor: 'Maharashtra State Electricity Distribution Co.',
      amount: 112450,
      tax: 20241,
      gstRate: 18,
      date: '2026-11-05',
      status: 'Paid',
      approver: 'Vikram Shinde',
      description: 'Monthly high-tension cinema auditorium power tariff',
      attachment: 'mseb_bill_nov2026.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10002',
      title: 'Auditorium & Lobby Deep Sanitization Contract',
      category: 'Housekeeping & Sanitization',
      vendor: 'Clean Corp Facility Services Ltd',
      amount: 28500,
      tax: 5130,
      gstRate: 18,
      date: '2026-11-07',
      status: 'Approved',
      approver: 'Vikram Shinde',
      description: 'Bi-weekly deep cleaning of Screen 1 & Screen 2 and washrooms',
      attachment: 'cleancorp_tax_invoice.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10003',
      title: 'Dolby Atmos Sound Processor AMC Retainer',
      category: 'Sound & Acoustic Retainer',
      vendor: 'Dolby Laboratories India Pvt Ltd',
      amount: 35000,
      tax: 6300,
      gstRate: 18,
      date: '2026-11-08',
      status: 'Approved',
      approver: 'Vikram Shinde',
      description: 'Q3 sound processor calibration & speaker tuning retainer',
      attachment: 'dolby_amc_invoice.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10004',
      title: 'Christie Laser Projector Q3 Preventive Maintenance',
      category: 'Projector & Lamp Maintenance',
      vendor: 'Christie Digital Systems India',
      amount: 42000,
      tax: 7560,
      gstRate: 18,
      date: '2026-11-10',
      status: 'Paid',
      approver: 'Vikram Shinde',
      description: 'Laser phosphor optical engine alignment & filter replacement',
      attachment: 'christie_service_nov2026.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10005',
      title: 'Concession Raw Materials & Popcorn Kernels Restock',
      category: 'F&B Consumables & Logistics',
      vendor: 'Connplex Central Commissary Ltd',
      amount: 48600,
      tax: 2430,
      gstRate: 5,
      date: '2026-11-12',
      status: 'Approved',
      approver: 'Vikram Shinde',
      description: 'Imported mushroom popcorn seeds, caramel glaze & soda syrups',
      attachment: 'commissary_fnb_nov.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10006',
      title: 'Local Cinema Staff Salary Advances & Usheer Roster',
      category: 'Staff Payroll',
      vendor: 'Ahilyanagar Cinema Operations Staff',
      amount: 125000,
      tax: 0,
      gstRate: 0,
      date: '2026-11-10',
      status: 'Approved',
      approver: 'Vikram Shinde',
      description: 'First half November operational payroll for 14 staff members',
      attachment: 'staff_payroll_summary.pdf'
    },
    {
      cinemaId: 'c5',
      expenseId: 'EXP-10007',
      title: 'HVAC Chiller Filter Replacement & Gas Top-up',
      category: 'Repairs & Operational Supplies',
      vendor: 'Blue Star Climate Solutions',
      amount: 18200,
      tax: 3276,
      gstRate: 18,
      date: '2026-11-14',
      status: 'Pending',
      approver: null,
      description: 'Screen 1 AC duct pressure sensor replacement and refrigerant top-up',
      attachment: 'bluestar_quote.pdf'
    }
  ];

  await FranchiseExpense.insertMany(initialExpenses);
  console.log(`Seeded ${initialExpenses.length} audited operational expenses for Ahilyanagar.`);
  await mongoose.disconnect();
}

seed().catch(console.error);
