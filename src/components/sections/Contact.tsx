'use client'

import { useState, FormEvent } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="contact-section">
      <div className="section-background m-bg-hide">
        <div className="background-wrapper bicycle-img">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/bg-5.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
              backgroundSize: 'cover',
            }}
          />
        </div>
      </div>
      <div className="container py-lg-5 bicycle-img">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase">Contactează-ne!</h2>
              <h4 className="fw-300">Completează formularul și te contactăm în cel mai scurt timp</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7 col-12">
            <div className="form-wrapper">
              {submitted ? (
                <p style={{ fontSize: 20, marginTop: 30, color: '#248C46', fontWeight: 600 }}>
                  Mulțumim! Te vom contacta în curând.
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-lg-6 col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Numele tău"
                        required
                      />
                    </div>
                    <div className="form-group col-lg-6 col-sm-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Adresa de email"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-lg-12">
                      <textarea
                        className="form-control"
                        placeholder="Mesajul tău"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-lg-12 d-flex justify-content-end">
                      <input type="submit" value="Trimite" className="btn btn-primary border-btn" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          <div className="col-lg-5 col-12 pt-4 pt-lg-0">
            <div style={{ paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                <i className="fas fa-phone" style={{ color: '#248C46', fontSize: 22, marginTop: 3 }}></i>
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>Telefon</strong>
                  <a href="tel:+40376060045" style={{ color: '#333', textDecoration: 'none', fontSize: 15 }}>
                    +0376 060 045
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                <i className="fas fa-envelope-open" style={{ color: '#248C46', fontSize: 22, marginTop: 3 }}></i>
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>Email</strong>
                  <a href="mailto:contact@motoped.ro" style={{ color: '#333', textDecoration: 'none', fontSize: 15 }}>
                    contact@motoped.ro
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#248C46', fontSize: 22, marginTop: 3 }}></i>
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>Adresă</strong>
                  <span style={{ color: '#333', fontSize: 15 }}>
                    Nod Rutier Vestem<br />
                    Șoseaua Sibiului 296, Sibiu<br />
                    <em style={{ color: '#666' }}>(Lângă benzinăria MOL)</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
