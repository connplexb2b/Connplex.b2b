import mongoose, { Schema } from 'mongoose';

const HeroSlideSchema = new Schema({
  eyebrow: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  tags: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  imagePath: { type: String, required: true, trim: true },
  link: { type: String, default: '', trim: true },
  linkText: { type: String, default: 'Know More', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
export default HeroSlide;
