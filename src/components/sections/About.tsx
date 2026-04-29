'use client'

import { useState } from 'react'

export default function About() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section id="about" className="design-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="img-wrapper">
              <img src="/images/image-2.jpg" alt="DAD3333 motorcycle" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase"><span>About</span>DAD3333</h2>
            </div>
            <div className="text-block text-lead">
              <p>Wheels DAD3333 comes with new modern design to give your more driving power and thrilling experience with added stance, proportions, and a certain attitude.</p>
              <p>It has been designed with great suspension geometry that consists of fork angle and height to absorb front and rear shock.</p>
            </div>
            <div className="btn-wrapper">
              <a href="#" className="btn btn-primary has-icon">
                <span>Read More</span><i className="fas fa-arrow-right"></i>
              </a>
              <button
                className="btn btn-primary btn-accent play-btn"
                onClick={() => setShowVideo(true)}
              >
                <i className="fas fa-play"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showVideo && (
        <div
          className="fancybox-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowVideo(false)}
        >
          <div style={{ position: 'relative', width: '80vw', maxWidth: 900, aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/_sI_Ps7JSEk?autoplay=1&rel=0&controls=1"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: 0 }}
            />
            <button
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute', top: -40, right: 0,
                background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer',
              }}
            >✕</button>
          </div>
        </div>
      )}
    </section>
  )
}
