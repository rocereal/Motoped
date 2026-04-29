'use client'

export default function Hero() {

  return (
    <section
      id="home"
      className="height-100 hero-section style-1 light-text"
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: '#000',
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="container double-top-padding double-bottom-padding">
        <div className="row">
          <div className="col-lg-5 col-md-12 banner-content bicycle-img">
            <h2 className="top-sub-heading">NIEVE Q-EN</h2>
            <h1 className="large-heading"><span>100% Electric</span>Micro Urban</h1>
            <div className="text-block text-lead">
              <p>
                Mașina electrică compactă de două locuri, perfectă pentru oraș.
                Zero emisii, zero costuri de combustibil, zero zgomot —
                doar mobilitate modernă și accesibilă.
              </p>
            </div>
            <div className="btn-wrapper">
              <a
                className="btn btn-primary btn-accent has-icon"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>Contactează-ne</span><i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-7 col-12 px-0">
            <div className="container1 d-none d-lg-block">
              <div className="hero-img">
                <img src="/images/nieve-red-side.png" alt="NIEVE Q-EN Electric Car" className="img-fluid" />
              </div>
            </div>
            <div className="container1 d-block d-lg-none">
              <div className="hero-img">
                <img src="/images/nieve-red-side.png" alt="NIEVE Q-EN Electric Car" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
