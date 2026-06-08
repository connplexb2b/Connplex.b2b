import mongoose, { Schema } from 'mongoose';

const CaseStudySchema = new Schema({
  num: { type: String, required: true, trim: true },
  tag: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '', trim: true },
  location: { type: String, default: '', trim: true },
  img: { type: String, required: true, trim: true },
  desc: { type: String, default: '', trim: true },
  category: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);
export default CaseStudy;
