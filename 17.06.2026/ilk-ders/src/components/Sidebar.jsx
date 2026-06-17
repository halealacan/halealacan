// Sidebar bileşenini dışa aktarır.
// App.js tarafından gönderilen propsları alır.
export default function Sidebar({

    categories,           // Kategori listesini tutan dizi
    selectedCategory,     // O anda seçili olan kategori
    setSelectedCategory   // Seçili kategoriyi değiştiren fonksiyon

}) {

    return (
    <>

    {/* Sol tarafta bulunan kategori menüsü */}
    <aside className="sidebar">

        {/* Sidebar başlığı */}
        <h2 className="sidebar-title">
            Kategoriler
        </h2>

        {/* Kategori listesinin bulunduğu alan */}
        <div className="sidebar-list">

            {categories.map((cat)=>(

                <div

                // React'in liste elemanlarını takip etmesi için gerekli
                key={cat}

                /*
                  Eğer seçili kategori bu kategoriye eşitse
                  sidebar-item-active classı eklenir.
                */
                className={`
                    sidebar-item
                    ${selectedCategory === cat
                        ? "sidebar-item-active"
                        : ""
                    }
                `}

                // Kategoriye tıklanınca çalışır
                onClick={() => setSelectedCategory(cat)}
                >

                {/* Kategori adı */}
                <span>
                    {cat}
                </span>

                {/* Sağ taraftaki > işareti */}
                <span className="text-gray-400">
                    &gt;
                </span>

                </div>

            ))}

        </div>

    </aside>

    </>
    )
}