// productsMock dosyasından ABOUT_DATA verisini içe aktarıyoruz
import { ABOUT_DATA } from '../productsMock'

// About Us (Hakkımızda) bileşeni
export default function AboutUs() {
  return (
    // Sayfanın ana kapsayıcısı
    <main className="about-container">

      {/* Üst başlık bölümü */}
      <div className="about-header">

        {/* Alt başlık */}
        <span className="about-subtitle">
          {ABOUT_DATA.subtitle}
        </span>

        {/* Ana başlık */}
        <h1 className="about-title">
          {ABOUT_DATA.title}
        </h1>
      </div>

      {/* İçerik bölümü */}
      <div className="about-body">

        {/* İlk açıklama metni */}
        <p className="about-text">
          {ABOUT_DATA.text1}
        </p>

        {/* İkinci açıklama metni */}
        <p className="about-text">
          {ABOUT_DATA.text2}
        </p>

        {/* Şirket değerlerinin listelendiği alan */}
        <div className="about-values-grid">

          {/* values dizisini dolaşarak kartlar oluşturuyoruz */}
          {ABOUT_DATA.values.map((val) => (

            // Her değer için bir kart oluşturulur
            <div
              key={val.title}
              className="value-card"
            >

              {/* Değer başlığı */}
              <h3 className="value-title">
                {val.title}
              </h3>

              {/* Değer açıklaması */}
              <p className="value-desc">
                {val.desc}
              </p>

            </div>
          ))}
        </div>
      </div>
    </main>
  )
}