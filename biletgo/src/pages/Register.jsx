import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearUserError } from '../store/userSlice';
import KVKKModal from '../components/KVKKModal';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTicket } = useSelector((state) => state.tickets);
  const { status, error: reduxError } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isKvkkOpen, setIsKvkkOpen] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearUserError());

    if (!acceptTerms) {
      setLocalError('KVKK ve Kullanım Koşullarını kabul etmelisiniz.');
      return;
    }

    const resultAction = await dispatch(registerUser({ name, phone, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      if (selectedTicket) {
        navigate('/detail');
      } else {
        navigate('/');
      }
    }
  };

  const activeError = localError || reduxError;

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Kayıt Ol</h2>
          <p className="mt-2 text-sm text-slate-400">
            Hemen kayıt olarak ucuz seyahat avantajlarını kaçırmayın.
          </p>
        </div>

        {activeError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold text-center">
            {activeError}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-8 space-y-5 relative z-10">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Telefon Numarası</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5551234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@biletgo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 select-none cursor-pointer">
                Kullanım koşullarını ve{' '}
                <button
                  type="button"
                  onClick={() => setIsKvkkOpen(true)}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  KVKK Aydınlatma Metnini
                </button>{' '}
                kabul ediyorum.
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-605 disabled:opacity-50 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {status === 'loading' ? (
                <span>Kaydediliyor...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Kayıt Ol</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-slate-400 relative z-10">
          <span>Zaten hesabınız var mı? </span>
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Giriş Yapın
          </Link>
        </div>
      </div>

      <KVKKModal isOpen={isKvkkOpen} onClose={() => setIsKvkkOpen(false)} />
    </div>
  );
}
