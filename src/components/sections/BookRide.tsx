'use client'

import { useState, FormEvent } from 'react'

export default function BookRide() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="book-ride" className="bookride-section light-text">
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/bg-7.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper text-center">
              <h2 className="large-heading text-uppercase">Book a Test Ride</h2>
            </div>
          </div>
          <div className="col-md-12">
            {submitted ? (
              <p className="text-center" style={{ fontSize: 20, marginTop: 30 }}>
                Thank you! We will contact you shortly.
              </p>
            ) : (
              <form className="style-2 transparent-field" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-lg-4 col-sm-6">
                    <input type="text" name="full-name" className="form-control" placeholder="Your full Name" required />
                  </div>
                  <div className="form-group col-lg-4 col-sm-6">
                    <input type="email" name="email" className="form-control" placeholder="Email ID" required />
                  </div>
                  <div className="form-group col-lg-4 col-sm-6">
                    <input type="text" name="mobile" className="form-control" placeholder="Mobile" required />
                  </div>
                  <div className="form-group col-lg-4 col-sm-6">
                    <select className="form-control" name="country">
                      <option value="">Select Country</option>
                      <option value="Country 1">Country 1</option>
                      <option value="Country 2">Country 2</option>
                      <option value="Country 3">Country 3</option>
                    </select>
                  </div>
                  <div className="form-group col-lg-4 col-sm-6">
                    <select className="form-control" name="state">
                      <option value="">Select State</option>
                      <option value="State 1">State 1</option>
                      <option value="State 2">State 2</option>
                      <option value="State 3">State 3</option>
                    </select>
                  </div>
                  <div className="form-group col-lg-4 col-sm-6">
                    <select className="form-control" name="city">
                      <option value="">Select City</option>
                      <option value="City 1">City 1</option>
                      <option value="City 2">City 2</option>
                      <option value="City 3">City 3</option>
                    </select>
                  </div>
                  <div className="form-group col-md-12">
                    <textarea placeholder="Remarks/Suggestions" className="form-control" name="comments"></textarea>
                  </div>
                  <div className="form-group col-md-12 text-center">
                    <input type="submit" value="Submit" />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
