import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  // Clear errors when the page is loaded or inputs change
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch, email, password]);

  // Handle redirection on successful login
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'store':
          navigate('/store');
          break;
        case 'user':
          navigate('/user');
          break;
        default:
          navigate('/user');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="row justify-content-center w-100 my-auto">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          {/* Card element with shadow and rounded corners */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-danger text-white text-center py-4">
              <h2 className="mb-0 fw-bold">Yemeksepeti</h2>
              <p className="mb-0 text-white-50">Giriş Yap</p>
            </div>
            
            <div className="card-body p-4 p-sm-5">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email Input group */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-secondary fw-semibold">
                    E-posta Adresi
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-light border-start-0 ps-0"
                      id="email"
                      name="email"
                      placeholder="Ornek: eposta@yemeksepeti.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autocomplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Password Input group */}
                <div className="mb-4">
                  <label htmlFor="current-password" className="form-label text-secondary fw-semibold">
                    Şifre
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control bg-light border-start-0 border-end-0 ps-0"
                      id="current-password"
                      name="password"
                      placeholder="Şifrenizi girin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autocomplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Submit button with loading state */}
                <button
                  type="submit"
                  className="btn btn-danger w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Giriş Yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Giriş Yap</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            <div className="card-footer bg-light py-3 border-0 text-center">
              <span className="text-muted small">
                Giriş bilgileri için db.json dosyasını kontrol edin.
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple clean footer */}
      <footer className="w-100 py-3 text-center text-muted small mt-auto border-top bg-white">
        &copy; 2026 Yemeksepeti. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default Login;
