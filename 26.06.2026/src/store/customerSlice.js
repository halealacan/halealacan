import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Redux Toolkit'in asenkron (API) işlemleri için kullandığı yapı.
// createAsyncThunk => API isteği yap, bekle, sonucu Redux'a gönder.


// ==========================
// MÜŞTERİLERİ GETİR
// ==========================
export const fetchCustomers = createAsyncThunk(

  // Action'ın ismi
  'customers/fetchCustomers',

  // Asenkron fonksiyon
  async (_, { rejectWithValue }) => {
    try {

      // db.json dosyasını getir.
      const response = await fetch('/db.json')

      // Eğer istek başarısız olursa hata fırlat.
      if (!response.ok)
        throw new Error('Müşteri verileri yüklenemedi.')

      // JSON'a çevir.
      const data = await response.json()

      // customers dizisini Redux'a gönder.
      return data.customers

    } catch (error) {

      // Hata olursa rejected action çalışacak.
      return rejectWithValue(error.message)
    }
  }
)


// ==========================
// YENİ MÜŞTERİ EKLE
// ==========================
export const addCustomerAsync = createAsyncThunk(

  'customers/addCustomerAsync',

  async (customerData, { rejectWithValue }) => {

    try {

      // Gerçek API yok.
      // 600ms bekleyerek API varmış gibi davranıyoruz.
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Yeni müşteri oluşturuyoruz.
      return {

        // Benzersiz id
        id: Date.now(),

        // İlk bakiye
        balance: 0,

        // Formdan gelen bilgiler
        ...customerData
      }

    } catch (error) {

      return rejectWithValue(error.message)

    }
  }
)


// ==========================
// MÜŞTERİ GÜNCELLE
// ==========================
export const editCustomerAsync = createAsyncThunk(

  'customers/editCustomerAsync',

  async (customerData, { rejectWithValue }) => {

    try {

      // API bekleme süresi
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Güncellenmiş müşteriyi geri gönder.
      return customerData

    } catch (error) {

      return rejectWithValue(error.message)

    }
  }
)


// ==========================
// MÜŞTERİ SİL
// ==========================
export const deleteCustomerAsync = createAsyncThunk(

  'customers/deleteCustomerAsync',

  async (customerId, { rejectWithValue }) => {

    try {

      // API bekleme süresi
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Silinecek id'yi geri gönder.
      return customerId

    } catch (error) {

      return rejectWithValue(error.message)

    }
  }
)


// ==========================
// BAŞLANGIÇ STATE'İ
// ==========================
const initialState = {

  // Müşteri listesi
  list: [],

  // Düzenlenecek müşteri
  selectedCustomer: null,

  // Veri çekme durumu
  //
  // idle
  // loading
  // succeeded
  // failed
  status: 'idle',

  // Hata mesajı
  error: null,

  // Ekleme-Silme-Güncelleme durumu
  actionStatus: 'idle',
}


// ==========================
// SLICE
// ==========================
const customerSlice = createSlice({

  name: 'customers',

  initialState,

  reducers: {

    // Düzenlemek için müşteri seç.
    selectCustomerForEdit: (state, action) => {

      state.selectedCustomer = action.payload

    },

    // Düzenleme bittiyse seçimi temizle.
    clearSelectedCustomer: (state) => {

      state.selectedCustomer = null

    },
  },



  // createAsyncThunk burada yakalanır.
  extraReducers: (builder) => {

    builder

      // ======================
      // FETCH
      // ======================

      // API çalışıyor.
      .addCase(fetchCustomers.pending, (state) => {

        state.status = 'loading'

      })

      // API başarılı.
      .addCase(fetchCustomers.fulfilled, (state, action) => {

        state.status = 'succeeded'

        // Gelen müşterileri listeye aktar.
        state.list = action.payload

      })

      // API başarısız.
      .addCase(fetchCustomers.rejected, (state, action) => {

        state.status = 'failed'

        state.error = action.payload

      })



      // ======================
      // ADD
      // ======================

      .addCase(addCustomerAsync.pending, (state) => {

        state.actionStatus = 'loading'

      })

      .addCase(addCustomerAsync.fulfilled, (state, action) => {

        state.actionStatus = 'succeeded'

        // Yeni müşteri listenin başına ekleniyor.
        state.list.unshift(action.payload)

      })

      .addCase(addCustomerAsync.rejected, (state) => {

        state.actionStatus = 'failed'

      })



      // ======================
      // EDIT
      // ======================

      .addCase(editCustomerAsync.pending, (state) => {

        state.actionStatus = 'loading'

      })

      .addCase(editCustomerAsync.fulfilled, (state, action) => {

        state.actionStatus = 'succeeded'

        // Güncellenecek müşteriyi bul.
        const index = state.list.findIndex(
          c => c.id === action.payload.id
        )

        // Bulunduysa bilgileri güncelle.
        if (index !== -1) {

          state.list[index] = {

            ...state.list[index],

            ...action.payload

          }

        }

        // Düzenleme tamamlandı.
        state.selectedCustomer = null

      })

      .addCase(editCustomerAsync.rejected, (state) => {

        state.actionStatus = 'failed'

      })



      // ======================
      // DELETE
      // ======================

      .addCase(deleteCustomerAsync.pending, (state) => {

        state.actionStatus = 'loading'

      })

      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {

        state.actionStatus = 'succeeded'

        // Gelen id'ye sahip müşteriyi sil.
        state.list = state.list.filter(

          c => c.id !== action.payload

        )

      })

      .addCase(deleteCustomerAsync.rejected, (state) => {

        state.actionStatus = 'failed'

      })

  }
})


// Reducers'ı dışarı açıyoruz.
export const {
  selectCustomerForEdit,
  clearSelectedCustomer
} = customerSlice.actions


// Store'a eklenecek reducer.
export default customerSlice.reducer