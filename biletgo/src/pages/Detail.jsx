import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setSelectedSeats } from '../store/ticketSlice';
import BusSeatMap from '../components/BusSeatMap';
import { ArrowLeft, CreditCard, AlertCircle, ShoppingBag, Clock } from 'lucide-react';

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { selectedTicket, selectedSeats } = useSelector((state) => state.tickets);

  if (!selectedTicket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <AlertCircle className="h-12 w-12 text-slate-500" />
        <p className="text-slate-400 text-sm">Seçili bilet bulunamadı. Lütfen arama yapın.</p>
        <Link to="/" className="text-indigo-400 font-semibold hover:underline text-sm">
          Anasayfa'ya Dön
        </Link>
      </div>
    );
  }

  const handleSeatClick = (seatNumber) => {
    let updatedSeats = [...selectedSeats];
    if (updatedSeats.includes(seatNumber)) {
      updatedSeats = updatedSeats.filter((num) => num !== seatNumber);
    } else {
      if (updatedSeats.length >= 4) {
        alert('Tek seferde en fazla 4 koltuk seçebilirsiniz.');
        return;
      }
      updatedSeats.push(seatNumber);
    }
    dispatch(setSelectedSeats(updatedSeats));
  };

  const totalPrice = selectedSeats.length * selectedTicket.price;
  const isBus = selectedTicket.type === 'bus';

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Lütfen en az bir koltuk seçiniz.');
      return;
    }
    
    if (!currentUser) {
      alert('Ödeme işlemine devam edebilmek için giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    navigate('/payment');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Geri Dön</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Seat Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Koltuk Seçimi</h2>
            <p className="text-xs text-slate-500 mb-6">Seyahat etmek istediğiniz boş koltukları seçin.</p>
            
            <BusSeatMap
              totalSeats={selectedTicket.totalSeats}
              occupiedSeats={selectedTicket.occupiedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              type={selectedTicket.type}
            />
          </div>
        </div>

        {/* Right Side: Booking Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sefer Bilgileri */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800">Sefer Detayları</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-white">{selectedTicket.company}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{isBus ? 'Otobüs' : 'Uçak'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-300">{selectedTicket.date}</div>
                <div className="text-[10px] text-slate-500 font-bold flex items-center justify-end gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedTicket.departureTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              <div className="text-xs font-semibold text-slate-400 flex-1">
                <span className="text-slate-500 font-medium">Kalkış:</span> {selectedTicket.origin}
              </div>
              <div className="h-3 w-px bg-slate-800"></div>
              <div className="text-xs font-semibold text-slate-400 flex-1 text-right">
                <span className="text-slate-500 font-medium">Varış:</span> {selectedTicket.destination}
              </div>
            </div>
          </div>

          {/* Koltuk Özet */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-indigo-400" />
              <span>Rezervasyon Özeti</span>
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Bilet Fiyatı:</span>
                <span className="font-semibold text-slate-200">{selectedTicket.price} TL</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Seçilen Koltuklar:</span>
                <span className="font-bold text-white">
                  {selectedSeats.length > 0 ? [...selectedSeats].sort((a,b)=>a-b).join(', ') : 'Seçilmedi'}
                </span>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Toplam Tutar:</span>
                <span className="text-lg text-indigo-400 font-black">{totalPrice} TL</span>
              </div>
            </div>

            {/* Warning if not logged in */}
            {!currentUser && (
              <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3.5 rounded-xl text-xs leading-relaxed">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Ödeme aşamasına geçebilmek için üye girişi yapmanız gerekmektedir.</span>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-605 disabled:opacity-40 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>
                {currentUser ? 'Ödemeye İlerle' : 'Giriş Yap ve Öde'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
