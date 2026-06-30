import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../store/ticketSlice';
import { Bus, Plane, Calendar, MapPin, Search, ArrowRightLeft, ShieldCheck, Heart, Users } from 'lucide-react';

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya'];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('all'); // 'all', 'bus', 'plane'

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination || !date) {
      alert('Lütfen nereden, nereye ve tarih alanlarını doldurunuz.');
      return;
    }
    if (origin === destination) {
      alert('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }

    dispatch(setSearchQuery({ origin, destination, date, type }));
    navigate('/filter');
  };

  const handleQuickBook = (qOrigin, qDestination, qType) => {
    // Tomorrow's date helper
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    dispatch(setSearchQuery({ origin: qOrigin, destination: qDestination, date: dateStr, type: qType }));
    navigate('/filter');
  };

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] w-full flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8 border-b border-slate-900"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url('/travel_background.png')` }}
      >
        <div className="absolute inset-0 bg-slate-950/20" />

        <div className="relative z-10 w-full max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hayalindeki Seyahati <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                BiletGO ile Planla
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">
              Otobüs ve uçak biletlerini en uygun fiyatlarla karşılaştırın, güvenle satın alın.
            </p>
          </div>

          {/* Search Form Panel */}
          <form 
            onSubmit={handleSearch}
            className="w-full glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl text-left border border-white/10"
          >
            {/* Travel Type Selectors */}
            <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => setType('all')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === 'all' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Tümü
              </button>
              <button
                type="button"
                onClick={() => setType('bus')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === 'bus' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bus className="h-4 w-4" />
                Otobüs
              </button>
              <button
                type="button"
                onClick={() => setType('plane')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === 'plane' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plane className="h-4 w-4" />
                Uçak
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Origin */}
              <div className="md:col-span-2 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereden</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Kalkış Şehri Seçin</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:col-span-1 pt-4 md:pt-0">
                <button
                  type="button"
                  onClick={swapCities}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all active:scale-95"
                  title="Şehirleri Değiştir"
                >
                  <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0" />
                </button>
              </div>

              {/* Destination */}
              <div className="md:col-span-2 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nereye</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Varış Şehri Seçin</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-2 relative">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Tarih</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Search className="h-5 w-5" />
                Biletleri Bul
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Popüler Seyahat Noktaları</h2>
            <p className="text-sm text-slate-500">En çok tercih edilen rotalar için hızlıca bilet bulun.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ticket 1 */}
            <div 
              onClick={() => handleQuickBook('İstanbul', 'Ankara', 'bus')}
              className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl cursor-pointer border border-slate-900 hover:border-slate-800/80 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <Bus className="h-3 w-3" />
                  Otobüs
                </div>
                <span className="text-xs text-slate-500">Yarın</span>
              </div>
              <div className="text-sm font-bold text-white mb-2">İstanbul &rarr; Ankara</div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Kamil Koç vb.</span>
                <span className="text-sm font-black text-indigo-400">650 TL'den</span>
              </div>
            </div>

            {/* Ticket 2 */}
            <div 
              onClick={() => handleQuickBook('İstanbul', 'Ankara', 'plane')}
              className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl cursor-pointer border border-slate-900 hover:border-slate-800/80 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <Plane className="h-3 w-3" />
                  Uçak
                </div>
                <span className="text-xs text-slate-500">Yarın</span>
              </div>
              <div className="text-sm font-bold text-white mb-2">İstanbul &rarr; Ankara</div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">THY, Pegasus</span>
                <span className="text-sm font-black text-purple-400">1150 TL'den</span>
              </div>
            </div>

            {/* Ticket 3 */}
            <div 
              onClick={() => handleQuickBook('İstanbul', 'İzmir', 'bus')}
              className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl cursor-pointer border border-slate-900 hover:border-slate-800/80 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <Bus className="h-3 w-3" />
                  Otobüs
                </div>
                <span className="text-xs text-slate-500">Yarın</span>
              </div>
              <div className="text-sm font-bold text-white mb-2">İstanbul &rarr; İzmir</div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">Pamukkale Turizm</span>
                <span className="text-sm font-black text-indigo-400">750 TL'den</span>
              </div>
            </div>

            {/* Ticket 4 */}
            <div 
              onClick={() => handleQuickBook('Ankara', 'İzmir', 'plane')}
              className="glass-card hover:bg-slate-900/60 p-6 rounded-2xl cursor-pointer border border-slate-900 hover:border-slate-800/80 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full font-semibold">
                  <Plane className="h-3 w-3" />
                  Uçak
                </div>
                <span className="text-xs text-slate-500">Yarın</span>
              </div>
              <div className="text-sm font-bold text-white mb-2">Ankara &rarr; İzmir</div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500">AJet vb.</span>
                <span className="text-sm font-black text-purple-400">1250 TL'den</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Corporate Values Cards Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/35 border-t border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: About */}
            <div className="bg-slate-900/60 border border-slate-800/50 p-8 rounded-3xl space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Biz Kimiz?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                BiletGO, kurulduğu günden bu yana dijital seyahat deneyimini en kolay ve en güvenli hale getirmek için çalışan yenilikçi bir teknoloji şirketidir. Kullanıcılarımızın konforunu ilk sıraya koyuyoruz.
              </p>
            </div>

            {/* Card 2: Mission */}
            <div className="bg-slate-900/60 border border-slate-800/50 p-8 rounded-3xl space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Misyon & Vizyon</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tüm ulaşım araçlarını tek bir çatı altında toplayarak kullanıcılarımıza şeffaf, hızlı ve bütçe dostu seyahat seçenekleri sunmak; yenilikçi çözümlerle küresel seyahat platformu olmaktır.
              </p>
            </div>

            {/* Card 3: Security */}
            <div className="bg-slate-900/60 border border-slate-800/50 p-8 rounded-3xl space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Güvenli Ödeme</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                3D Secure ve uluslararası üst düzey güvenlik sertifikalarıyla ödemeleriniz tamamen güvence altındadır. Kişisel verilerinizin korunmasına en üst düzeyde önem veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
