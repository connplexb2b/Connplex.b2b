import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import formRoutes from "./routes/formRoutes.js";

dotenv.config();

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Request Log] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Origin: ${req.headers.origin || 'N/A'} - Duration: ${duration}ms`);
  });
  next();
});

// Dynamic production CORS setup
const allowedOrigins = [
  "https://connplex-b2b-89ab.vercel.app",
  "https://connplex-b2b.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, health checks, curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") ||
                      /^http:\/\/localhost:\d+$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Preflight OPTIONS handler
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Forms API routes
app.use("/api/forms", formRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error] Path: ${req.path}. Error: ${err.message}`);
  
  if (res.headersSent) {
    return next(err);
  }
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

// Start server after initializing database
const startServer = async () => {
  console.log("Initializing database connection...");
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();