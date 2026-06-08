import mongoose, { Schema } from 'mongoose';

const GalleryImageSchema = new Schema({
  title: { type: String, required: true, trim: true },
  caption: { type: String, default: '', trim: true },
  imagePath: { type: String, required: true, trim: true },
  category: { type: String, default: 'General', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
export default GalleryImage;
