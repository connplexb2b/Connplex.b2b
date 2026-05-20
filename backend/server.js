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

// Configure CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'https://connplex-b2b.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    // Permit requests with no origin (like mobile apps, curl requests, or postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return allowedOrigin.trim() === origin || allowedOrigin.trim() === '*';
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by CORS Policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if any
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Connplex B2B backend API server.'
  });
});

// Production-ready Health Check Endpoint
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

// Register API Routes
app.use('/api', apiRoutes);

// Not Found Route Fallback
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Connplex B2B Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
