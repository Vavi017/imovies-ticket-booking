import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: 'Screen 1'
  },
  totalSeats: {
    type: Number,
    default: 60
  },
  seatLayout: {
    rows: {
      type: [String],
      default: ['A', 'B', 'C', 'D', 'E', 'F']
    },
    seatsPerRow: {
      type: Number,
      default: 10
    },
    categoryRows: {
      vip: { type: [String], default: ['A'] },
      premium: { type: [String], default: ['B', 'C'] },
      regular: { type: [String], default: ['D', 'E', 'F'] }
    }
  }
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide theatre name'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      default: 'Metropolis'
    },
    location: {
      type: String,
      required: [true, 'Please provide location address'],
      trim: true
    },
    screens: [screenSchema],
    amenities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Food Court', 'Parking']
    }
  },
  {
    timestamps: true
  }
);

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
