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
    console.log(req.body);

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;