import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Printer,
  Ticket,
  Film,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

export const BookingSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          const { data } = await api.get(`/bookings/${id}`);
          if (data.success) {
            setBooking(data.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-white mb-2">Booking Not Found</h2>
        <Link to="/movies" className="text-amber-400 font-semibold underline">
          Browse Movies
        </Link>
      </div>
    );
  }

  const movie = booking.movie || {};
  const theatre = booking.theatre || {};
  const show = booking.show || {};
  const seats = booking.seats || [];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      {/* Success Banner */}
      <div className="text-center space-y-3 no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white">Booking Confirmed!</h1>
        <p className="text-sm text-slate-400">
          Your payment of <span className="text-amber-400 font-bold">₹{booking.grandTotal}</span> was successful. Your e-ticket is ready below.
        </p>
      </div>

      {/* Digital Ticket Card (Printable) */}
      <div className="printable-ticket bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-sm shadow-md">
              IM
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                I<span className="text-amber-400">MOVIES</span> PASS
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Official E-Ticket Confirmation
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Booking Ref</span>
            <span className="font-mono text-base font-extrabold text-amber-400 tracking-wider">
              {booking.bookingCode}
            </span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="flex gap-5 items-center">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-xl shadow-lg border border-slate-700 shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {movie.title}
            </h2>
            <p className="text-xs text-slate-400">
              {movie.language} • {movie.genres?.join(', ')} • {movie.duration} mins
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-white">{theatre.name}</span>, {theatre.city}
            </p>
            <p className="text-[11px] text-slate-400">{theatre.location}</p>
          </div>
        </div>

        {/* Showtime Grid */}
        <div className="grid grid-cols-3 gap-3 py-4 px-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
          <div>
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-3 h-3 text-amber-400" /> Date
            </span>
            <p className="text-sm font-bold text-white">{show.date}</p>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-amber-400" /> Showtime
            </span>
            <p className="text-sm font-black text-amber-400">{show.startTime}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Screen / Audi</span>
            <p className="text-sm font-bold text-white">Audi {show.screenNumber || 1}</p>
          </div>
        </div>

        {/* Seat Tokens */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Reserved Seats ({seats.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {seats.map((s, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm shadow-sm"
              >
                {s.seatNumber} <span className="text-xs font-normal text-slate-400">({s.category})</span>
              </span>
            ))}
          </div>
        </div>

        {/* QR Code and Payment Details */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-5">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 block">Total Amount Paid</span>
            <p className="text-2xl font-black text-white">₹{booking.grandTotal}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              Txn ID: {booking.paymentDetails?.transactionId || 'MOCK-TXN-SUCCESS'}
            </p>
          </div>

          <div className="flex flex-col items-center bg-white p-3 rounded-2xl text-black shadow-lg">
            <QrCode className="w-16 h-16" />
            <span className="text-[9px] font-mono tracking-tighter mt-1 font-bold">
              SCAN AT CINEMA
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden on print) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 no-print pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>

        <Link
          to="/profile"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>Go to My Bookings</span>
        </Link>

        <Link
          to="/movies"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-1.5 transition"
        >
          <span>More Movies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
