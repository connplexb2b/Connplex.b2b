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
  reserveSkyinn
} from '../controllers/formController.js';

const router = express.Router();

// Define API post endpoints for each form collection
router.post('/forms/book-event', bookEvent);
router.post('/forms/connevents-waitlist', joinConnEventsWaitlist);
router.post('/forms/connflix-subscribers', joinConnflixWaitlist);
router.post('/forms/connmusic-waitlist', joinConnmusicWaitlist);
router.post('/forms/studio-invitations', requestStudioInvitation);
router.post('/forms/contact-messages', submitContactInquiry);
router.post('/forms/downtown-invitations', requestDowntownInvitation);
router.post('/forms/franchise-applications', submitFranchiseApplication);
router.post('/forms/purex-subscribers', subscribePurex);
router.post('/forms/skyinn-reservations', reserveSkyinn);

export default router;
