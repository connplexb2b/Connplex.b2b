import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;

const franchiseApplicationSchema = new mongoose.Schema({
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
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  preferredInvestment: {
    type: String,
    required: [true, 'Preferred investment range is required'],
    trim: true,
  },
  preferredCity: {
    type: String,
    required: [true, 'Preferred city for cinema is required'],
    trim: true,
  },
  hasProperty: {
    type: String,
    required: [true, 'Property availability details are required'],
    trim: true,
  },
  timeframe: {
    type: String,
    required: [true, 'Investment timeframe is required'],
    trim: true,
  },
  message: {
    type: String,
    trim: true,
    default: '',
  }
}, {
  timestamps: true,
  collection: 'franchise_applications'
});

const FranchiseApplication = mongoose.model('FranchiseApplication', franchiseApplicationSchema);
export default FranchiseApplication;
