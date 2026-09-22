import {
  getAhilyanagarDailyRevenue,
  fetchDailyTicketAndFnbFromVista,
} from "../services/AhilyanagarRevenueService.js";

export const getAhilyanagarRevenue = async (req, res) => {
  try {
    const params = {
      fromDate: req.query?.fromDate || req.body?.fromDate || req.body?.FromDate,
      toDate: req.query?.toDate || req.body?.toDate || req.body?.ToDate,
      cinemaId: req.query?.cinemaId || req.body?.cinemaId || req.body?.CinemaID || "Ahilyanagar",
      serverUrl: req.query?.serverUrl || req.body?.serverUrl,
      preset: req.query?.preset || req.body?.preset,
    };
    const result = await getAhilyanagarDailyRevenue(params);
    if (result.success) {
      return res.status(200).json({
        status: 200,
        message: result.msg || "Success",
        isLive: result.isLive,
        data: result.data,
      });
    }
    return res.status(400).json({ status: 400, message: result.message });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export const getAhilyanagarVistaDailyData = async (req, res) => {
  try {
    const { date, cinemaId, vistaBaseUrl } = req.query || {};
    const data = await fetchDailyTicketAndFnbFromVista({ date, cinemaId, vistaBaseUrl });
    return res.status(200).json({ status: 200, data });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};
