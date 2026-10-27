import mongoose from 'mongoose';

const bookingSeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true
    },
    seats: [bookingSeatSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      default: 30
    },
    grandTotal: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'failed', 'refunded'],
      default: 'completed'
    },
    paymentDetails: {
      method: { type: String, default: 'Credit / Debit Card' },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date, default: Date.now }
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
