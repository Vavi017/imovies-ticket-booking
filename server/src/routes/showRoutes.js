import express from 'express';
import {
  getShows,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow
} from '../controllers/showController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getShows);
router.get('/:id/seats', getShowSeats);
router.post('/', protect, admin, createShow);
router.put('/:id', protect, admin, updateShow);
router.delete('/:id', protect, admin, deleteShow);

export default router;
