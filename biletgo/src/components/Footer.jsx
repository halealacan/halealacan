import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">BiletGO</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            En ucuz otobüs ve uçak biletlerini saniyeler içinde bulun, güvenle satın alın. Seyahatleriniz BiletGO ile çok daha kolay.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Hızlı Menü</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Anasayfa</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">Giriş Yap</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">Kayıt Ol</Link>
            </li>
          </ul>
        </div>

        {/* Corporate Column */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Kurumsal</h3>
          <ul className="space-y-2 text-xs text-slate-500">
            <li>
              <Link to="/corporate?tab=vision" className="hover:text-white transition-colors">Vizyon & Misyon</Link>
            </li>
            <li>
              <Link to="/corporate?tab=about" className="hover:text-white transition-colors">Hakkımızda</Link>
            </li>
            <li>
              <Link to="/corporate?tab=terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
            </li>
            <li>
              <Link to="/corporate?tab=kvkk" className="hover:text-white transition-colors">Kişisel Verilerin Korunması (KVKK)</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white mb-4">İletişim</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone className="h-3.5 w-3.5 text-indigo-400" />
            <span>+90 (850) 123 45 67</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            <span>destek@biletgo.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            <span>Levent, Beşiktaş, İstanbul</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-8 pt-8 border-t border-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} BiletGO. Tüm Hakları Saklıdır.
        </p>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="text-xs">Tailwind v3 & React</span>
        </div>
      </div>
    </footer>
  );
}
