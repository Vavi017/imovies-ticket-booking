import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ChevronLeft,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';

export const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Payment mock state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 8920 1928 3049');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [upiId, setUpiId] = useState('user@okaxis');

  useEffect(() => {
    const fetchShowAndSeats = async () => {
      try {
        const { data } = await api.get(`/shows/${showId}/seats`);
        if (data.success) {
          setShow(data.show);
          setSeats(data.seats || []);
        }
      } catch (err) {
        console.error('Failed to load show seat map:', err);
        toast.error('Could not load show seat map.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowAndSeats();
  }, [showId]);

  const handleToggleSeat = (seat) => {
    const isSelected = selectedSeats.some((s) => s._id === seat._id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
    } else {
      if (selectedSeats.length >= 8) {
        toast.warning('Maximum 8 seats can be booked in a single transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleRemoveSeat = (seatId) => {
    setSelectedSeats(selectedSeats.filter((s) => s._id !== seatId));
  };

  // Price calculations
  const totalTicketPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 25 : 0;
  const grandTotal = totalTicketPrice + convenienceFee;

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in or register to complete your booking.');
      navigate('/login', { state: { from: `/book/${showId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        showId: show._id,
        seatIds: selectedSeats.map((s) => s._id),
        paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card' : 'UPI Instant'
      };

      const { data } = await api.post('/bookings', payload);
      if (data.success) {
        toast.success('Booking Confirmed! Enjoy your movie!');
        navigate(`/booking-success/${data.booking._id}`, {
          state: { booking: data.booking }
        });
      }
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-white mb-2">Show Not Found</h2>
        <Link to="/movies" className="text-amber-400 font-semibold underline">
          Return to Movies
        </Link>
      </div>
    );
  }

  const movie = show.movie || {};
  const theatre = show.theatre || {};

  return (
    <div className="space-y-8">
      {/* Top Header Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {movie.title}
            </h1>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
              <span className="text-amber-400 font-semibold">{theatre.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {show.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {show.startTime}
              </span>
              <span>•</span>
              <span>Audi {show.screenNumber || 1}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Real-time Secure Seat Locking</span>
        </div>
      </div>

      {/* Main Grid: Interactive Seat Layout & Sidebar Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Seat Map */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            prices={show.prices}
          />
        </div>

        {/* Right Side: Order Summary & Mock Checkout */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 sticky top-24">
          <div>
            <h2 className="text-lg font-black text-white flex items-center justify-between">
              <span>Booking Summary</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {selectedSeats.length} Seats
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{theatre.city} • Screen {show.screenNumber || 1}</p>
          </div>

          {/* Selected Seat Badges */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Selected Seats
            </span>
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                Click on any available seat on the screen to reserve.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat._id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold"
                  >
                    <span>{seat.seatNumber}</span>
                    <button
                      onClick={() => handleRemoveSeat(seat._id)}
                      className="hover:text-red-400 text-slate-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Tickets Base Total</span>
              <span className="font-semibold text-white">₹{totalTicketPrice}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Convenience Fee (₹25 / seat)</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
              <span>Grand Total</span>
              <span className="text-amber-400 text-base font-black">₹{grandTotal}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Payment Method (Mock)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / GPay</span>
              </button>
            </div>

            {/* Mock Inputs */}
            {paymentMethod === 'card' ? (
              <div className="space-y-2 pt-1 text-xs">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-1 text-xs">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi / phone@okhdfcbank"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={selectedSeats.length === 0 || submitting}
            onClick={handleConfirmBooking}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              selectedSeats.length === 0 || submitting
                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {selectedSeats.length === 0
                    ? 'Select Seats to Book'
                    : `Pay ₹${grandTotal} & Confirm`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
