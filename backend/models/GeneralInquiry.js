import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;

const generalInquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [phoneRegex, 'Please provide a valid phone number'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  }
}, {
  timestamps: true,
  collection: 'generalinquiries'
});

const GeneralInquiry = mongoose.model('GeneralInquiry', generalInquirySchema);
export default GeneralInquiry;
