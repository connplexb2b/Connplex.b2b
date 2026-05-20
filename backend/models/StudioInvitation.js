import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const studioInvitationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  }
}, {
  timestamps: true,
  collection: 'studio_invitations'
});

const StudioInvitation = mongoose.model('StudioInvitation', studioInvitationSchema);
export default StudioInvitation;
