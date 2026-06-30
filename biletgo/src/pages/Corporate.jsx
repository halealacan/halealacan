import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Compass, FileText, ShieldAlert, Heart, Users } from 'lucide-react';

export default function Corporate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'about';

  const tabs = [
    { id: 'about', name: 'Hakkımızda', icon: Users },
    { id: 'vision', name: 'Vizyon & Misyon', icon: Heart },
    { id: 'terms', name: 'Kullanım Koşulları', icon: FileText },
    { id: 'kvkk', name: 'KVKK Politikası', icon: ShieldAlert },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-2">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Kurumsal Bilgiler</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          BiletGO olarak sunduğumuz hizmetlerin yasal altyapısı, şirket vizyonumuz ve değerlerimiz hakkında merak ettiğiniz her şey.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Left Side: Tabs Selection */}
        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-left border transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side: Content Area */}
        <main className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl min-h-[400px] flex flex-col justify-between">
          <div className="space-y-6">
            {activeTab === 'about' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-400" />
                  <span>Biz Kimiz?</span>
                </h2>
                <div className="text-sm text-slate-350 space-y-4 leading-relaxed">
                  <p>
                    BiletGO, 2026 yılında kurulmuş olup, seyahat etmek isteyen herkes için en hızlı, en güvenli ve en avantajlı çözümleri sunmayı hedefleyen bir dijital biletleme platformudur. 
                  </p>
                  <p>
                    Teknolojik altyapımız sayesinde yüzlerce otobüs firmasını ve hava yolu şirketini tek bir platformda birleştirerek, seyahat planlarınızı dakikalar içinde karşılaştırmalı olarak organize etmenizi sağlıyoruz.
                  </p>
                  <p>
                    Kullanıcı odaklı tasarımımız, şeffaf fiyat politikamız ve 7/24 kesintisiz müşteri desteğimiz ile seyahatinizin her adımında yanınızdayız. Seyahatlerinizi ertelemeyin, BiletGO ile yola çıkın!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-400" />
                  <span>Misyon & Vizyon</span>
                </h2>
                <div className="text-sm text-slate-350 space-y-4 leading-relaxed">
                  <p className="font-semibold text-slate-200 text-md">Misyonumuz</p>
                  <p>
                    Kullanıcılarımızın seyahat ihtiyaçlarına en hızlı, en pratik ve bütçe dostu çözümleri sunarak seyahat etmeyi herkes için erişilebilir kılmak. Dijital seyahat süreçlerindeki tüm karmaşıklıkları en aza indirerek konforlu bir satın alım deneyimi yaşatmak.
                  </p>
                  <p className="font-semibold text-slate-200 text-md pt-2">Vizyonumuz</p>
                  <p>
                    Gelişmiş veri analitiği, kullanıcı dostu arayüzler ve yenilikçi mobil entegrasyonlar ile yalnızca Türkiye'de değil, tüm bölgede akla gelen ilk dijital seyahat ve biletleme süper-uygulaması haline gelmek.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pink-400" />
                  <span>Kullanım Koşulları</span>
                </h2>
                <div className="text-sm text-slate-350 space-y-4 leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                  <p className="font-semibold text-slate-200">1. Taraflar ve Amaç</p>
                  <p>
                    Bu Kullanım Koşulları sözleşmesi, BiletGO web sitesini ziyaret eden tüm kullanıcılar için geçerlidir. Sitemizi kullanarak bu koşulları kabul etmiş sayılırsınız.
                  </p>
                  <p className="font-semibold text-slate-200">2. Rezervasyon ve İptal Kuralları</p>
                  <p>
                    BiletGO, bilet satış işlemlerinde aracı kurum olarak görev yapmaktadır. Alınan biletlerin iptal, iade ve değişiklik işlemleri biletin satın alındığı taşıyıcı firmanın (otobüs firması veya havayolu) kurallarına tabidir. BiletGO, taşıyıcı firmaların kurallarından sorumlu tutulamaz.
                  </p>
                  <p className="font-semibold text-slate-200">3. Ödeme Güvenliği ve Kart Kullanımı</p>
                  <p>
                    Tüm ödeme işlemleri 256-bit SSL güvenlik sertifikalı sanal POS sistemleri aracılığıyla gerçekleştirilir. Kullanıcılar kart bilgilerinin doğruluğundan ve işlem güvenliğinden kendileri sorumludur.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'kvkk' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-indigo-400" />
                  <span>KVKK Politikası</span>
                </h2>
                <div className="text-sm text-slate-350 space-y-4 leading-relaxed max-h-[350px] overflow-y-auto pr-2">
                  <p className="font-semibold text-slate-200">Kişisel Verilerin Korunması Aydınlatma Metni</p>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, BiletGO olarak veri sorumlusu sıfatıyla seyahat rezervasyonlarınızın gerçekleştirilebilmesi, faturalandırılabilmesi ve müşteri memnuniyeti süreçlerinin takibi amacıyla ad-soyad, telefon, e-posta gibi kişisel verilerinizi kaydetmekteyiz.
                  </p>
                  <p>
                    Kişisel verileriniz, yasal mevzuatın öngördüğü süreler boyunca saklanır ve izniniz dışında hiçbir üçüncü parti kurum veya kuruluşa ticari amaçlarla satılmaz/aktarılmaz. Kanun kapsamındaki haklarınızı kullanmak ve veri silme talebinde bulunmak için destek@biletgo.com adresinden bizimle iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-800 pt-6 mt-6 flex justify-between items-center text-xs text-slate-500">
            <span>BiletGO &copy; {new Date().getFullYear()}</span>
            <span>Güvenli Altyapı</span>
          </div>
        </main>
      </div>
    </div>
  );
}
