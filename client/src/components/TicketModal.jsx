import React from 'react';
import { X, Printer, Film, Calendar, Clock, MapPin, QrCode, CheckCircle2, Ticket } from 'lucide-react';

export const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const movie = booking.movie || {};
  const theatre = booking.theatre || {};
  const show = booking.show || {};
  const seats = booking.seats || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 no-print">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Digital Movie Ticket</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Container */}
        <div className="p-6 overflow-y-auto printable-ticket space-y-6">
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl text-slate-100 overflow-hidden">
            {/* Top brand header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-sm">
                  IM
                </div>
                <div>
                  <h4 className="text-base font-extrabold tracking-tight text-white leading-none">
                    I<span className="text-amber-400">MOVIES</span> PASS
                  </h4>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Admit One Per Seat
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Booking ID</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {booking.bookingCode}
                </span>
              </div>
            </div>

            {/* Movie Info with Poster */}
            <div className="flex gap-4 items-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-700 shrink-0"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  {booking.bookingStatus === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                </span>
                <h2 className="text-xl font-black text-white leading-tight">
                  {movie.title}
                </h2>
                <p className="text-xs text-slate-400">
                  {movie.language} • {movie.genres?.join(', ')}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-medium text-slate-300">{theatre.name}</span>, {theatre.city}
                </p>
              </div>
            </div>

            {/* Showtime & Screen Matrix */}
            <div className="grid grid-cols-3 gap-3 my-5 py-4 px-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-amber-400" /> Date
                </span>
                <p className="text-sm font-bold text-white">{show.date || 'Today'}</p>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Time
                </span>
                <p className="text-sm font-bold text-amber-400">{show.startTime}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Screen</span>
                <p className="text-sm font-bold text-white">Audi {show.screenNumber || 1}</p>
              </div>
            </div>

            {/* Seats Reserved */}
            <div className="mb-5">
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Reserved Seats ({seats.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {seats.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm shadow-sm"
                  >
                    {s.seatNumber} <span className="text-[10px] font-normal text-slate-400">({s.category})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Perforated divider visual */}
            <div className="relative my-6 -mx-6 flex items-center">
              <div className="w-6 h-6 rounded-full bg-slate-900 border-r border-slate-700/80 -ml-3"></div>
              <div className="flex-1 border-t-2 border-dashed border-slate-700"></div>
              <div className="w-6 h-6 rounded-full bg-slate-900 border-l border-slate-700/80 -mr-3"></div>
            </div>

            {/* Ticket Footer / Barcode & Total */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Amount Paid</span>
                <p className="text-lg font-black text-white">
                  ₹{booking.grandTotal}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    (incl. taxes & fees)
                  </span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Paid via {booking.paymentDetails?.method || 'Card'}
                </p>
              </div>

              {/* QR Code Graphic */}
              <div className="flex flex-col items-center bg-white p-2 rounded-xl text-black shadow-md">
                <QrCode className="w-12 h-12" />
                <span className="text-[9px] font-mono tracking-tighter mt-1 font-bold">
                  SCAN AT GATE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
