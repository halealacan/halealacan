import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import api from '../../services/api';
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '../../redux/cartSlice';

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab control when no restaurant is selected: 'restaurants' or 'orders'
  const [userTab, setUserTab] = useState('restaurants');
  const [userOrders, setUserOrders] = useState([]);

  // Local state for feedback alerts
  const [cartAlert, setCartAlert] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Credit Card Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false); // Controls rotation on CVC focus
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Info Modal State for Footer Links
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Select cart state from Redux
  const { items: cartItems, restaurantId: cartRestaurantId, restaurantName: cartRestaurantName } = useSelector((state) => state.cart);

  // Categories list matching actual Yemeksepeti filters
  const categories = [
    { id: 'All', name: 'Tümü', icon: 'bi-grid-fill' },
    { id: 'Burger', name: 'Burger', icon: 'bi-ticket-detailed-fill' },
    { id: 'Pizza', name: 'Pizza', icon: 'bi-disc-fill' },
    { id: 'Döner', name: 'Döner / Kebap', icon: 'bi-funnel-fill' },
    { id: 'Tatlı', name: 'Tatlı', icon: 'bi-egg-fried' }
  ];

  // Fetch restaurants and customer orders on load
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [restaurantsData, allOrders] = await Promise.all([
        api.getRestaurants(),
        api.getOrders()
      ]);
      
      setRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
      
      // Filter orders belonging to current customer
      const myOrders = allOrders.filter(o => o.customerName === user?.username);
      setUserOrders(myOrders);
    } catch (err) {
      setError(err.message || 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  // Fetch updated orders list
  const fetchUpdatedOrders = async () => {
    try {
      const allOrders = await api.getOrders();
      const myOrders = allOrders.filter(o => o.customerName === user?.username);
      setUserOrders(myOrders);
    } catch (err) {
      console.error('Sipariş listesi güncellenirken hata oluştu:', err);
    }
  };

  // Poll orders status updates in the background every 5 seconds to show state changes
  useEffect(() => {
    let intervalId;
    if (user && userTab === 'orders' && !selectedRestaurant) {
      intervalId = setInterval(() => {
        fetchUpdatedOrders();
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, userTab, selectedRestaurant]);

  // Filter restaurants based on search and category
  useEffect(() => {
    let result = restaurants;

    // Search query filter
    if (searchText) {
      result = result.filter((r) =>
        r.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category bubble filter
    if (selectedCategory !== 'All') {
      result = result.filter((r) =>
        r.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredRestaurants(result);
  }, [searchText, selectedCategory, restaurants]);

  // Load menu items (foods) when a restaurant is clicked
  const handleSelectRestaurant = async (restaurant) => {
    try {
      setLoading(true);
      setError(null);
      const menuData = await api.getFoodsByRestaurantId(restaurant.id);
      setMenuItems(menuData);
      setSelectedRestaurant(restaurant);
      setCheckoutSuccess(false);
    } catch (err) {
      setError(err.message || 'Menü yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setMenuItems([]);
    setCheckoutSuccess(false);
    setUserTab('restaurants');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Add item to cart with restaurant check feedback
  const handleAddToCart = (food) => {
    if (cartRestaurantId && Number(cartRestaurantId) !== Number(selectedRestaurant.id)) {
      // Auto-clear notice
      setCartAlert(`Sepetinizdeki '${cartRestaurantName}' restoranına ait ürünler temizlendi ve yeni ürünler eklendi.`);
      setTimeout(() => setCartAlert(null), 5000);
    }
    
    dispatch(addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name
    }));
  };

  // Open Payment modal
  const handleOpenPayment = () => {
    setPaymentForm({ cardName: '', cardNumber: '', cardExpiry: '', cardCVC: '' });
    setPaymentError('');
    setIsCardFlipped(false);
    setIsPaymentModalOpen(true);
  };

  const handleClosePayment = () => {
    setIsPaymentModalOpen(false);
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setPaymentForm({ ...paymentForm, cardNumber: formatted });
  };

  // Format Card Expiry (adds slash e.g. MM/YY)
  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.length > 4) value = value.slice(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setPaymentForm({ ...paymentForm, cardExpiry: formatted });
  };

  // Handle order and payment post to JSON Server
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    const { cardName, cardNumber, cardExpiry, cardCVC } = paymentForm;

    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
      setPaymentError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setPaymentError('Kart numarası 16 haneli olmalıdır.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError('Geçersiz son kullanma tarihi. Format AA/YY şeklinde olmalıdır.');
      return;
    }

    if (cardCVC.length !== 3) {
      setPaymentError('Güvenlik kodu (CVC) 3 haneli olmalıdır.');
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentError('');

      // Formulate database order item
      const orderData = {
        restaurantId: Number(selectedRestaurant.id),
        restaurantName: selectedRestaurant.name,
        customerName: user.username,
        items: cartItems.map((item) => `${item.quantity}x ${item.name}`).join(', '),
        total: cartTotal,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Hazırlanıyor',
      };

      // POST to JSON Server `/orders` endpoint via Axios
      await api.addOrder(orderData);

      // Reset application checkout states
      dispatch(clearCart());
      setIsPaymentModalOpen(false);
      setCheckoutSuccess(true);
      
      // Instantly load orders to userOrders state
      await fetchUpdatedOrders();
      
      // Auto redirect to orders tab
      setSelectedRestaurant(null);
      setUserTab('orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setPaymentError('Ödeme/Sipariş oluşturma işlemi başarısız oldu.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Interactive Footer Links Click Handler
  const handleOpenInfo = (topic) => {
    setInfoModalTitle(topic);
    let content = null;
    
    switch (topic) {
      case 'Hakkımızda':
        content = (
          <div>
            <p><strong>Yemeksepeti</strong>, 2001 yılında kurulmuş ve Türkiye'de online yemek siparişi sektörünün öncüsü olmuştur. Bugün 81 ilde binlerce üye restoranı ve milyonlarca kullanıcısıyla Türkiye'nin en büyük yemek siparişi portalıdır.</p>
            <p>Amacımız, kullanıcılarımıza en hızlı, en pratik ve en kaliteli yemek siparişi deneyimini yaşatmaktır. Yenilikçi teknolojilerimiz ve kullanıcı odaklı hizmet anlayışımızla her geçen gün büyümeye ve gelişmeye devam ediyoruz.</p>
          </div>
        );
        break;
      case 'Sıkça Sorulan Sorular':
        content = (
          <div>
            <ol className="ps-3 d-flex flex-column gap-3 text-dark small">
              <li>
                <strong>Nasıl sipariş verebilirim?</strong>
                <p className="text-muted mb-0">Restoran seçin, ürünlerinizi sepete ekleyin, "Siparişi Onayla" butonuna basarak ödeme bilgilerinizi girip siparişinizi oluşturun.</p>
              </li>
              <li>
                <strong>Siparişimi nasıl iptal edebilirim?</strong>
                <p className="text-muted mb-0">Siparişinizi restoran hazırlamaya başlamadan önce destek hattımızla iletişime geçerek iptal edebilirsiniz.</p>
              </li>
              <li>
                <strong>Ödeme yöntemleri nelerdir?</strong>
                <p className="text-muted mb-0">Sistemimizde şu an sadece Kredi/Banka Kartı ile online ödeme yöntemi geçerlidir.</p>
              </li>
            </ol>
          </div>
        );
        break;
      case 'Yardım & Destek':
        content = (
          <div>
            <p>Herhangi bir sorun yaşamanız durumunda 7/24 hizmet veren müşteri destek ekibimizle iletişime geçebilirsiniz.</p>
            <ul className="list-group list-group-flush text-dark small">
              <li className="list-group-item px-0"><i className="bi bi-telephone-fill text-danger me-2"></i> <strong>Çağrı Merkezi:</strong> 444 5 444</li>
              <li className="list-group-item px-0"><i className="bi bi-chat-dots-fill text-danger me-2"></i> <strong>Canlı Destek:</strong> Web arayüzümüz üzerinden canlı sohbete bağlanabilirsiniz.</li>
              <li className="list-group-item px-0"><i className="bi bi-clock-fill text-danger me-2"></i> <strong>Çalışma Saatleri:</strong> Haftanın her günü 24 saat kesintisiz hizmet vermekteyiz.</li>
            </ul>
          </div>
        );
        break;
      case 'İletişim':
        content = (
          <div>
            <p>Yemeksepeti Merkez Ofis iletişim bilgileri:</p>
            <ul className="list-group list-group-flush text-dark small">
              <li className="list-group-item px-0"><i className="bi bi-geo-alt-fill text-danger me-2"></i> <strong>Adres:</strong> Yemeksepeti Park, Maslak, İstanbul</li>
              <li className="list-group-item px-0"><i className="bi bi-envelope-fill text-danger me-2"></i> <strong>E-posta:</strong> info@yemeksepeti.com</li>
              <li className="list-group-item px-0"><i className="bi bi-telephone-fill text-danger me-2"></i> <strong>Telefon:</strong> (0212) 359 59 00</li>
            </ul>
          </div>
        );
        break;
      case 'Restoran Kaydı':
        content = (
          <div>
            <p>Restoranınızı Yemeksepeti bünyesine dahil ederek satışlarınızı katlayabilirsiniz.</p>
            <p className="fw-bold mb-1">Başvuru Koşulları:</p>
            <ul className="ps-3 small text-muted">
              <li>Vergi levhası ve resmi şirket evrakları.</li>
              <li>Menü ve fiyat listesi.</li>
              <li>Paket servis hizmet kapasitesi.</li>
            </ul>
            <p className="mb-0">Hemen iş ortağımız olmak için <strong className="text-danger">partner.yemeksepeti.com</strong> adresinden başvuru formunu doldurun, ekibimiz 24 saat içinde sizinle iletişime geçsin.</p>
          </div>
        );
        break;
      case 'Mağaza Portal Girişi':
        content = (
          <div>
            <p>Mağaza sahipleri için partner yönetim paneli giriş arayüzü.</p>
            <p>Restoranınızın yemeklerini eklemek, fiyatları düzenlemek ve gelen siparişleri takip etmek için bu portalı kullanabilirsiniz.</p>
            <button 
              onClick={() => { setIsInfoModalOpen(false); handleLogout(); }} 
              className="btn btn-warning fw-bold text-dark mt-2 w-100 py-2.5 rounded-pill"
            >
              Giriş Ekranına Git (Oturumu Kapat)
            </button>
          </div>
        );
        break;
      case 'Gizlilik Sözleşmesi':
        content = (
          <div>
            <p>Yemeksepeti olarak kişisel verilerinizin korunmasına büyük önem veriyoruz. KVKK kapsamında verileriniz:</p>
            <ul className="ps-3 small text-muted">
              <li>Siparişlerinizin teslimatı için ilgili restoranla paylaşılır.</li>
              <li>Güvenliğiniz için gelişmiş şifreleme yöntemleriyle sunucularımızda saklanır.</li>
              <li>Asla üçüncü şahıslarla reklam veya pazarlama amacıyla paylaşılmaz.</li>
            </ul>
            <p className="mb-0">Kişisel verilerinizin silinmesini veya güncellenmesini talep etmek için dilediğiniz zaman destek ekibimizle iletişime geçebilirsiniz.</p>
          </div>
        );
        break;
      case 'Kullanım Koşulları':
        content = (
          <div>
            <p>Sistemimizi kullanan tüm üyelerimiz aşağıdaki kuralları kabul etmiş sayılır:</p>
            <ul className="ps-3 small text-muted">
              <li>Kullanıcılar sipariş verirken doğru adres, isim ve telefon bilgisi girmekle yükümlüdür.</li>
              <li>Hazırlık aşamasına geçen siparişlerin iptali veya iadesi yapılamaz.</li>
              <li>Kapıda veya online ödemelerde kart sahibinin rızası olmalıdır.</li>
            </ul>
          </div>
        );
        break;
      default:
        content = <p>Detaylı bilgi için destek ekibimizle iletişime geçin.</p>;
    }
    
    setInfoModalContent(content);
    setIsInfoModalOpen(true);
  };

  const totalCartItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const deliveryFee = 25;
  const cartTotal = cartSubtotal + deliveryFee;

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Self-contained Premium Credit Card Styles */}
      <style>{`
        /* Glassmorphism Credit Card Container */
        .payment-card-wrapper {
          width: 100%;
          max-width: 360px;
          height: 210px;
          margin: 0 auto 24px;
          perspective: 1000px;
        }

        .payment-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }

        .payment-card-wrapper.flipped .payment-card-inner {
          transform: rotateY(180deg);
        }

        .payment-card-front,
        .payment-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          color: white;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-sizing: border-box;
        }

        .payment-card-front {
          background: linear-gradient(135deg, #1b1b1b 0%, #373737 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 22px;
        }

        .payment-card-back {
          background: linear-gradient(135deg, #2b2b2b 0%, #151515 100%);
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
        }

        .card-stripe {
          background-color: #000;
          height: 45px;
          width: 100%;
          margin-top: 24px;
        }

        .card-signature-cvc {
          padding: 0 22px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .card-signature-bar {
          background: repeating-linear-gradient(45deg, #e5e5ea, #e5e5ea 8px, #d1d1d6 8px, #d1d1d6 16px);
          height: 38px;
          width: 75%;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          color: #1c1c1e;
          font-family: monospace;
          font-weight: bold;
          font-size: 16px;
        }
      `}</style>

      {/* Navbar - Yemeksepeti Red Theme with Cart Counter Badge */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm py-3 px-4 sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={handleBackToRestaurants}>
            <i className="bi bi-egg-fried fs-3 text-white"></i>
            <span className="navbar-brand mb-0 h1 fw-bold text-white fs-4">
              yemeksepeti
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Cart Quick Info Badge */}
            {totalCartItems > 0 && (
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold d-flex align-items-center gap-1.5 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => { setSelectedRestaurant(restaurants.find(r => r.id === Number(cartRestaurantId)) || null); setUserTab('restaurants'); }}>
                <i className="bi bi-cart-fill"></i>
                <span>{totalCartItems} Ürün</span>
                <span className="bg-dark bg-opacity-10 px-1.5 py-0.5 rounded text-dark ms-1">{cartSubtotal} TL</span>
              </span>
            )}
            
            <span className="text-white bg-dark bg-opacity-25 px-3 py-1.5 rounded-pill small fw-semibold d-none d-sm-inline">
              <i className="bi bi-person-circle me-1"></i> {user?.username}
            </span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-right me-1"></i> Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-grow-1">
        {/* If no restaurant is selected: Show Restaurant Discovery Dashboard OR My Orders List */}
        {!selectedRestaurant ? (
          <>
            {/* Red Hero Search Banner */}
            <div className="bg-danger text-white py-5 px-4 mb-4 text-center shadow-sm position-relative overflow-hidden" 
                 style={{ background: 'linear-gradient(135deg, #ea004b 0%, #c2003c 100%)' }}>
              <div className="container py-3 position-relative z-1">
                <h1 className="display-6 fw-bold mb-2">Aklındaysa Kapında!</h1>
                <p className="text-white-50 mb-4 fs-5">Binlerce restorandan dilediğin yemeği hemen sipariş et.</p>
                
                {/* Search Bar */}
                {userTab === 'restaurants' && (
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                      <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                        <span className="input-group-text bg-white border-0 text-muted">
                          <i className="bi bi-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-0 ps-0 fs-6 focus-ring-none"
                          placeholder="Restoran veya mutfak ara..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TAB SELECTOR: Restoranlar / Siparişlerim */}
            <div className="container mb-4">
              <div className="card border-0 shadow-sm rounded-pill bg-white p-2 d-inline-flex mx-auto d-flex flex-row gap-2" style={{ maxWidth: '400px' }}>
                <button
                  onClick={() => { setUserTab('restaurants'); setCheckoutSuccess(false); }}
                  className={`btn rounded-pill px-4 py-2 fw-bold border-0 flex-grow-1 ${
                    userTab === 'restaurants' ? 'btn-danger text-white' : 'btn-light text-secondary'
                  }`}
                >
                  <i className="bi bi-shop me-2"></i> Restoranlar
                </button>
                <button
                  onClick={() => { setUserTab('orders'); setCheckoutSuccess(false); fetchUpdatedOrders(); }}
                  className={`btn rounded-pill px-4 py-2 fw-bold border-0 flex-grow-1 ${
                    userTab === 'orders' ? 'btn-danger text-white' : 'btn-light text-secondary'
                  }`}
                >
                  <i className="bi bi-receipt me-2"></i> Siparişlerim ({userOrders.length})
                </button>
              </div>
            </div>

            <div className="container pb-5">
              {checkoutSuccess && (
                <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>Siparişiniz Başarıyla Alındı!</strong> Ödemeniz onaylandı. Siparişlerinizi bu ekrandan anlık takip edebilirsiniz.
                  <button type="button" className="btn-close" onClick={() => setCheckoutSuccess(false)} aria-label="Kapat"></button>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
              )}

              {/* RENDER VIEW 1: RESTAURANTS TAB */}
              {userTab === 'restaurants' && (
                <>
                  {/* Category Bubbles Navigation */}
                  <div className="mb-4 overflow-auto py-2">
                    <div className="d-flex gap-2 justify-content-start">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`btn rounded-pill px-4 py-2.5 fw-semibold d-flex align-items-center gap-2 border-0 shadow-sm text-nowrap ${
                            selectedCategory === cat.id
                              ? 'btn-danger text-white'
                              : 'btn-white bg-white text-secondary'
                          }`}
                        >
                          <i className={`bi ${cat.icon}`}></i>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <h2 className="h4 fw-bold text-dark mb-4">
                    {selectedCategory === 'All' ? 'Tüm Restoranlar' : `${selectedCategory} Restoranları`}
                  </h2>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-danger" role="status"></div>
                      <div className="text-muted mt-2">Restoranlar Yükleniyor...</div>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {filteredRestaurants.map((res) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={res.id}>
                          <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover transition-all">
                            <div className="bg-secondary bg-opacity-10 py-5 text-center text-muted position-relative">
                              <i className="bi bi-shop display-4 text-secondary opacity-50"></i>
                              <span className="position-absolute bottom-0 start-0 m-3 badge bg-danger text-white rounded-pill fw-semibold small">
                                {res.category}
                              </span>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h3 className="h5 card-title fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '80%' }}>
                                  {res.name}
                                </h3>
                                <span className="badge bg-warning text-dark d-flex align-items-center gap-1 font-monospace">
                                  <i className="bi bi-star-fill text-dark small"></i> {res.rating}
                                </span>
                              </div>
                              <p className="card-text text-muted small mb-4 flex-grow-1">
                                <i className="bi bi-geo-alt me-1"></i> {res.address}
                              </p>
                              <button
                                onClick={() => handleSelectRestaurant(res)}
                                className="btn btn-danger w-100 rounded-3 py-2 fw-semibold"
                              >
                                Menüyü Gör <i className="bi bi-chevron-right ms-1 small"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredRestaurants.length === 0 && (
                        <div className="col-12 text-center py-5 text-muted">
                          <i className="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                          Aramanıza veya seçtiğiniz kategoriye uygun restoran bulunamadı.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* RENDER VIEW 2: MY ORDERS HISTORY TAB */}
              {userTab === 'orders' && (
                <div>
                  <h2 className="h4 fw-bold text-dark mb-4">Sipariş Geçmişim</h2>
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-danger" role="status"></div>
                      <div className="text-muted mt-2">Sipariş Geçmişi Yükleniyor...</div>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {userOrders.map((order) => {
                        let badgeClass = 'bg-warning text-dark';
                        let badgeIcon = 'bi-clock-history';
                        
                        if (order.status === 'Yolda') {
                          badgeClass = 'bg-info text-dark';
                          badgeIcon = 'bi-truck';
                        } else if (order.status === 'Teslim Edildi') {
                          badgeClass = 'bg-success text-white';
                          badgeIcon = 'bi-check2-circle';
                        }
                        
                        return (
                          <div className="col-12" key={order.id}>
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
                              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom pb-3 mb-3">
                                <div>
                                  <span className="small text-muted d-block">Sipariş Numarası</span>
                                  <strong className="text-dark fs-6">#{order.id}</strong>
                                </div>
                                <div>
                                  <span className="small text-muted d-block">Sipariş Tarihi</span>
                                  <span className="text-dark small">{order.date}</span>
                                </div>
                                <div>
                                  <span className="small text-muted d-block">Restoran</span>
                                  <strong className="text-danger">{order.restaurantName}</strong>
                                </div>
                                <div>
                                  <span className="small text-muted d-block text-end">Toplam Tutar</span>
                                  <strong className="text-dark fs-5">{order.total} TL</strong>
                                </div>
                                <div>
                                  <span className={`badge ${badgeClass} px-3 py-2 rounded-pill fw-bold d-flex align-items-center gap-1.5`}>
                                    <i className={`bi ${badgeIcon}`}></i>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="small text-muted d-block mb-1">Satın Alınan Ürünler</span>
                                <p className="text-dark mb-0 fw-semibold fs-6">{order.items}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {userOrders.length === 0 && (
                        <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm">
                          <i className="bi bi-receipt fs-1 d-block mb-3 opacity-35 text-secondary"></i>
                          Henüz hiçbir sipariş vermediniz.
                          <button onClick={() => setUserTab('restaurants')} className="btn btn-danger btn-sm rounded-pill px-4 py-2 mt-3 d-block mx-auto fw-bold shadow-sm">
                            Hemen Alışverişe Başla
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Restaurant Menu & Cart Sidebar Display View */
          <div className="container py-4">
            {/* Back Button */}
            <button
              onClick={handleBackToRestaurants}
              className="btn btn-link text-danger fw-semibold p-0 mb-4 text-decoration-none d-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left"></i> Restoranlara Dön
            </button>

            {cartAlert && (
              <div className="alert alert-warning alert-dismissible fade show shadow-sm mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {cartAlert}
                <button type="button" className="btn-close" onClick={() => setCartAlert(null)} aria-label="Kapat"></button>
              </div>
            )}

            {/* Restaurant Detail Banner Card */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
              <div className="card-body p-4 p-md-5 d-flex flex-wrap align-items-center gap-4">
                <div className="bg-danger text-white p-4 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                  <i className="bi bi-shop fs-1"></i>
                </div>
                <div>
                  <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill mb-2 fw-bold text-uppercase small">
                    {selectedRestaurant.category}
                  </span>
                  <h1 className="h2 fw-bold text-dark mb-1">{selectedRestaurant.name}</h1>
                  <div className="d-flex align-items-center gap-3 small text-muted">
                    <span>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <strong className="text-dark">{selectedRestaurant.rating}</strong> / 5.0
                    </span>
                    <span>|</span>
                    <span>
                      <i className="bi bi-geo-alt-fill me-1"></i> {selectedRestaurant.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu and Cart Dual-Column Layout */}
            <div className="row g-4 mb-5">
              {/* Menu Column */}
              <div className="col-12 col-lg-8">
                <h2 className="h4 fw-bold text-dark mb-4">Menü / Yemekler</h2>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                    <div className="text-muted mt-2">Menü Yükleniyor...</div>
                  </div>
                ) : (
                  <div className="row g-4">
                    {menuItems.map((food) => (
                      <div className="col-12 col-md-6" key={food.id}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-row p-3 gap-3 align-items-center card-hover transition-all bg-white">
                          <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', minWidth: '100px' }}>
                            <i className="bi bi-egg-fried fs-1 text-danger opacity-25"></i>
                          </div>
                          
                          <div className="d-flex flex-column flex-grow-1 min-width-0">
                            <h3 className="h6 fw-bold text-dark mb-1 text-truncate">{food.name}</h3>
                            <p className="text-muted small mb-2 text-wrap-2-lines flex-grow-1" style={{ height: '38px', overflow: 'hidden' }}>
                              {food.description}
                            </p>
                            <div className="d-flex align-items-center justify-content-between mt-auto">
                              <span className="fw-bold text-danger fs-5">{food.price} TL</span>
                              <button
                                onClick={() => handleAddToCart(food)}
                                className="btn btn-danger btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1 shadow-sm"
                              >
                                <i className="bi bi-cart-plus"></i>
                                <span className="small">Ekle</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {menuItems.length === 0 && (
                      <div className="col-12 text-center py-5 text-muted">
                        Bu restorana ait yemek bulunmuyor.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Cart Sidebar Column */}
              <div className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '90px', zIndex: 9 }}>
                  <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h2 className="h5 fw-bold mb-0 text-dark">
                      <i className="bi bi-cart3 text-danger me-2"></i> Sepetim
                    </h2>
                    {totalCartItems > 0 && (
                      <button 
                        onClick={() => dispatch(clearCart())} 
                        className="btn btn-link text-muted small p-0 text-decoration-none"
                      >
                        Temizle
                      </button>
                    )}
                  </div>

                  <div className="card-body p-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <i className="bi bi-basket fs-1 text-muted opacity-30 mb-3 d-block"></i>
                        <span>Sepetiniz boş.</span>
                        <p className="small text-muted-50 mt-1">Lezzetli yemeklerden sepete ekleyerek başlayın.</p>
                      </div>
                    ) : (
                      <>
                        {/* Restaurant Name Header inside Cart */}
                        <div className="bg-light p-3 rounded-3 mb-3 border text-center">
                          <span className="small text-muted d-block">Sipariş Verilen Mağaza:</span>
                          <strong className="text-dark">{cartRestaurantName}</strong>
                        </div>

                        {/* List of Cart Items */}
                        <div className="overflow-auto mb-4" style={{ maxHeight: '280px' }}>
                          {cartItems.map((item) => (
                            <div className="d-flex align-items-center justify-content-between py-3 border-bottom" key={item.id}>
                              <div className="min-width-0 pe-2">
                                <h4 className="h6 fw-semibold text-dark mb-0 text-truncate" style={{ maxWidth: '160px' }}>
                                  {item.name}
                                </h4>
                                <span className="text-danger small fw-bold">{item.price} TL</span>
                              </div>
                              
                              {/* Quantity selectors */}
                              <div className="d-flex align-items-center gap-2">
                                <div className="btn-group btn-group-sm rounded-pill border bg-light overflow-hidden shadow-sm" role="group">
                                  <button 
                                    onClick={() => dispatch(decreaseQuantity(item.id))} 
                                    className="btn btn-light px-2"
                                    aria-label="Adet azalt"
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <span className="px-2.5 d-flex align-items-center justify-content-center text-dark font-monospace fw-bold" style={{ minWidth: '24px' }}>
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => dispatch(increaseQuantity(item.id))} 
                                    className="btn btn-light px-2"
                                    aria-label="Adet artır"
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>

                                {/* Delete Item Button */}
                                <button 
                                  onClick={() => dispatch(removeFromCart(item.id))} 
                                  className="btn btn-outline-secondary btn-sm border-0 rounded-circle text-muted"
                                  title="Ürünü sil"
                                  aria-label="Ürünü sepetten çıkar"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing details */}
                        <div className="mb-4 bg-light p-3 rounded-4 small">
                          <div className="d-flex justify-content-between text-muted mb-2">
                            <span>Ara Toplam</span>
                            <span>{cartSubtotal} TL</span>
                          </div>
                          <div className="d-flex justify-content-between text-muted mb-2">
                            <span>Gönderim Ücreti</span>
                            <span>{deliveryFee} TL</span>
                          </div>
                          <hr className="my-2 border-secondary border-opacity-25" />
                          <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                            <span>Toplam Tutar</span>
                            <span className="text-danger">{cartTotal} TL</span>
                          </div>
                        </div>

                        {/* Order Confirmation button */}
                        <button
                          onClick={handleOpenPayment}
                          className="btn btn-danger w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        >
                          <i className="bi bi-credit-card"></i>
                          <span>Siparişi Onayla</span>
                          <span className="bg-dark bg-opacity-25 px-2 py-0.5 rounded small">{cartTotal} TL</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREDIT CARD PAYMENT MODAL WITH INTERACTIVE FLIPPING CARD */}
      {isPaymentModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100 m-3" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-danger text-white py-3 d-flex justify-content-between align-items-center border-0">
              <h3 className="h5 fw-bold mb-0">
                <i className="bi bi-credit-card me-2"></i> Ödeme ve Onay
              </h3>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={handleClosePayment}
                aria-label="Kapat"
              ></button>
            </div>
            
            <form onSubmit={handleConfirmOrder}>
              <div className="card-body p-4">
                {paymentError && (
                  <div className="alert alert-danger p-2 small mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    {paymentError}
                  </div>
                )}

                {/* INTERACTIVE FLIPPING CREDIT CARD VISUAL */}
                <div className={`payment-card-wrapper ${isCardFlipped ? 'flipped' : ''}`}>
                  <div className="payment-card-inner">
                    {/* Card Front face */}
                    <div className="payment-card-front">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="bg-warning rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '28px', opacity: 0.85 }}>
                          {/* Card chip visual */}
                          <div className="border border-dark border-opacity-20 rounded-1" style={{ width: '22px', height: '18px' }}></div>
                        </div>
                        <span className="fw-bold fs-6 tracking-wide text-white-50">PAYMENT CARD</span>
                      </div>
                      
                      {/* Card Number display */}
                      <div className="fs-5 fw-bold font-monospace tracking-widest my-3 text-white">
                        {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-end text-uppercase">
                        <div className="min-width-0 pe-2">
                          <span className="d-block text-white-50" style={{ fontSize: '10px' }}>KART SAHİBİ</span>
                          <span className="fw-bold small text-truncate d-block" style={{ letterSpacing: '1px' }}>
                            {paymentForm.cardName || 'AD SOYAD'}
                          </span>
                        </div>
                        <div style={{ minWidth: '55px' }}>
                          <span className="d-block text-white-50" style={{ fontSize: '10px' }}>GEÇ. TAR.</span>
                          <span className="fw-bold small font-monospace d-block">{paymentForm.cardExpiry || 'AA/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Back face */}
                    <div className="payment-card-back">
                      {/* Magnetic stripe strip */}
                      <div className="card-stripe"></div>
                      
                      {/* Signature bar with CVC display */}
                      <div className="card-signature-cvc">
                        <span className="text-white-50 mb-1" style={{ fontSize: '9px' }}>GÜVENLİK KODU (CVC)</span>
                        <div className="card-signature-bar">
                          <span>{paymentForm.cardCVC || '•••'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount display */}
                <div className="bg-light p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center border">
                  <span className="text-secondary small fw-semibold">Ödenecek Tutar</span>
                  <span className="h4 fw-bold text-danger mb-0">{cartTotal} TL</span>
                </div>

                {/* Cardholder Name input */}
                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label text-secondary fw-semibold small">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardName"
                    name="cardName"
                    placeholder="Ad Soyad"
                    value={paymentForm.cardName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                    onFocus={() => setIsCardFlipped(false)}
                    autocomplete="cc-name"
                    required
                  />
                </div>

                {/* Card Number input */}
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label text-secondary fw-semibold small">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={paymentForm.cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => setIsCardFlipped(false)}
                    autocomplete="cc-number"
                    required
                  />
                </div>

                {/* Expiry and CVC Grid input */}
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="cardExpiry" className="form-label text-secondary fw-semibold small">
                        Son Kullanma (AA/YY)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="AA/YY"
                        value={paymentForm.cardExpiry}
                        onChange={handleCardExpiryChange}
                        onFocus={() => setIsCardFlipped(false)}
                        autocomplete="cc-exp"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="cardCVC" className="form-label text-secondary fw-semibold small">
                        CVC (Güvenlik Kodu)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardCVC"
                        name="cardCVC"
                        maxLength="3"
                        placeholder="xxx"
                        value={paymentForm.cardCVC}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardCVC: e.target.value.replace(/\D/g, '') })}
                        onFocus={() => setIsCardFlipped(true)}
                        onBlur={() => setIsCardFlipped(false)}
                        autocomplete="cc-csc"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-light p-3 border-0 d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4 rounded-pill" 
                  onClick={handleClosePayment}
                >
                  İptal Et
                </button>
                <button 
                  type="submit" 
                  className="btn btn-danger fw-bold px-4 rounded-pill d-flex align-items-center gap-1.5"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : null}
                  <span>Ödeme Yap ve Sipariş Ver</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INFO DISPLAY POPUP MODAL FOR FOOTER LINKS */}
      {isInfoModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1060 }}
        >
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100 m-3" style={{ maxWidth: '550px' }}>
            <div className="card-header bg-danger text-white py-3 d-flex justify-content-between align-items-center border-0">
              <h3 className="h5 fw-bold mb-0">
                {infoModalTitle}
              </h3>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setIsInfoModalOpen(false)}
                aria-label="Kapat"
              ></button>
            </div>
            <div className="card-body p-4">
              {infoModalContent}
            </div>
            <div className="card-footer bg-light p-3 border-0 d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-danger px-4 rounded-pill" 
                onClick={() => setIsInfoModalOpen(false)}
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Yemeksepeti Footer */}
      <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
        <div className="container">
          <div className="row g-4 mb-4">
            {/* Column 1: Info/Brand */}
            <div className="col-12 col-md-4">
              <h4 className="h5 fw-bold text-danger mb-3">
                <i className="bi bi-egg-fried me-2"></i>yemeksepeti
              </h4>
              <p className="small text-white-50">
                Türkiye'nin en sevilen online yemek siparişi platformu. En lezzetli hamburgerlerden sıcak baklavalara, binlerce restorandan dilediğini seç, kapına gelsin!
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('İletişim'); }} className="text-white-50 hover-text-danger" title="Facebook"><i className="bi bi-facebook fs-5"></i></a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('İletişim'); }} className="text-white-50 hover-text-danger" title="Twitter"><i className="bi bi-twitter-x fs-5"></i></a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('İletişim'); }} className="text-white-50 hover-text-danger" title="Instagram"><i className="bi bi-instagram fs-5"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-6 col-md-4">
              <h5 className="small fw-bold text-uppercase text-white-50 tracking-wider mb-3">Yemeksepeti</h5>
              <ul className="list-unstyled small d-flex flex-column gap-2">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Hakkımızda'); }} className="text-white-50 text-decoration-none hover-underline">Hakkımızda</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Sıkça Sorulan Sorular'); }} className="text-white-50 text-decoration-none hover-underline">Sıkça Sorulan Sorular</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Yardım & Destek'); }} className="text-white-50 text-decoration-none hover-underline">Yardım & Destek</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('İletişim'); }} className="text-white-50 text-decoration-none hover-underline">İletişim</a></li>
              </ul>
            </div>

            {/* Column 3: Corporate Partner */}
            <div className="col-6 col-md-4">
              <h5 className="small fw-bold text-uppercase text-white-50 tracking-wider mb-3">İş Ortaklarımız</h5>
              <ul className="list-unstyled small d-flex flex-column gap-2">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Restoran Kaydı'); }} className="text-white-50 text-decoration-none hover-underline">Restoran Kaydı</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Mağaza Portal Girişi'); }} className="text-white-50 text-decoration-none hover-underline">Mağaza Portal Girişi</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Gizlilik Sözleşmesi'); }} className="text-white-50 text-decoration-none hover-underline">Gizlilik Sözleşmesi</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleOpenInfo('Kullanım Koşulları'); }} className="text-white-50 text-decoration-none hover-underline">Kullanım Koşulları</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="border-secondary border-opacity-20 my-4" />
          
          <div className="d-flex flex-wrap justify-content-between align-items-center small text-white-50 gap-2">
            <span>&copy; 2026 Yemeksepeti. Tüm hakları saklıdır.</span>
            <span>Made with <i className="bi bi-heart-fill text-danger mx-1"></i> for Food Lovers</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
