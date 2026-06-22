export default function Home() {
  return (
    <div className="space-y-xl">
      <section className="mt-lg">
        <h2 className="text-heading-lg">merhaba sınıf</h2>
        <p className="text-body-md"> bugun ne öğrenmek isteriz</p>
      </section>

      <section>
        <div className="search-bar-wrapper">
          <span className="material-symbols-outlined search-bar-icon">
            search
          </span>
          <input
            type="text"
            className="search-bar-input"
            placeholder="Kurs eğitmen veya konu ara..."
          />
        </div>
      </section>
      <section className="category-chips-scroll no scrollbar">
        <button className="category-chips-active">Tümü</button>
        <button className="category-chip">Tasarım</button>
        <button className="category-chip">Yazılım</button>
        <button className="category-chip">Pazarlama</button>
        <button className="category-chip">İşletme</button>
      </section>
      <section>
        <div className="hero-card block">
          <div className="hero-overlay">
            <div
              className="hero-bg-img"
              style={{
                backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuCMhSTJBrMvCxohdOiO08I77jgTYR1qxRzpZfQ1h7CRQHKJ1E3ALBNF_zgFiEYB1Q0PND57ZzMOccOY-zHdzm85MEiNqUtWVEEx6DiFW0Nmasld9IXDr3_Wy_c3gIOm7QI4LaUi49ViVQyOVeX2cx13MjxR0uRl95wccrcrEZgGay5oEhHuoHzn4ZBMQ08T0olw9bOrPHsOam9e74LcIWNoEbgFZVQ1GUFzBLT6q35Cj0XDTABX_IJS9S4B_dPSbBpA8uQ9ubwkKckB)`,
              }}
            ></div>
            <div className="hero-text-container">
              <span className="badge-tag">öne çıkan</span>
              <h3 className="text-display-lg mt-2">
                UI/UX Tasarım Temelleri 2026
              </h3>
              <p className="hero-description">
                Profesyonel tasarımcı olmak için gereken her şey bu kursta
              </p>
              <button className="btn-primary mt-4">Şimdi Başla</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
