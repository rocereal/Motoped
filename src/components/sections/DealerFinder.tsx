'use client'

import { useState, FormEvent } from 'react'

export default function DealerFinder() {
  const [searched, setSearched] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <section id="dealer" className="dealer-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase"><span>Find</span>Dealer</h2>
            </div>
            <div className="text-block text-lead">
              <p>Now, it&apos;s easier to locate dealer closest to you. Select and search – That&apos;s it!</p>
            </div>
          </div>
          <div className="col-md-12">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="col-lg-3 col-sm-6">
                  <select name="country" className="form-control">
                    <option value="">Select Country</option>
                    <option value="Country 1">Country 1</option>
                    <option value="Country 2">Country 2</option>
                    <option value="Country 3">Country 3</option>
                  </select>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <select name="state" className="form-control">
                    <option value="">Select State</option>
                    <option value="State 1">State 1</option>
                    <option value="State 2">State 2</option>
                    <option value="State 3">State 3</option>
                  </select>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <select name="city" className="form-control">
                    <option value="">Select City</option>
                    <option value="City 1">City 1</option>
                    <option value="City 2">City 2</option>
                    <option value="City 3">City 3</option>
                  </select>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <input type="submit" className="btn fw" value="Search" />
                </div>
              </div>
            </form>
            {searched && (
              <p style={{ marginTop: 20, color: '#666' }}>
                No dealers found. Please try different filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
