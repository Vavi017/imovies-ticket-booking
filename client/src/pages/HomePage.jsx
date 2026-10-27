import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Play, Star, Calendar, Sparkles, ShieldCheck, Ticket, ArrowRight, Clock } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get('/movies');
        if (data.success) {
          setMovies(data.movies);
          if (data.movies.length > 0) {
            setFeaturedMovie(data.movies[0]); // First blockbuster
          }
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation'];

  const filteredMovies =
    selectedGenre === 'All'
      ? movies
      : movies.filter((m) => m.genres?.includes(selectedGenre));

  return (
    <div className="space-y-16">
      {/* Hero Showcase Banner */}
      {featuredMovie && (
        <section className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-end p-6 sm:p-12 border border-slate-800 shadow-2xl">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/70 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Featured Blockbuster
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{featuredMovie.rating?.toFixed(1)} / 10</span>
              </div>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {featuredMovie.duration} mins
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {featuredMovie.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to={`/movies/${featuredMovie._id}`}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </Link>

              {featuredMovie.trailerUrl && (
                <a
                  href={featuredMovie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 flex items-center gap-2 backdrop-blur-md transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Movies Catalog Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Film className="w-7 h-7 text-amber-400" />
              <span>Now Showing in Cinemas</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a movie to browse showtimes, theatres, and reserve your seats
            </p>
          </div>

          <Link
            to="/movies"
            className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1 group"
          >
            <span>View All Movies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse"></div>
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No movies found in this genre</h3>
            <p className="text-sm text-slate-500 mt-1">Try selecting a different filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Instant Digital Ticket</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get immediate ticket confirmation with gate-ready QR codes and printable passes.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Interactive Seat Layout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your exact seats in real time from VIP Recliners, Premium, or Standard sections.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Zero-Hassle Cancellation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plans changed? Cancel your ticket instantly from your profile with automated refunds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
