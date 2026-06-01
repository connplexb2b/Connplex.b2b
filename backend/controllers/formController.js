import BookEvent from '../models/BookEvent.js';
import ConnEventsWaitlist from '../models/ConnEventsWaitlist.js';
import ConnflixSubscriber from '../models/ConnflixSubscriber.js';
import ConnmusicWaitlist from '../models/ConnmusicWaitlist.js';
import GameflixWaitlist from '../models/GameflixWaitlist.js';
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
import Feedback from '../models/Feedback.js';
import FAQ from '../models/FAQ.js';
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

// 4b. Gameflix Waitlist Form Controller
export const joinGameflixWaitlist = (req, res, next) => {
  return handleSubmission(GameflixWaitlist, req, res, next);
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

// 16. Feedback Form Controller
export const submitFeedback = (req, res, next) => {
  return handleSubmission(Feedback, req, res, next);
};

// 17. Get FAQs Controller
export const getFAQs = async (req, res, next) => {
  try {
    let faqs = await FAQ.find().sort({ order: 1 });
    
    // Seed default FAQs if the collection is empty
    if (faqs.length === 0) {
      const defaultFAQs = [
        {
          question: 'What are the location requirements for starting a Connplex Cinemas franchise?',
          answer: 'At Connplex Cinemas, we typically look for spaces ranging from 7,000 to 15,000 sq. ft., depending on the number of screens, seating capacity, and cinema format selected.\n\nThe ideal property should also offer:\n• Clear height ranging from 11 ft. to 24 ft. & more\n• Strong visibility and accessibility\n• High-footfall surroundings\n• Strong catchment potential\n• Entertainment and retail compatibility\n\nWe believe the right location becomes the heart of the city\'s entertainment ecosystem. Whether it\'s a mall, high street, mixed-use development, or standalone property — if your location has the potential to become a leisure destination, it could be the perfect fit for Connplex.',
          order: 1
        },
        {
          question: 'Do I need to own a property to start a Connplex franchise?',
          answer: 'Not necessarily. While owning a property is an advantage, it is not mandatory to partner with Connplex Cinemas.\n\nMany of our successful franchise partners operate from leased or long-term rental spaces that meet our cinema development standards.\n\nWhat matters most is:\n• The right location\n• Strong audience potential\n• Proper layout feasibility\n• Commercial viability\n\nWhether you own the property or plan to lease one, our team will help evaluate and guide the opportunity.',
          order: 2
        },
        {
          question: 'What is the minimum investment required to open a Connplex Cinemas franchise?',
          answer: 'The investment depends on the cinema format, city category, screen count, and property condition.\n\nTypically, Franchise investment starts from ₹2 Crore onwards for cinema or auditorium development.\n\nThis usually includes:\n• Interior development\n• Cinema seating\n• Projection systems\n• Sound & acoustics\n• F&B setup\n• Technology infrastructure\n• Branding elements\n\nThe overall investment may vary depending on:\n• Tier 1 / Tier 2 / Tier 3 city\n• Number of screens\n• Premium or luxury format selection\n• Existing site readiness.',
          order: 3
        },
        {
          question: 'What kind of returns and payback period can I expect?',
          answer: 'Cinema is one of the few entertainment businesses with strong cash-flow potential, as customers pay upfront through ticketing and F&B purchases.\n\nWith Connplex\'s proven business model and operational support, franchise partners can typically expect:\n• Attractive ROI opportunities\n• Estimated payback within 18–24 months\n• Long-term recurring revenue potential\n• Multiple revenue streams through ticketing, F&B, advertising, and events\n\nActual returns may vary depending on location performance and operational scale.',
          order: 4
        },
        {
          question: 'How soon can I launch my Connplex Cinemas after approval?',
          answer: 'Once the location and agreement are finalized, the development process moves quickly.\n\nOn average, a Connplex Cinemas franchise can become operational within 3–6 months, depending on:\n• Site readiness\n• Construction requirements\n• Number of screens\n• Interior scope\n• Technology installation timelines\n\nFor ready-to-develop sites, timelines can be even faster.',
          order: 5
        },
        {
          question: 'Do I need prior cinema or business experience to start?',
          answer: 'Not at all.\n\nConnplex Cinemas is designed for entrepreneurs, developers, investors, and business owners who want to enter the entertainment industry with expert support.\n\nYou do not need prior cinema experience because our team provides:\n• End-to-end guidance\n• Operational training\n• SOP frameworks\n• Technology integration\n• Marketing support\n• Launch assistance\n\nAll you need is the vision to build a landmark entertainment destination — we\'ll help you bring it to life.',
          order: 6
        },
        {
          question: 'What support will I receive as a Connplex franchise partner?',
          answer: 'When you partner with Connplex, you gain access to a complete cinema ecosystem designed for long-term growth and operational success.\n\nOur Support Includes:\nLocation & Design Assistance\nSite evaluation, space planning, audience flow optimization, and premium cinema layout development.\n\nProject & Setup Guidance\nSupport for interiors, acoustics, projection systems, seating, sound engineering, and technology integration.\n\nOperations & Training\nComprehensive staff training, SOP implementation, and operational guidance to ensure smooth daily management.\n\nMarketing & Brand Support\nNational-level campaigns combined with localized marketing strategies to maximize awareness and footfalls.\n\nTechnology Integration\nAdvanced ticketing systems, automation tools, analytics dashboards, and digital infrastructure.\n\nOngoing Business Support\nContinuous assistance in operations, marketing, financial planning, and business optimization.\n\nAt Connplex, we don\'t just offer a franchise — we build long-term growth partnerships.',
          order: 7
        },
        {
          question: 'Are there any franchise fees or revenue-sharing models?',
          answer: 'Yes. Connplex Cinemas follows a transparent and performance-driven franchise model.\n\nThe Structure Typically Includes:\nOne-Time Franchise Fee\nA non-refundable fee that provides access to the Connplex brand, systems, expertise, and support ecosystem.\n\nRevenue Sharing Model\nA predefined revenue-sharing structure designed to ensure aligned growth for both Connplex and the franchise partner.\n\nTransparent Agreements\nClear commercial terms with no hidden operational surprises.\n\nOur goal is to create a sustainable and mutually profitable partnership.',
          order: 8
        },
        {
          question: 'Will I get exclusivity in my city or region?',
          answer: 'Yes, depending on the market size, city potential, and selected franchise format, Connplex may offer location-based exclusivity.\n\nThis helps:\n• Protect your market potential\n• Avoid brand saturation\n• Maintain premium positioning\n• Enable sustainable growth opportunities\n\nHowever, all exclusivity approvals are subject to Connplex management evaluation and final approval.',
          order: 9
        },
        {
          question: 'What are the major revenue streams in a Connplex Cinemas franchise?',
          answer: 'A Connplex franchise generates revenue through multiple channels, including:\n• Movie ticket sales\n• Food & beverage sales\n• Brand advertising\n• Celebrity & event activations\n• Sports screenings\n• Stand-up comedy & live shows\n• Gaming & experiential zones\n• Digital promotions\n\nThis diversified model helps maximize profitability.',
          order: 10
        },
        {
          question: 'Can Connplex Cinemas be developed inside malls or mixed-use projects?',
          answer: 'Yes. Connplex Cinemas can be integrated into:\n• Shopping malls\n• Commercial complexes\n• Mixed-use developments\n• High-street properties\n• Standalone entertainment hubs\n\nOur flexible cinema formats are designed to suit different real estate models.',
          order: 11
        },
        {
          question: 'Does Connplex help with marketing before launch?',
          answer: 'Absolutely.\n\nWe provide:\n• Pre-launch campaigns\n• Influencer marketing\n• PR & media coverage\n• Digital advertising\n• Outdoor branding\n• Launch event planning\n• Social media promotions\n\nOur objective is to create strong market buzz before your cinema opens.',
          order: 12
        },
        {
          question: 'What cinema formats does Connplex offer?',
          answer: 'Connplex offers multiple scalable formats including:\n• Luxuriance\n• Signature\n• Smart\n\nEach format is designed for different market sizes, audience segments, and investment capacities.',
          order: 13
        },
        {
          question: 'Can I operate multiple Connplex franchise locations?',
          answer: 'Yes. Connplex welcomes multi-location and regional expansion partnerships for qualified investors and developers.\n\nMany partners expand into multiple cities after successfully operating their first location.',
          order: 14
        },
        {
          question: 'How do I apply for a Connplex Cinemas franchise?',
          answer: 'You can apply by:\n• Filling out the franchise inquiry form\n• Sharing your property details\n• Connecting with our expansion team\n\nOnce submitted, our team will evaluate your location and discuss the next steps for partnership development.',
          order: 15
        }
      ];
      faqs = await FAQ.insertMany(defaultFAQs);
      console.log('[MongoDB Success] Seeded default FAQs into collection');
    }
    
    return res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error(`[Database Failure] Failed to get FAQs: ${error.message}`);
    return next(error);
  }
};
