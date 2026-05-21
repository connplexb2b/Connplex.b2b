import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import formRoutes from "./routes/formRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://connplex-b2b-89ab.vercel.app",
    "https://connplex-b2b.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/api/forms", formRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});