// ProductCard bileşenini dışa aktarır.
// ProductGrid içerisinden gönderilen tek bir ürünü alır.
export default function ProductCard({

    product // Tek bir ürün objesi

}) {

    return (
        <>

        {/* Ürünün tamamını kapsayan kart */}
        <div className="product-card">

            {/* Ürün görselinin bulunduğu alan */}
            <div className="product-img-container">

                {/* Ürün resmi */}
                <img

                    // Resim adresi
                    src={product.image}

                    // Resim yüklenmezse veya erişilebilirlik için açıklama
                    alt={product.title}

                    // CSS sınıfı
                    className="product-img"
                />

            </div>

            {/* Ürün bilgilerinin bulunduğu bölüm */}
            <div className="product-info">

                {/* Ürün kategorisi */}
                <span className="product-category">
                    {product.category}
                </span>

                {/* Ürün adı */}
                <h3 className="product-title">
                    {product.title}
                </h3>

                {/* Puan bilgisi */}
                <div className="product-title">

                    {/* Yıldız simgesi yerine geçiyor */}
                    <span>*</span>

                    {/* Ortalama puan */}
                    <span>
                        {product.rating}
                    </span>

                    {/* Değerlendirme sayısı */}
                    <span className="text-gray-400">
                        ({product.ratingCount})
                    </span>

                </div>

                {/* Fiyat ve buton alanı */}
                <div className="product-price-container">

                    {/* Ürün fiyatı */}
                    <span className="product-price-container">
                        {product.price} tl
                    </span>

                    {/* Sepete ekleme butonu */}
                    <button className="product-btn">

                        <span>+</span>

                    </button>

                </div>

            </div>

        </div>

        </>
    );
}