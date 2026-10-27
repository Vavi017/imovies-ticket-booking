import Booking from '../models/Booking.js';
import Seat from '../models/Seat.js';
import Show from '../models/Show.js';

// Helper to generate a unique booking code
const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'IMV-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create a new booking with mock payment confirmation
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { showId, seatIds, paymentMethod } = req.body;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and an array of seatIds'
      });
    }

    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theatre');

    if (!show || show.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Active show not found'
      });
    }

    // Find requested seats
    const seats = await Seat.find({
      _id: { $in: seatIds },
      show: showId
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected seats are invalid for this show'
      });
    }

    // Check if any seat is already booked or locked
    const alreadyBooked = seats.filter((s) => s.status !== 'available');
    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats ${alreadyBooked.map((s) => s.seatNumber).join(', ')} have already been reserved. Please select different seats.`
      });
    }

    // Calculate totals
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = Math.round(seats.length * 25);
    const grandTotal = totalAmount + convenienceFee;

    // Generate unique booking code
    let bookingCode = generateBookingCode();
    let codeExists = await Booking.findOne({ bookingCode });
    while (codeExists) {
      bookingCode = generateBookingCode();
      codeExists = await Booking.findOne({ bookingCode });
    }

    const bookingSeats = seats.map((s) => ({
      seatNumber: s.seatNumber,
      row: s.row,
      category: s.category,
      price: s.price
    }));

    // Mock payment transaction ID
    const mockTxnId = 'TXN-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Create the booking record
    const booking = await Booking.create({
      bookingCode,
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: bookingSeats,
      totalAmount,
      convenienceFee,
      grandTotal,
      paymentStatus: 'completed',
      paymentDetails: {
        method: paymentMethod || 'Credit / Debit Card',
        transactionId: mockTxnId,
        paidAt: new Date()
      },
      bookingStatus: 'confirmed',
      bookedAt: new Date()
    });

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        status: 'booked',
        bookedBy: req.user._id,
        bookingId: booking._id
      }
    );

    // Update remaining available seats count on the show
    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeatsCount: -seats.length }
    });

    // Populate booking response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration language genres')
      .populate('theatre', 'name city location')
      .populate('show', 'date startTime screenNumber')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process booking'
    });
  }
};

// @desc    Get user's personal booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language genres rating')
      .populate('theatre', 'name city location')
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
      message: error.message || 'Failed to fetch user bookings'
    });
  }
};

// @desc    Get booking details by ID or code
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title posterUrl duration language genres rating')
      .populate('theatre', 'name city location amenities')
      .populate('show', 'date startTime screenNumber')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch booking details'
    });
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled'
      });
    }

    // Release seats associated with this booking
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    const updatedSeats = await Seat.updateMany(
      { show: booking.show, seatNumber: { $in: seatNumbers } },
      {
        status: 'available',
        bookedBy: null,
        bookingId: null
      }
    );

    // Increment available seats count on show
    await Show.findByIdAndUpdate(booking.show, {
      $inc: { availableSeatsCount: booking.seats.length }
    });

    // Update booking record
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and refund initiated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};
