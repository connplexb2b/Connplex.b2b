import mongoose, { Schema } from 'mongoose';

const FAQItemSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  category: { type: String, default: 'General', trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const FAQItem = mongoose.models.FAQItem || mongoose.model('FAQItem', FAQItemSchema);
export default FAQItem;
