import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

export const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'All';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const [allGenres, setAllGenres] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    // Sync with URL query parameter changes
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
    const g = searchParams.get('genre');
    if (g !== null) setSelectedGenre(g);
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append('search', search.trim());
        if (selectedGenre !== 'All') queryParams.append('genre', selectedGenre);
        if (selectedLanguage !== 'All') queryParams.append('language', selectedLanguage);

        const { data } = await api.get(`/movies?${queryParams.toString()}`);
        if (data.success) {
          setMovies(data.movies);
          if (data.genres) setAllGenres(['All', ...data.genres]);
          if (data.languages) setAllLanguages(['All', ...data.languages]);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchMovies, 250);
    return () => clearTimeout(timeout);
  }, [search, selectedGenre, selectedLanguage]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSortBy('rating');
    setSearchParams({});
  };

  // Client-side sorting
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(b.releaseDate) - new Date(a.releaseDate);
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <Film className="w-8 h-8 text-amber-400" />
          <span>Explore All Movies</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Search, filter, and discover the hottest movies running in your city's cinemas
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, cast..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Genres</option>
              {allGenres.filter((g) => g !== 'All').map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Languages</option>
              {allLanguages.filter((l) => l !== 'All').map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Latest Release</option>
              <option value="duration">Longest Duration</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters / Reset */}
        {(search || selectedGenre !== 'All' || selectedLanguage !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Showing filtered results ({sortedMovies.length} movies)</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-[2/3] rounded-2xl bg-slate-900 animate-pulse"></div>
          ))}
        </div>
      ) : sortedMovies.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800">
          <Film className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-200">No movies match your criteria</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search query, genre, or language filters to find what you are looking for.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
