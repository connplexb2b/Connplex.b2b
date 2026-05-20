import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API working",
  });
});

router.post("/contact-messages", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: req.body,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;