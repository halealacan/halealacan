// Header bileşenini dışa aktarır.
// App.js içinden gönderilen propsları alır.
export default function Header({
  searchInput,            // Arama kutusundaki mevcut değer
  setSearchInput,         // Arama kutusunun değerini güncelleyen fonksiyon
  handleSearchSubmit,     // Arama formu gönderildiğinde çalışan fonksiyon
  setSelectedCategory,    // Seçili kategoriyi değiştiren fonksiyon
  setSearchQuery,         // Aranacak sorguyu değiştiren fonksiyon
  setView,
  cart               // Görüntülenecek sayfayı değiştiren fonksiyon
}) {
  
  // Logoya tıklanınca çalışacak fonksiyon
  const handleLogoClick = () => {

    // Ana sayfaya döner
    setView('home');

    // Kategoriyi "Tümü" olarak sıfırlar
    setSelectedCategory('Tümü');

    // Arama sorgusunu temizler
    setSearchQuery('');

    // Input içerisindeki yazıyı temizler
    setSearchInput("");
  }
  
  return (
    <>
      {/* Sayfanın üst kısmındaki header alanı */}
      <header className="header">

        {/* Header içeriğini ortalamak ve düzenlemek için kullanılan container */}
        <div className="header-container">

          {/* Logo alanı */}
          {/* Tıklanınca ana sayfaya döner */}
          <div className="logo" onClick={handleLogoClick}>
            n11
            {/* Logonun farklı renkte gösterilen kısmı */}
            <span className="logo-accent">Clone</span>
          </div>

          {/* Arama formu */}
          {/* Enter'a basılınca veya Ara butonuna tıklanınca çalışır */}
          <form
            className="search-bar"
            onSubmit={handleSearchSubmit}
          >

            {/* Kullanıcının ürün aradığı input alanı */}
            <input
              type="text"
              placeholder="Ürün,Kategori veya Marka Ara..."
              className="search-input"

              // Kullanıcı her yazdığında state güncellenir
              onChange={(e) => setSearchInput(e.target.value)}

              // Input'un değeri state'den gelir
              value={searchInput}
            />

            {/* Formu gönderen buton */}
            <button
              type="submit"
              className="search-button"
            >
              Ara
            </button>
          </form>

          {/* Header'ın sağ tarafındaki işlemler */}
          <div className="header-actions">

            {/* Yeni Ürün ekleme sayfasına geçiş */}
            <div
              className="action-item"
              onClick={() => setView('addProduct')}
            >
              <span>Yeni Ürün</span>
            </div>

            {/* Giriş yap alanı */}
            <div className="action-item">
              <span>Giriş Yap</span>
            </div>

            {/* Sepet alanı */}
            <div 
              className="action-item"
              onClick={() => setView('cart')}
            >


              {/* Sepet yazısı */}
              <span>Sepetim</span>

              {/* Sepetteki ürün sayısını gösteren rozet */}
              {/* Şu an sabit olarak 0 yazıyor */}
              <span className="badge">{cart.length}</span>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}