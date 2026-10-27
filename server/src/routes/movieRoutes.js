import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;
