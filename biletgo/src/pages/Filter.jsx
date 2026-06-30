import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery, setSelectedTicket, fetchTickets } from '../store/ticketSlice';
import { Bus, Plane, Calendar, MapPin, SlidersHorizontal, ArrowRight, UserCheck } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya'];

export default function Filter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchQuery, list: ticketsList, status: ticketsStatus, error: ticketsError } = useSelector((state) => state.tickets);

  // Local filter states
  const [localOrigin, setLocalOrigin] = useState(searchQuery.origin || 'İstanbul');
  const [localDestination, setLocalDestination] = useState(searchQuery.destination || 'Ankara');
  const [localDate, setLocalDate] = useState(searchQuery.date || new Date().toISOString().split('T')[0]);
  const [localType, setLocalType] = useState(searchQuery.type || 'all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'price-desc', 'time-asc'

  // Load tickets on mount / search change
  useEffect(() => {
    if (searchQuery.origin) setLocalOrigin(searchQuery.origin);
    if (searchQuery.destination) setLocalDestination(searchQuery.destination);
    if (searchQuery.date) setLocalDate(searchQuery.date);
    if (searchQuery.type) setLocalType(searchQuery.type);
    
    dispatch(fetchTickets({
      origin: searchQuery.origin,
      destination: searchQuery.destination,
      date: searchQuery.date,
      type: searchQuery.type
    }));
  }, [searchQuery, dispatch]);

  const handleApplySearch = (e) => {
    e.preventDefault();
    if (localOrigin === localDestination) {
      alert('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }
    dispatch(setSearchQuery({
      origin: localOrigin,
      destination: localDestination,
      date: localDate,
      type: localType
    }));
  };

  const handleSelectTicket = (ticket) => {
    dispatch(setSelectedTicket(ticket));
    navigate('/detail');
  };

  // Filter and sort tickets locally
  const filteredTickets = ticketsList
    .filter((ticket) => {
      // Travel Type Filter
      if (searchQuery.type !== 'all' && ticket.type !== searchQuery.type) return false;
      // Price Filter
      if (ticket.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'time-asc') {
        const timeA = a.departureTime.replace(':', '');
        const timeB = b.departureTime.replace(':', '');
        return timeA - timeB;
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Filter Form & Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-20">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
              <h2 className="text-md font-bold text-white">Aramayı Düzenle & Filtrele</h2>
            </div>

            {/* Change Search Form */}
            <form onSubmit={handleApplySearch} className="space-y-4">
              {/* Origin */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereden</label>
                <select
                  value={localOrigin}
                  onChange={(e) => setLocalOrigin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereye</label>
                <select
                  value={localDestination}
                  onChange={(e) => setLocalDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Tarih</label>
                <input
                  type="date"
                  value={localDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Ulaşım Türü</label>
                <div className="grid grid-cols-3 gap-2">
                  {['all', 'bus', 'plane'].map((vType) => (
                    <button
                      key={vType}
                      type="button"
                      onClick={() => setLocalType(vType)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        localType === vType
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {vType === 'all' ? 'Tümü' : vType === 'bus' ? 'Otobüs' : 'Uçak'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-bold text-white text-xs shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                Aramayı Güncelle
              </button>
            </form>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Maksimum Fiyat</label>
                  <span className="text-xs font-bold text-indigo-400">{maxPrice} TL</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Sort selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Sıralama Kriteri</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-slate-300 focus:outline-none focus:border-indigo-500 text-xs appearance-none cursor-pointer"
                >
                  <option value="price-asc">Fiyata Göre Artan</option>
                  <option value="price-desc">Fiyata Göre Azalan</option>
                  <option value="time-asc">Kalkış Saatine Göre</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Ticket Listings */}
        <main className="flex-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                {searchQuery.origin ? (
                  <>
                    <span>{searchQuery.origin}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                    <span>{searchQuery.destination}</span>
                  </>
                ) : (
                  <span>
                    {searchQuery.type === 'bus' 
                      ? 'Tüm Otobüs Seferleri' 
                      : searchQuery.type === 'plane' 
                        ? 'Tüm Uçak Seferleri' 
                        : 'Tüm Seferler'}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{searchQuery.date || localDate}</span>
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-400">
              <span className="text-indigo-400">{filteredTickets.length}</span> bilet listelendi
            </div>
          </div>

          {ticketsStatus === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-10 w-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin"></div>
              <span className="text-slate-400 text-sm">Biletler aranıyor...</span>
            </div>
          ) : ticketsError ? (
            <div className="text-center py-20 text-red-400 text-sm border border-red-500/10 bg-red-500/5 rounded-3xl">
              {ticketsError}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm border border-slate-800 rounded-3xl">
              Aradığınız kriterlere uygun bilet bulunamadı.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const emptySeats = ticket.totalSeats - ticket.occupiedSeats.length;
                const isBus = ticket.type === 'bus';

                return (
                  <div
                    key={ticket.id}
                    className="bg-slate-900 border border-slate-850 hover:border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch gap-4 transition-all duration-200"
                  >
                    {/* Details Column */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                      {/* Icon & Brand */}
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${
                          isBus ? 'bg-indigo-600 shadow-lg shadow-indigo-600/15' : 'bg-purple-600 shadow-lg shadow-purple-600/15'
                        }`}>
                          {isBus ? <Bus className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">{ticket.company}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {isBus ? 'Otobüs' : 'Uçak Seferi'}
                          </div>
                        </div>
                      </div>

                      {/* Travel Specs */}
                      <div className="grid grid-cols-3 gap-8 text-center sm:text-left flex-1 max-w-sm">
                        <div>
                          <div className="text-sm font-black text-white">{ticket.departureTime}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{ticket.origin}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] text-slate-500 font-bold">{ticket.duration}</span>
                          <div className="h-0.5 w-full bg-slate-800 relative mt-1">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-slate-700"></div>
                          </div>
                        </div>
                        <div className="text-right sm:text-left">
                          <div className="text-sm font-black text-slate-400">Varış</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{ticket.destination}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action & Price Column */}
                    <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-3 sm:border-l sm:border-slate-850 sm:pl-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 flex items-center justify-end gap-1 mb-1">
                          <UserCheck className="h-3 w-3" />
                          <span>{emptySeats} Boş Yer</span>
                        </div>
                        <div className="text-lg font-black text-indigo-400">{ticket.price} TL</div>
                      </div>
                      <button
                        onClick={() => handleSelectTicket(ticket)}
                        className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition-all ${
                          isBus ? 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02]' : 'bg-purple-600 hover:bg-purple-500 hover:scale-[1.02]'
                        }`}
                      >
                        Koltuk Seç
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
