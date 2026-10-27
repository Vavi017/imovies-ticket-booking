import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true
    },
    seatNumber: {
      type: String, // e.g. "A1", "C5"
      required: true
    },
    row: {
      type: String, // e.g. "A"
      required: true
    },
    number: {
      type: Number, // e.g. 1
      required: true
    },
    category: {
      type: String,
      enum: ['vip', 'premium', 'regular'],
      default: 'regular'
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'locked'],
      default: 'available'
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique seat per show
seatSchema.index({ show: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model('Seat', seatSchema);
export default Seat;
