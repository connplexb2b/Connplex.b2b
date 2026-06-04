import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;

const feedbackSchema = new mongoose.Schema({
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
    trim: true,
    match: [phoneRegex, 'Please provide a valid phone number'],
  },
  location: {
    type: String,
    trim: true,
  },
  feedbackType: {
    type: String,
    required: [true, 'Feedback type is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  }
}, {
  timestamps: true,
  collection: 'feedbacks'
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
