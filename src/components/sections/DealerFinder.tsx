export default function DealerFinder() {
  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">
        <div className="row align-items-stretch">
          <div className="col-lg-5 col-12 mb-4 mb-lg-0 d-flex flex-column justify-content-center">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.9rem', marginBottom: 16 }}>
              Dealer Autorizat NIEVE
            </h2>
            <p style={{ color: '#555', marginBottom: 28, lineHeight: 1.7 }}>
              Vizitați showroom-ul nostru din Sibiu și descoperiți NIEVE Q-EN în persoană.
              Suntem disponibili pentru un test drive gratuit.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#248C46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: 16 }}></i>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Adresă</p>
                  <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                    Nod Rutier Vestem, Șoseaua Sibiului 296, Sibiu<br />
                    <span style={{ color: '#888' }}>Lângă benzinăria MOL</span>
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#248C46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-phone" style={{ color: '#fff', fontSize: 16 }}></i>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Telefon</p>
                  <a href="tel:+40376060045" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>
                    +0376 060 045
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#248C46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-envelope-open" style={{ color: '#fff', fontSize: 16 }}></i>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Email</p>
                  <a href="mailto:contact@motoped.ro" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>
                    contact@motoped.ro
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-12">
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', height: 380 }}>
              <iframe
                src="https://maps.google.com/maps?q=Intersectia+DN7+DN1+557260+Vestem+Romania&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                title="Locație Motoped Sibiu"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
