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
              <h2 className="large-heading text-uppercase">Say Hi !!</h2>
              <h4 className="fw-300">Fill the Gap and We Will Contact You Soon</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7 col-12">
            <div className="form-wrapper">
              {submitted ? (
                <p style={{ fontSize: 20, marginTop: 30, color: '#248C46', fontWeight: 600 }}>
                  Thank you! We will contact you soon.
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-lg-6 col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="form-group col-lg-6 col-sm-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-lg-12">
                      <textarea
                        className="form-control"
                        placeholder="Your Question"
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-lg-12 d-flex justify-content-end">
                      <input type="submit" value="Send" className="btn btn-primary border-btn" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
