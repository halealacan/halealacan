import React from 'react';
import { User } from 'lucide-react';

export default function BusSeatMap({ totalSeats, occupiedSeats, selectedSeats, onSeatClick, type }) {
  const isBus = type === 'bus';
  
  // Define layout
  // Bus: 3 seats per row (2 on left, hallway, 1 on right) -> e.g. 13 rows * 3 = 39 seats + 1 rear = 40 seats
  // Plane: 6 seats per row (3 on left, hallway, 3 on right) -> e.g. 30 rows * 6 = 180 seats
  const seatsPerRow = isBus ? 3 : 6;
  const rowsCount = Math.ceil(totalSeats / seatsPerRow);

  const getSeatStatus = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return 'occupied';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const renderSeat = (seatNumber) => {
    if (seatNumber > totalSeats) return null;
    const status = getSeatStatus(seatNumber);

    let styleClass = '';
    if (status === 'occupied') {
      styleClass = 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed';
    } else if (status === 'selected') {
      styleClass = 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/35';
    } else {
      styleClass = 'bg-slate-900 border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400';
    }

    return (
      <button
        key={seatNumber}
        disabled={status === 'occupied'}
        onClick={() => onSeatClick(seatNumber)}
        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-semibold transition-all duration-150 ${styleClass}`}
      >
        {status === 'occupied' ? <User className="h-3.5 w-3.5" /> : seatNumber}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
      {/* Legend */}
      <div className="flex gap-6 mb-6 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-900 border border-slate-800 rounded"></div>
          <span>Boş</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-indigo-600 border border-indigo-500 rounded"></div>
          <span>Seçili</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-slate-500">
            <User className="h-2.5 w-2.5" />
          </div>
          <span>Dolu</span>
        </div>
      </div>

      {/* Vehicle Silhouette */}
      <div className="relative border-2 border-slate-800 rounded-3xl p-6 bg-slate-950/40 w-full max-w-sm flex flex-col items-center">
        {/* Front of Vehicle indicator */}
        <div className="w-full flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Ön / Şoför</span>
          <div className="h-1.5 w-8 rounded-full bg-slate-800"></div>
        </div>

        {/* Seats Container */}
        <div className="grid gap-y-3 w-full">
          {Array.from({ length: rowsCount }).map((_, rowIndex) => {
            const rowSeats = [];
            for (let i = 0; i < seatsPerRow; i++) {
              const seatNum = rowIndex * seatsPerRow + i + 1;
              rowSeats.push(seatNum);
            }

            return (
              <div key={rowIndex} className="flex justify-between items-center w-full">
                {isBus ? (
                  <>
                    {/* Left 2 seats */}
                    <div className="flex gap-2">
                      {renderSeat(rowSeats[0])}
                      {renderSeat(rowSeats[1])}
                    </div>
                    {/* Hallway */}
                    <div className="w-6"></div>
                    {/* Right 1 seat */}
                    <div>
                      {renderSeat(rowSeats[2])}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left 3 seats */}
                    <div className="flex gap-1.5">
                      {renderSeat(rowSeats[0])}
                      {renderSeat(rowSeats[1])}
                      {renderSeat(rowSeats[2])}
                    </div>
                    {/* Hallway */}
                    <div className="w-6 text-[10px] text-slate-700 font-bold flex justify-center items-center">
                      {rowIndex + 1}
                    </div>
                    {/* Right 3 seats */}
                    <div className="flex gap-1.5">
                      {renderSeat(rowSeats[3])}
                      {renderSeat(rowSeats[4])}
                      {renderSeat(rowSeats[5])}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Back of Vehicle Indicator */}
        <div className="w-full text-center mt-6 pt-4 border-t border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Arka</span>
        </div>
      </div>
    </div>
  );
}
