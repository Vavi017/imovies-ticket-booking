import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Film,
  Play,
  MapPin,
  Sparkles,
  Ticket,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../services/api';

export const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [datesList, setDatesList] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        if (data.success) {
          setMovie(data.movie);
          setShows(data.shows || []);

          // Extract unique dates from shows
          const uniqueDates = Array.from(new Set(data.shows.map((s) => s.date))).sort();
          setDatesList(uniqueDates);
          if (uniqueDates.length > 0) {
            setSelectedDate(uniqueDates[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-slate-400 mb-6">The requested movie could not be located.</p>
        <Link
          to="/movies"
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm"
        >
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date
  const dateShows = shows.filter((s) => s.date === selectedDate);

  // Group shows by Theatre
  const theatreMap = {};
  dateShows.forEach((show) => {
    const tId = show.theatre?._id;
    if (!tId) return;
    if (!theatreMap[tId]) {
      theatreMap[tId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    theatreMap[tId].shows.push(show);
  });

  const theatreList = Object.values(theatreMap);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  return (
    <div className="space-y-12">
      {/* Movie Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Backdrop visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center filter brightness-40 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-black/40"></div>
        </div>

        {/* Content Details */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-48 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 shrink-0 bg-slate-950">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Info */}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                {movie.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 uppercase">
                {movie.language}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 text-amber-400 text-xs font-bold border border-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                {movie.duration} Minutes
              </span>
              <span>•</span>
              <span>{movie.genres?.join(', ')}</span>
              <span>•</span>
              <span>Released {new Date(movie.releaseDate).getFullYear()}</span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl pt-2">
              {movie.description}
            </p>

            {/* Director & Cast */}
            <div className="pt-2 space-y-2 text-xs sm:text-sm border-t border-slate-800/80">
              {movie.director && (
                <p className="text-slate-400">
                  <span className="text-white font-semibold">Director:</span> {movie.director}
                </p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <p className="text-slate-400">
                  <span className="text-white font-semibold">Starring:</span> {movie.cast.join(', ')}
                </p>
              )}
            </div>

            {/* Trailer Action */}
            {movie.trailerUrl && (
              <div className="pt-3">
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                >
                  <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Watch Official Trailer</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-amber-400" />
            <span>Select Date & Showtimes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred date and click a showtime to choose seats
          </p>
        </div>

        {/* Date Selector Tabs */}
        {datesList.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {datesList.map((dStr) => {
              const formatted = formatDisplayDate(dStr);
              const isSelected = selectedDate === dStr;
              return (
                <button
                  key={dStr}
                  onClick={() => setSelectedDate(dStr)}
                  className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-105 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider">{formatted.day}</span>
                  <span className="text-xl font-black">{formatted.dateNum}</span>
                  <span className="text-[10px] uppercase font-semibold">{formatted.month}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
            <p className="text-sm text-slate-400">No scheduled showtimes currently found for this movie.</p>
          </div>
        )}

        {/* Theatres & Showtimes List */}
        <div className="space-y-4 pt-2">
          {theatreList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                No shows scheduled on {selectedDate}. Please pick another date.
              </p>
            </div>
          ) : (
            theatreList.map(({ theatre, shows: tShows }) => (
              <div
                key={theatre._id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition shadow-sm space-y-4"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{theatre.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{theatre.location}, {theatre.city}</span>
                    </p>
                  </div>

                  {/* Amenities */}
                  {theatre.amenities && (
                    <div className="flex flex-wrap gap-1.5">
                      {theatre.amenities.slice(0, 3).map((a, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Showtimes Buttons */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Available Showtimes
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {tShows.map((s) => (
                      <button
                        key={s._id}
                        onClick={() => navigate(`/book/${s._id}`)}
                        className="group flex flex-col items-center justify-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-amber-400 hover:bg-amber-500/10 transition-all text-left"
                      >
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {s.startTime}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                          <span>Audi {s.screenNumber || 1}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">₹{s.prices?.regular || 180} onwards</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailsPage;
