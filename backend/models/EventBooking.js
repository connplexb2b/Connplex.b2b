import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/; // E.164 standard phone format or standard 10 digit local format

const eventBookingSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    trim: true,
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    trim: true,
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    trim: true,
  },
  expectedGuests: {
    type: String,
    required: [true, 'Expected guest count range is required'],
    trim: true,
  },
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
    match: [phoneRegex, 'Please provide a valid phone number (10 digits or E.164 international format)'],
  },
  company: {
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
  timestamps: true, // Auto-inject createdAt & updatedAt fields
  collection: 'event_bookings' // Explicitly specify database collection name
});

const EventBooking = mongoose.model('EventBooking', eventBookingSchema);
export default EventBooking;
