// React'ten useContext hook'unu alıyoruz
import { useContext } from "react";

// Kullanıcı bilgilerini tuttuğumuz context'i içe aktarıyoruz
import { UserContext } from "../context/UserContext";

// Tema değiştirmek için oluşturduğumuz özel hook'u içe aktarıyoruz
import { useTheme } from "../hooks/useTheme";

// Header bileşeni
export default function Header({
  searchInput,
  setSearchInput,
  handleSearchSubmit,
  setSelectedCategory,
  setSearchQuery,
  setView,
  onLoginClick,
  onCartClick,
  cartCount,
}) {
  // Logoya tıklanınca çalışır
  const handleLogoClick = () => {
    // Ana sayfaya döner
    setView("home");

    // Kategoriyi tüm ürünler yapar
    setSelectedCategory("Tümü");

    // Arama sonucunu temizler
    setSearchQuery("");

    // Arama inputunu temizler
    setSearchInput("");
  };

  // UserContext içinden user ve logout bilgilerini alıyoruz
  const { user, logout } = useContext(UserContext);

  // useTheme hook'undan tema ve tema değiştirme fonksiyonunu alıyoruz
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Header ana kapsayıcısı */}
      <header className="header">
        <div className="header-container">

          {/* Logo alanı */}
          <div className="logo" onClick={handleLogoClick}>
            n11<span className="logo-accent">Clone</span>
          </div>

          {/* Arama formu */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Ürün,Kategori veya Marka Ara..."
              className="search-input"

              // Input değiştikçe searchInput state'i güncellenir
              onChange={(e) => setSearchInput(e.target.value)}

              // Inputun değeri searchInput state'inden gelir
              value={searchInput}
            />

            {/* Arama butonu */}
            <button type="submit" className="search-button">
              Ara
            </button>
          </form>

          {/* Header sağ taraf butonları */}
          <div className="header-actions">

            {/* Tema değiştirme butonu */}
            <div className="header-item" onClick={toggleTheme}>
              <span>
                {theme === "light" ? "🌙" : "🌞"}
              </span>
            </div>

            {/* Yeni ürün ekleme sayfasına gider */}
            <div className="action-item" onClick={() => setView("addProduct")}>
              <span>Yeni Ürün</span>
            </div>

            {/* Kullanıcı giriş yaptıysa çıkış butonu gösterilir */}
            {user ? (
              <div className="action-item" onClick={logout}>
                <span>Çıkış Yap</span>
              </div>
            ) : (
              // Kullanıcı giriş yapmadıysa giriş butonu gösterilir
              <div className="action-item" onClick={onLoginClick}>
                <span>Giriş Yap</span>
              </div>
            )}

            {/* Sepet sayfasına gider */}
            <div className="action-item" onClick={onCartClick}>
              <span>Sepetim</span>

              {/* Sepetteki ürün sayısını gösterir */}
              <span className="badge">{cartCount}</span>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}