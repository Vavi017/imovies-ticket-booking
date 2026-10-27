import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';

// @desc    Get dashboard metrics & stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalMovies, totalTheatres, totalShows, totalBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Show.countDocuments({ status: 'active' }),
      Booking.countDocuments()
    ]);

    // Calculate total revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city')
      .populate('show', 'date startTime')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalShows,
        totalBookings,
        totalRevenue
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin stats'
    });
  }
};

// @desc    Get all bookings across the system
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city')
      .populate('show', 'date startTime screenNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch all bookings'
    });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};
