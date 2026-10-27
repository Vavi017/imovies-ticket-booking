import express from 'express';
import {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre
} from '../controllers/theatreController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);
router.post('/', protect, admin, createTheatre);
router.put('/:id', protect, admin, updateTheatre);
router.delete('/:id', protect, admin, deleteTheatre);

export default router;
