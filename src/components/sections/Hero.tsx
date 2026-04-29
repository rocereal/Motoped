'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const progressRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let value = 0
    const end = 100
    const speed = 100
    const timer = setInterval(() => {
      value++
      if (valueRef.current) valueRef.current.textContent = `${value}%`
      if (progressRef.current) {
        progressRef.current.style.background = `conic-gradient(#248C46 ${value * 3.6}deg, #ededed 0deg)`
      }
      if (value === end) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="home"
      className="height-100 hero-section style-1 light-text"
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: '#000',
        backgroundImage: "url('/images/bg-11.jpg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="container double-top-padding double-bottom-padding">
        <div className="row">
          <div className="col-lg-5 col-md-12 banner-content bicycle-img">
            <h2 className="top-sub-heading">New SS-100</h2>
            <h1 className="large-heading"><span>Smart &amp; Connected</span>E-BIKE</h1>
            <div className="text-block text-lead">
              <p>
                The most popular electric motorcycles include SS-100 ($10,000),
                SS-130 ($10,500) and SS-200 ($12,000).
              </p>
            </div>
            <div className="btn-wrapper">
              <a
                className="btn btn-primary btn-accent has-icon"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>Download brochure</span><i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-7 col-12 px-0">
            <div className="container1 d-none d-lg-block">
              <div className="circular-progress" ref={progressRef}>
                <span className="progress-value" ref={valueRef}>0%</span>
              </div>
              <div className="hero-img">
                <img src="/images/hero-bike.webp" alt="SS-100 E-Bike" className="img-fluid" />
              </div>
              <span className="blink">
                <img src="/images/charging-image.webp" alt="charging" className="img-fluid" />
              </span>
            </div>
            <div className="d-block d-lg-none" style={{ textAlign: 'center', padding: '20px 0' }}>
              <img src="/images/hero-bike.webp" alt="SS-100 E-Bike" className="img-fluid" style={{ maxHeight: 280 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
