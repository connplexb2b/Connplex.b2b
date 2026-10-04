import mongoose, { Schema, Document } from 'mongoose';

export interface IReconciliationAudit extends Document {
  franchiseCode: string;
  vistaCinemaId: string;
  auditDate: string; // YYYY-MM-DD
  realTimeTotalGross: number; // 10-minute worker sync total
  auditedTotalGross: number; // Vista EOD report total
  varianceAmount: number; // realTimeTotalGross - auditedTotalGross
  auditStatus: 'MATCH' | 'VARIANCE_WITHIN_TOLERANCE' | 'DISCREPANCY';
  details?: Record<string, any>;
  reviewedBy?: string;
  resolvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReconciliationAuditSchema = new Schema<IReconciliationAudit>(
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
    auditDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    realTimeTotalGross: {
      type: Number,
      required: true,
      default: 0,
    },
    auditedTotalGross: {
      type: Number,
      required: true,
      default: 0,
    },
    varianceAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    auditStatus: {
      type: String,
      enum: ['MATCH', 'VARIANCE_WITHIN_TOLERANCE', 'DISCREPANCY'],
      required: true,
      default: 'MATCH',
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

ReconciliationAuditSchema.index(
  { franchiseCode: 1, auditDate: 1 },
  { unique: true }
);

export const ReconciliationAudit =
  mongoose.models.ReconciliationAudit ||
  mongoose.model<IReconciliationAudit>('ReconciliationAudit', ReconciliationAuditSchema);

export default ReconciliationAudit;
