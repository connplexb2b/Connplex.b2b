import mongoose from "mongoose";

const ReconciliationAuditSchema = new mongoose.Schema(
  {
    franchiseCode: { type: String, required: true, index: true },
    vistaCinemaId: { type: String, required: true, index: true },
    auditDate: { type: String, required: true, index: true },
    realTimeTotalGross: { type: Number, required: true, default: 0 },
    auditedTotalGross: { type: Number, required: true, default: 0 },
    varianceAmount: { type: Number, required: true, default: 0 },
    auditStatus: {
      type: String,
      enum: ["MATCH", "VARIANCE_WITHIN_TOLERANCE", "DISCREPANCY"],
      required: true,
      default: "MATCH",
    },
    details: { type: mongoose.Schema.Types.Mixed },
    reviewedBy: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

ReconciliationAuditSchema.index({ franchiseCode: 1, auditDate: 1 }, { unique: true });

export const ReconciliationAudit =
  mongoose.models.ReconciliationAudit ||
  mongoose.model("ReconciliationAudit", ReconciliationAuditSchema);

export default ReconciliationAudit;
