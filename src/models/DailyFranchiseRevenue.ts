import mongoose, { Schema, Document } from 'mongoose';

export interface IMoviePerformance {
  title: string;
  filmCode?: string;
  shows: number;
  ticketsSold: number;
  ticketRevenue: number;
  fnbRevenue: number;
  totalRevenue: number;
  occupancy: number;
}

export interface IHourlyDistribution {
  hour: number; // 0 to 23
  admissions: number;
  ticketRevenue: number;
  fnbRevenue: number;
  totalRevenue: number;
}

export interface IDailyFranchiseRevenue extends Document {
  franchiseCode: string;
  vistaCinemaId: string;
  businessDate: string; // YYYY-MM-DD
  totalGrossRevenue: number; // ticketRevenue + fnbRevenue
  ticketRevenue: number; // Confirmed box office
  fnbRevenue: number; // Concessions
  counterRevenue: number; // ticketRevenue - (bookMyShowRevenue + websiteRevenue + otherRevenue)
  bookMyShowRevenue: number; // BMS channel share of ticketRevenue
  websiteRevenue: number; // Website channel share of ticketRevenue
  otherRevenue: number; // Other aggregators share
  ticketsSold: number; // Paid admissions
  showsCount: number;
  availableSeats: number;
  occupancyPercentage: number;
  averageTicketPrice: number; // ATP = ticketRevenue / ticketsSold
  spendPerHead: number; // SPH = fnbRevenue / ticketsSold
  fnbToBoxOfficeRatioPercent: number; // (fnbRevenue / ticketRevenue) * 100
  isReconciled: boolean;
  reconciliationStatus: 'RECONCILED' | 'PENDING' | 'DISCREPANCY_DETECTED';
  varianceAmount: number;
  lastSyncedAt: Date;
  syncVersion: number;
  movies: IMoviePerformance[];
  hourlyDistribution: IHourlyDistribution[];
  createdAt: Date;
  updatedAt: Date;
}

const MoviePerformanceSchema = new Schema<IMoviePerformance>(
  {
    title: { type: String, required: true },
    filmCode: { type: String, default: '' },
    shows: { type: Number, default: 0 },
    ticketsSold: { type: Number, default: 0 },
    ticketRevenue: { type: Number, default: 0 },
    fnbRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    occupancy: { type: Number, default: 0 },
  },
  { _id: false }
);

const HourlyDistributionSchema = new Schema<IHourlyDistribution>(
  {
    hour: { type: Number, required: true, min: 0, max: 23 },
    admissions: { type: Number, default: 0 },
    ticketRevenue: { type: Number, default: 0 },
    fnbRevenue: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },
  { _id: false }
);

const DailyFranchiseRevenueSchema = new Schema<IDailyFranchiseRevenue>(
  {
    franchiseCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    vistaCinemaId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    businessDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    totalGrossRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    ticketRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    fnbRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    counterRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    bookMyShowRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    websiteRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    otherRevenue: {
      type: Number,
      default: 0,
    },
    ticketsSold: {
      type: Number,
      required: true,
      default: 0,
    },
    showsCount: {
      type: Number,
      default: 0,
    },
    availableSeats: {
      type: Number,
      default: 0,
    },
    occupancyPercentage: {
      type: Number,
      default: 0,
    },
    averageTicketPrice: {
      type: Number,
      default: 0,
    },
    spendPerHead: {
      type: Number,
      default: 0,
    },
    fnbToBoxOfficeRatioPercent: {
      type: Number,
      default: 0,
    },
    isReconciled: {
      type: Boolean,
      default: true,
    },
    reconciliationStatus: {
      type: String,
      enum: ['RECONCILED', 'PENDING', 'DISCREPANCY_DETECTED'],
      default: 'RECONCILED',
    },
    varianceAmount: {
      type: Number,
      default: 0,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    syncVersion: {
      type: Number,
      default: 1,
    },
    movies: [MoviePerformanceSchema],
    hourlyDistribution: [HourlyDistributionSchema],
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: Enforces idempotency guarantee across all sync cycles
DailyFranchiseRevenueSchema.index(
  { franchiseCode: 1, businessDate: 1 },
  { unique: true }
);

DailyFranchiseRevenueSchema.index({ vistaCinemaId: 1, businessDate: 1 });

export const DailyFranchiseRevenue =
  mongoose.models.DailyFranchiseRevenue ||
  mongoose.model<IDailyFranchiseRevenue>('DailyFranchiseRevenue', DailyFranchiseRevenueSchema);

export default DailyFranchiseRevenue;
