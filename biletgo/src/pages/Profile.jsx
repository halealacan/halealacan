import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Ticket, ShieldCheck, Calendar } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Fetch booking count for user
    const fetchBookingCount = async () => {
      try {
        const response = await fetch(`http://localhost:3001/bookings?userId=${currentUser.id}`);
        if (response.ok) {
          const bookings = await response.json();
          setBookingCount(bookings.length);
        }
      } catch (err) {
        console.error('Rezervasyon sayısı yüklenemedi:', err);
      }
    };

    fetchBookingCount();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-8">
        {/* Ambient background light */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl"></div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white border-4 border-slate-950 shadow-xl shadow-indigo-500/10">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentUser.name}</h1>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
              BiletGO Üyesi
            </span>
          </div>
        </div>

        {/* Profile Card Fields */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 space-y-4 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-850">
            Kişisel Bilgiler
          </h3>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {/* Full Name */}
            <div className="flex items-center justify-between py-2 border-b border-slate-900/60">
              <div className="flex items-center gap-2.5 text-slate-400">
                <User className="h-4.5 w-4.5 text-slate-500" />
                <span>Ad Soyad:</span>
              </div>
              <span className="font-bold text-slate-200">{currentUser.name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-2 border-b border-slate-900/60">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail className="h-4.5 w-4.5 text-slate-500" />
                <span>E-posta:</span>
              </div>
              <span className="font-semibold text-slate-200 font-mono">{currentUser.email}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone className="h-4.5 w-4.5 text-slate-500" />
                <span>Telefon:</span>
              </div>
              <span className="font-semibold text-slate-200 font-mono">
                {currentUser.phone ? `+90 (${currentUser.phone.substring(0,3)}) ${currentUser.phone.substring(3,6)} ${currentUser.phone.substring(6,8)} ${currentUser.phone.substring(8,10)}` : 'Belirtilmedi'}
              </span>
            </div>
          </div>
        </div>

        {/* Member Stats Column */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <Link 
            to="/my-bookings"
            className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 hover:border-indigo-500/40 cursor-pointer text-left block hover:-translate-y-0.5 duration-200 transition-all"
          >
            <div className="flex items-center gap-2.5 text-indigo-400 mb-2">
              <Ticket className="h-5 w-5" />
              <span className="text-xs font-bold">Rezervasyonlar</span>
            </div>
            <div className="text-2xl font-black text-white">{bookingCount}</div>
            <span className="text-[10px] text-slate-500">Satın alınan bilet sayısı</span>
          </Link>

          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 text-left">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold">Hesap Durumu</span>
            </div>
            <div className="text-md font-extrabold text-white">Doğrulanmış</div>
            <span className="text-[10px] text-slate-500">Güvenli profil altyapısı</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center relative z-10">
          <Link 
            to="/" 
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            &larr; Anasayfa'ya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
