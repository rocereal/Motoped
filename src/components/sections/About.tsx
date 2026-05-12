'use client'

export default function About() {
  return (
    <section id="despre" className="about-section mb-5">
      <div className="container">
        <div className="row align-items-center bicycle-img">
          <div className="col-md-6">
            <div className="img-wrapper">
              <img src="/images/nieve-about.jpg" alt="NIEVE Q-EN Electric Car" className="img-fluid" />
            </div>
          </div>
          <div className="col-md-6 about-text">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase"><span>Despre</span>NIEVE Q-EN</h2>
            </div>
            <div className="text-block">
              <p>
                NIEVE Q-EN este un microvehicul electric de două locuri, proiectat special
                pentru mobilitatea urbană modernă. Cu un design compact la exterior și un
                interior surprinzător de spațios, Q-EN îmbină confortul cu estetica contemporană.
              </p>
              <p>
                Dezvoltat pe platforma Jiangling Motors Group (JMEV) — lider global cu peste
                120.000 de vehicule electrice exportate — NIEVE Q-EN oferă performanță
                dovedită, fiabilitate ridicată și un cost de operare minim. Fără combustibil,
                fără zgomot, fără emisii.
              </p>
            </div>
            <div style={{ margin: '24px 0 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#dd0606', fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>
                  24.900 lei
                </span>
                <span style={{ fontSize: '1rem', color: '#999', textDecoration: 'line-through', fontFamily: "'Poppins', sans-serif" }}>
                  29.000 lei
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#555', fontFamily: "'Poppins', sans-serif" }}>
                Posibilitate rate de la <strong style={{ color: '#333' }}>486 lei/lună</strong> timp de 5 ani
              </p>
            </div>
            <div className="btn-wrapper">
              <a
                href="#dealer"
                className="btn btn-primary has-icon"
              >
                <span>Cumpără acum</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
