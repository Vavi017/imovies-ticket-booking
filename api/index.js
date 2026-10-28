import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import Movie from '../server/src/models/Movie.js';
import { seedDatabase } from '../server/src/utils/seed.js';

export default async function handler(req, res) {
  try {
    const { isMemory } = await connectDB();
    const movieCount = await Movie.countDocuments();
    if (isMemory || movieCount === 0) {
      await seedDatabase();
    }
  } catch (err) {
    console.error('Database connection notice in serverless handler:', err.message);
  }

  return app(req, res);
}
