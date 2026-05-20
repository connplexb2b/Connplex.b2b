import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const connmusicWaitlistSchema = new mongoose.Schema({
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
  collection: 'connmusic_waitlist'
});

const ConnmusicWaitlist = mongoose.model('ConnmusicWaitlist', connmusicWaitlistSchema);
export default ConnmusicWaitlist;
