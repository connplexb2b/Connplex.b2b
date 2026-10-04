import { FranchiseDashboardService } from "../../src/services/FranchiseDashboardService.js";
import { resolveDashboardAuth } from "../../src/lib/dashboardAuth.js";

export const getSummary = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const data = await FranchiseDashboardService.getSummary(auth.effectiveFranchiseCode);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getDaily = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const { startDate, endDate } = req.query;
    const data = await FranchiseDashboardService.getDailyBreakdown(auth.effectiveFranchiseCode, startDate, endDate);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getChannelBreakdown = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const { startDate, endDate } = req.query;
    const data = await FranchiseDashboardService.getChannelBreakdown(auth.effectiveFranchiseCode, startDate, endDate);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getFnbMetrics = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const { startDate, endDate } = req.query;
    const data = await FranchiseDashboardService.getFnbMetrics(auth.effectiveFranchiseCode, startDate, endDate);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getMovieWise = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const data = await FranchiseDashboardService.getMovieWise(auth.effectiveFranchiseCode);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getHourly = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const { date } = req.query;
    const data = await FranchiseDashboardService.getHourly(auth.effectiveFranchiseCode, date);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getOccupancy = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    const { date } = req.query;
    const data = await FranchiseDashboardService.getOccupancy(auth.effectiveFranchiseCode, date);
    res.json({ status: 200, userRole: auth.role, scopedFranchise: auth.effectiveFranchiseCode, data });
  } catch (err) {
    next(err);
  }
};

export const getSyncStatus = async (req, res, next) => {
  try {
    const data = await FranchiseDashboardService.getSyncStatus();
    res.json({ status: 200, data });
  } catch (err) {
    next(err);
  }
};

export const triggerSync = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    if (auth.role !== "CORPORATE_ADMIN") {
      return res.status(403).json({
        status: 403,
        message: "Access Denied: Only Connplex Corporate Administrators can trigger manual synchronization.",
      });
    }
    const { franchiseCode, startDate, endDate } = req.body || {};
    const data = await FranchiseDashboardService.triggerManualSync({ franchiseCode, startDate, endDate });
    res.json({ status: 200, data });
  } catch (err) {
    next(err);
  }
};

export const getCorporateOverview = async (req, res, next) => {
  try {
    const auth = resolveDashboardAuth(req);
    if (auth.role !== "CORPORATE_ADMIN") {
      return res.status(403).json({
        status: 403,
        message: "Access Denied: Only Connplex Corporate Administrators can access corporate overview.",
      });
    }
    const data = await FranchiseDashboardService.getCorporateOverview();
    res.json({ status: 200, userRole: auth.role, data });
  } catch (err) {
    next(err);
  }
};
