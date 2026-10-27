import express from 'express';
import {
  getAdminStats,
  getAllBookings,
  getAllUsers
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin); // All admin routes require admin privileges

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

export default router;
