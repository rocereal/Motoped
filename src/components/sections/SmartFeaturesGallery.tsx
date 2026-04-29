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

type LightboxState = { tabIndex: number; imgIndex: number } | null

export default function SmartFeaturesGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [navOpen, setNavOpen] = useState(true)
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const openLightbox = (tabIndex: number, imgIndex: number) => {
    setLightbox({ tabIndex, imgIndex })
  }

  const closeLightbox = () => setLightbox(null)

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

  const handleTabClick = (i: number) => {
    setActiveTab(i)
    if (typeof window !== 'undefined' && window.innerWidth < 767) {
      setNavOpen(false)
    }
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
              <div
                className="select-filter"
                onClick={() => setNavOpen((v) => !v)}
              >
                {tabs[activeTab].label}
              </div>
              <ul
                className="nav nav-tabs text-uppercase"
                role="tablist"
                style={{ display: navOpen ? undefined : 'none' }}
              >
                {tabs.map((tab, i) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      className={`nav-link${i === activeTab ? ' active' : ''}`}
                      role="tab"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTabClick(i)}
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
                    style={{ display: i === activeTab ? 'block' : 'none' }}
                  >
                    <ul className={`st-gallery column-${tab.images.length === 2 ? '2' : '3'}`}>
                      {tab.images.map((img, imgIdx) => (
                        <li key={img.src}>
                          <a
                            href={img.src}
                            onClick={(e) => {
                              e.preventDefault()
                              openLightbox(i, imgIdx)
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

      {lightbox && currentImg && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={lbPrev}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50%', width: 52, height: 52, color: '#fff',
              fontSize: 20, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1,
            }}
          >
            <i className="fas fa-chevron-left" />
          </button>

          <img
            src={currentImg.src}
            alt={currentImg.caption}
            style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />

          <div
            style={{
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              color: '#fff', fontSize: 16, fontFamily: "'Poppins', sans-serif",
              background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: 4,
            }}
          >
            {currentImg.caption}
          </div>

          <button
            onClick={lbNext}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50%', width: 52, height: 52, color: '#fff',
              fontSize: 20, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1,
            }}
          >
            <i className="fas fa-chevron-right" />
          </button>

          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 24, right: 32,
              background: 'none', border: 'none', color: '#fff',
              fontSize: 36, lineHeight: 1, cursor: 'pointer',
            }}
          >
            &times;
          </button>

          <div
            style={{
              position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8,
            }}
          >
            {tabs[lightbox.tabIndex].images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, imgIndex: i }) }}
                style={{
                  width: 10, height: 10, borderRadius: '50%', border: 'none', padding: 0,
                  background: i === lightbox.imgIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
