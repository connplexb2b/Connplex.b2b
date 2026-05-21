import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  }
}, {
  timestamps: true,
  collection: 'newsletter_subscribers'
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
