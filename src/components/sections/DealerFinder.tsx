const iconStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%',
  background: '#dd0606',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const mapWrapperStyle: React.CSSProperties = {
  borderRadius: 12,
  overflow: 'hidden',
  height: 355,
  position: 'relative',
}

const iframeStyle: React.CSSProperties = {
  border: 0,
  display: 'block',
  width: '100%',
  /* taller than wrapper to clip attribution bar at bottom */
  height: 'calc(100% + 40px)',
  marginTop: 0,
}

const locations = [
  {
    city: 'Sibiu',
    address: 'Nod Rutier Vestem, Șoseaua Sibiului 296, Sibiu',
    note: 'Lângă benzinăria MOL',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1138.2306093752168!2d24.24800247657232!3d45.700796565916015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474c5f69efbb5aed%3A0x307bc6497052dfd7!2sMOL!5e0!3m2!1sro!2sro!4v1777477161368!5m2!1sro!2sro',
  },
  {
    city: 'Lunguletu',
    address: 'Strada Principală, DN7, Lunguletu',
    note: 'Vizavi de Piață',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1420.320319866087!2d25.682236941671484!3d44.6043750058982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sro!2sro!4v1777477073647!5m2!1sro!2sro',
  },
]

export default function DealerFinder() {
  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">

        <div className="heading-wrapper" style={{ marginBottom: 10 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.9rem', marginBottom: 8 }}>
            Dealer Autorizat NIEVE
          </h2>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 0 }}>
            Vizitați showroom-urile noastre și descoperiți NIEVE Q-EN în persoană.
            Suntem disponibili pentru un test drive gratuit.
          </p>
        </div>

        {locations.map((loc) => (
          <div key={loc.city} className="row align-items-stretch" style={{ marginTop: 40 }}>
            <div className="col-lg-5 col-12 mb-4 mb-lg-0 d-flex flex-column justify-content-center">
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: 20, color: '#dd0606' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: 8 }} />{loc.city}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={iconStyle}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Adresă</p>
                    <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                      {loc.address}<br />
                      <span style={{ color: '#888' }}>{loc.note}</span>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={iconStyle}>
                    <i className="fas fa-phone" style={{ color: '#fff', fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Telefon</p>
                    <a href="tel:+40376060045" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>
                      +0376 060 045
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={iconStyle}>
                    <i className="fas fa-envelope-open" style={{ color: '#fff', fontSize: 16 }} />
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
              <div style={mapWrapperStyle}>
                <iframe
                  src={loc.mapSrc}
                  style={iframeStyle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Locație Motoped ${loc.city}`}
                />
              </div>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}
