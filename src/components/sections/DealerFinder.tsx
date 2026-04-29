export default function DealerFinder() {
  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <h2>Dealer Autorizat NIEVE</h2>
            <p style={{ color: '#666', marginTop: 12 }}>
              Vizitați showroom-ul nostru din Sibiu și descoperiți NIEVE Q-EN
              în persoană. Echipa noastră vă stă la dispoziție pentru un test drive gratuit.
            </p>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-4 mb-3">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#248C46', fontSize: 20, marginTop: 4 }}></i>
                  <div>
                    <strong>Adresă</strong>
                    <p style={{ margin: 0, color: '#555', fontSize: 14 }}>
                      Nod Rutier Vestem<br />
                      Șoseaua Sibiului 296, Sibiu<br />
                      <em>(Lângă benzinăria MOL)</em>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <i className="fas fa-phone" style={{ color: '#248C46', fontSize: 20, marginTop: 4 }}></i>
                  <div>
                    <strong>Telefon</strong>
                    <p style={{ margin: 0, color: '#555', fontSize: 14 }}>
                      <a href="tel:+40376060045" style={{ color: '#555', textDecoration: 'none' }}>
                        +0376 060 045
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <i className="fas fa-envelope-open" style={{ color: '#248C46', fontSize: 20, marginTop: 4 }}></i>
                  <div>
                    <strong>Email</strong>
                    <p style={{ margin: 0, color: '#555', fontSize: 14 }}>
                      <a href="mailto:contact@motoped.ro" style={{ color: '#555', textDecoration: 'none' }}>
                        contact@motoped.ro
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <a
                href="https://maps.google.com/?q=Soseaua+Sibiului+296+Sibiu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary has-icon"
              >
                <span>Vezi pe hartă</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
