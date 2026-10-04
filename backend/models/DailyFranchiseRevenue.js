import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filmCode: { type: String, default: "" },
    shows: { type: Number, default: 0 },
    ticketsSold: { type: Number, default: 0 },
    ticketRevenue: { type: Number, default: 0 },
    fnbRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    occupancy: { type: Number, default: 0 },
  },
  { _id: false }
);

const HourlySchema = new mongoose.Schema(
  {
    hour: { type: Number, required: true },
    admissions: { type: Number, default: 0 },
    ticketRevenue: { type: Number, default: 0 },
    fnbRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { _id: false }
);

const DailyFranchiseRevenueSchema = new mongoose.Schema(
  {
    franchiseCode: { type: String, required: true, index: true },
    vistaCinemaId: { type: String, required: true, index: true },
    businessDate: { type: String, required: true, index: true },
    totalGrossRevenue: { type: Number, required: true, default: 0 },
    ticketRevenue: { type: Number, required: true, default: 0 },
    fnbRevenue: { type: Number, required: true, default: 0 },
    counterRevenue: { type: Number, required: true, default: 0 },
    bookMyShowRevenue: { type: Number, required: true, default: 0 },
    websiteRevenue: { type: Number, required: true, default: 0 },
    otherRevenue: { type: Number, default: 0 },
    ticketsSold: { type: Number, required: true, default: 0 },
    showsCount: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },
    occupancyPercentage: { type: Number, default: 0 },
    averageTicketPrice: { type: Number, default: 0 },
    spendPerHead: { type: Number, default: 0 },
    fnbToBoxOfficeRatioPercent: { type: Number, default: 0 },
    isReconciled: { type: Boolean, default: true },
    reconciliationStatus: {
      type: String,
      enum: ["RECONCILED", "PENDING", "DISCREPANCY_DETECTED"],
      default: "RECONCILED",
    },
    varianceAmount: { type: Number, default: 0 },
    lastSyncedAt: { type: Date, default: Date.now },
    syncVersion: { type: Number, default: 1 },
    movies: [MovieSchema],
    hourlyDistribution: [HourlySchema],
  },
  { timestamps: true }
);

// Compound Unique Index: Idempotency guarantee
DailyFranchiseRevenueSchema.index({ franchiseCode: 1, businessDate: 1 }, { unique: true });

export const DailyFranchiseRevenue =
  mongoose.models.DailyFranchiseRevenue ||
  mongoose.model("DailyFranchiseRevenue", DailyFranchiseRevenueSchema);

export default DailyFranchiseRevenue;
