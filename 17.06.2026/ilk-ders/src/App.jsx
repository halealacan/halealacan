// Header bileşenini içe aktarır
import Header from "./components/Header";

// Navbar bileşenini içe aktarır
import Navbar from "./components/Navbar";

// Sidebar bileşenini içe aktarır
import Sidebar from "./components/Sidebar";

// ProductGrid bileşenini içe aktarır
// Burada isim ProducutGrid yazılmış ama dosya ProductGrid'den geliyor
import ProducutGrid from "./components/ProductGrid";

// Footer bileşenini içe aktarır
import Footer from "./components/Footer"

// Yeni ürün ekleme formunu içe aktarır
import AddProductForm from "./components/AddProductForm"

// Hazır ürün ve kategori verilerini içe aktarır
import { MOCK_PRODUCTS,MOCK_CATEGORIES } from "./productsMock"

// React'ten useState hook'unu içe aktarır
import { useState } from "react";

function App() {

  // Ürün listesini state olarak tutar
  const [products,setProducts]=useState(MOCK_PRODUCTS);

  // Seçili kategoriyi tutar
  const [selectedCategory,setSelectedCategory]=useState('Tümü');

  // Hangi sayfanın gösterileceğini tutar
  // home ise ana sayfa, addProduct ise ürün ekleme formu gösterilir
  const [view,setView]=useState('home');

  // Gerçek arama işleminde kullanılan kelimeyi tutar
  const [searchQuery,setSearchQuery]=useState("");

  // Arama inputunun içinde yazan değeri tutar
  const [searchInput,setSearchInput]=useState("");

    // Yeni ürün ekleme fonksiyonu
    const handleAddProduct=(data)=>{

    // Formdan gelen bilgilerle yeni ürün objesi oluşturulur
    const newProduct={
      id:Date.now(),              // Ürüne benzersiz id verir
      title:data.title,           // Ürün adı
      price:Number(data.price),   // Fiyatı number tipine çevirir
      category:data.category,     // Ürün kategorisi
      rating:5.0,                 // Yeni ürünün varsayılan puanı
      ratingCount:1,              // Varsayılan değerlendirme sayısı
      image:data.image,           // Ürün görseli
      description:data.description, // Ürün açıklaması
      
    }

    // Yeni ürünü listenin en başına ekler
    setProducts([newProduct,...products]);
  }




  // Ürünleri kategoriye ve arama kelimesine göre filtreler
  const filteredProducts=products.filter((p)=>{

    // Eğer kategori Tümü ise tüm ürünler geçer
    // Değilse ürün kategorisi seçili kategoriye eşit olmalıdır
    const matchesCategory=selectedCategory==='Tümü' || p.category ===selectedCategory;

    // Ürün başlığında veya açıklamasında arama kelimesi var mı kontrol eder
    const matchesSearh=p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Hem kategori hem de arama koşulu sağlanıyorsa ürünü gösterir
    return matchesCategory && matchesSearh
  })

// Arama formu gönderildiğinde çalışır
const handleSearchSubmit=(e)=>{

  // Sayfanın yenilenmesini engeller
  e.preventDefault();

  // Inputtaki değeri gerçek arama sorgusuna aktarır
  setSearchQuery(searchInput);
}
  
  return (
    <>

      {/* Header'a arama ve sayfa değiştirme işlemleri için gerekli propslar gönderilir */}
      <Header searchInput={searchInput}
      setSearchInput={setSearchInput}
      handleSearchSubmit={handleSearchSubmit}
      setSearchQuery={setSearchQuery}
      setSelectedCategory={setSelectedCategory} 
      setView={setView}
      />

      {/* Navbar'a kategori bilgileri ve kategori değiştirme fonksiyonu gönderilir */}
      <Navbar categories={MOCK_CATEGORIES} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setView={setView} />

      {/* Eğer view home ise ana sayfa gösterilir */}
      {view=== 'home' ? (
        
      <main className="main-layout">

        {/* Sidebar'a kategori bilgileri gönderilir */}
        <Sidebar  categories={MOCK_CATEGORIES}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      
        />

        {/* Ürünlerin gösterildiği ana içerik alanı */}
        <div className="content-area">

          {/* İçerik başlığı */}
          <div className="content-header">

            {/* Seçili kategori ve varsa arama kelimesi gösterilir */}
            <h1 className="page-title">{selectedCategory} {searchQuery && `> "${searchQuery}"`} Ürünler</h1>

            {/* Filtrelenmiş ürün sayısı */}
            <span className="text-sm">Topam {filteredProducts.length}</span>
          </div>

          {/* Eğer hiç ürün yoksa boş alan gösterilir */}
          {filteredProducts.length===0 ? (
            <div className="text-center py-10">
              <p className="text-center py-10">
              </p>
            </div>
          ):(  

          // Ürün varsa ProductGrid'e filtrelenmiş ürünler gönderilir
          <ProducutGrid products={filteredProducts}/>
          )}

        </div>
      </main>

      ):(

      // Eğer view home değilse yeni ürün ekleme formu gösterilir
      <AddProductForm  categories={MOCK_CATEGORIES}
      setView={setView} onAddProduct={handleAddProduct}
       />
      )
      }

      {/* Sayfanın en altında footer gösterilir */}
      <Footer/>
    </>
  );
}

// App bileşenini dışa aktarır
export default App;