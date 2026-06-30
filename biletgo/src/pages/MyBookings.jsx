import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Clock, Ticket, AlertCircle, ArrowRight, User } from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    fetchUserBookings();
  }, [currentUser, navigate]);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3001/bookings?userId=${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Rezervasyonlar yüklenemedi.');
      }
      const data = await response.json();
      // Sort bookings by creation date descending (newest first)
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sorted);
    } catch (err) {
      setError('Bağlantı hatası: Biletler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Ticket className="h-8 w-8 text-indigo-400" />
            <span>Biletlerim</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Satın aldığınız otobüs ve uçak biletlerini buradan takip edebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2 text-sm text-slate-300">
          <User className="h-4 w-4 text-indigo-400" />
          <span>{currentUser.name}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-slate-400 text-sm">Biletleriniz yükleniyor...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400 text-sm border border-red-500/10 bg-red-500/5 rounded-3xl">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-850 rounded-3xl space-y-4">
          <AlertCircle className="h-12 w-12 text-slate-650 mx-auto" />
          <h3 className="text-md font-bold text-slate-350">Henüz bir biletiniz bulunmuyor</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Hemen ana sayfaya dönerek bilet arayabilir ve ilk seyahatinizi rezerve edebilirsiniz.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all hover:scale-[1.02]"
            >
              Bilet Ara
            </Link>
          </div>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isBus = booking.type === 'bus';
            const bookingPnr = booking.pnr || 'PNR' + booking.id.toString().toUpperCase().padEnd(3, 'X');

            return (
              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-850 hover:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col md:flex-row relative duration-200 transition-all"
              >
                {/* Left ticket stub */}
                <div className="p-6 md:p-8 flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${
                        isBus ? 'bg-indigo-600 shadow-md shadow-indigo-600/20' : 'bg-purple-600 shadow-md shadow-purple-600/20'
                      }`}>
                        <Ticket className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{booking.company}</h4>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          {isBus ? 'Otobüs Seyahati' : 'Uçak Uçuşu'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">PNR</span>
                      <span className="text-xs font-black text-indigo-400 font-mono tracking-wider">
                        {bookingPnr}
                      </span>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-md font-bold text-white">{booking.origin}</span>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                      <span className="text-md font-bold text-white">{booking.destination}</span>
                    </div>

                    <div className="flex gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-550" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-550" />
                        <span>{booking.departureTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Info */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Koltuklar:</span>
                    <div className="flex gap-1.5">
                      {booking.selectedSeats?.map((seat) => (
                        <span key={seat} className="text-xs font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right price stub / dotted divider */}
                <div className="hidden md:flex flex-col items-center justify-between border-l-2 border-dashed border-slate-950 bg-slate-900/60 p-6 w-44 justify-center text-center">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Toplam Ödeme</span>
                    <span className="text-lg font-black text-indigo-400 block">{booking.totalPrice} TL</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold italic flex items-center gap-1 mt-4">
                    <Compass className="h-3.5 w-3.5 text-indigo-500" />
                    <span>BiletGO</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
