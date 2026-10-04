import mongoose, { Schema, Document } from 'mongoose';

export interface ISyncStatus extends Document {
  syncType: 'REVENUE_10MIN' | 'AUDIT_NIGHTLY' | 'CINEMA_DISCOVERY';
  status: 'STARTED' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  recordsProcessed: number;
  failedCinemas: Array<{ cinemaId: string; error: string }>;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SyncStatusSchema = new Schema<ISyncStatus>(
  {
    syncType: {
      type: String,
      enum: ['REVENUE_10MIN', 'AUDIT_NIGHTLY', 'CINEMA_DISCOVERY'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['STARTED', 'SUCCESS', 'PARTIAL', 'FAILED'],
      required: true,
      default: 'STARTED',
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    recordsProcessed: {
      type: Number,
      default: 0,
    },
    failedCinemas: [
      {
        cinemaId: { type: String, required: true },
        error: { type: String, required: true },
      },
    ],
    errorMessage: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

SyncStatusSchema.index({ syncType: 1, startedAt: -1 });

export const SyncStatus =
  mongoose.models.SyncStatus || mongoose.model<ISyncStatus>('SyncStatus', SyncStatusSchema);

export default SyncStatus;
