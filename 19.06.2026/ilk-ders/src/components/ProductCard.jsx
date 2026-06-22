// ProductCard bileşenini dışarı aktarıyoruz
export default function ProductCard({
  // Ürün bilgileri
  product,

  // Ürüne tıklanınca çalışacak fonksiyon
  onProductClick,

  // Sepete ekleme fonksiyonu
  onAddToCart,
}) {
  return (
    <>
      {/* Ürün kartı */}
      <div
        className="product-card"

        // Kartın herhangi bir yerine tıklanınca ürün detayına gider
        onClick={() => onProductClick(product)}
      >

        {/* Ürün resmi alanı */}
        <div className="product-img-container">

          <img
            // Ürün resmi
            src={product.image}

            // Resim yüklenemezse açıklama metni
            alt={product.title}

            className="product-img"
          />
        </div>

        {/* Ürün bilgileri */}
        <div className="product-info">

          {/* Ürün kategorisi */}
          <span className="product-category">
            {product.category}
          </span>

          {/* Ürün adı */}
          <h3 className="product-title">
            {product.title}
          </h3>

          {/* Ürün puanı */}
          <div className="product-rating">

            {/* Yıldız */}
            <span>*</span>

            {/* Ortalama puan */}
            <span>{product.rating}</span>

            {/* Değerlendirme sayısı */}
            <span className="text-gray-400">
              ({product.ratingCount})
            </span>

          </div>

          {/* Fiyat ve sepet butonu */}
          <div className="product-price-container">

            {/* Ürün fiyatı */}
            <span className="product-price">
              {product.price} TL
            </span>

            {/* Sepete ekle butonu */}
            <button
              className="product-btn"

              onClick={(e) => {

                // Tıklama olayının üst elemana gitmesini engeller
                e.stopPropagation();

                // Ürünü sepete ekler
                onAddToCart(product);
              }}
            >

              {/* Artı ikonu */}
              <span>+</span>

            </button>

          </div>
        </div>
      </div>
    </>
  );
}