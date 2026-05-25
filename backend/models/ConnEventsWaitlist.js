import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const connEventsWaitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true, // Prevent duplicate notify requests
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  }
}, {
  timestamps: true,
  collection: 'conneventswaitlists'
});

const ConnEventsWaitlist = mongoose.model('ConnEventsWaitlist', connEventsWaitlistSchema);
export default ConnEventsWaitlist;
