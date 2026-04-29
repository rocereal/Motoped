'use client'

import { useState, FormEvent } from 'react'

export default function DealerFinder() {
  const [searched, setSearched] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSearched(true)
  }

  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <h2>Find Dealer Near You</h2>
          </div>
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="col-lg-4 col-sm-6">
                  <select name="country" className="form-control">
                    <option value="">Select Country</option>
                    <option value="Country 1">Country 1</option>
                    <option value="Country 2">Country 2</option>
                    <option value="Country 3">Country 3</option>
                    <option value="Country 4">Country 4</option>
                    <option value="Country 5">Country 5</option>
                  </select>
                </div>
                <div className="col-lg-4 col-sm-6">
                  <select name="city" className="form-control">
                    <option value="">Select City</option>
                    <option value="City 1">City 1</option>
                    <option value="City 2">City 2</option>
                    <option value="City 3">City 3</option>
                    <option value="City 4">City 4</option>
                    <option value="City 5">City 5</option>
                  </select>
                </div>
                <div className="col-lg-4 col-sm-12">
                  <input type="submit" className="btn fw" value="Submit" />
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
