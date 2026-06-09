import mongoose, { Schema } from 'mongoose';

const SEOPageSchema = new Schema({
  pageSlug: { type: String, required: true, unique: true, trim: true },
  pageLabel: { type: String, required: true, trim: true },
  metaTitle: { type: String, default: '', trim: true },
  metaDescription: { type: String, default: '', trim: true },
  keywords: { type: String, default: '', trim: true },
  ogImage: { type: String, default: '', trim: true },
}, { timestamps: true });

export const SEOPage = mongoose.models.SEOPage || mongoose.model('SEOPage', SEOPageSchema);
export default SEOPage;
