import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Redux Toolkit'in asenkron işlemleri için kullandığı yapı.
// API'den veri çekme veya veri gönderme işlemlerinde kullanılır.


// ==========================
// MESAJLARI GETİR
// ==========================
export const fetchMessages = createAsyncThunk(

  // Action ismi
  'messaging/fetchMessages',

  // Asenkron fonksiyon
  async (_, { rejectWithValue }) => {

    try {

      // db.json dosyasını getir.
      const response = await fetch('/db.json')

      // Eğer istek başarısızsa hata oluştur.
      if (!response.ok)
        throw new Error('Mesaj verileri yüklenemedi.')

      // JSON'a çevir.
      const data = await response.json()

      // contacts ve threads'i Redux'a gönder.
      return {

        contacts: data.contacts,

        threads: data.threads

      }

    } catch (error) {

      // Hata olursa rejected çalışacak.
      return rejectWithValue(error.message)

    }
  }
)


// ==========================
// YENİ MESAJ GÖNDER
// ==========================
export const sendMessageAsync = createAsyncThunk(

  'messaging/sendMessageAsync',

  async (messageText, { getState, rejectWithValue }) => {

    try {

      // API bekleme süresi
      await new Promise((resolve) => setTimeout(resolve, 350))

      // Redux Store'un tamamını al.
      const state = getState()

      // Şu anda konuşulan kişinin id'sini al.
      const activeId = state.messaging.activeContactId

      // Şimdiki saati oluştur.
      const timeStr = new Date().toLocaleTimeString('tr-TR', {

        hour: '2-digit',

        minute: '2-digit'

      })

      // Yeni mesaj oluştur.
      return {

        // Mesaj hangi kişiye ait?
        contactId: activeId,

        // Mesaj bilgisi
        message: {

          // Benzersiz id
          id: Date.now(),

          // Gönderen ben olduğum için "me"
          sender: 'me',

          // Yazdığım mesaj
          content: messageText,

          // Gönderilme saati
          time: timeStr

        }

      }

    } catch (error) {

      return rejectWithValue(error.message)

    }
  }
)


// ==========================
// BAŞLANGIÇ STATE'İ
// ==========================
const initialState = {

  // Sol taraftaki kişi listesi
  contacts: [],

  // İlk açılan kişi
  activeContactId: 'AY',

  // Tüm konuşmalar
  threads: {},

  // Veri çekme durumu
  status: 'idle',

  // Hata mesajı
  error: null,

  // Mesaj gönderme durumu
  actionStatus: 'idle',
}


// ==========================
// SLICE
// ==========================
const messageSlice = createSlice({

  name: 'messaging',

  initialState,

  reducers: {

    // Sol tarafta başka kişiye tıklayınca çalışır.
    setActiveContact: (state, action) => {

      // Seçilen kişinin id'sini değiştir.
      state.activeContactId = action.payload

    }
  },


  // Async işlemler burada yakalanır.
  extraReducers: (builder) => {

    builder

      // ======================
      // MESAJLARI GETİR
      // ======================

      // API çalışıyor.
      .addCase(fetchMessages.pending, (state) => {

        state.status = 'loading'

      })

      // API başarılı.
      .addCase(fetchMessages.fulfilled, (state, action) => {

        state.status = 'succeeded'

        // Kişileri kaydet.
        state.contacts = action.payload.contacts

        // Konuşmaları kaydet.
        state.threads = action.payload.threads

      })

      // API başarısız.
      .addCase(fetchMessages.rejected, (state, action) => {

        state.status = 'failed'

        state.error = action.payload

      })


      // ======================
      // MESAJ GÖNDER
      // ======================

      // Gönderiliyor...
      .addCase(sendMessageAsync.pending, (state) => {

        state.actionStatus = 'loading'

      })

      // Mesaj başarıyla gönderildi.
      .addCase(sendMessageAsync.fulfilled, (state, action) => {

        state.actionStatus = 'succeeded'

        // Gelen bilgileri ayır.
        const { contactId, message } = action.payload

        // Eğer bu kişiyle daha önce konuşma yoksa
        // boş bir dizi oluştur.
        if (!state.threads[contactId]) {

          state.threads[contactId] = []

        }

        // Yeni mesajı konuşmanın sonuna ekle.
        state.threads[contactId].push(message)

      })

      // Hata oluştu.
      .addCase(sendMessageAsync.rejected, (state) => {

        state.actionStatus = 'failed'

      })
  }
})


// Reducer actionlarını dışarı aç.
export const { setActiveContact } = messageSlice.actions


// Store'a eklenecek reducer.
export default messageSlice.reducer