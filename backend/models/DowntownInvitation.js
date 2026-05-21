import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const downtownInvitationSchema = new mongoose.Schema({
  name: {
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
  consent: {
    type: Boolean,
    required: [true, 'Consent checkbox is required'],
    default: true
  }
}, {
  timestamps: true,
  collection: 'downtowninvitations'
});

const DowntownInvitation = mongoose.model('DowntownInvitation', downtownInvitationSchema);
export default DowntownInvitation;
