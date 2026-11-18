import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFranchiseExpense extends Document {
  cinemaId: string;
  expenseId: string;
  title: string;
  category: string;
  vendor: string;
  amount: number;
  tax: number;
  gstRate: number;
  date: string; // YYYY-MM-DD
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  approver?: string;
  approvedAt?: Date;
  attachment?: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FranchiseExpenseSchema = new Schema<IFranchiseExpense>(
  {
    cinemaId: { type: String, required: true, index: true },
    expenseId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: [
        'Electricity & Utilities',
        'Housekeeping & Sanitization',
        'Projector & Lamp Maintenance',
        'Sound & Acoustic Retainer',
        'Facility & Rent',
        'Staff Payroll',
        'F&B Consumables & Logistics',
        'Marketing & Local Promotions',
        'Repairs & Operational Supplies',
        'Statutory & Licensing Fees',
        'Other'
      ],
      default: 'Electricity & Utilities'
    },
    vendor: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    gstRate: { type: Number, default: 18 },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Paid'],
      default: 'Pending',
      index: true
    },
    approver: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    attachment: { type: String, default: '' },
    description: { type: String, default: '' },
    createdBy: { type: String, default: 'Franchise Manager' }
  },
  {
    timestamps: true
  }
);

FranchiseExpenseSchema.index({ cinemaId: 1, date: -1 });

export const FranchiseExpense: Model<IFranchiseExpense> =
  mongoose.models.FranchiseExpense ||
  mongoose.model<IFranchiseExpense>('FranchiseExpense', FranchiseExpenseSchema, 'franchise_expenses');

export default FranchiseExpense;
