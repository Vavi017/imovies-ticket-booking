import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes require user authentication

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

export default router;
