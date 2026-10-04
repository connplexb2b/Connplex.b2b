import mongoose from "mongoose";

const SyncStatusSchema = new mongoose.Schema(
  {
    syncType: { type: String, enum: ["REVENUE_10MIN", "AUDIT_NIGHTLY", "CINEMA_DISCOVERY"], required: true },
    status: { type: String, enum: ["STARTED", "SUCCESS", "PARTIAL", "FAILED"], required: true, default: "STARTED" },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    durationMs: { type: Number, default: 0 },
    recordsProcessed: { type: Number, default: 0 },
    failedCinemas: [{ cinemaId: String, error: String }],
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const SyncStatus = mongoose.models.SyncStatus || mongoose.model("SyncStatus", SyncStatusSchema);
export default SyncStatus;
