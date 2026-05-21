import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const vendorRegistrationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  productCategory: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
  collection: 'vendor_registrations'
});

const VendorRegistration = mongoose.model('VendorRegistration', vendorRegistrationSchema);
export default VendorRegistration;
