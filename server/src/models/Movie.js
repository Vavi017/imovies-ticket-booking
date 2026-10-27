import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide movie description'],
      trim: true
    },
    genres: {
      type: [String],
      required: [true, 'Please provide at least one genre'],
      default: []
    },
    language: {
      type: String,
      required: [true, 'Please provide language'],
      trim: true,
      default: 'English'
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please provide duration in minutes'],
      min: 1
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide release date']
    },
    posterUrl: {
      type: String,
      required: [true, 'Please provide poster URL'],
      trim: true
    },
    bannerUrl: {
      type: String,
      default: '',
      trim: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0
    },
    trailerUrl: {
      type: String,
      default: '',
      trim: true
    },
    cast: {
      type: [String],
      default: []
    },
    director: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming', 'archived'],
      default: 'now_showing'
    }
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
