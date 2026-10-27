import React from 'react';
import { Armchair, Check, X, Shield, Sparkles } from 'lucide-react';

export const SeatGrid = ({ seats, selectedSeats, onToggleSeat, prices }) => {
  // Group seats by row
  const rowsMap = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  // Sort rows and seats per row
  const sortedRows = Object.keys(rowsMap).sort();
  sortedRows.forEach((r) => {
    rowsMap[r].sort((a, b) => a.number - b.number);
  });

  // Split into categories for clear grouping
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'vip':
        return `VIP Section (Recliner) - ₹${prices?.vip || 350}`;
      case 'premium':
        return `Premium Section - ₹${prices?.premium || 250}`;
      case 'regular':
      default:
        return `Standard / Regular - ₹${prices?.regular || 180}`;
    }
  };

  // Group rows by their category for clean section headers
  const categoryGroups = {
    vip: sortedRows.filter((r) => rowsMap[r][0]?.category === 'vip'),
    premium: sortedRows.filter((r) => rowsMap[r][0]?.category === 'premium'),
    regular: sortedRows.filter((r) => rowsMap[r][0]?.category === 'regular' || !rowsMap[r][0]?.category)
  };

  const renderRow = (rowLetter) => {
    const rowSeats = rowsMap[rowLetter] || [];
    return (
      <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3 my-1.5">
        {/* Row Label Left */}
        <span className="w-5 text-center font-bold text-xs text-slate-500">
          {rowLetter}
        </span>

        {/* Seats Container */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {rowSeats.map((seat, index) => {
            const isSelected = selectedSeats.some((s) => s._id === seat._id);
            const isBooked = seat.status === 'booked';
            const isVip = seat.category === 'vip';
            const isPremium = seat.category === 'premium';

            // Split into aisles after 5th seat for realistic cinema walkaway
            const isAisle = index === 4;

            let seatClasses = 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all relative select-none ';

            if (isBooked) {
              seatClasses += 'bg-slate-800/60 border border-slate-700/50 text-slate-600 cursor-not-allowed opacity-60';
            } else if (isSelected) {
              seatClasses += 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30 scale-105';
            } else {
              // Available
              if (isVip) {
                seatClasses += 'bg-amber-950/20 border border-amber-600/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 cursor-pointer';
              } else if (isPremium) {
                seatClasses += 'bg-indigo-950/20 border border-indigo-600/40 text-indigo-300 hover:border-indigo-400 hover:bg-indigo-500/20 cursor-pointer';
              } else {
                seatClasses += 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/60 hover:text-white hover:bg-slate-800 cursor-pointer';
              }
            }

            return (
              <React.Fragment key={seat._id}>
                <button
                  type="button"
                  disabled={isBooked}
                  onClick={() => onToggleSeat(seat)}
                  className={seatClasses}
                  title={`${seat.seatNumber} (${seat.category.toUpperCase()}) - ₹${seat.price}`}
                >
                  {isBooked ? (
                    <X className="w-3.5 h-3.5 text-slate-600" />
                  ) : isSelected ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{seat.number}</span>
                  )}
                </button>
                {isAisle && <div className="w-4 sm:w-8"></div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Row Label Right */}
        <span className="w-5 text-center font-bold text-xs text-slate-500">
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Cinema Screen Visual */}
      <div className="w-full max-w-2xl mb-10 text-center">
        <div className="cinema-screen mb-3"></div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          All Eyes This Way • Cinema Screen
        </p>
      </div>

      {/* Seat Rows by Category */}
      <div className="w-full space-y-6 overflow-x-auto pb-6">
        {categoryGroups.vip.length > 0 && (
          <div className="space-y-1">
            <div className="text-center text-xs font-semibold text-amber-400/90 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getCategoryLabel('vip')}</span>
            </div>
            {categoryGroups.vip.map(renderRow)}
          </div>
        )}

        {categoryGroups.premium.length > 0 && (
          <div className="space-y-1 pt-2">
            <div className="text-center text-xs font-semibold text-indigo-400/90 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>{getCategoryLabel('premium')}</span>
            </div>
            {categoryGroups.premium.map(renderRow)}
          </div>
        )}

        {categoryGroups.regular.length > 0 && (
          <div className="space-y-1 pt-2">
            <div className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <span>{getCategoryLabel('regular')}</span>
            </div>
            {categoryGroups.regular.map(renderRow)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 py-3 px-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700"></div>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500 text-black flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-amber-400 font-semibold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-600">
            <X className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-500">Booked / Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
