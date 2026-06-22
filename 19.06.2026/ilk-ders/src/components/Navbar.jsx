// Navbar bileşenini dışarı aktarıyoruz
export default function Navbar({
  // App.js'ten gelen kategoriler dizisi
  categories,

  // O an seçili olan kategori
  selectedCategory,

  // Kategori değiştirme fonksiyonu
  setSelectedCategory,

  // Sayfa görünümünü değiştiren fonksiyon
  setView,
}) {
  return (
    // Kategori menüsünün ana kapsayıcısı
    <nav className="nav-categories">

      {/* Menü içeriğini tutan alan */}
      <div className="nav-container">

        {/* categories dizisini dolaşıyoruz */}
        {categories.map((cat) => (

          // Her kategori için bir span oluşturuyoruz
          <span

            // React'in elemanları takip edebilmesi için key veriyoruz
            key={cat}

            // Eğer seçili kategori bu kategori ise aktif class eklenir
            className={`nav-link ${
              selectedCategory === cat
                ? "nav-link-active"
                : ""
            }`}

            // Kategoriye tıklanınca çalışır
            onClick={() => {

              // Tıklanan kategoriyi seçili kategori yapar
              setSelectedCategory(cat);

              // Ana sayfaya yönlendirir
              setView("home");
            }}
          >

            {/* Kategori adı ekrana yazdırılır */}
            {cat}

          </span>
        ))}
      </div>
    </nav>
  );
}