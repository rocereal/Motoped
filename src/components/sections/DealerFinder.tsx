const iconStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%',
  background: '#dd0606',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

export default function DealerFinder() {
  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">
        <div className="heading-wrapper" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.9rem', marginBottom: 8 }}>
            Dealer Autorizat NIEVE
          </h2>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 0 }}>
            Vizitați showroom-urile noastre și descoperiți NIEVE Q-EN în persoană.
            Suntem disponibili pentru un test drive gratuit.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={iconStyle}>
              <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Adresă</p>
              <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                Nod Rutier Vestem, Șoseaua Sibiului 296, Sibiu<br />
                <span style={{ color: '#888' }}>Lângă benzinăria MOL</span>
              </p>
              <p style={{ margin: '10px 0 0', color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                Strada Principală, DN7, Lunguletu<br />
                <span style={{ color: '#888' }}>Vizavi de Piață</span>
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
    </section>
  )
}
