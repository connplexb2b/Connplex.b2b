import mongoose from "mongoose";

const FranchiseSchema = new mongoose.Schema(
  {
    franchiseCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    vistaCinemaId: { type: String, required: true, index: true },
    vistaCinemaName: { type: String, required: true },
    screenCount: { type: Number, default: 2 },
    totalSeatCapacity: { type: Number, default: 300 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "PENDING"], default: "ACTIVE" },
    ownerUserId: { type: String, default: null },
    ownerName: { type: String, default: null },
    contactEmail: { type: String, default: null },
    contactPhone: { type: String, default: null },
  },
  { timestamps: true }
);

export const Franchise = mongoose.models.Franchise || mongoose.model("Franchise", FranchiseSchema);
export default Franchise;
