import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const gameflixWaitlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
  platform: {
    type: String,
    required: [true, 'Preferred platform is required'],
    enum: ['PC', 'Console', 'Mobile', 'Cloud'],
  }
}, {
  timestamps: true,
  collection: 'gameflixwaitlists'
});

const GameflixWaitlist = mongoose.model('GameflixWaitlist', gameflixWaitlistSchema);
export default GameflixWaitlist;
