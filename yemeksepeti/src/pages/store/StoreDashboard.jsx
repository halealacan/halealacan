import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import api from '../../services/api';

const StoreDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Food Form / Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null); // Null for adding, ID for editing
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [formError, setFormError] = useState('');
  const [savingFood, setSavingFood] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch restaurant, menu and orders data from JSON Server
  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const restaurants = await api.getRestaurantByUserId(user?.id);
      const myRestaurant = restaurants[0];

      if (myRestaurant) {
        setRestaurant(myRestaurant);

        // Fetch menu items (foods)
        const menuData = await api.getFoodsByRestaurantId(myRestaurant.id);
        setMenuItems(menuData);

        // Fetch orders
        const ordersData = await api.getOrdersByRestaurantId(myRestaurant.id);
        setOrders(ordersData);
      } else {
        throw new Error('Bu kullanıcıya ait restoran bulunamadı');
      }
    } catch (err) {
      setError(err.message || 'Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStoreData();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // ----------------------------------------------------
  // Food CRUD Operations
  // ----------------------------------------------------
  
  const openAddModal = () => {
    setEditingFoodId(null);
    setFoodForm({ name: '', description: '', price: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFoodId(food.id);
    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    const { name, description, price } = foodForm;

    if (!name || !description || !price) {
      setFormError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setFormError('Lütfen geçerli bir fiyat girin.');
      return;
    }

    try {
      setSavingFood(true);
      setFormError('');
      const foodData = {
        name,
        description,
        price: Number(price),
        restaurantId: restaurant.id,
      };

      if (editingFoodId) {
        // Edit flow
        const updatedFood = await api.updateFood(editingFoodId, foodData);
        setMenuItems(menuItems.map((item) => (item.id === editingFoodId ? updatedFood : item)));
      } else {
        // Add flow
        const newFood = await api.addFood(foodData);
        setMenuItems([...menuItems, newFood]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setFormError('İşlem sırasında bir hata oluştu.');
    } finally {
      setSavingFood(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Bu yemeği menüden silmek istediğinize emin misiniz?')) {
      try {
        await api.deleteFood(foodId);
        setMenuItems(menuItems.filter((item) => item.id !== foodId));
      } catch (err) {
        alert('Yemek silinirken bir hata oluştu.');
      }
    }
  };

  // ----------------------------------------------------
  // Order Operations (Status Transitions)
  // ----------------------------------------------------

  const handleTransitionStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Hazırlanıyor') nextStatus = 'Yolda';
    else if (currentStatus === 'Yolda') nextStatus = 'Teslim Edildi';

    if (!nextStatus) return;

    try {
      const updatedOrder = await api.updateOrderStatus(orderId, nextStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status } : o)));
    } catch (err) {
      alert('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Horizontal Navbar - Warm Amber/Orange Theme */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-warning shadow-sm py-3 px-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shop fs-3 text-dark"></i>
            <span className="navbar-brand mb-0 h1 fw-bold text-dark fs-4">
              Yemeksepeti Partner
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="bg-dark bg-opacity-10 text-dark px-3 py-1.5 rounded-pill small fw-semibold">
              <i className="bi bi-person-badge-fill me-1"></i> {user?.username} (Mağaza Sahibi)
            </div>
            <button onClick={handleLogout} className="btn btn-dark btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-right me-1"></i> Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="container py-4 flex-grow-1">
        {error && (
          <div className="alert alert-danger shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <div className="text-muted mt-2">Mağaza Bilgileri Yükleniyor...</div>
          </div>
        ) : (
          <>
            {/* Restaurant Info Header Banner */}
            {restaurant && (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="bg-dark text-white p-4 p-md-5 position-relative">
                  <div className="position-absolute end-0 top-0 p-4 opacity-10 d-none d-md-block">
                    <i className="bi bi-shop" style={{ fontSize: '120px' }}></i>
                  </div>
                  
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="bg-warning text-dark p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-shop fs-1"></i>
                    </div>
                    <div>
                      <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill mb-2 fw-bold text-uppercase small">
                        {restaurant.category}
                      </span>
                      <h1 className="h2 fw-bold mb-1">{restaurant.name}</h1>
                      <div className="d-flex align-items-center gap-3 small text-white-50">
                        <span>
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          <strong className="text-white">{restaurant.rating}</strong> / 5.0
                        </span>
                        <span>|</span>
                        <span>
                          <i className="bi bi-geo-alt-fill me-1"></i> {restaurant.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Tabs & Sections */}
            <div className="card border-0 shadow-sm rounded-4 bg-white">
              <div className="card-header bg-white border-bottom p-3">
                <ul className="nav nav-pills card-header-pills gap-2">
                  <li className="nav-item">
                    <button
                      className={`nav-link rounded-pill fw-bold px-4 py-2 ${
                        activeTab === 'menu' ? 'active bg-warning text-dark' : 'text-secondary'
                      }`}
                      onClick={() => setActiveTab('menu')}
                    >
                      <i className="bi bi-list-stars me-2"></i> Yemek Menüsü ({menuItems.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link rounded-pill fw-bold px-4 py-2 ${
                        activeTab === 'orders' ? 'active bg-warning text-dark' : 'text-secondary'
                      }`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <i className="bi bi-receipt-cutoff me-2"></i> Siparişler ({orders.length})
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {/* Active Tab Panel Rendering */}
                {activeTab === 'menu' ? (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                      <div>
                        <h2 className="h4 mb-1 fw-bold text-dark">Yemek Listesi</h2>
                        <p className="text-muted small mb-0">Müşterilerinize sunduğunuz menü öğelerini düzenleyin, ekleyin veya silin.</p>
                      </div>
                      <button onClick={openAddModal} className="btn btn-warning fw-bold px-4 py-2.5 rounded-pill shadow-sm d-flex align-items-center gap-2 text-dark">
                        <i className="bi bi-plus-circle-fill"></i> Yeni Yemek Ekle
                      </button>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover align-middle border-top">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: '80px' }}>ID</th>
                            <th scope="col">Yemek Adı</th>
                            <th scope="col">Açıklama</th>
                            <th scope="col" style={{ width: '120px' }}>Fiyat</th>
                            <th scope="col" className="text-end" style={{ width: '200px' }}>İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {menuItems.map((item) => (
                            <tr key={item.id}>
                              <td className="text-muted">#{item.id}</td>
                              <td>
                                <strong className="text-dark">{item.name}</strong>
                              </td>
                              <td className="text-muted small">{item.description}</td>
                              <td className="fw-bold text-success">{item.price} TL</td>
                              <td className="text-end">
                                <div className="btn-group gap-1">
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                    title="Düzenle"
                                  >
                                    <i className="bi bi-pencil me-1"></i> Düzenle
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFood(item.id)}
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                    title="Sil"
                                  >
                                    <i className="bi bi-trash me-1"></i> Sil
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {menuItems.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-4 text-muted">
                                Menüde henüz yemek bulunmuyor. "Yeni Yemek Ekle" butonunu kullanarak menüyü oluşturun.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h2 className="h4 mb-1 fw-bold text-dark">Sipariş Listesi</h2>
                        <p className="text-muted small mb-0">Restoranınıza gelen güncel siparişlerin teslimat durumlarını yönetin.</p>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover align-middle border-top">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: '80px' }}>ID</th>
                            <th scope="col">Müşteri</th>
                            <th scope="col">İçerik</th>
                            <th scope="col">Tarih</th>
                            <th scope="col">Durum</th>
                            <th scope="col">Tutar</th>
                            <th scope="col" className="text-end" style={{ width: '220px' }}>Sipariş Durumu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => {
                            let badgeClass = 'bg-warning text-dark';
                            if (order.status === 'Yolda') {
                              badgeClass = 'bg-info text-dark';
                            } else if (order.status === 'Teslim Edildi') {
                              badgeClass = 'bg-success';
                            } else if (order.status === 'İptal Edildi') {
                              badgeClass = 'bg-danger';
                            }

                            return (
                              <tr key={order.id}>
                                <td className="text-muted">#{order.id}</td>
                                <td>
                                  <strong className="text-dark">{order.customerName}</strong>
                                </td>
                                <td className="text-secondary small">{order.items}</td>
                                <td className="text-muted small">{order.date}</td>
                                <td>
                                  <span className={`badge ${badgeClass} px-3 py-2 rounded-pill fw-semibold`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="fw-bold text-dark">{order.total} TL</td>
                                <td className="text-end">
                                  {order.status === 'Hazırlanıyor' && (
                                    <button
                                      onClick={() => handleTransitionStatus(order.id, order.status)}
                                      className="btn btn-warning btn-sm rounded-pill w-100 fw-bold d-flex align-items-center justify-content-center gap-1.5 text-dark shadow-sm py-1.5"
                                    >
                                      <i className="bi bi-truck"></i> Yola Çıkar
                                    </button>
                                  )}
                                  {order.status === 'Yolda' && (
                                    <button
                                      onClick={() => handleTransitionStatus(order.id, order.status)}
                                      className="btn btn-success btn-sm rounded-pill w-100 fw-bold d-flex align-items-center justify-content-center gap-1.5 shadow-sm py-1.5"
                                    >
                                      <i className="bi bi-check2-circle"></i> Teslim Et
                                    </button>
                                  )}
                                  {order.status === 'Teslim Edildi' && (
                                    <span className="text-success small fw-semibold">
                                      <i className="bi bi-check-lg me-1"></i> Tamamlandı
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">
                                Henüz sipariş alınmadı.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Partner portal footer */}
      <footer className="bg-dark text-white-50 text-center py-4 mt-auto border-top border-secondary">
        <div className="container small">
          <p className="mb-1 fw-bold text-white">Yemeksepeti Partner Portalı</p>
          <p className="mb-0">Bu panel Yemeksepeti iş ortakları ve restoran yöneticileri için hazırlanmıştır. &copy; 2026</p>
        </div>
      </footer>

      {/* FOOD MODAL - Lightweight and React-friendly inline modal */}
      {isModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden w-100 m-3" style={{ maxWidth: '500px' }}>
            <div className="card-header bg-warning text-dark py-3 d-flex justify-content-between align-items-center border-0">
              <h3 className="h5 fw-bold mb-0">
                {editingFoodId ? 'Yemek Düzenle' : 'Yeni Yemek Ekle'}
              </h3>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseModal}
                aria-label="Kapat"
              ></button>
            </div>
            
            <form onSubmit={handleSaveFood}>
              <div className="card-body p-4">
                {formError && (
                  <div className="alert alert-danger p-2 small mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                    {formError}
                  </div>
                )}

                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="foodName" className="form-label text-secondary fw-semibold small">
                    Yemek Adı
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="foodName"
                    placeholder="Örn: Klasik Hamburger"
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="foodDesc" className="form-label text-secondary fw-semibold small">
                    Açıklama
                  </label>
                  <textarea
                    className="form-control"
                    id="foodDesc"
                    rows="3"
                    placeholder="İçindekiler ve porsiyon bilgisi..."
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label htmlFor="foodPrice" className="form-label text-secondary fw-semibold small">
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="foodPrice"
                    min="1"
                    placeholder="Örn: 180"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="card-footer bg-light p-3 border-0 d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4 rounded-pill" 
                  onClick={handleCloseModal}
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  className="btn btn-warning fw-bold px-4 rounded-pill text-dark"
                  disabled={savingFood}
                >
                  {savingFood ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : null}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;
