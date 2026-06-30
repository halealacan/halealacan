import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { setSearchQuery } from '../store/ticketSlice';
import { Plane, Bus, LogOut, User, Compass, Ticket, PlusCircle } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNavSearch = (type) => {
    dispatch(setSearchQuery({ origin: '', destination: '', date: '', type }));
    navigate('/filter');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
            BiletGO
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Anasayfa</Link>
          <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
            <button
              onClick={() => handleNavSearch('bus')}
              className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Bus className="h-3.5 w-3.5" />
              Otobüs
            </button>
            <button
              onClick={() => handleNavSearch('plane')}
              className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plane className="h-3.5 w-3.5" />
              Uçak
            </button>
          </div>
        </nav>

        {/* Auth / Account */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1.5 hover:border-slate-750 hover:bg-slate-900/80 transition-all cursor-pointer"
                title="Profil Bilgilerim"
              >
                <User className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">{currentUser.name}</span>
              </Link>
              <Link
                to="/my-bookings"
                className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all cursor-pointer"
                title="Biletlerim"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Biletlerim</span>
              </Link>
              <Link
                to="/add-ticket"
                className="flex items-center gap-1.5 text-xs text-purple-400 font-bold px-3 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 transition-all cursor-pointer"
                title="Sefer Ekle"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Sefer Ekle</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-200"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
