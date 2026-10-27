import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res) => {
  try {
    const { search, genre, language, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'All') {
      query.genres = { $in: [new RegExp(`^${genre}$`, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = { $regex: `^${language}$`, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1, createdAt: -1 });

    // Distinct filter options for UI
    const allGenres = await Movie.distinct('genres');
    const allLanguages = await Movie.distinct('language');

    res.status(200).json({
      success: true,
      count: movies.length,
      genres: allGenres,
      languages: allLanguages,
      movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch movies'
    });
  }
};

// @desc    Get single movie by ID with showtimes
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Get active shows for this movie populated with theatre details
    const shows = await Show.find({
      movie: movie._id,
      status: 'active'
    })
      .populate('theatre', 'name city location amenities')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      movie,
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch movie details'
    });
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      movie
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create movie'
    });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      movie
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update movie'
    });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Delete associated shows
    await Show.deleteMany({ movie: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Movie and associated shows removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete movie'
    });
  }
};
