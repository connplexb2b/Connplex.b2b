import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API working",
  });
});

router.post("/book-event", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    return res.status(201).json({
      success: true,
      message: "Book event form submitted successfully",
      data: req.body,
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/contact-messages", async (req, res) => {
  try {
    console.log("CONTACT BODY:", req.body);

    return res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: req.body,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;