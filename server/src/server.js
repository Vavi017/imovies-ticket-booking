import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import Movie from './models/Movie.js';
import { seedDatabase } from './utils/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Start server and initialize database
const startServer = async () => {
  try {
    const { isMemory } = await connectDB();

    // Auto-seed if database is empty or running on in-memory instance
    const movieCount = await Movie.countDocuments();
    if (isMemory || movieCount === 0) {
      console.log('Detected fresh / in-memory database. Running auto-seeding...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` IMovies API Server running on port ${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(` Default Admin: admin@imovies.com / admin123`);
      console.log(` Default User:  user@imovies.com / user123`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
