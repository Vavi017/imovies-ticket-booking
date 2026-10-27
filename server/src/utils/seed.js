import mongoose from 'mongoose';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Seat from '../models/Seat.js';
import Booking from '../models/Booking.js';
import { sampleUsers, sampleTheatres, sampleMovies } from '../data/seedData.js';
import { generateSeatsForShow } from '../controllers/showController.js';

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const seedDatabase = async () => {
  try {
    console.log('Seeding initial data into database...');

    // 1. Clear old data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Seat.deleteMany({}),
      Booking.deleteMany({})
    ]);

    // 2. Insert Users
    const users = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      users.push(user);
    }
    const adminUser = users.find((u) => u.role === 'admin');
    const regularUser = users.find((u) => u.role === 'user');

    // 3. Insert Theatres
    const theatres = await Theatre.insertMany(sampleTheatres);

    // 4. Insert Movies
    const movies = await Movie.insertMany(sampleMovies);

    // 5. Generate Shows for next 5 days
    const showTimes = ['10:30 AM', '02:15 PM', '06:30 PM', '09:45 PM'];
    const createdShows = [];

    const today = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(formatDate(d));
    }

    // Assign shows for movies in theatres across dates
    for (const movie of movies) {
      for (let tIndex = 0; tIndex < theatres.length; tIndex++) {
        const theatre = theatres[tIndex];
        // 2 showtimes per movie per theatre per date
        const time1 = showTimes[tIndex % showTimes.length];
        const time2 = showTimes[(tIndex + 2) % showTimes.length];

        for (const dateStr of dates.slice(0, 3)) {
          // Show 1
          const show1 = await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            screenNumber: 1,
            date: dateStr,
            startTime: time1,
            prices: { vip: 350, premium: 250, regular: 180 }
          });
          await generateSeatsForShow(show1._id, theatre._id, show1.prices);
          createdShows.push(show1);

          // Show 2
          const show2 = await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            screenNumber: 1,
            date: dateStr,
            startTime: time2,
            prices: { vip: 320, premium: 220, regular: 160 }
          });
          await generateSeatsForShow(show2._id, theatre._id, show2.prices);
          createdShows.push(show2);
        }
      }
    }

    // 6. Pre-book a couple of sample seats and create a sample booking for regularUser
    if (createdShows.length > 0 && regularUser) {
      const targetShow = createdShows[0];
      const targetSeats = await Seat.find({
        show: targetShow._id,
        seatNumber: { $in: ['B4', 'B5'] }
      });

      if (targetSeats.length === 2) {
        const totalAmount = targetSeats.reduce((sum, s) => sum + s.price, 0);
        const convenienceFee = 50;
        const grandTotal = totalAmount + convenienceFee;

        const sampleBooking = await Booking.create({
          bookingCode: 'IMV-DEMO88',
          user: regularUser._id,
          show: targetShow._id,
          movie: targetShow.movie,
          theatre: targetShow.theatre,
          seats: targetSeats.map((s) => ({
            seatNumber: s.seatNumber,
            row: s.row,
            category: s.category,
            price: s.price
          })),
          totalAmount,
          convenienceFee,
          grandTotal,
          paymentStatus: 'completed',
          paymentDetails: {
            method: 'Credit Card',
            transactionId: 'TXN-INIT-99482',
            paidAt: new Date()
          },
          bookingStatus: 'confirmed',
          bookedAt: new Date()
        });

        // Mark those seats as booked
        await Seat.updateMany(
          { _id: { $in: targetSeats.map((s) => s._id) } },
          {
            status: 'booked',
            bookedBy: regularUser._id,
            bookingId: sampleBooking._id
          }
        );

        await Show.findByIdAndUpdate(targetShow._id, {
          $inc: { availableSeatsCount: -2 }
        });
      }
    }

    console.log(`Database Seed Complete!`);
    console.log(`Users: ${users.length} (Admin: admin@imovies.com / admin123 | User: user@imovies.com / user123)`);
    console.log(`Theatres: ${theatres.length}`);
    console.log(`Movies: ${movies.length}`);
    console.log(`Shows: ${createdShows.length}`);
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};
