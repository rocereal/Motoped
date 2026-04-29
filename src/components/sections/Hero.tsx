'use client'

export default function Hero() {
  return (
    <section id="home" className="height-100 hero-section light-text">
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/bg-5.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundColor: '#1c232d',
            }}
          />
        </div>
      </div>
      <div className="container double-top-padding double-bottom-padding height-100">
        <div className="row">
          <div className="col-md-6 banner-content">
            <h2 className="top-sub-heading">Introducing</h2>
            <h1 className="large-heading"><span>Thrilling</span> DAD3333</h1>
            <div className="text-block text-lead">
              <p>Two Wheels to move the soul. <br />Power Packed Performance</p>
            </div>
            <a
              className="btn btn-primary btn-accent has-icon"
              href="#book-ride"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('book-ride')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Book test ride</span><i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        <div className="placeholder-text">WXL1300cc</div>
        <div className="pricing-text">Starting at <span>$12,799*</span></div>
      </div>
    </section>
  )
}
