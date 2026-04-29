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
    columns: 3,
  },
  {
    id: 'exterior',
    label: 'Exterior',
    images: [
      { src: '/images/nieve-front-white.png', caption: 'Față Elegantă' },
      { src: '/images/nieve-rear-white.png', caption: 'Spate Compact' },
      { src: '/images/nieve-red-side.png', caption: 'Profil Lateral' },
    ],
    columns: 3,
  },
  {
    id: 'interior',
    label: 'Interior',
    images: [
      { src: '/images/nieve-interior-dashboard.png', caption: 'Bord cu Ecran 7 inch' },
      { src: '/images/nieve-interior-seats.png', caption: 'Scaune Confortabile' },
    ],
    columns: 2,
  },
]

type LightboxState = { tabIndex: number; imgIndex: number } | null

export default function SmartFeaturesGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const lbPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!lightbox) return
    const imgs = tabs[lightbox.tabIndex].images
    setLightbox({ ...lightbox, imgIndex: (lightbox.imgIndex - 1 + imgs.length) % imgs.length })
  }

  const lbNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!lightbox) return
    const imgs = tabs[lightbox.tabIndex].images
    setLightbox({ ...lightbox, imgIndex: (lightbox.imgIndex + 1) % imgs.length })
  }

  const currentImg = lightbox ? tabs[lightbox.tabIndex].images[lightbox.imgIndex] : null

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

              {/* Mobile: native select — hidden on desktop via CSS */}
              <select
                className="tab-mobile-select"
                value={activeTab}
                onChange={(e) => setActiveTab(Number(e.target.value))}
              >
                {tabs.map((tab, i) => (
                  <option key={tab.id} value={i}>{tab.label}</option>
                ))}
              </select>

              {/* Nav tabs — exact template structure, hidden on mobile via CSS */}
              <ul className="nav nav-tabs text-uppercase" role="tablist">
                {tabs.map((tab, i) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      className={`nav-link${i === activeTab ? ' active' : ''}`}
                      role="tab"
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tab content — exact template structure */}
              <div className="tab-content">
                {tabs.map((tab, i) => (
                  <div
                    key={tab.id}
                    id={tab.id}
                    className={`tab-pane${i === activeTab ? ' active' : ''}`}
                    role="tabpanel"
                    style={{ display: i === activeTab ? 'block' : 'none' }}
                  >
                    <ul className={`st-gallery column-${tab.columns}`}>
                      {tab.images.map((img, imgIdx) => (
                        <li key={img.src}>
                          <a
                            href={img.src}
                            onClick={(e) => {
                              e.preventDefault()
                              setLightbox({ tabIndex: i, imgIndex: imgIdx })
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

      {/* Lightbox — replaces FancyBox */}
      {lightbox && currentImg && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <button onClick={lbPrev} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', width: 52, height: 52, color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-chevron-left" />
          </button>

          <img
            src={currentImg.src}
            alt={currentImg.caption}
            style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />

          <button onClick={lbNext} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '50%', width: 52, height: 52, color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-chevron-right" />
          </button>

          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 24, right: 32, background: 'none', border: 'none', color: '#fff', fontSize: 40, lineHeight: 1, cursor: 'pointer' }}>
            &times;
          </button>

          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: 14, fontFamily: "'Poppins',sans-serif", background: 'rgba(0,0,0,0.5)', padding: '5px 14px', borderRadius: 4, whiteSpace: 'nowrap' }}>
            {currentImg.caption} &nbsp;·&nbsp; {(lightbox.imgIndex + 1)}/{tabs[lightbox.tabIndex].images.length}
          </div>
        </div>
      )}
    </section>
  )
}
