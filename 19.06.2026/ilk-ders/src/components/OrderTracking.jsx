// React'ten useState hook'unu içe aktarıyoruz
import { useState } from "react";

// Sipariş Takip bileşeni
export default function OrderTracking() {

  // Sipariş numarasını tutan state
  const [orderId, setOrderId] = useState("");

  // Kullanıcının girdiği e-posta adresini tutan state
  const [email, setEmail] = useState("");

  // Bulunan sipariş bilgisini tutan state
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Hata mesajını tutan state
  const [error, setError] = useState("");

  // Form gönderilince çalışır
  const handleTrackSubmit = (e) => {

    // Sayfanın yenilenmesini engeller
    e.preventDefault();

    // Örnek olarak sadece 12345 numaralı sipariş bulunuyor
    if (orderId === "12345") {

      // Sipariş bilgisi state'e kaydedilir
      setTrackedOrder({
        id: "12345",
        status: "Hazırlanıyor",
      });

      // Hata mesajı temizlenir
      setError("");

    } else {

      // Sipariş bulunamazsa sipariş bilgisi temizlenir
      setTrackedOrder(null);

      // Hata mesajı gösterilir
      setError(
        "Sipariş Bulunamadı! (Örnek Sipariş No: 12345)"
      );
    }
  };

  return (
    <>
      {/* Sayfanın ana kapsayıcısı */}
      <main className="tracking-container">

        {/* Sipariş sorgulama kartı */}
        <div className="tracking-card">

          {/* Başlık */}
          <h2 className="form-title">
            Sipariş Takibi
          </h2>

          {/* Form */}
          <form onSubmit={handleTrackSubmit}>

            {/* Sipariş numarası alanı */}
            <div className="form-group">

              <label className="form-label">
                Sipariş Numarası
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="Örn:12345"

                // Input değeri state'ten gelir
                value={orderId}

                // Boş bırakılamaz
                required

                // Yazdıkça state güncellenir
                onChange={(e) =>
                  setOrderId(e.target.value)
                }
              />
            </div>

            {/* E-posta alanı */}
            <div className="form-group">

              <label className="form-label">
                E-Posta Adresi
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="Ahmet@yilmaz.com"

                // Input değeri state'ten gelir
                value={email}

                // Boş bırakılamaz
                required

                // Yazdıkça state güncellenir
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* Sorgulama butonu */}
            <button
              className="form-submit"
              type="submit"
            >
              Siparişi Sorgula
            </button>

          </form>

          {/* Hata varsa göster */}
          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

        </div>

        {/* Sipariş bulunduysa durum kartını göster */}
        {trackedOrder && (

          <div className="tracking-card">

            {/* Sipariş durumu */}
            <h3 className="value-title">
              Sipariş Durumu: Hazırlanıyor
            </h3>

            {/* Sipariş aşamalarını gösteren zaman çizelgesi */}
            <div className="timeline">

              {/* 1. aşama */}
              <div className="timeline-step">
                <div className="timeline-icon timeline-icon-active"></div>

                <span className="timeline-label timeline-label-active">
                  Sipariş Alındı
                </span>
              </div>

              {/* 2. aşama */}
              <div className="timeline-step">
                <div className="timeline-icon timeline-icon-active"></div>

                <span className="timeline-label timeline-label-active">
                  Hazırlanıyor
                </span>
              </div>

              {/* 3. aşama */}
              <div className="timeline-step">
                <div className="timeline-icon">
                  3
                </div>

                <span className="timeline-label">
                  Kargoya Verildi
                </span>
              </div>

              {/* 4. aşama */}
              <div className="timeline-step">
                <div className="timeline-icon">
                  4
                </div>

                <span className="timeline-label">
                  Teslim Edildi
                </span>
              </div>

            </div>
          </div>
        )}

      </main>
    </>
  );
}