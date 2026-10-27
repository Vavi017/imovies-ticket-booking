import Show from '../models/Show.js';
import Seat from '../models/Seat.js';
import Theatre from '../models/Theatre.js';
import Movie from '../models/Movie.js';

// Helper to auto-generate seats for a newly created or unseeded show
export const generateSeatsForShow = async (showId, theatreId, prices) => {
  const theatre = await Theatre.findById(theatreId);
  const layout = theatre?.screens?.[0]?.seatLayout || {
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 10,
    categoryRows: {
      vip: ['A'],
      premium: ['B', 'C'],
      regular: ['D', 'E', 'F']
    }
  };

  const seatsToInsert = [];
  const rows = layout.rows || ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = layout.seatsPerRow || 10;
  const categoryRows = layout.categoryRows || {
    vip: ['A'],
    premium: ['B', 'C'],
    regular: ['D', 'E', 'F']
  };

  const showPrices = prices || { vip: 350, premium: 250, regular: 180 };

  for (const row of rows) {
    let category = 'regular';
    if (categoryRows.vip && categoryRows.vip.includes(row)) {
      category = 'vip';
    } else if (categoryRows.premium && categoryRows.premium.includes(row)) {
      category = 'premium';
    }

    const price = showPrices[category] || 180;

    for (let num = 1; num <= seatsPerRow; num++) {
      seatsToInsert.push({
        show: showId,
        seatNumber: `${row}${num}`,
        row,
        number: num,
        category,
        price,
        status: 'available'
      });
    }
  }

  const createdSeats = await Seat.insertMany(seatsToInsert);
  await Show.findByIdAndUpdate(showId, {
    totalSeats: createdSeats.length,
    availableSeatsCount: createdSeats.length
  });

  return createdSeats;
};

// @desc    Get all shows with optional filters
// @route   GET /api/shows
// @access  Public
export const getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    let query = { status: 'active' };

    if (movieId) query.movie = movieId;
    if (theatreId) query.theatre = theatreId;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language genres')
      .populate('theatre', 'name city location')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch shows'
    });
  }
};

// @desc    Get show details and its seat map
// @route   GET /api/shows/:id/seats
// @access  Public
export const getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title posterUrl duration rating genres language')
      .populate('theatre', 'name city location screens amenities');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    let seats = await Seat.find({ show: show._id }).sort({ row: 1, number: 1 });

    // If seats don't exist yet for this show, generate them on the fly
    if (seats.length === 0) {
      seats = await generateSeatsForShow(show._id, show.theatre._id, show.prices);
    }

    res.status(200).json({
      success: true,
      show,
      seats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch show seat map'
    });
  }
};

// @desc    Create show & generate seats
// @route   POST /api/shows
// @access  Private/Admin
export const createShow = async (req, res) => {
  try {
    const { movie, theatre, date, startTime, prices, screenNumber } = req.body;

    const show = await Show.create({
      movie,
      theatre,
      date,
      startTime,
      screenNumber: screenNumber || 1,
      prices: prices || { vip: 350, premium: 250, regular: 180 }
    });

    // Generate seats automatically
    await generateSeatsForShow(show._id, theatre, show.prices);

    const populatedShow = await Show.findById(show._id)
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city');

    res.status(201).json({
      success: true,
      show: populatedShow
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create show'
    });
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      show
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update show'
    });
  }
};

// @desc    Delete show and seats
// @route   DELETE /api/shows/:id
// @access  Private/Admin
export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    await Seat.deleteMany({ show: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Show and seats removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete show'
    });
  }
};
