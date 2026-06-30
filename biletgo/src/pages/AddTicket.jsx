import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTicket } from '../store/ticketSlice';
import { Bus, Plane, Calendar, Clock, MapPin, Tag, PlusCircle, CheckCircle, ArrowRight } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya'];
const BUS_COMPANIES = ['Kamil Koç', 'Metro Turizm', 'Pamukkale Turizm', 'Varan Turizm'];
const FLIGHT_COMPANIES = ['Türk Hava Yolları', 'Pegasus', 'AJet', 'SunExpress'];

export default function AddTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Wizard Steps: 1 = Type Selection, 2 = Ticket details
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [type, setType] = useState(''); // 'bus' or 'plane'
  const [company, setCompany] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleSelectType = (selectedType) => {
    setType(selectedType);
    setCompany('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCompany = company === 'other' ? customCompany : company;

    // Validations
    if (!type) {
      setError('Lütfen araç tipini seçin.');
      return;
    }
    if (!finalCompany) {
      setError('Lütfen firma adını belirtin.');
      return;
    }
    if (!origin || !destination) {
      setError('Kalkış ve varış noktalarını seçin.');
      return;
    }
    if (origin === destination) {
      setError('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }
    if (!date) {
      setError('Sefer tarihini seçin.');
      return;
    }
    if (!time) {
      setError('Sefer saatini seçin.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Lütfen geçerli bir fiyat girin.');
      return;
    }
    if (!duration) {
      setError('Sefer süresini belirtin (örn: 5s 30dk).');
      return;
    }

    setLoading(true);

    const ticketData = {
      type,
      company: finalCompany,
      origin,
      destination,
      date,
      departureTime: time,
      duration,
      price: Number(price),
      totalSeats: type === 'bus' ? 40 : 180,
      occupiedSeats: [],
    };

    try {
      const resultAction = await dispatch(addTicket(ticketData));
      if (addTicket.fulfilled.match(resultAction)) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          // Redirect to filter page to see new tickets
          navigate('/filter');
        }, 1500);
      } else {
        throw new Error(resultAction.payload || 'Bilet eklenirken hata oluştu.');
      }
    } catch (err) {
      setError(err.message || 'Bağlantı hatası: Sunucu aktif olmayabilir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl"></div>

        {success ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="h-8 w-8 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white">Sefer Başarıyla Eklendi!</h2>
            <p className="text-xs text-slate-500">Sefer listeleme sayfasına yönlendiriliyorsunuz...</p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                <PlusCircle className="h-6 w-6 text-indigo-400" />
                <span>Yeni Sefer Tanımla</span>
              </h1>
              <p className="text-xs text-slate-500">
                Sisteme yeni bir otobüs veya uçak seferi ekleyin.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* STEP 1: Type Selection */}
            {step === 1 && (
              <div className="space-y-4 pt-4 animate-in fade-in duration-200">
                <h3 className="text-sm font-semibold text-slate-350 text-center mb-4">Taşıt Türünü Seçin</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Bus Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectType('bus')}
                    className="flex flex-col items-center justify-center gap-4 bg-slate-950 hover:bg-slate-950/60 p-6 rounded-2xl border border-slate-850 hover:border-indigo-500/50 cursor-pointer group transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bus className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Otobüs Seferi</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">40 Koltuk Kapasitesi</span>
                    </div>
                  </button>

                  {/* Plane Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectType('plane')}
                    className="flex flex-col items-center justify-center gap-4 bg-slate-950 hover:bg-slate-950/60 p-6 rounded-2xl border border-slate-850 hover:border-purple-500/50 cursor-pointer group transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plane className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Uçak Seferi</span>
                      <span className="text-[10px] text-slate-500 mt-1 block">180 Koltuk Kapasitesi</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Details Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-white flex items-center gap-1 mb-2"
                >
                  &larr; Araç Türünü Değiştir
                </button>

                {/* Company Select */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Firma / Havayolu</label>
                  <select
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Firma Seçin</option>
                    {(type === 'bus' ? BUS_COMPANIES : FLIGHT_COMPANIES).map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                    <option value="other">Diğer (Kendim Yazacağım)</option>
                  </select>
                </div>

                {/* Custom Company input if 'other' is selected */}
                {company === 'other' && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Özel Firma Adı</label>
                    <input
                      type="text"
                      required
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      placeholder="Firma Adı Girin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                )}

                {/* Origin & Destination Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereden</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <select
                        required
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Kalkış</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereye</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <select
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Varış</option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Tarih</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Saat (Saat:Dakika)</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Duration Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Bilet Fiyatı (TL)</label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="number"
                        required
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Örn: 750"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Sefer Süresi</label>
                    <input
                      type="text"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Örn: 5s 30dk veya 1s 15dk"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
                  >
                    <span>{loading ? 'Sefer Tanımlanıyor...' : 'Sefer Ekle'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
