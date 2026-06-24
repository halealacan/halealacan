import { createSlice } from "@reduxjs/toolkit";

// State'in başlangıç verileri
const initialState = {
  reportsList: [
    {
      id: 1,
      title: "Ciro_Raporu.pdf",
      size: "2.4MB",
      date: "24.06.2026 16.00",
      url: "#",
    },
    {
      id: 2,
      title: "Stock_Raporu.pdf",
      size: "2.4MB",
      date: "24.06.2026 16.00",
      url: "#",
    },
  ],
};

// Redux Slice oluşturuyoruz
const reportsSlice = createSlice({
  // Slice'ın adı
  name: "reports",

  // Başlangıç state'i
  initialState,

  // State'i değiştiren fonksiyonlar
  reducers: {
    // Yeni rapor oluşturma işlemi
    generateReport: (state, action) => {

      // Componentten gelen verileri payload içinden alıyoruz
      const { type, range, format } = action.payload;

      // Kullanıcı Excel seçerse xlsx, değilse pdf
      const fileExt =
        format === "Excell(.xlsx)"
          ? "xlsx"
          : "pdf";

      // Rapor türünü kısaltıyoruz
      // Örn:
      // "Ciro Raporu" => "CR"
      const titleAbbr = type
        .split(" ") // boşluklardan ayır
        .map((w) => w[0]) // her kelimenin ilk harfi
        .join("") // birleştir
        .toUpperCase(); // büyük harf yap

      // Tarih aralığını düzenliyoruz
      const rangeClean = range.replace(" ", "_");

      // Dosya adını oluşturuyoruz
      // Örn:
      // CR_Raporu_Haziran2026.pdf
      const title =
        `${titleAbbr}_Raporu_${rangeClean}.${fileExt}`;

      // Rastgele dosya boyutu üretiyoruz
      // 1.2 ile 4.2 MB arasında
      const sizeNum =
        (1.2 + Math.random() * 3).toFixed(1);

      const size = `${sizeNum} MB`;

      // Şu anki tarih ve saati alıyoruz
      const dateStr = new Date().toLocaleString(
        "tr-TR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      // Yeni raporun id'sini hesaplıyoruz
      // Listedeki en büyük id'yi bul
      // +1 ekle
      const nextId =
        state.reportsList.length > 0
          ? Math.max(
              ...state.reportsList.map((r) => r.id)
            ) + 1
          : 1;

      // Yeni raporu listenin başına ekliyoruz
      state.reportsList.unshift({
        id: nextId,
        title,
        size,
        date: dateStr,
        url: "#",
      });
    },
  },
});

// Action'ı dışarı açıyoruz
export const { generateReport } =
  reportsSlice.actions;

// Reducer'ı store'a gönderebilmek için export ediyoruz
export default reportsSlice.reducer;