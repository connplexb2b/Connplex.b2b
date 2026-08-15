import mongoose, { Schema } from 'mongoose';

const InvestorFileSchema = new Schema({
  id: { type: String, required: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  title: { type: String },
});

const InvestorSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['pdf', 'audio'], default: 'pdf' },
  parent: { type: String, default: '', trim: true },
  files: [InvestorFileSchema],
}, { timestamps: true });

export const Investor = mongoose.models.Investor || mongoose.model('Investor', InvestorSchema);
export default Investor;
