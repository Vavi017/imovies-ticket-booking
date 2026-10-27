import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Show must be associated with a movie']
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Show must be associated with a theatre']
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for straightforward day querying
      required: [true, 'Show date is required']
    },
    startTime: {
      type: String, // e.g., "02:30 PM" or "14:30"
      required: [true, 'Show start time is required']
    },
    prices: {
      vip: { type: Number, default: 350 },
      premium: { type: Number, default: 250 },
      regular: { type: Number, default: 180 }
    },
    totalSeats: {
      type: Number,
      default: 60
    },
    availableSeatsCount: {
      type: Number,
      default: 60
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Show = mongoose.model('Show', showSchema);
export default Show;
