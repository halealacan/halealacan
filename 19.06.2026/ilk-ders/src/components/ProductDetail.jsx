// ProductDetail bileşenini dışarı aktarıyoruz
export default function ProductDetail({
  // Detayı gösterilecek ürün
  product,

  // Geri dönme fonksiyonu
  onBack,

  // Sepete ekleme fonksiyonu
  onAddTocart,
}) {

  // Eğer ürün yoksa hiçbir şey gösterme
  if (!product) return null;

  return (
    <>
      {/* Ürün detay sayfasının ana kapsayıcısı */}
      <div className="detail-container">

        {/* Ürün resmi bölümü */}
        <div className="detail-img-box">

          <img
            // Ürün resmi
            src={product.image}

            // Resim açıklaması
            alt={product.title}

            className="detail-img"
          />

        </div>

        {/* Ürün bilgileri bölümü */}
        <div className="detail-info-box">

          {/* Ürün kategorisi */}
          <span className="detail-badge">
            {product.category}
          </span>

          {/* Ürün adı */}
          <h1 className="detail-title">
            {product.title}
          </h1>

          {/* Ürün puanı */}
          <div className="detail-rating">

            {/* Yıldız */}
            <span>*</span>

            {/* Ortalama puan */}
            <span>{product.rating}</span>

            {/* Değerlendirme sayısı */}
            <span className="text-gray-400">
              {product.ratingCount} Değerlendirme
            </span>

          </div>

          {/* Ürün fiyatı */}
          <div className="detail-price">

            {/* Sayıyı Türk formatında gösterir */}
            {product.price.toLocaleString("tr-TR")} TL

          </div>

          {/* Ürün açıklaması */}
          <p className="detail-description">
            {product.description}
          </p>

          {/* Butonlar */}
          <div className="detail-btn-group">

            {/* Sepete ekleme butonu */}
            <button
              className="detail-add-btn"

              onClick={() =>
                onAddTocart(product)
              }
            >
              Sepete Ekle
            </button>

            {/* Önceki sayfaya dönme butonu */}
            <button
              className="detail-back-btn"
              onClick={onBack}
            >
              Geri Dön
            </button>

          </div>
        </div>
      </div>
    </>
  );
}