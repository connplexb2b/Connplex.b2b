import express from 'express';
import {
  bookEvent,
  joinConnEventsWaitlist,
  joinConnflixWaitlist,
  joinConnmusicWaitlist,
  requestStudioInvitation,
  submitContactInquiry,
  requestDowntownInvitation,
  submitFranchiseApplication,
  subscribePurex,
  reserveSkyinn,
  subscribeNewsletter,
  registerVendor
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
router.post('/studio-invitations', requestStudioInvitation);
router.post('/contact-messages', submitContactInquiry);
router.post('/downtown-invitations', requestDowntownInvitation);
router.post('/franchise-applications', submitFranchiseApplication);
router.post('/purex-subscribers', subscribePurex);
router.post('/skyinn-reservations', reserveSkyinn);
router.post('/newsletter', subscribeNewsletter);
router.post('/vendor-registration', registerVendor);

export default router;
