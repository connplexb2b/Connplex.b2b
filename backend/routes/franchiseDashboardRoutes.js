import express from "express";
import {
  getSummary,
  getDaily,
  getChannelBreakdown,
  getFnbMetrics,
  getMovieWise,
  getHourly,
  getOccupancy,
  getSyncStatus,
  triggerSync,
  getCorporateOverview,
} from "../controllers/FranchiseDashboardController.js";

const router = express.Router();

router.get("/v1/franchise-dashboard/summary", getSummary);
router.get("/v1/franchise-dashboard/daily", getDaily);
router.get("/v1/franchise-dashboard/channel-breakdown", getChannelBreakdown);
router.get("/v1/franchise-dashboard/fnb-metrics", getFnbMetrics);
router.get("/v1/franchise-dashboard/movie-wise", getMovieWise);
router.get("/v1/franchise-dashboard/hourly", getHourly);
router.get("/v1/franchise-dashboard/occupancy", getOccupancy);
router.get("/v1/franchise-dashboard/sync-status", getSyncStatus);
router.post("/v1/franchise-dashboard/sync-trigger", triggerSync);
router.get("/v1/franchise-dashboard/corporate-overview", getCorporateOverview);

export default router;
