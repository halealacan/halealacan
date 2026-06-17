// Footer bileşenini dışa aktarır.
// Sayfanın en alt kısmında gösterilecek içerikleri oluşturur.
export default function Footer(){

    return(
        <>

        {/* Sayfanın alt kısmı */}
        <footer className="footer">

            {/* Footer içeriğini düzenleyen kapsayıcı */}
            <div className="footer-container">

                {/* 1. Bölüm */}
                <div className="footer-section">

                    {/* Bölüm başlığı */}
                    <h3 className="footer-title">
                        N11clone
                    </h3>

                    {/* Link görünümlü metinler */}
                    <span className="footer-link">
                        Hakkımızda
                    </span>

                    <span className="footer-link">
                        Kariyer
                    </span>

                    <span className="footer-link">
                        İletişim
                    </span>

                </div>

                {/* 2. Bölüm */}
                <div className="footer-section">

                    <h3 className="footer-title">
                        Kategoriler
                    </h3>

                    <span className="footer-link">
                        Telefon
                    </span>

                    <span className="footer-link">
                        Aksesuar
                    </span>

                    <span className="footer-link">
                        Bilgisayar
                    </span>

                </div>

                {/* 3. Bölüm */}
                <div className="footer-section">

                    <h3 className="footer-title">
                        Müşteri Hizmetleri
                    </h3>

                    <span className="footer-link">
                        Yardım Merkezi
                    </span>

                    <span className="footer-link">
                        Sipariş Takibi
                    </span>

                    <span className="footer-link">
                        İade Ve Değişim
                    </span>

                </div>

                {/* 4. Bölüm */}
                <div className="footer-section">

                    <h3 className="footer-title">
                        Güvenli Alışveriş
                    </h3>

                    {/* Açıklama metni */}
                    <p
                        className="text-xs"
                        text-gray-500
                    >
                        %100 güvenli ödeme altyapısı ile
                        kart bilgileriniz korunmaktadır.
                    </p>

                </div>

                {/* Footer'ın en alt kısmı */}
                <div className="footer-bottom">

                    {/* Telif hakkı bilgisi */}
                    <p>
                        @2026 Hale Alacan - Tüm Hakları Saklıdır.
                    </p>

                </div>

            </div>

        </footer>

        </>
    );
}