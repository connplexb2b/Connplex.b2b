import express from "express";
import {
  getAhilyanagarRevenue,
  getAhilyanagarVistaDailyData,
} from "../controllers/AhilyanagarRevenueController.js";

const router = express.Router();

router.get("/franchise/ahilyanagar/daily-revenue", getAhilyanagarRevenue);
router.post("/franchise/ahilyanagar/daily-revenue", getAhilyanagarRevenue);
router.get("/franchise/ahilyanagar/vista-daily-data", getAhilyanagarVistaDailyData);

export default router;
