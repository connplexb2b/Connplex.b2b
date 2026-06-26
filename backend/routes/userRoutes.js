import express from "express";
import { createFranchiseAds } from "../controllers/FranchiseadsController.js";

const router = express.Router();

router.post("/create-franchise-ads", createFranchiseAds);

export default router;
