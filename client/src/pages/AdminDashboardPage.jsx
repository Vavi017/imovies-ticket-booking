import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Film,
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Clock,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Collections state
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Modals state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genres: 'Sci-Fi, Action',
    language: 'English',
    duration: 145,
    releaseDate: '2024-03-01',
    posterUrl: '',
    bannerUrl: '',
    rating: 8.5,
    director: '',
    cast: 'Actor 1, Actor 2',
    status: 'now_showing'
  });

  const [showModalOpen, setShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    movie: '',
    theatre: '',
    screenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '06:30 PM',
    priceVip: 350,
    pricePremium: 250,
    priceRegular: 180
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, showsRes, theatresRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/shows'),
        api.get('/theatres'),
        api.get('/admin/bookings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (moviesRes.data.success) setMovies(moviesRes.data.movies);
      if (showsRes.data.success) setShows(showsRes.data.shows);
      if (theatresRes.data.success) setTheatres(theatresRes.data.theatres);
      if (bookingsRes.data.success) setAllBookings(bookingsRes.data.bookings);

      // Pre-select first movie and theatre in show form
      if (moviesRes.data.movies.length > 0 && !showForm.movie) {
        setShowForm((prev) => ({ ...prev, movie: moviesRes.data.movies[0]._id }));
      }
      if (theatresRes.data.theatres.length > 0 && !showForm.theatre) {
        setShowForm((prev) => ({ ...prev, theatre: theatresRes.data.theatres[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  // Movie CRUD
  const handleOpenMovieModal = (movieToEdit = null) => {
    if (movieToEdit) {
      setEditingMovie(movieToEdit);
      setMovieForm({
        title: movieToEdit.title,
        description: movieToEdit.description,
        genres: movieToEdit.genres?.join(', ') || '',
        language: movieToEdit.language || 'English',
        duration: movieToEdit.duration || 120,
        releaseDate: movieToEdit.releaseDate ? movieToEdit.releaseDate.split('T')[0] : '2024-03-01',
        posterUrl: movieToEdit.posterUrl || '',
        bannerUrl: movieToEdit.bannerUrl || '',
        rating: movieToEdit.rating || 8.0,
        director: movieToEdit.director || '',
        cast: movieToEdit.cast?.join(', ') || '',
        status: movieToEdit.status || 'now_showing'
      });
    } else {
      setEditingMovie(null);
      setMovieForm({
        title: '',
        description: '',
        genres: 'Action, Sci-Fi',
        language: 'English',
        duration: 135,
        releaseDate: new Date().toISOString().split('T')[0],
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        rating: 8.4,
        director: '',
        cast: '',
        status: 'now_showing'
      });
    }
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genres: movieForm.genres.split(',').map((g) => g.trim()).filter(Boolean),
        cast: movieForm.cast.split(',').map((c) => c.trim()).filter(Boolean),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating)
      };

      if (editingMovie) {
        const { data } = await api.put(`/movies/${editingMovie._id}`, payload);
        if (data.success) {
          toast.success('Movie updated successfully!');
        }
      } else {
        const { data } = await api.post('/movies', payload);
        if (data.success) {
          toast.success('Movie created successfully!');
        }
      }

      setMovieModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Delete this movie? All scheduled shows will also be deleted.')) return;
    try {
      const { data } = await api.delete(`/movies/${movieId}`);
      if (data.success) {
        toast.success('Movie deleted successfully');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  // Show CRUD
  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie: showForm.movie,
        theatre: showForm.theatre,
        screenNumber: Number(showForm.screenNumber),
        date: showForm.date,
        startTime: showForm.startTime,
        prices: {
          vip: Number(showForm.priceVip),
          premium: Number(showForm.pricePremium),
          regular: Number(showForm.priceRegular)
        }
      };

      const { data } = await api.post('/shows', payload);
      if (data.success) {
        toast.success('Show scheduled & 60 seats initialized!');
        setShowModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule show');
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Delete this scheduled show and its seat map?')) return;
    try {
      const { data } = await api.delete(`/shows/${showId}`);
      if (data.success) {
        toast.success('Show deleted');
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete show');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <span>Admin Control Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage movie listings, schedule showtimes, and monitor booking operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenMovieModal()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Movie</span>
          </button>
          <button
            onClick={() => setShowModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Show</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">₹{stats?.totalRevenue || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Bookings</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalBookings || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Shows</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalShows || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Movies</span>
            <Film className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalMovies || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Registered Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'movies'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          Movies Catalog ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'shows'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          Shows & Showtimes ({shows.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'bookings'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          Customer Bookings ({allBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('theatres')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'theatres'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          Theatres & Screens ({theatres.length})
        </button>
      </div>

      {/* Tab 1: Movies */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4 items-center justify-between"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded-xl bg-slate-950 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">{movie.title}</h3>
                    <p className="text-xs text-slate-400">{movie.genres?.join(', ')}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {movie.duration}m • Rating: ⭐ {movie.rating}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenMovieModal(movie)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Edit Movie"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Shows */}
      {activeTab === 'shows' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 uppercase text-slate-400 font-bold">
                <tr>
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">Theatre</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Seats Left</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {shows.map((show) => (
                  <tr key={show._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white">
                      {show.movie?.title || 'Unknown Movie'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {show.theatre?.name} (Audi {show.screenNumber || 1})
                    </td>
                    <td className="py-3 px-4">{show.date}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{show.startTime}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {show.availableSeatsCount} / {show.totalSeats}
                    </td>
                    <td className="py-3 px-4">
                      ₹{show.prices?.regular} - ₹{show.prices?.vip}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteShow(show._id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 uppercase text-slate-400 font-bold">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">Theatre & Date</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {b.bookingCode}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{b.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-500">{b.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {b.movie?.title || 'Movie'}
                    </td>
                    <td className="py-3 px-4">
                      <p>{b.theatre?.name}</p>
                      <p className="text-[10px] text-slate-400">{b.show?.date} • {b.show?.startTime}</p>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {b.seats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">₹{b.grandTotal}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Theatres */}
      {activeTab === 'theatres' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {theatres.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <h3 className="text-base font-black text-white">{t.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.location}, {t.city}</span>
              </p>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1.5">
                  Amenities
                </span>
                <div className="flex flex-wrap gap-1">
                  {t.amenities?.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movie Modal */}
      {movieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h3>
              <button
                onClick={() => setMovieModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Genres (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.genres}
                    onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Language *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rating (0-10) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Release Date *</label>
                  <input
                    type="date"
                    required
                    value={movieForm.releaseDate}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Director</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Star Cast (comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.cast}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show Scheduling Modal */}
      {showModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Schedule New Show</h3>
              <button
                onClick={() => setShowModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Movie *</label>
                <select
                  required
                  value={showForm.movie}
                  onChange={(e) => setShowForm({ ...showForm, movie: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Theatre *</label>
                <select
                  required
                  value={showForm.theatre}
                  onChange={(e) => setShowForm({ ...showForm, theatre: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={showForm.date}
                    onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Showtime *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07:30 PM"
                    value={showForm.startTime}
                    onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Regular (₹)</label>
                  <input
                    type="number"
                    value={showForm.priceRegular}
                    onChange={(e) => setShowForm({ ...showForm, priceRegular: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Premium (₹)</label>
                  <input
                    type="number"
                    value={showForm.pricePremium}
                    onChange={(e) => setShowForm({ ...showForm, pricePremium: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">VIP (₹)</label>
                  <input
                    type="number"
                    value={showForm.priceVip}
                    onChange={(e) => setShowForm({ ...showForm, priceVip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md"
                >
                  Create Show & Provision Seats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
