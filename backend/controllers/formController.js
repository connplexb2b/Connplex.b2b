import BookEvent from '../models/BookEvent.js';
import ConnEventsWaitlist from '../models/ConnEventsWaitlist.js';
import ConnflixSubscriber from '../models/ConnflixSubscriber.js';
import ConnmusicWaitlist from '../models/ConnmusicWaitlist.js';
import StudioInvitation from '../models/StudioInvitation.js';
import ContactMessage from '../models/ContactMessage.js';
import DowntownInvitation from '../models/DowntownInvitation.js';
import FranchiseInquiry from '../models/FranchiseInquiry.js';
import PurexSubscriber from '../models/PurexSubscriber.js';
import SkyinnReservation from '../models/SkyinnReservation.js';
import Newsletter from '../models/Newsletter.js';
import VendorRegistration from '../models/VendorRegistration.js';
import ConsultantBooking from '../models/ConsultantBooking.js';
import CareerApplication from '../models/CareerApplication.js';
import GeneralInquiry from '../models/GeneralInquiry.js';
import { syncToZoho } from '../services/zohoService.js';

// Helper to handle standard model creation and responses
const handleSubmission = async (Model, req, res, next) => {
  try {
    const record = await Model.create(req.body);
    
    // Debug logging for insertion success
    console.log(`[MongoDB Success] Inserted document into collection: ${Model.collection.name}`);
    
    // Non-blocking background sync to Zoho CRM
    syncToZoho({
      module: "Leads",
      data: record,
      source: `Website - ${Model.modelName}`
    })
      .then(() => {
        const hasZohoConfig = process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_ID !== "your_zoho_client_id_here";
        if (hasZohoConfig) {
          console.log(`[Zoho Success] Synced ${Model.modelName} successfully to Zoho CRM`);
        }
      })
      .catch((zohoError) => {
        console.error(`[Zoho Error] Failed to sync ${Model.modelName} to Zoho CRM. Error: ${zohoError.message}`);
      });
    
    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: record
    });
  } catch (error) {
    // Debug logging for insertion failure
    console.error(`[Database Failure] Failed insertion in collection: ${Model.collection.name}. Error: ${error.message}`);
    
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
  return handleSubmission(BookEvent, req, res, next);
};

// 2. Conn Events Waitlist Form Controller
export const joinConnEventsWaitlist = (req, res, next) => {
  return handleSubmission(ConnEventsWaitlist, req, res, next);
};

// 3. Connflix Footer Notify Form Controller
export const joinConnflixWaitlist = (req, res, next) => {
  return handleSubmission(ConnflixSubscriber, req, res, next);
};

// 4. Connmusic Waitlist Form Controller
export const joinConnmusicWaitlist = (req, res, next) => {
  return handleSubmission(ConnmusicWaitlist, req, res, next);
};

// 5. Connplex Studio Invitation Form Controller
export const requestStudioInvitation = (req, res, next) => {
  return handleSubmission(StudioInvitation, req, res, next);
};

// 6. Contact Message Form Controller
export const submitContactInquiry = (req, res, next) => {
  return handleSubmission(ContactMessage, req, res, next);
};

// 7. Downtown VIP Invitation Form Controller
export const requestDowntownInvitation = (req, res, next) => {
  return handleSubmission(DowntownInvitation, req, res, next);
};

// 8. Franchise Form Controller
export const submitFranchiseApplication = (req, res, next) => {
  return handleSubmission(FranchiseInquiry, req, res, next);
};

// 9. Pure-X Subscribe Form Controller
export const subscribePurex = (req, res, next) => {
  return handleSubmission(PurexSubscriber, req, res, next);
};

// 10. Sky-Inn VIP Modal Form Controller
export const reserveSkyinn = (req, res, next) => {
  return handleSubmission(SkyinnReservation, req, res, next);
};

// 11. Newsletter Form Controller
export const subscribeNewsletter = (req, res, next) => {
  return handleSubmission(Newsletter, req, res, next);
};

// 12. Vendor Registration Form Controller
export const registerVendor = (req, res, next) => {
  return handleSubmission(VendorRegistration, req, res, next);
};

// 13. Consultant Booking Form Controller
export const bookConsultant = (req, res, next) => {
  return handleSubmission(ConsultantBooking, req, res, next);
};

// 14. Career Application Form Controller
export const applyCareer = (req, res, next) => {
  return handleSubmission(CareerApplication, req, res, next);
};

// 15. General Inquiry Form Controller
export const submitGeneralInquiry = (req, res, next) => {
  return handleSubmission(GeneralInquiry, req, res, next);
};
