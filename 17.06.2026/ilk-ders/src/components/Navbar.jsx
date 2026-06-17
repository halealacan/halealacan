// Navbar bileşenini dışa aktarır.
// App.js tarafından gönderilen propsları alır.
export default function Navbar({
    categories,           // Kategori listesini tutan dizi
    selectedCategory,     // O anda seçili olan kategori
    setSelectedCategory,  // Seçili kategoriyi değiştiren fonksiyon
    setView               // Görüntülenecek sayfayı değiştiren fonksiyon
}) {

    return(

        // Kategori menüsünün dış kapsayıcısı
        <nav className="nav-categories">

            {/* Kategorileri hizalamak için kullanılan container */}
            <div className="nav-container">

               {/* 
                  categories dizisini dolaşır.
                  Her kategori için bir span oluşturur.
               */}
               {categories.map((cat)=>(

                <span 

                // React'in liste elemanlarını ayırt etmesi için key
                key={cat} 

                /*
                  Eğer seçili kategori bu kategoriye eşitse
                  nav-link-active classı eklenir.
                */
                className={`
                    nav-link 
                    ${selectedCategory === cat ? 'nav-link-active' : ''}
                `}

                // Kategoriye tıklanınca çalışır
                onClick={()=>{

                    // Tıklanan kategoriyi seçili kategori yapar
                    setSelectedCategory(cat);

                    // Ana sayfaya döner
                    setView('home');
                }}
                >

                    {/* Ekranda kategori adını gösterir */}
                    {cat}

                </span>

               ))}

            </div>
        </nav>
        
    )
}