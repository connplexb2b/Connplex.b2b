import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const connflixSubscriberSchema = new mongoose.Schema({
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
  collection: 'connflix_subscribers'
});

const ConnflixSubscriber = mongoose.model('ConnflixSubscriber', connflixSubscriberSchema);
export default ConnflixSubscriber;
