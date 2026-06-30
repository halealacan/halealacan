import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Printer, Home, Compass } from 'lucide-react';

export default function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const seats = searchParams.get('seats');
  const price = searchParams.get('price');

  const isSuccess = status === 'success';

  const pnr = searchParams.get('pnr') || 'PNRXYZ';

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col justify-center">
      {isSuccess ? (
        /* Success Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6 text-center">
          {/* Decorative gradients */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"></div>

          <div className="flex justify-center">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Ödemeniz Başarılı!</h1>
            <p className="text-xs text-slate-400">Biletleriniz hazırlandı ve cep telefonunuza iletildi.</p>
          </div>

          {/* Ticket Receipt Receipt */}
          <div className="border border-slate-800 bg-slate-950/60 rounded-2xl p-5 text-left space-y-3 relative font-sans">
            {/* PNR Code */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">PNR Numarası</span>
              <span className="text-sm font-black text-indigo-400 font-mono tracking-wider">{pnr}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-350">
              <div className="flex justify-between">
                <span>Güzergah:</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  {origin} <ArrowRight className="h-3 w-3 text-slate-500" /> {destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Koltuk No:</span>
                <span className="font-semibold text-white">{seats ? seats.split(',').sort((a,b)=>a-b).join(', ') : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Toplam Ödeme:</span>
                <span className="font-bold text-indigo-400">{price} TL</span>
              </div>
            </div>

            {/* Dotted separator line */}
            <div className="w-full flex justify-between gap-1 overflow-hidden h-px my-1 select-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-px w-2 bg-slate-800 flex-shrink-0"></div>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <Compass className="h-3 w-3 text-indigo-400" />
              <span>İyi Yolculuklar Dileriz!</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-850 hover:bg-slate-850 text-slate-300 px-4 py-3 rounded-xl text-xs font-bold transition-all"
            >
              <Printer className="h-4 w-4" />
              Yazdır
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02]"
            >
              <Home className="h-4 w-4" />
              Anasayfa
            </Link>
          </div>
        </div>
      ) : (
        /* Failure Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6 text-center">
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-red-500/5 blur-3xl"></div>

          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border border-red-500/20">
              <XCircle className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white">Ödeme Başarısız</h1>
            <p className="text-xs text-slate-400">Kartınızdan tahsilat gerçekleştirilemedi.</p>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl text-xs text-slate-500 leading-relaxed text-left">
            <strong>Olası Sebepler:</strong>
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li>Kart limiti yetersiz olabilir.</li>
              <li>3D Secure doğrulaması iptal edilmiş veya hatalı girilmiş olabilir.</li>
              <li>Kartınız internet alışverişlerine kapalı olabilir.</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-350 px-4 py-3 rounded-xl text-xs font-bold transition-all"
            >
              Geri Dön
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02]"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
