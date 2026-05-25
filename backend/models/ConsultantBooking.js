import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;

const consultantBookingSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  subject: {
    type: String,
    trim: true,
    default: '',
  },
  message: {
    type: String,
    trim: true,
    default: '',
  }
}, {
  timestamps: true,
  collection: 'consultantbookings'
});

const ConsultantBooking = mongoose.model('ConsultantBooking', consultantBookingSchema);
export default ConsultantBooking;
