// React'ten useState hook'unu içe aktarıyoruz
import { useState } from "react";

// productsMock dosyasındaki sıkça sorulan soruları içe aktarıyoruz
import { FAQ_DATA } from "../productsMock";

// Help Center (Yardım Merkezi) bileşeni
export default function HelpCenter() {

  // Açık olan soru indeksini tutan state
  // Başlangıçta hiçbir soru açık değil
  const [activeFaq, setActiveFaq] = useState(null);

  // Soru açma-kapama fonksiyonu
  const handleToggle = (index) => {

    // Eğer aynı soruya tekrar tıklanırsa kapat
    // Farklı soruya tıklanırsa onu aç
    setActiveFaq(
      activeFaq === index
        ? null
        : index
    );
  };

  return (
    <>
      {/* Sayfanın ana kapsayıcısı */}
      <main className="help-container">

        {/* SSS (FAQ) bölümü */}
        <div className="faq-section">

          {/* Bölüm başlığı */}
          <h2 className="form-title">
            Sıkça Sorulan Sorular
          </h2>

          {/* FAQ_DATA dizisini dolaşıyoruz */}
          {FAQ_DATA.map((faq, index) => (

            // Her soru için kart oluşturuyoruz
            <div
              key={index}
              className="faq-card"

              // Kart tıklanınca aç/kapat işlemi yapılır
              onClick={() => handleToggle(index)}
            >

              {/* Soru kısmı */}
              <div className="faq-question">

                {/* Soru metni */}
                <span>{faq.q}</span>

                {/* Açık mı kapalı mı göstergesi */}
                <span className="text-gray-400">

                  {/* Açıksa -, kapalıysa + göster */}
                  {activeFaq === index ? "-" : "+"}

                </span>
              </div>

              {/* Soru açıksa cevabı göster */}
              {activeFaq === index && (

                <p className="faq-answer">
                  {faq.a}
                </p>

              )}
            </div>
          ))}
        </div>

        {/* Destek talebi oluşturma bölümü */}
        <div className="support-section">

          {/* Başlık */}
          <h2 className="form-title">
            Destek Talebi Oluştur
          </h2>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>

            {/* Ad Soyad alanı */}
            <div className="form-group">

              <label className="form-label">
                Adınız Soyadınız
              </label>

              <input
                className="form-input"
                placeholder="Örn: Ahmet Yılmaz"
                type="text"
              />
            </div>

            {/* E-posta alanı */}
            <div className="form-group">

              <label className="form-label">
                E-Posta Adresiniz
              </label>

              <input
                className="form-input"
                placeholder="ahmet@yilmaz.com"
                type="email"
              />
            </div>

            {/* Mesaj alanı */}
            <div className="form-group">

              <label className="form-label">
                Mesajınız
              </label>

              <textarea
                className="form-textarea"
                placeholder="Talebinizi buraya detaylıca yazınız..."
              />
            </div>

            {/* Gönder butonu */}
            <button
              type="submit"
              className="form-submit"
            >
              Talebi Gönder
            </button>

          </form>
        </div>
      </main>
    </>
  );
}