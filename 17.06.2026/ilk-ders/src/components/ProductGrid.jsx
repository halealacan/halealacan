// ProductCard bileşenini içe aktarır.
// Her ürün için kart oluşturmak amacıyla kullanacağız.
import ProductCard from "./ProductCard"

// ProductGrid bileşenini dışa aktarır.
// App.js'ten gelen products dizisini alır.
export default function ProductGrid({ products, onAddToCart }) {

    return (
        <>

        {/* Ürün kartlarının gösterileceği alan */}
        <div className="product-grid">

            {products.map((product) => (

                // Her ürün için bir ProductCard oluşturulur
                <ProductCard

                    // React'in liste elemanlarını takip edebilmesi için benzersiz key
                    key={product.id}

                    // Ürünün tamamı ProductCard'a gönderilir
                    product={product}

                    onAddCart={onAddToCart}
                />

            ))}

        </div>

        </>
    )
}