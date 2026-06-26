import { createSlice } from "@reduxjs/toolkit";

// Redux'ta tutulacak ilk (başlangıç) durum.
// Uygulama ilk açıldığında state'in değeri bu olacaktır.
const initialState = {
  user: null,          // Giriş yapan kullanıcı bilgisi. Başta kimse giriş yapmadığı için null.
  isAuth: false,       // Kullanıcı giriş yaptı mı? Başlangıçta hayır.
  activeTab: "login",  // İlk açılan ekran login sayfası.
};

// Auth (Kimlik Doğrulama) ile ilgili slice oluşturuyoruz.
const authSlice = createSlice({
  name: "auth", // Slice'ın adı. Redux action isimlerinde kullanılır.

  initialState, // Başlangıç state'ini buraya veriyoruz.

  reducers: {
    // ==========================
    // LOGIN
    // ==========================
    login: (state, action) => {

      // Kullanıcı giriş yaptığı için true yapıyoruz.
      state.isAuth = true;

      // Kullanıcının bilgilerini state içine kaydediyoruz.
      state.user = {
        name: "Selahaddin Ç.",

        // action.payload dispatch sırasında gönderilen bilgidir.
        // Örneğin:
        // dispatch(login("Admin"))
        //
        // role => "Admin" olur.
        //
        // dispatch(login("Muhasebe"))
        //
        // role => "Muhasebe" olur.
        role: action.payload,
      };

      // Giriş başarılı olunca kullanıcı dashboard sayfasına yönlendiriliyor.
      state.activeTab = "dashboard";
    },

    // ==========================
    // LOGOUT
    // ==========================
    logout: (state) => {

      // Kullanıcı çıkış yaptı.
      state.isAuth = false;

      // Kullanıcı bilgilerini siliyoruz.
      state.user = null;

      // Tekrar login ekranına dönüyoruz.
      state.activeTab = "login";
    },

    // ==========================
    // TAB DEĞİŞTİRME
    // ==========================
    setActiveTab: (state, action) => {

      // Hangi sekmeye geçilecekse payload'dan alıyoruz.
      //
      // dispatch(setActiveTab("customers"))
      //
      // activeTab = "customers"
      //
      // dispatch(setActiveTab("reports"))
      //
      // activeTab = "reports"
      state.activeTab = action.payload;
    },
  },
});

// Reducers içinde yazdığımız fonksiyonların action creator'larını dışarı aktarıyoruz.
//
// Artık istediğimiz component içinde:
//
// dispatch(login("Admin"))
// dispatch(logout())
// dispatch(setActiveTab("customers"))
//
// şeklinde kullanabiliriz.
export const { login, logout, setActiveTab } = authSlice.actions;

// Slice'ın reducer'ını dışarı aktarıyoruz.
//
// store.js içerisinde:
//
// reducer:{
//    auth: authReducer
// }
//
// şeklinde eklenir.
export default authSlice.reducer;