import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Establish database connection
connectDB();

const app = express();

// Configure CORS Allowed Origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'https://connplex-b2b.vercel.app'];

const corsOptions = {
  origin: (origin, callback) => {
    // Permit requests with no origin (like mobile apps, curl requests, or postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return allowedOrigin === origin || allowedOrigin === '*';
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Responds with 200 for preflight OPTIONS requests
};

// 1. CORS middleware configuration (Must be first)
app.use(cors(corsOptions));

// 2. Preflight request handling for all routes
app.options('*', cors(corsOptions));

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request Logging Middleware (Incoming requests, request body, etc.)
app.use((req, res, next) => {
  const start = Date.now();
  const origin = req.headers.origin || 'No Origin';
  console.log(`[Request] ${req.method} ${req.originalUrl} - Origin: ${origin} - IP: ${req.ip}`);
  
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`[Request Body]`, JSON.stringify(req.body, null, 2));
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Response] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Time: ${duration}ms`);
  });

  next();
});

// Root endpoint for simple checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Connplex B2B backend API server.'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connectionState: dbStatus
    },
    system: {
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`,
      nodeVersion: process.version,
      platform: process.platform
    }
  });
});

// 5. Register API Routes under /api/forms
app.use('/api/forms', apiRoutes);

// 6. Not Found Route Fallback
app.use(notFound);

// 7. Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Connplex B2B Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Test Endpoint: http://localhost:${PORT}/api/forms/test`);
  console.log(`=================================================`);
});
