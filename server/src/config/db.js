import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`Attempting connection to configured MongoDB at ${uri.substring(0, 25)}...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(` MongoDB Connected (External): ${conn.connection.host}`);
      return { isMemory: false };
    } catch (err) {
      console.warn(` Failed to connect to external MongoDB: ${err.message}`);
      console.log('Falling back to In-Memory MongoDB...');
    }
  } else {
    console.log('No MONGODB_URI provided in environment. Initializing In-Memory MongoDB...');
  }

  // Fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'imovies'
      }
    });
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(` MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    return { isMemory: true };
  } catch (err) {
    console.error(` Error initializing In-Memory MongoDB: ${err.message}`);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
