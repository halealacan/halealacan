## Projenin Amacı
# 1. Adım
Bu proje otobüs uçak biletleri arayabilmek ve otobüs ucuz uçak bileti almak için tasarlanmıştır.
projede anasayfa,login,register,filtre sayfası ve detay sayfası olacaktır.

# 2.Adım
Arama barı arkasında bir tatil resmi veya uçak otobüs resmi background image olarak kullanılacak.
Sonrasında şirket hakkımızda kartları, vizyon misyon kartları, altında standard olan
örn: istanbul ankara otobüs, istanbul ankara uçak vb. şeklinde hazır biletler fiyatlarıyla olacak.
Onun altında tüm sayfalara gidebileceğimiz footer alanları olacak.

# 3.Adım
Login ekranında email ve şifre ile giriş yapılacak. Giriş yapınca direkt anasayfaya gönderebiliriz.
Headerda login yazan yer ise kullanıcının adı soyadı olacak.

# 4.Adım
Register ekranında ad soyad, telefon, email, kullanım koşullarını kabul ediyorum checkbox olacak ve KVKK kesinlikle modal olarak açılacak.

# 5.Adım
Filtre sayfasında sol tarafta tarih seçimi değiştirme, otobüs/uçak seçimi değiştirme,
fiyata göre filtreleme, koltuğa göre filtreleme gibi alanlar olacak.
Sağ tarafta ise listeleme yapılacak ve her listelenen biletin detay sayfasına
yönlendirecek buton olacak.

# 6.Adım
Detay sayfasında otobüs için koltuk seçimi yapılacak ve ödeme yap ekranına
yönlendirecek buton olacak. Ödeme sayfasına yönlendirip ödemeniz başarılı ya da
başarısız sayfalarına gönderilecek şekilde bir ödeme simülasyonu yapılacaktır.

# Teknik Gereksinimler

# 1.Adım
kesinlikle react vite,redux tailwind csss kullanılacak kullanılıcak kütüphane sayısı sınırlandırılıcak gereksiz kütüphane eklenmeyecek.her sayfada emojiler ve gereksiz yorum satırları olmayacak.
# 2.Adım
db.json dosyası hazırlanıp static veriler bu dosyada tutulacak olup json-server ile ayaga kaldırılıcak ve tüm sayfalarda bu verileri kullanacagız. ayrıca direkt db.json üzerindeki dosyada güncelleme ekleme silme vb. işlemlerde yapıp sistemi sayfa yenilendiğinde sıfırdan başlama özelliğinden kurtaracağız.
# 3.Adım
