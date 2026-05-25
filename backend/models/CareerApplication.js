import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;

const careerApplicationSchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: [true, 'Position applied for is required'],
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
    default: '',
  },
  cvUrl: {
    type: String,
    trim: true,
    default: '',
  },
  coverLetter: {
    type: String,
    trim: true,
    default: '',
  }
}, {
  timestamps: true,
  collection: 'careerapplications'
});

const CareerApplication = mongoose.model('CareerApplication', careerApplicationSchema);
export default CareerApplication;
