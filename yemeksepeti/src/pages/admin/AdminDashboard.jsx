import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { logout } from '../../redux/authSlice';
import api from '../../services/api';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'users', 'restaurants', 'orders', 'reports', 'settings'
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);

  // Filtered states for search
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Settings mock state
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    apiCaching: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch all necessary data concurrently on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersData, restaurantsData, foodsData, ordersData] = await Promise.all([
          api.getUsers(),
          api.getRestaurants(),
          api.getFoods(),
          api.getOrders(),
        ]);

        setUsers(usersData);
        setFilteredUsers(usersData);

        setRestaurants(restaurantsData);
        setFilteredRestaurants(restaurantsData);

        setFoods(foodsData);

        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        setError(err.message || 'Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter lists based on search query specific to the active section
  useEffect(() => {
    const query = searchText.toLowerCase();
    
    if (activeSection === 'users') {
      const filtered = users.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else if (activeSection === 'restaurants') {
      const filtered = restaurants.filter(
        (r) =>
          r.name?.toLowerCase().includes(query) ||
          r.category?.toLowerCase().includes(query) ||
          r.address?.toLowerCase().includes(query)
      );
      setFilteredRestaurants(filtered);
    } else if (activeSection === 'orders') {
      const filtered = orders.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(query) ||
          o.items?.toLowerCase().includes(query) ||
          o.status?.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered);
    }
  }, [searchText, activeSection, users, restaurants, orders]);

  // Reset search text when switching sections
  useEffect(() => {
    setSearchText('');
  }, [activeSection]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ----------------------------------------------------
  // React Data Table - Columns Configurations
  // ----------------------------------------------------

  // Users Columns
  const userColumns = [
    { name: '# ID', selector: (row) => row.id, sortable: true, width: '90px' },
    { name: 'Kullanıcı Adı', selector: (row) => row.username, sortable: true },
    { name: 'E-posta', selector: (row) => row.email, sortable: true },
    {
      name: 'Rol',
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => {
        let badgeClass = 'bg-primary';
        if (row.role === 'admin') badgeClass = 'bg-danger';
        else if (row.role === 'store') badgeClass = 'bg-info text-dark';
        return <span className={`badge ${badgeClass} px-3 py-1.5 rounded-pill`}>{row.role}</span>;
      },
    },
  ];

  // Restaurants Columns
  const restaurantColumns = [
    { name: '# ID', selector: (row) => row.id, sortable: true, width: '90px' },
    { name: 'Restoran Adı', selector: (row) => row.name, sortable: true },
    { name: 'Kategori', selector: (row) => row.category, sortable: true },
    { name: 'Puan', selector: (row) => row.rating, sortable: true, width: '100px', cell: (row) => <span><i className="bi bi-star-fill text-warning me-1"></i>{row.rating}</span> },
    { name: 'Adres', selector: (row) => row.address, sortable: true },
  ];

  // Orders Columns
  const orderColumns = [
    { name: '# ID', selector: (row) => row.id, sortable: true, width: '90px' },
    { name: 'Müşteri', selector: (row) => row.customerName, sortable: true },
    { name: 'Ürünler', selector: (row) => row.items, sortable: true, wrap: true },
    { name: 'Tarih', selector: (row) => row.date, sortable: true },
    {
      name: 'Durum',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let badgeClass = 'bg-warning text-dark';
        if (row.status === 'Yolda') badgeClass = 'bg-info text-dark';
        else if (row.status === 'Teslim Edildi') badgeClass = 'bg-success';
        return <span className={`badge ${badgeClass} px-3 py-1.5 rounded-pill`}>{row.status}</span>;
      },
    },
    { name: 'Tutar', selector: (row) => row.total, sortable: true, cell: (row) => <strong className="text-dark">{row.total} TL</strong> },
  ];

  // Generic Table Theme styles
  const customTableStyles = {
    headRow: {
      style: {
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#dee2e6',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        color: '#495057',
      },
    },
    cells: {
      style: {
        paddingTop: '12px',
        paddingBottom: '12px',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: '#f1f3f5',
        borderBottomColor: '#dee2e6',
        transitionDuration: '0.15s',
      },
    },
  };

  // ----------------------------------------------------
  // Statistics Calculations (Reports)
  // ----------------------------------------------------
  const completedOrders = orders.filter((o) => o.status === 'Teslim Edildi');
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const avgOrderValue = orders.length > 0 ? (orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) / orders.length).toFixed(1) : 0;
  
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const storeCount = users.filter((u) => u.role === 'store').length;
  const standardUserCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className="bg-dark text-white shadow-lg d-flex flex-column"
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          minWidth: isSidebarOpen ? '260px' : '0px',
          transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
          opacity: isSidebarOpen ? 1 : 0,
        }}
      >
        <div className="p-4 border-bottom border-secondary d-flex align-items-center justify-content-between">
          <span className="fs-5 fw-bold text-danger"><i className="bi bi-shield-lock me-2"></i>Admin Panel</span>
        </div>
        
        <nav className="flex-grow-1 p-3">
          <ul className="nav nav-pills flex-column gap-1">
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
                className={`nav-link text-white ${activeSection === 'dashboard' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('users'); }}
                className={`nav-link text-white ${activeSection === 'users' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-people me-2"></i> Kullanıcılar
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('restaurants'); }}
                className={`nav-link text-white ${activeSection === 'restaurants' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-shop me-2"></i> Restoranlar
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('orders'); }}
                className={`nav-link text-white ${activeSection === 'orders' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-receipt me-2"></i> Siparişler
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('reports'); }}
                className={`nav-link text-white ${activeSection === 'reports' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-graph-up me-2"></i> Raporlar
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveSection('settings'); }}
                className={`nav-link text-white ${activeSection === 'settings' ? 'active bg-danger' : 'opacity-75'}`}
              >
                <i className="bi bi-gear me-2"></i> Ayarlar
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-top border-secondary text-center small text-white-50">
          Sistem Paneli v1.1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex flex-column min-width-0">
        {/* Top Navbar */}
        <header className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4 py-3">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <button
              onClick={toggleSidebar}
              className="btn btn-outline-secondary btn-sm"
              aria-label="Menüyü gizle/göster"
            >
              <i className={`bi ${isSidebarOpen ? 'bi-chevron-left' : 'bi-justify'}`}></i>
            </button>

            <div className="d-flex align-items-center gap-3">
              <span className="text-secondary small d-none d-sm-inline">
                Giriş Yapan: <strong className="text-dark">{user?.username} (Yönetici)</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm rounded-pill px-3">
                <i className="bi bi-box-arrow-right me-1"></i> Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="container-fluid p-4 overflow-auto flex-grow-1">
          {error && (
            <div className="alert alert-danger mb-4 shadow-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <div className="text-muted mt-2">Sistem Verileri Yükleniyor...</div>
            </div>
          ) : (
            <>
              {/* SECTION 1: DASHBOARD MAIN OVERVIEW */}
              {activeSection === 'dashboard' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Genel Bakış</h1>
                  <p className="text-muted mb-4 small">Sistemdeki temel metrikleri ve son hareketleri inceleyin.</p>

                  {/* Summary Metric Cards */}
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white card-hover transition-all" 
                           onClick={() => setActiveSection('users')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted text-uppercase small fw-bold d-block mb-1">Kullanıcılar</span>
                            <span className="h2 fw-bold text-dark mb-0">{users.length}</span>
                          </div>
                          <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle">
                            <i className="bi bi-people fs-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white card-hover transition-all"
                           onClick={() => setActiveSection('restaurants')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted text-uppercase small fw-bold d-block mb-1">Restoranlar</span>
                            <span className="h2 fw-bold text-dark mb-0">{restaurants.length}</span>
                          </div>
                          <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle">
                            <i className="bi bi-shop fs-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted text-uppercase small fw-bold d-block mb-1">Yemekler</span>
                            <span className="h2 fw-bold text-dark mb-0">{foods.length}</span>
                          </div>
                          <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                            <i className="bi bi-egg-fried fs-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white card-hover transition-all"
                           onClick={() => setActiveSection('orders')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-muted text-uppercase small fw-bold d-block mb-1">Siparişler</span>
                            <span className="h2 fw-bold text-dark mb-0">{orders.length}</span>
                          </div>
                          <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                            <i className="bi bi-receipt fs-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity row */}
                  <div className="row g-4">
                    {/* Left: Recent orders table */}
                    <div className="col-12 col-lg-8">
                      <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
                        <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                          <h2 className="h5 fw-bold text-dark mb-0">Son Siparişler</h2>
                          <button onClick={() => setActiveSection('orders')} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                            Tümünü Gör
                          </button>
                        </div>
                        <div className="card-body p-4">
                          <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th scope="col" style={{ width: '80px' }}>ID</th>
                                  <th scope="col">Müşteri</th>
                                  <th scope="col">Tarih</th>
                                  <th scope="col">Tutar</th>
                                  <th scope="col">Durum</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.slice(-5).reverse().map((order) => {
                                  let badgeClass = 'bg-warning text-dark';
                                  if (order.status === 'Yolda') badgeClass = 'bg-info text-dark';
                                  else if (order.status === 'Teslim Edildi') badgeClass = 'bg-success';
                                  
                                  return (
                                    <tr key={order.id}>
                                      <td className="text-muted">#{order.id}</td>
                                      <td><strong>{order.customerName}</strong></td>
                                      <td className="small text-muted">{order.date}</td>
                                      <td className="fw-bold">{order.total} TL</td>
                                      <td>
                                        <span className={`badge ${badgeClass} px-2.5 py-1.5 rounded-pill small`}>
                                          {order.status}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Server / Database Info status */}
                    <div className="col-12 col-lg-4">
                      <div className="card border-0 shadow-sm rounded-3 bg-white h-100">
                        <div className="card-header bg-white border-0 p-4 pb-0">
                          <h2 className="h5 fw-bold text-dark mb-0">Sistem Durumu</h2>
                        </div>
                        <div className="card-body p-4">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 pb-3">
                              <span className="text-muted">Veritabanı</span>
                              <span className="badge bg-success px-3 py-1.5 rounded-pill fw-semibold">Aktif (JSON)</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 py-3">
                              <span className="text-muted">Sunucu Bağlantısı</span>
                              <span className="badge bg-success px-3 py-1.5 rounded-pill fw-semibold">Online</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 py-3">
                              <span className="text-muted">Bakım Modu</span>
                              <span className={`badge ${settings.maintenanceMode ? 'bg-danger' : 'bg-secondary'} px-3 py-1.5 rounded-pill fw-semibold`}>
                                {settings.maintenanceMode ? 'Açık' : 'Kapalı'}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0 border-0 pt-3">
                              <span className="text-muted">Önbellek (Caching)</span>
                              <span className={`badge ${settings.apiCaching ? 'bg-info text-dark' : 'bg-secondary'} px-3 py-1.5 rounded-pill fw-semibold`}>
                                {settings.apiCaching ? 'Aktif' : 'Pasif'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: USERS LIST TABLE */}
              {activeSection === 'users' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Kullanıcı Listesi</h1>
                  <p className="text-muted mb-4 small">Sistemdeki tüm kayıtlı admin, mağaza ve kullanıcı hesaplarını inceleyin.</p>
                  
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      {/* Search row */}
                      <div className="row mb-4 align-items-center justify-content-between">
                        <div className="col-12 col-md-4">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                              <i className="bi bi-search"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Kullanıcı adı veya e-posta ara..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-auto mt-2 mt-md-0 text-muted small">
                          Toplam: <strong>{filteredUsers.length}</strong> kullanıcı listeleniyor
                        </div>
                      </div>

                      <DataTable
                        columns={userColumns}
                        data={filteredUsers}
                        pagination
                        paginationPerPage={10}
                        highlightOnHover
                        responsive
                        customStyles={customTableStyles}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: RESTAURANTS LIST TABLE */}
              {activeSection === 'restaurants' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Restoran Listesi</h1>
                  <p className="text-muted mb-4 small">Sistemde hizmet veren tüm restoran ve iş ortağı mağazaları listeyin.</p>
                  
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      {/* Search row */}
                      <div className="row mb-4 align-items-center justify-content-between">
                        <div className="col-12 col-md-4">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                              <i className="bi bi-search"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Restoran adı veya kategori ara..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-auto mt-2 mt-md-0 text-muted small">
                          Toplam: <strong>{filteredRestaurants.length}</strong> restoran listeleniyor
                        </div>
                      </div>

                      <DataTable
                        columns={restaurantColumns}
                        data={filteredRestaurants}
                        pagination
                        paginationPerPage={10}
                        highlightOnHover
                        responsive
                        customStyles={customTableStyles}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: ORDERS LIST TABLE */}
              {activeSection === 'orders' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Tüm Siparişler</h1>
                  <p className="text-muted mb-4 small">Sistem genelinde verilmiş tüm siparişleri ve mevcut teslimat durumlarını görün.</p>
                  
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      {/* Search row */}
                      <div className="row mb-4 align-items-center justify-content-between">
                        <div className="col-12 col-md-4">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                              <i className="bi bi-search"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Müşteri adı veya durum ara..."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-auto mt-2 mt-md-0 text-muted small">
                          Toplam: <strong>{filteredOrders.length}</strong> sipariş listeleniyor
                        </div>
                      </div>

                      <DataTable
                        columns={orderColumns}
                        data={filteredOrders}
                        pagination
                        paginationPerPage={10}
                        highlightOnHover
                        responsive
                        customStyles={customTableStyles}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: REPORTS & REVENUE OVERVIEW */}
              {activeSection === 'reports' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Finansal Raporlar</h1>
                  <p className="text-muted mb-4 small">Sistemin genel ciro, sipariş ortalamaları ve kullanıcı dağılım istatistikleri.</p>

                  {/* Revenue Cards */}
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-md-4">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                        <span className="text-muted small fw-bold text-uppercase d-block mb-1">Toplam Brüt Gelir</span>
                        <h2 className="fw-bold text-success mb-1">{totalRevenue} TL</h2>
                        <span className="small text-muted-50">Teslim edilen siparişler toplamıdır.</span>
                      </div>
                    </div>
                    
                    <div className="col-12 col-md-4">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                        <span className="text-muted small fw-bold text-uppercase d-block mb-1">Ortalama Sipariş Tutarı</span>
                        <h2 className="fw-bold text-dark mb-1">{avgOrderValue} TL</h2>
                        <span className="small text-muted-50">Sipariş başına düşen ortalama tutar.</span>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                        <span className="text-muted small fw-bold text-uppercase d-block mb-1">Kullanıcı Rol Dağılımları</span>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <span className="badge bg-danger">Admin: {adminCount}</span>
                          <span className="badge bg-info text-dark">Mağaza: {storeCount}</span>
                          <span className="badge bg-primary">Kullanıcı: {standardUserCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Graphical distribution mockup with progress bars */}
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-header bg-white border-0 p-4">
                      <h2 className="h5 fw-bold mb-0 text-dark">Kullanıcı Dağılım Grafiği</h2>
                    </div>
                    <div className="card-body p-4 pt-0">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1 small text-muted">
                          <span>Müşteriler ({standardUserCount} kişi)</span>
                          <span>{users.length > 0 ? ((standardUserCount / users.length) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${users.length > 0 ? (standardUserCount / users.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1 small text-muted">
                          <span>İş Ortağı Mağazalar ({storeCount} kişi)</span>
                          <span>{users.length > 0 ? ((storeCount / users.length) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-info" role="progressbar" style={{ width: `${users.length > 0 ? (storeCount / users.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between mb-1 small text-muted">
                          <span>Sistem Yöneticileri ({adminCount} kişi)</span>
                          <span>{users.length > 0 ? ((adminCount / users.length) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${users.length > 0 ? (adminCount / users.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: SYSTEM SETTINGS OVERVIEW */}
              {activeSection === 'settings' && (
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">Sistem Ayarları</h1>
                  <p className="text-muted mb-4 small">Yemeksepeti sisteminin genel konfigürasyonlarını yönetin.</p>

                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
                        <h2 className="h5 fw-bold text-dark mb-4"><i className="bi bi-sliders me-2"></i>Genel Konfigürasyon</h2>
                        
                        {/* Maintenance Mode toggle */}
                        <div className="form-check form-switch mb-4 d-flex align-items-center justify-content-between ps-0">
                          <div>
                            <label className="form-check-label fw-bold text-dark d-block" htmlFor="maintenanceToggle">
                              Bakım Modu
                            </label>
                            <span className="small text-muted d-block" style={{ maxWidth: '320px' }}>
                              Aktifleştirildiğinde, müşteriler ve mağazalar sisteme erişemez, sadece yöneticiler giriş yapabilir.
                            </span>
                          </div>
                          <input
                            className="form-check-input fs-4"
                            type="checkbox"
                            role="switch"
                            id="maintenanceToggle"
                            checked={settings.maintenanceMode}
                            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>

                        {/* Allow registrations toggle */}
                        <div className="form-check form-switch mb-4 d-flex align-items-center justify-content-between ps-0">
                          <div>
                            <label className="form-check-label fw-bold text-dark d-block" htmlFor="regToggle">
                              Yeni Kayıtlara İzin Ver
                            </label>
                            <span className="small text-muted d-block" style={{ maxWidth: '320px' }}>
                              Yeni müşterilerin ve restoran sahiplerinin sisteme kayıt olmasını açar veya kapatır.
                            </span>
                          </div>
                          <input
                            className="form-check-input fs-4"
                            type="checkbox"
                            role="switch"
                            id="regToggle"
                            checked={settings.allowRegistration}
                            onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>

                        {/* API caching toggle */}
                        <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0">
                          <div>
                            <label className="form-check-label fw-bold text-dark d-block" htmlFor="cacheToggle">
                              API Veri Önbelleği
                            </label>
                            <span className="small text-muted d-block" style={{ maxWidth: '320px' }}>
                              JSON veritabanı yanıtlarını tarayıcı tarafında önbelleğe alarak performansı artırır.
                            </span>
                          </div>
                          <input
                            className="form-check-input fs-4"
                            type="checkbox"
                            role="switch"
                            id="cacheToggle"
                            checked={settings.apiCaching}
                            onChange={(e) => setSettings({ ...settings, apiCaching: e.target.checked })}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="card border-0 shadow-sm rounded-3 bg-white p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h2 className="h5 fw-bold text-dark mb-3"><i className="bi bi-database-check me-2"></i>Veritabanı Araçları</h2>
                          <p className="small text-muted">Sisteme kayıtlı mock verileri sıfırlayabilir veya sistem yedeğini simüle edebilirsiniz.</p>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-4">
                          <button onClick={() => alert('Veritabanı yedeği başarıyla indirildi. (Simülasyon)')} className="btn btn-outline-dark py-2.5">
                            <i className="bi bi-download me-2"></i> Veritabanını Yedekle
                          </button>
                          <button onClick={() => alert('Sistem önbelleği başarıyla temizlendi.')} className="btn btn-outline-danger py-2.5">
                            <i className="bi bi-trash3 me-2"></i> Önbelleği Temizle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Admin footer */}
        <footer className="bg-white border-top text-center py-3 text-muted small mt-auto">
          &copy; 2026 Yemeksepeti Sistem Yönetim Portalı. Tüm hakları saklıdır.
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
