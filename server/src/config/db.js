import mongoose from 'mongoose';

let isConnected = false;
let mongoMemoryServer = null;

export const connectDB = async () => {
  // If already connected in serverless cache, reuse connection
  if (isConnected && mongoose.connection.readyState === 1) {
    return { isMemory: false };
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Connecting to MongoDB...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000
      });
      isConnected = true;
      console.log(` MongoDB Connected (External): ${conn.connection.host}`);
      return { isMemory: false };
    } catch (err) {
      console.warn(` Failed to connect to external MongoDB: ${err.message}`);
      if (process.env.VERCEL) {
        throw new Error(
          'Could not connect to MongoDB Atlas. Please ensure MONGODB_URI in Vercel Environment Variables is correct and Network Access (0.0.0.0/0) is enabled in MongoDB Atlas.'
        );
      }
      console.log('Falling back to In-Memory MongoDB for local development...');
    }
  } else {
    if (process.env.VERCEL) {
      console.warn('Running on Vercel without MONGODB_URI!');
    } else {
      console.log('No MONGODB_URI provided in environment. Initializing In-Memory MongoDB...');
    }
  }

  // Fallback to MongoMemoryServer (works locally)
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'imovies'
      }
    });
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    isConnected = true;
    console.log(` MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    return { isMemory: true };
  } catch (err) {
    console.error(` Error initializing In-Memory MongoDB: ${err.message}`);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  isConnected = false;
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
