import mongoose, { Schema } from 'mongoose';

const NewsArticleSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  shortDesc: { type: String, default: '', trim: true },
  imagePath: { type: String, default: '', trim: true },
  body: { type: String, default: '', trim: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const NewsArticle = mongoose.models.NewsArticle || mongoose.model('NewsArticle', NewsArticleSchema);
export default NewsArticle;
