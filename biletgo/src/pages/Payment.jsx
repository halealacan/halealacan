import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearBooking, updateTicketSeats, addBooking } from '../store/ticketSlice';
import { ArrowLeft, CreditCard, Shield, Landmark } from 'lucide-react';

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { selectedTicket, selectedSeats } = useSelector((state) => state.tickets);

  // Form states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [simulateSuccess, setSimulateSuccess] = useState(true);

  // UI state
  const [processing, setProcessing] = useState(false);

  if (!selectedTicket || selectedSeats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-slate-400 text-sm">Geçerli bir bilet veya koltuk seçimi bulunamadı.</p>
        <Link to="/" className="text-indigo-400 font-semibold hover:underline text-sm">Anasayfaya Git</Link>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * selectedTicket.price;

  const handleCardNumberChange = (e) => {
    // Format card number to 1111 2222 3333 4444
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  const handleExpiryChange = (e) => {
    // Format expiry date MM/YY
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      setExpiry(v.substring(0, 2) + '/' + v.substring(2, 4));
    } else {
      setExpiry(v);
    }
  };

  const handleCvvChange = (e) => {
    const v = e.target.value.replace(/\D/g, '');
    setCvv(v.substring(0, 3));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate bank transaction timeout (1.5 seconds)
    setTimeout(async () => {
      if (simulateSuccess) {
        try {
          // 1. Dispatch seat update thunk (handles fetching & merging in slice)
          const seatAction = await dispatch(updateTicketSeats({
            ticketId: selectedTicket.id,
            newSeats: selectedSeats
          }));

          if (updateTicketSeats.rejected.match(seatAction)) {
            throw new Error('Koltuklar güncellenemedi.');
          }

          const pnrChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let generatedPnr = '';
          for (let i = 0; i < 6; i++) {
            generatedPnr += pnrChars.charAt(Math.floor(Math.random() * pnrChars.length));
          }

          // 2. Dispatch addBooking thunk
          const bookingAction = await dispatch(addBooking({
            userId: currentUser?.id || 'guest',
            userName: currentUser?.name || 'Misafir',
            ticketId: selectedTicket.id,
            origin: selectedTicket.origin,
            destination: selectedTicket.destination,
            date: selectedTicket.date,
            departureTime: selectedTicket.departureTime,
            company: selectedTicket.company,
            type: selectedTicket.type,
            selectedSeats,
            totalPrice,
            pnr: generatedPnr,
            createdAt: new Date().toISOString(),
          }));

          if (addBooking.rejected.match(bookingAction)) {
            throw new Error('Rezervasyon kaydedilemedi.');
          }

          const bookedSeatsParam = selectedSeats.join(',');
          
          // Clear booking selections in Redux
          dispatch(clearBooking());
          setProcessing(false);
          
          navigate(`/payment-result?status=success&origin=${selectedTicket.origin}&destination=${selectedTicket.destination}&seats=${bookedSeatsParam}&price=${totalPrice}&pnr=${generatedPnr}`);
        } catch (error) {
          console.error(error);
          setProcessing(false);
          navigate('/payment-result?status=fail&reason=db-error');
        }
      } else {
        setProcessing(false);
        navigate('/payment-result?status=fail');
      }
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Koltuk Seçimine Dön</span>
      </button>

      {processing ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin"></div>
            <Landmark className="absolute h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-white mt-4">Ödemeniz İşleniyor</h2>
          <p className="text-xs text-slate-500">Güvenli banka ödeme geçidine bağlanılıyor, lütfen sayfayı kapatmayın...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-1.5">Ödeme Bilgileri</h2>
              <p className="text-xs text-slate-500 mb-6">Kredi veya banka kartı bilgilerinizi giriniz.</p>

              {/* Visual Credit Card Preview */}
              <div className="w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 border border-indigo-500/20 p-6 flex flex-col justify-between shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300">BiletGO Card</span>
                    <div className="h-7 w-10 bg-yellow-500/20 border border-yellow-500/30 rounded-md mt-1.5"></div>
                  </div>
                  <CreditCard className="h-7 w-7 text-indigo-400" />
                </div>
                <div>
                  <div className="text-md font-bold tracking-widest text-slate-100 font-mono">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 block">Kart Sahibi</span>
                      <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase truncate max-w-[150px] block">
                        {cardName || 'AD SOYAD'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 block">S.K.T</span>
                      <span className="text-xs font-semibold tracking-wide text-slate-200 block font-mono">
                        {expiry || 'AA/YY'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {/* Name on Card */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Kart Sahibinin Adı</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Kart Numarası</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all font-mono"
                  />
                </div>

                {/* Expiry & CVV Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Son Kullanma (AA/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength="5"
                      placeholder="12/28"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">CVV (CVC)</label>
                    <input
                      type="password"
                      required
                      maxLength="3"
                      placeholder="•••"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Simulation Mode Toggle (For Testing) */}
                <div className="border border-slate-800 bg-slate-950/60 p-4 rounded-xl flex items-center justify-between gap-4 mt-6">
                  <div>
                    <span className="text-xs font-bold text-slate-350 block">Simülasyon Test Modu</span>
                    <span className="text-[10px] text-slate-500">Ödemenin sonucunu kendiniz belirleyin.</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulateSuccess(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        simulateSuccess
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      Başarılı
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateSuccess(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        !simulateSuccess
                          ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      Başarısız
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
                  >
                    <span>Ödemeyi Tamamla ({totalPrice} TL)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-md font-bold text-white pb-3 border-b border-slate-800">Özet Bilgiler</h2>
              
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Firma:</span>
                  <span className="font-bold text-slate-200">{selectedTicket.company}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rota:</span>
                  <span className="font-bold text-slate-200">{selectedTicket.origin} &rarr; {selectedTicket.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sefer Tarihi:</span>
                  <span className="font-bold text-slate-200">{selectedTicket.date} - {selectedTicket.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Koltuk Numaraları:</span>
                  <span className="font-bold text-white">{[...selectedSeats].sort((a,b)=>a-b).join(', ')}</span>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400">Genel Toplam:</span>
                  <span className="text-indigo-400 text-md font-black">{totalPrice} TL</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 border border-slate-850 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 leading-normal">
                <Shield className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Kart bilgileriniz PCI-DSS standartları çerçevesinde 256-bit SSL şifreleme sertifikasıyla korunur. BiletGO kart bilgilerinizi asla saklamaz.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
