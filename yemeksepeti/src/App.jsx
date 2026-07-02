import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/authSlice';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import StoreDashboard from './pages/store/StoreDashboard';
import UserDashboard from './pages/user/UserDashboard';

// Protected Route Component for Role-Based Authorization
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

// Root Redirect Component
const RootRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user.role}`} replace />;
};

// Common Layout Wrapper for Dashboards (Beginner-friendly)
const DashboardLayout = ({ title, children }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-danger" to="/">
            Yemeksepeti Clone
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50 small d-none d-sm-inline">
              Giriş yapan: <strong className="text-white">{user?.username} ({user?.role})</strong>
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <h1 className="h3 mb-3 fw-bold text-secondary">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimal Dashboards Placeholders as requested ("Başka hiçbir sayfayı oluşturma" - placeholder panels allowed)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={['store']}>
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Root Redirect handler */}
        <Route path="/" element={<RootRedirect />} />

        {/* Fallback to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
