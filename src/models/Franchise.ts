import mongoose, { Schema, Document } from 'mongoose';

export interface IFranchise extends Document {
  franchiseCode: string; // Unique PK, e.g. 'FR-CL16', 'FR-CN01'
  name: string; // e.g. 'Connplex Luxuriance Ahilyanagar'
  city: string;
  state: string;
  vistaCinemaId: string; // Maps to Vista tblCinema.Cinema_strID (e.g. 'CL16', 'CN01', 'SOUTH BOPA')
  vistaCinemaName: string;
  screenCount: number;
  totalSeatCapacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  ownerUserId?: string;
  ownerName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FranchiseSchema = new Schema<IFranchise>(
  {
    franchiseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    vistaCinemaId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    vistaCinemaName: {
      type: String,
      required: true,
      trim: true,
    },
    screenCount: {
      type: Number,
      default: 2,
    },
    totalSeatCapacity: {
      type: Number,
      default: 300,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
      default: 'ACTIVE',
      index: true,
    },
    ownerUserId: {
      type: String,
      default: null,
    },
    ownerName: {
      type: String,
      default: null,
    },
    contactEmail: {
      type: String,
      default: null,
    },
    contactPhone: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Franchise =
  mongoose.models.Franchise || mongoose.model<IFranchise>('Franchise', FranchiseSchema);

export default Franchise;
