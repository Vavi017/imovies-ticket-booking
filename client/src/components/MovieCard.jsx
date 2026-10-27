import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  const formatDuration = (mins) => {
    if (!mins) return 'N/A';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col">
      {/* Poster Container */}
      <Link to={`/movies/${movie._id}`} className="relative block aspect-[2/3] overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-semibold tracking-wide uppercase">
          {movie.language || 'English'}
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform flex items-center gap-1.5">
            <Ticket className="w-4 h-4" />
            Book Now
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {formatDuration(movie.duration)}
            </span>
            <span>•</span>
            <span className="truncate">{movie.genres?.slice(0, 2).join(', ')}</span>
          </div>

          <Link
            to={`/movies/${movie._id}`}
            className="block text-base font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
          >
            {movie.title}
          </Link>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700 hover:border-amber-400"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Select Showtimes</span>
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
