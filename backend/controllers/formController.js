import EventBooking from '../models/EventBooking.js';
import ConnEventsWaitlist from '../models/ConnEventsWaitlist.js';
import ConnflixSubscriber from '../models/ConnflixSubscriber.js';
import ConnmusicWaitlist from '../models/ConnmusicWaitlist.js';
import StudioInvitation from '../models/StudioInvitation.js';
import ContactMessage from '../models/ContactMessage.js';
import DowntownInvitation from '../models/DowntownInvitation.js';
import FranchiseApplication from '../models/FranchiseApplication.js';
import PurexSubscriber from '../models/PurexSubscriber.js';
import SkyinnReservation from '../models/SkyinnReservation.js';
import Newsletter from '../models/Newsletter.js';
import VendorRegistration from '../models/VendorRegistration.js';

// Helper to handle standard model creation and responses
const handleSubmission = async (Model, req, res, next, successMessage) => {
  try {
    const record = await Model.create(req.body);
    return res.status(201).json({
      success: true,
      message: successMessage,
      data: record
    });
  } catch (error) {
    // If it's a Mongoose duplicate key error (code 11000)
    if (error.code === 11000) {
      res.status(409); // Conflict
      return next(new Error('This email address has already been registered or subscribed.'));
    }
    
    // Check if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400); // Bad Request
      return next(new Error(messages.join(', ')));
    }
    
    return next(error);
  }
};

// 1. Book Event Form Controller
export const bookEvent = (req, res, next) => {
  return handleSubmission(
    EventBooking,
    req,
    res,
    next,
    'Your event booking request has been successfully recorded. Our events team will contact you shortly.'
  );
};

// 2. Conn Events Waitlist Form Controller
export const joinConnEventsWaitlist = (req, res, next) => {
  return handleSubmission(
    ConnEventsWaitlist,
    req,
    res,
    next,
    'Success! You have been added to the Conn Events VIP waitlist.'
  );
};

// 3. Connflix Footer Notify Form Controller
export const joinConnflixWaitlist = (req, res, next) => {
  return handleSubmission(
    ConnflixSubscriber,
    req,
    res,
    next,
    'Success! You are now subscribed to Connflix release updates.'
  );
};

// 4. Connmusic Waitlist Form Controller
export const joinConnmusicWaitlist = (req, res, next) => {
  return handleSubmission(
    ConnmusicWaitlist,
    req,
    res,
    next,
    'Success! You are registered on the Connmusic early listen list.'
  );
};

// 5. Connplex Studio Invitation Form Controller
export const requestStudioInvitation = (req, res, next) => {
  return handleSubmission(
    StudioInvitation,
    req,
    res,
    next,
    'Success! Your invitation request to Connplex Studio has been logged.'
  );
};

// 6. Contact Message Form Controller
export const submitContactInquiry = (req, res, next) => {
  return handleSubmission(
    ContactMessage,
    req,
    res,
    next,
    'Thank you for contacting Connplex Cinemas. Our support team will review your inquiry and get in touch.'
  );
};

// 7. Downtown VIP Invitation Form Controller
export const requestDowntownInvitation = (req, res, next) => {
  return handleSubmission(
    DowntownInvitation,
    req,
    res,
    next,
    'Thank you for requesting access to Downtown Cinema. An exclusive curator will email your VIP invite shortly.'
  );
};

// 8. Franchise Form Controller
export const submitFranchiseApplication = (req, res, next) => {
  return handleSubmission(
    FranchiseApplication,
    req,
    res,
    next,
    'Thank you for your interest in partnering with Connplex Cinemas. Our Franchise Development team will review your application and contact you soon.'
  );
};

// 9. Pure-X Subscribe Form Controller
export const subscribePurex = (req, res, next) => {
  return handleSubmission(
    PurexSubscriber,
    req,
    res,
    next,
    'Success! You are now on the Pure-X VIP air purification announcement list.'
  );
};

// 10. Sky-Inn VIP Modal Form Controller
export const reserveSkyinn = (req, res, next) => {
  return handleSubmission(
    SkyinnReservation,
    req,
    res,
    next,
    'Success! You have been successfully added to the Sky-Inn Drive-In exclusive reservation list.'
  );
};

// 11. Newsletter Form Controller
export const subscribeNewsletter = (req, res, next) => {
  return handleSubmission(
    Newsletter,
    req,
    res,
    next,
    'Success! You are now subscribed to our newsletter.'
  );
};

// 12. Vendor Registration Form Controller
export const registerVendor = (req, res, next) => {
  return handleSubmission(
    VendorRegistration,
    req,
    res,
    next,
    'Success! Your vendor registration has been submitted.'
  );
};
