// Global error middleware to catch and normalize all Express route errors
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log full error stack in development
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error Middleware] Caught error: ${err.message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Route not found fallback middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
