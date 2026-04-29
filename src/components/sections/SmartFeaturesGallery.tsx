'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'highlights',
    label: 'Evidențieri',
    images: [
      { src: '/images/nieve-front-led.png', caption: 'Faruri LED Full-Angle' },
      { src: '/images/nieve-front-45.png', caption: 'Design Modern Compact' },
      { src: '/images/nieve-rear-45.png', caption: 'Stopuri LED Integrate' },
    ],
  },
  {
    id: 'exterior',
    label: 'Exterior',
    images: [
      { src: '/images/nieve-front-white.png', caption: 'Față Elegantă' },
      { src: '/images/nieve-rear-white.png', caption: 'Spate Compact' },
      { src: '/images/nieve-red-side.png', caption: 'Profil Lateral' },
    ],
  },
  {
    id: 'interior',
    label: 'Interior',
    images: [
      { src: '/images/nieve-interior-dashboard.png', caption: 'Bord cu Ecran 7 inch' },
      { src: '/images/nieve-interior-seats.png', caption: 'Scaune Confortabile' },
    ],
  },
]

export default function SmartFeaturesGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <section id="gallery" className="technology-section gray-bg">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 text-center">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase">
                <span>Galerie</span>Foto
              </h2>
            </div>
            <div className="text-block text-lead">
              <p>
                Descoperă NIEVE Q-EN din toate unghiurile — exterior impresionant,
                interior modern și detalii care fac diferența.
              </p>
            </div>
          </div>

          <div className="col-md-12">
            <div className="tab-section vertical-tab m-top-30">
              <div className="select-filter">{tabs[activeTab].label}</div>
              <ul className="nav nav-tabs text-uppercase" role="tablist">
                {tabs.map((tab, i) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      className={`nav-link${i === activeTab ? ' active' : ''}`}
                      role="tab"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="tab-content">
                {tabs.map((tab, i) => (
                  <div
                    key={tab.id}
                    className={`tab-pane${i === activeTab ? ' active' : ''}`}
                    role="tabpanel"
                  >
                    <ul className={`st-gallery column-${tab.images.length === 2 ? '2' : '3'}`}>
                      {tab.images.map((img) => (
                        <li key={img.src}>
                          <a
                            href={img.src}
                            onClick={(e) => {
                              e.preventDefault()
                              setLightbox(img.src)
                            }}
                          >
                            <img src={img.src} alt={img.caption} />
                            <span className="caption-text">{img.caption}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 24, right: 32,
              background: 'none', border: 'none', color: '#fff',
              fontSize: 36, lineHeight: 1, cursor: 'pointer',
            }}
          >
            &times;
          </button>
        </div>
      )}
    </section>
  )
}
