// React'ten useContext hook'unu alıyoruz
import { useContext } from "react";

// Kullanıcı giriş bilgilerini yönettiğimiz context'i içe aktarıyoruz
import { UserContext } from "../context/UserContext";

// Form işlemleri için react-hook-form kütüphanesini içe aktarıyoruz
import { useForm } from "react-hook-form";

// LoginModal bileşeni
export default function LoginModal({ isOpen, onClose }) {

  // Eğer modal açık değilse ekrana hiçbir şey basma
  if (!isOpen) return null;

  // UserContext içinden login fonksiyonunu alıyoruz
  const { login } = useContext(UserContext);

  // useForm içinden form için gerekli fonksiyonları alıyoruz
  const {
    register,        // inputları forma bağlar
    handleSubmit,    // form submit işlemini yönetir
    setError,        // manuel hata mesajı vermek için kullanılır
    reset,           // formu temizler
    formState: { errors }, // form hatalarını tutar
  } = useForm();

  // Form gönderilince çalışacak fonksiyon
  const onSubmit = (data) => {

    // Girilen email ve şifre kontrol edilir
    if (
      data.email === "admin@gmail.com" &&
      data.password === "123456"
    ) {

      // Bilgiler doğruysa login işlemi yapılır
      login(data.email, data.password);

      // Form temizlenir
      reset();

      // Modal kapatılır
      onClose();

    } else {

      // Bilgiler yanlışsa genel hata mesajı oluşturulur
      setError("root.serverError", {
        type: "custom",
        message: "E-posta veya şifre hatalı!",
      });
    }
  };

  // Modal kapatılırken çalışır
  const handleClose = () => {

    // Form alanlarını temizler
    reset();

    // Modalı kapatır
    onClose();
  };

  return (
    <>
      {/* Modalın arka plan koyu alanı */}
      <div className="modal-overlay">

        {/* Modal kutusu */}
        <div className="modal-content">

          {/* Modal kapatma butonu */}
          <span
            className="drawer-close"
            onClick={handleClose}
          >
            &times;
          </span>

          {/* Form başlığı */}
          <h2 className="form-title">
            Giriş Yap
          </h2>

          {/* Form gönderilince handleSubmit önce validasyon yapar, sonra onSubmit'i çalıştırır */}
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* E-posta input alanı */}
            <div className="form-group">

              <label className="form-label">
                E-Posta
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="ahmet@yilmaz.com"

                // Email inputunu react-hook-form'a kaydediyoruz
                {...register("email", {

                  // Boş bırakılırsa hata verir
                  required: "E-Posta Zorunludur",

                  // E-posta formatı kontrolü
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Geçerli e-posta adresi",
                  },
                })}
              />

              {/* Email hatası varsa ekrana yazdırılır */}
              {errors.email && (
                <span className="form-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Şifre input alanı */}
            <div className="form-group">

              <label className="form-label">
                Şifre
              </label>

              <input
                className="form-input"
                placeholder="********"
                type="password"

                // Şifre inputunu react-hook-form'a kaydediyoruz
                {...register("password", {

                  // Boş bırakılırsa hata verir
                  required: "Şifre Zorunludur",

                  // En az 6 karakter kontrolü
                  minLength: {
                    value: 6,
                    message: "Şifre en az 6 karakter olmalıdır",
                  },
                })}
              />

              {/* Şifre hatası varsa ekrana yazdırılır */}
              {errors.password && (
                <span className="form-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Form gönderme butonu */}
            <button
              type="submit"
              className="form-submit"
            >
              Giriş Yap
            </button>

            {/* Email veya şifre yanlışsa genel hata mesajı gösterilir */}
            {errors.root?.serverError && (
              <span className="form-error mt-3">
                {errors.root.serverError.message}
              </span>
            )}

          </form>
        </div>
      </div>
    </>
  );
}