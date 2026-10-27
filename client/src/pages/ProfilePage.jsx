import React, { useState, useEffect } from 'react';
import {
  User,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Mail,
  Phone,
  Film
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Profile Edit
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      toast.error('Failed to load your booking history.');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', { name, phone });
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released and refund initiated.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const { data } = await api.put(`/bookings/${bookingId}/cancel`);
      if (data.success) {
        toast.success('Booking cancelled successfully and refund initiated!');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
          <User className="w-8 h-8 text-amber-400" />
          <span>My Profile & Bookings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account credentials and view your cinema ticket reservations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Card & Settings */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{user?.name}</h2>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {user?.role} Account
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2 border-t border-slate-800 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {updatingProfile ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Bookings History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <span>Booking History ({bookings.length})</span>
            </h2>
          </div>

          {loadingBookings ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-900 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">No tickets booked yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore our catalog of movies and reserve seats for your next cinema adventure!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const movie = booking.movie || {};
                const theatre = booking.theatre || {};
                const show = booking.show || {};
                const isCancelled = booking.bookingStatus === 'cancelled';

                return (
                  <div
                    key={booking._id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    {/* Poster + Details */}
                    <div className="flex gap-4 items-center">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-xl shadow-md border border-slate-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              isCancelled
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isCancelled ? 'Cancelled' : 'Confirmed'}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400 font-bold">
                            {booking.bookingCode}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white leading-tight">
                          {movie.title}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {theatre.name} • Audi {show.screenNumber || 1}
                        </p>

                        <p className="text-xs text-slate-300 flex items-center gap-2 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-400" /> {show.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <Clock className="w-3 h-3" /> {show.startTime}
                          </span>
                        </p>

                        <p className="text-xs text-slate-400">
                          Seats: <span className="font-mono text-white font-bold">{booking.seats?.map((s) => s.seatNumber).join(', ')}</span> (₹{booking.grandTotal})
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
                      <button
                        onClick={() => setSelectedTicket(booking)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Ticket</span>
                      </button>

                      {!isCancelled && (
                        <button
                          disabled={cancellingId === booking._id}
                          onClick={() => handleCancelBooking(booking._id)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs border border-red-500/30 transition disabled:opacity-50"
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Ticket'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
