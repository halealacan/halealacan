import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCart } from '../hooks/useCart'

export default function Checkout({ setView }) {
  const { cart, cartTotal, clearCart } = useCart()

  const [addresses, setAddresses] = useState([
    { id: 1, title: 'Ev Adresi', name: 'Ahmet Yılmaz', phone: '0555 123 45 67', detail: 'Barbaros Mah. Dereboyu Cad. No:1 Ataşehir / İstanbul' },
    { id: 2, title: 'İş Adresi', name: 'Ahmet Yılmaz - n11', phone: '0212 987 65 43', detail: 'Büyükdere Cad. No:193 Levent / İstanbul' }
  ])

  const [selectedAddressId, setSelectedAddressId] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
  } = useForm()

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    formState: { errors: cardErrors },
    reset: resetCard,
  } = useForm()

  const handleOpenAddAddress = () => {
    setEditingAddress(null)
    resetAddress({
      title: '',
      name: '',
      phone: '',
      detail: ''
    })
    setIsAddressFormOpen(true)
  }

  const handleOpenEditAddress = (addr, e) => {
    e.stopPropagation()
    setEditingAddress(addr)
    resetAddress({
      title: addr.title,
      name: addr.name,
      phone: addr.phone,
      detail: addr.detail
    })
    setIsAddressFormOpen(true)
  }

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation()
    const updated = addresses.filter((a) => a.id !== id)
    setAddresses(updated)
    if (selectedAddressId === id) {
      if (updated.length > 0) {
        setSelectedAddressId(updated[0].id)
      } else {
        setSelectedAddressId(null)
      }
    }
  }

  const handleAddressSubmit = (data) => {
    if (editingAddress) {
      const updated = addresses.map((a) =>
        a.id === editingAddress.id ? { ...a, ...data } : a
      )
      setAddresses(updated)
    } else {
      const newAddr = {
        id: Date.now(),
        ...data
      }
      setAddresses([...addresses, newAddr])
      setSelectedAddressId(newAddr.id)
    }
    setIsAddressFormOpen(false)
    setEditingAddress(null)
    resetAddress()
  }

  const handleCompleteOrder = () => {
    if (!selectedAddressId) {
      alert('Lütfen bir teslimat adresi seçin veya ekleyin!')
      return
    }

    const orderRef = 'N11-ORD-' + Math.floor(100000 + Math.random() * 900000)
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

    setOrderSuccess({
      orderId: orderRef,
      address: selectedAddress,
      total: cartTotal,
      method: paymentMethod === 'card' ? 'Kredi Kartı' : 'Havale / EFT'
    })
    clearCart()
  }

  const onCardSubmit = (data) => {
    handleCompleteOrder()
    resetCard()
  }

  if (orderSuccess) {
    return (
      <main className="tracking-container">
        <div className="tracking-card">
          <h2 className="form-title">Siparişiniz Başarıyla Alındı!</h2>
          <p className="value-desc">Sipariş numaranız ve detaylar aşağıdadır:</p>

          <div className="return-success-box">
            <span className="return-success-code">Sipariş No: {orderSuccess.orderId}</span>
          </div>

          <div className="form-group border-t border-b border-gray-100 py-4 my-2">
            <h4 className="value-title mb-2">Teslimat Adresi:</h4>
            <p className="value-desc font-bold">{orderSuccess.address.title} - {orderSuccess.address.name}</p>
            <p className="value-desc">{orderSuccess.address.detail}</p>
            <p className="value-desc">{orderSuccess.address.phone}</p>
          </div>

          <div className="form-group">
            <p className="value-desc">Ödeme Yöntemi: <span className="font-bold">{orderSuccess.method}</span></p>
            <p className="value-desc">Toplam Tutar: <span className="font-bold">{orderSuccess.total.toLocaleString('tr-TR')} TL</span></p>
            <p className="value-desc text-green-600 font-bold mt-2">Tahmini Teslimat: 3 iş günü içinde</p>
          </div>

          <button className="form-submit mt-4" onClick={() => setView('home')}>
            Alışverişe Devam Et
          </button>
        </div>
      </main>
    )
  }

  const activeAddress = addresses.find((a) => a.id === selectedAddressId)

  return (
    <main className="checkout-layout">
      <div className="checkout-main">
        <div className="tracking-card">
          <h2 className="form-title">Teslimat Adresi</h2>
          <div className="address-grid">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${selectedAddressId === addr.id ? 'address-card-active' : ''}`}
                onClick={() => setSelectedAddressId(addr.id)}
              >
                <h3 className="value-title">{addr.title}</h3>
                <p className="value-desc">{addr.name}</p>
                <p className="value-desc">{addr.phone}</p>
                <p className="value-desc">{addr.detail}</p>
                <div className="address-card-actions">
                  <span className="address-card-btn" onClick={(e) => handleOpenEditAddress(addr, e)}>Düzenle</span>
                  <span className="address-card-btn" onClick={(e) => handleDeleteAddress(addr.id, e)}>Sil</span>
                </div>
              </div>
            ))}

            <div className="address-add-btn" onClick={handleOpenAddAddress}>
              <span>+</span>
              <span className="value-title">Yeni Adres Ekle</span>
            </div>
          </div>
        </div>

        <div className="tracking-card">
          <h2 className="form-title">Ödeme Yöntemi</h2>
          <div className="payment-tabs">
            <span
              className={`payment-tab ${paymentMethod === 'card' ? 'payment-tab-active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              Kredi Kartı
            </span>
            <span
              className={`payment-tab ${paymentMethod === 'bank' ? 'payment-tab-active' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              Havale / EFT
            </span>
          </div>

          {paymentMethod === 'card' ? (
            <form onSubmit={handleSubmitCard(onCardSubmit)}>
              <div className="form-group">
                <label className="form-label">Kart Sahibi</label>
                <input
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  className="form-input"
                  {...registerCard('cardHolder', { required: 'Kart sahibi zorunludur' })}
                />
                {cardErrors.cardHolder && (
                  <span className="form-error">⚠ {cardErrors.cardHolder.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Kart Numarası</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className="form-input"
                  {...registerCard('cardNumber', {
                    required: 'Kart numarası zorunludur',
                    pattern: {
                      value: /^\d{16}$/,
                      message: 'Kart numarası 16 haneli olmalıdır'
                    }
                  })}
                />
                {cardErrors.cardNumber && (
                  <span className="form-error">⚠ {cardErrors.cardNumber.message}</span>
                )}
              </div>

              <div className="address-grid">
                <div className="form-group">
                  <label className="form-label">Son Kullanma Tarihi</label>
                  <input
                    type="text"
                    placeholder="AA / YY"
                    maxLength="5"
                    className="form-input"
                    {...registerCard('expiry', {
                      required: 'Süre zorunludur',
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                        message: 'Geçersiz format (AA/YY)'
                      }
                    })}
                  />
                  {cardErrors.expiry && (
                    <span className="form-error">⚠ {cardErrors.expiry.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">CVC (Güvenlik Kodu)</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="3"
                    className="form-input"
                    {...registerCard('cvc', {
                      required: 'CVC zorunludur',
                      pattern: {
                        value: /^\d{3}$/,
                        message: 'CVC 3 haneli olmalıdır'
                      }
                    })}
                  />
                  {cardErrors.cvc && (
                    <span className="form-error">⚠ {cardErrors.cvc.message}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="hidden" id="submit-card-hidden-btn"></button>
            </form>
          ) : (
            <div className="bank-info-container">
              <div className="bank-card">
                <h4 className="bank-card-title">Türkiye İş Bankası</h4>
                <p className="bank-card-text">Alıcı: n11clone Teknolojik Hizmetler A.Ş.</p>
                <p className="bank-card-text">IBAN: TR98 0006 2000 0000 1234 5678 90</p>
                <p className="bank-card-text text-red-500 font-bold">Açıklama alanına sipariş referans kodunu yazınız.</p>
              </div>

              <div className="bank-card">
                <h4 className="bank-card-title">Akbank</h4>
                <p className="bank-card-text">Alıcı: n11clone Teknolojik Hizmetler A.Ş.</p>
                <p className="bank-card-text">IBAN: TR12 0004 6000 0000 9876 5432 10</p>
                <p className="bank-card-text text-red-500 font-bold">Açıklama alanına sipariş referans kodunu yazınız.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="checkout-sidebar">
        <h3 className="value-title">Sipariş Özeti</h3>

        {cart.map((item) => (
          <div key={item.id} className="checkout-product-row">
            <img
              src={item.image}
              alt={item.title}
              className="checkout-product-img"
            />
            <div>
              <h4 className="checkout-product-title">{item.title}</h4>
              <span className="value-desc">{item.quantity} Adet - {(item.price * item.quantity).toLocaleString('tr-TR')} TL</span>
            </div>
          </div>
        ))}

        <div className="checkout-summary-item">
          <span>Ara Toplam</span>
          <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
        </div>

        <div className="checkout-summary-item">
          <span>Kargo</span>
          <span>Bedava</span>
        </div>

        <div className="checkout-summary-item">
          <span>Toplam</span>
          <span className="cart-summary-total">{cartTotal.toLocaleString('tr-TR')} TL</span>
        </div>

        <button
          className="form-submit"
          onClick={() => {
            if (paymentMethod === 'card') {
              const btn = document.getElementById('submit-card-hidden-btn')
              if (btn) btn.click()
            } else {
              handleCompleteOrder()
            }
          }}
        >
          Siparişi Tamamla
        </button>
      </div>

      {isAddressFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="drawer-close" onClick={() => setIsAddressFormOpen(false)}>&times;</span>
            <h2 className="form-title">{editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h2>
            <form onSubmit={handleSubmitAddress(handleAddressSubmit)}>
              <div className="form-group">
                <label className="form-label">Adres Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: Evim, İş Yerim"
                  className="form-input"
                  {...registerAddress('title', { required: 'Adres başlığı zorunludur' })}
                />
                {addressErrors.title && (
                  <span className="form-error">⚠ {addressErrors.title.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Adı Soyadı</label>
                <input
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  className="form-input"
                  {...registerAddress('name', { required: 'Ad Soyad zorunludur' })}
                />
                {addressErrors.name && (
                  <span className="form-error">⚠ {addressErrors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Telefon Numarası</label>
                <input
                  type="text"
                  placeholder="05..."
                  className="form-input"
                  {...registerAddress('phone', { required: 'Telefon zorunludur' })}
                />
                {addressErrors.phone && (
                  <span className="form-error">⚠ {addressErrors.phone.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Açık Adres</label>
                <textarea
                  placeholder="Mahalle, sokak, no, daire, ilçe, il bilgilerini giriniz..."
                  className="form-textarea"
                  {...registerAddress('detail', { required: 'Açık adres zorunludur' })}
                />
                {addressErrors.detail && (
                  <span className="form-error">⚠ {addressErrors.detail.message}</span>
                )}
              </div>

              <button type="submit" className="form-submit">Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
