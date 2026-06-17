// react-hook-form kütüphanesinden useForm hook'unu içe aktarır
import {useForm} from 'react-hook-form'

// Yeni ürün ekleme formu bileşeni
export default function AddProductForm({categories,setView,onAddProduct}){

    // useForm form işlemlerini yönetmek için kullanılır
    const{
        register,              // Inputları forma bağlar
        handleSubmit,          // Form gönderilince validasyon kontrolü yapar
        reset,                 // Formu temizler
        formState:{errors},    // Formdaki hata mesajlarını tutar
    }=useForm();

    // Form başarıyla gönderilirse çalışacak fonksiyon
    const onSubmit=(data)=>{

        // Formdan gelen ürün bilgilerini App.js'e gönderir
        onAddProduct(data)

        // Form alanlarını temizler
        reset()

        // Ana sayfaya döner
        setView('home')
    }


    return (
    <>
    {/* Ana içerik alanı */}
    <main className="container">

        {/* Formun genel düzenini sağlayan alan */}
        <div className="form-layout">

            {/* Form başlığı */}
            <h2 className="form-title">Yeni Ürün Ekle </h2>

            {/* Form gönderildiğinde handleSubmit önce kontrol yapar, sonra onSubmit çalışır */}
            <form onSubmit={handleSubmit(onSubmit)} >

                {/* Ürün adı alanı */}
                <div className="form-group">
                    <label className="form-label">ürün adı</label>

                    <input type="text"
                     className="form-input" 
                     placeholder="örn:kablosuz klavye" 

                     // title inputunu forma kaydeder ve kurallarını belirler
                     {...register('title',{

                        // Boş geçilirse hata verir
                        required: 'ürün adı zorunludur',

                        // En az 3 karakter olmasını ister
                        minLength:{
                            value:3,
                            message:'ürün adı en az 3 karakter olmalıdır'
                        }
                     })}
                     />

                     {/* title alanında hata varsa hata mesajını gösterir */}
                     {errors.title &&(
                        <span className='form-error'>{errors.title.message}</span>
                     )}
                </div>

                {/* Kategori seçme alanı */}
                <div className="form-group">
                    <label className="form-label">kategori</label>

                    <select className="form-select"

                    // category select alanını forma kaydeder
                    {...register('category',{

                        // Kategori seçilmezse hata verir
                        required: 'kategori seçimi zorunludur'
                    })}
                    >
                        {/* Varsayılan boş seçenek */}
                        <option value="">Seçiniz</option>

                        {/* Tümü dışındaki kategorileri option olarak ekler */}
                        {categories.filter(c=>c !== 'Tümü').map(cat=>(
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* category alanında hata varsa hata mesajını gösterir */}
                    {errors.category &&(
                <span className='form-error'>{errors.category.message}</span>
              )}
                </div>

                {/* Görsel URL alanı */}
                <div className="form-group">
                    <label className="form-label">Görsel URL</label>

                    <input 
                    type="text"
                placeholder="https://"
                className="form-input"

                // image inputunu forma kaydeder
                {...register('image',{

                  // Görsel URL boş bırakılırsa hata verir
                  required:'Görsel URL zorunludur.'
                })} />

                {/* image alanında hata varsa hata mesajını gösterir */}
                {errors.image &&(
                <span className='form-error'>{errors.image.message}</span>
              )}
                </div>

                {/* Fiyat alanı */}
                <div className="form-group">
                    <label className="form-label">Fiyat (TL)</label>

                    <input 
                type="number"
                placeholder="Örn: 1450"
                className="form-input"

                // price inputunu forma kaydeder
                {...register('price',{

                  // Fiyat boş bırakılırsa hata verir
                  required:'Fiyat Zorunludur',

                  // Fiyatın en az 1 olmasını ister
                  min:{
                    value:1,
                    message:'Fiyat 0\'dan büyük olmalıdır'
                  }
                })} />

                {/* price alanında hata varsa hata mesajını gösterir */}
                {errors.price &&(
                <span className='form-error'>{errors.price.message}</span>
              )}
                </div>

                {/* Açıklama alanı */}
                <div className="form-group">
                    <label className="form-label">Açıklama</label>

                    <textarea 
                    placeholder="ürün detayları..." 
                    className="form-textarea" 

                    // description textarea alanını forma kaydeder
                    {...register('description',{

                    // Açıklama boş bırakılırsa hata verir
                    required:'Açıklama Zorunludur',

                    // Açıklamanın en az 10 karakter olmasını ister
                    minLength:{
                    value:10,
                    message:'Açıklama en az 10 karakter olmalıdır'
                  }
                })}
                    />

                    {/* description alanında hata varsa hata mesajını gösterir */}
                    {errors.description &&(
                <span className='form-error'>{errors.description.message}</span>
              )}
                </div>

                {/* Formu gönderen buton */}
                <button className="form-submit" type="submit">
                    Ürünü Kaydet
                </button>

              {/* Formu temizleyip ana sayfaya döner */}
              <span className='form-toggle-btn' onClick={()=>{reset();setView('home')}}>Geri Dön</span>
            </form>
        </div>
    </main>


    </>

    )
}