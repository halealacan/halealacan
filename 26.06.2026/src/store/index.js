// Redux Toolkit'ten configureStore fonksiyonunu alıyoruz.
// Store oluşturmak için kullanılır.
import { configureStore } from '@reduxjs/toolkit'

// Her slice'ın reducer'ını içe aktarıyoruz.
// Bunlar uygulamanın farklı bölümlerini yönetiyor.
import authReducer from './authSlice'
import customerReducer from './customerSlice'
import stockReducer from './stockSlice'
import productReducer from './productSlice'
import reportsReducer from './reportsSlice'
import messageReducer from './messageSlice'

// Redux Store oluşturuluyor.
//
// Store = Uygulamanın ortak hafızasıdır.
// Tüm componentler buradaki verilere ulaşabilir.
export const store = configureStore({

  // reducer nesnesi içine bütün slice'ları ekliyoruz.
  reducer: {

    // Kullanıcı giriş işlemleri
    // (login, logout, aktif sayfa vb.)
    auth: authReducer,

    // Müşteri işlemleri
    // (listeleme, ekleme, silme, güncelleme)
    customers: customerReducer,

    // Stok işlemleri
    stock: stockReducer,

    // Ürün işlemleri
    products: productReducer,

    // Rapor işlemleri
    reports: reportsReducer,

    // Mesajlaşma işlemleri
    messaging: messageReducer,
  },
})