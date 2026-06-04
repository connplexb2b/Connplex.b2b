import express from 'express';
import {
  bookEvent,
  joinConnEventsWaitlist,
  joinConnflixWaitlist,
  joinConnmusicWaitlist,
  joinGameflixWaitlist,
  requestStudioInvitation,
  submitContactInquiry,
  requestDowntownInvitation,
  submitFranchiseApplication,
  subscribePurex,
  reserveSkyinn,
  subscribeNewsletter,
  registerVendor,
  bookConsultant,
  applyCareer,
  submitGeneralInquiry,
  submitFeedback,
  getFAQs
} from '../controllers/formController.js';

const router = express.Router();

// GET /api/forms/test
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API working"
  });
});

// Define API post endpoints for each form collection
router.post('/book-event', bookEvent);
router.post('/connevents-waitlist', joinConnEventsWaitlist);
router.post('/connflix-subscribers', joinConnflixWaitlist);
router.post('/connmusic-waitlist', joinConnmusicWaitlist);
router.post('/gameflix-waitlist', joinGameflixWaitlist);
router.post('/studio-invitations', requestStudioInvitation);
router.post('/contact-messages', submitContactInquiry);
router.post('/downtown-invitations', requestDowntownInvitation);
router.post('/franchise-applications', submitFranchiseApplication);
router.post('/purex-subscribers', subscribePurex);
router.post('/skyinn-reservations', reserveSkyinn);
router.post('/newsletter', subscribeNewsletter);
router.post('/vendor-registration', registerVendor);

// Add the requested collection-specific routes
router.post('/franchise-inquiry', submitFranchiseApplication);
router.post('/consultant-booking', bookConsultant);
router.post('/career-application', applyCareer);
router.post('/general-inquiry', submitGeneralInquiry);
router.post('/feedback', submitFeedback);
router.get('/faqs', getFAQs);

export default router;