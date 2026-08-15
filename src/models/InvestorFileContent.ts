import mongoose, { Schema } from 'mongoose';

const InvestorFileContentSchema = new Schema({
  filename: { type: String, required: true, unique: true },
  data: { type: Buffer, required: true },
  mimeType: { type: String, required: true },
}, { timestamps: true });

export const InvestorFileContent = mongoose.models.InvestorFileContent || mongoose.model('InvestorFileContent', InvestorFileContentSchema);
export default InvestorFileContent;
