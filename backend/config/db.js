import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('CRITICAL ERROR: MONGO_URI environment variable is missing in your configuration.');
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    return;
  }

  const options = {
    autoIndex: true, // Auto-build indexes in development/production
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  // Mongoose connection listeners
  mongoose.connection.on('connected', () => {
    console.log(`Successfully connected to MongoDB Atlas database: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error occurred: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected. Trying to reconnect...');
  });

  try {
    await mongoose.connect(mongoURI, options);
  } catch (error) {
    console.error(`Mongoose initial connection failure: ${error.message}`);
    // Do not exit process in production to allow retry triggers, exit in dev
    if (process.env.NODE_ENV === 'development') {
      console.warn('Exiting backend process due to Mongoose initial failure...');
      process.exit(1);
    }
  }
};

export default connectDB;
