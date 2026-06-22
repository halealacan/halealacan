// Footer bileşenini dışarı aktarıyoruz.
// App.js'ten gelen setView ve setSelectedCategory prop'larını alıyoruz.
export default function Footer({ setView, setSelectedCategory }) {

  // Kategori linkine tıklanınca çalışacak fonksiyon
  const handleCategoryLink = (cat) => {

    // Seçilen kategoriyi state'e kaydeder
    setSelectedCategory(cat)

    // Ana sayfaya yönlendirir
    setView('home')
  }

  return (
    // Footer'ın ana kapsayıcısı
    <footer className="footer">

      {/* Footer içeriğini tutan container */}
      <div className="footer-container">

        {/* Şirket bilgileri bölümü */}
        <div className="footer-section">

          {/* Bölüm başlığı */}
          <h3 className="footer-title">n11clone</h3>

          {/* Hakkımızda sayfasına yönlendirir */}
          <span
            className="footer-link"
            onClick={() => setView('about')}
          >
            Hakkımızda
          </span>

          {/* Kariyer linki (şu an about sayfasına gidiyor) */}
          <span
            className="footer-link"
            onClick={() => setView('about')}
          >
            Kariyer
          </span>

          {/* İletişim sayfasına yönlendirir */}
          <span
            className="footer-link"
            onClick={() => setView('help')}
          >
            İletişim
          </span>
        </div>

        {/* Kategoriler bölümü */}
        <div className="footer-section">

          <h3 className="footer-title">Kategoriler</h3>

          {/* Telefon kategorisini seçip ana sayfaya döner */}
          <span
            className="footer-link"
            onClick={() => handleCategoryLink('Telefon')}
          >
            Telefon
          </span>

          {/* Bilgisayar kategorisini seçip ana sayfaya döner */}
          <span
            className="footer-link"
            onClick={() => handleCategoryLink('Bilgisayar')}
          >
            Bilgisayar
          </span>

          {/* Aksesuar kategorisini seçip ana sayfaya döner */}
          <span
            className="footer-link"
            onClick={() => handleCategoryLink('Aksesuar')}
          >
            Aksesuar
          </span>
        </div>

        {/* Müşteri hizmetleri bölümü */}
        <div className="footer-section">

          <h3 className="footer-title">
            Müşteri Hizmetleri
          </h3>

          {/* Yardım merkezi sayfası */}
          <span
            className="footer-link"
            onClick={() => setView('help')}
          >
            Yardım Merkezi
          </span>

          {/* Sipariş takip sayfası */}
          <span
            className="footer-link"
            onClick={() => setView('tracking')}
          >
            Sipariş Takibi
          </span>

          {/* İade ve değişim sayfası */}
          <span
            className="footer-link"
            onClick={() => setView('returns')}
          >
            İade ve Değişim
          </span>
        </div>

        {/* Güvenli alışveriş bilgilendirme bölümü */}
        <div className="footer-section">

          <h3 className="footer-title">
            Güvenli Alışveriş
          </h3>

          {/* Bilgilendirme metni */}
          <p className="text-xs text-gray-500">
            %100 Güvenli Ödeme altyapısı ile kart bilgileriniz korunur.
          </p>
        </div>
      </div>

      {/* Footer'ın alt kısmı */}
      <div className="footer-bottom">

        {/* Telif hakkı yazısı */}
        <p>
          © 2026 n11clone - Tüm hakları saklıdır.
        </p>

      </div>
    </footer>
  )
}