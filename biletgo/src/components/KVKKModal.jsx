import React from 'react';
import { X } from 'lucide-react';

export default function KVKKModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-lg font-bold text-white">KVKK Aydınlatma Metni</h2>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm text-slate-300 space-y-4 leading-relaxed">
          <p className="font-semibold text-slate-200">
            Kişisel Verilerin Korunması Kanunu (KVKK) Bilgilendirme ve Onay Metni
          </p>
          <p>
            BiletGO olarak, seyahat rezervasyonlarınızın gerçekleştirilebilmesi, fatura düzenlenebilmesi, rezervasyon güncellemelerinin size iletilebilmesi ve yasal yükümlülüklerin yerine getirilebilmesi amacıyla kişisel verilerinizi işlemekteyiz.
          </p>
          <p>
            <strong>İşlenen Verileriniz:</strong> Adınız, soyadınız, telefon numaranız, e-posta adresiniz, seyahat detaylarınız ve ödeme simülasyonu verileriniz.
          </p>
          <p>
            <strong>Veri Toplama Yöntemi:</strong> Web sitemizdeki üyelik ve bilet arama/rezervasyon formları aracılığıyla tamamen elektronik ortamda toplanmaktadır.
          </p>
          <p>
            <strong>Haklarınız:</strong> 6698 sayılı Kanun’un 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz.
          </p>
          <p>
            Kişisel verileriniz, yasal mevzuatta belirtilen süreler boyunca saklanacak olup üçüncü şahıslarla paylaşılmamaktadır.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Okudum, Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
