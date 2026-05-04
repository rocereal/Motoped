'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const tabs = [
  {
    id: 'exterior',
    label: 'Exterior',
    images: [
      { src: '/images/gallery-ext-1.png', caption: 'Față Elegantă' },
      { src: '/images/gallery-ext-2.png', caption: 'Design Compact' },
      { src: '/images/gallery-ext-3.png', caption: 'Profil Aerodinamic' },
      { src: '/images/gallery-ext-4.png', caption: 'Vedere Laterală' },
      { src: '/images/gallery-ext-5.png', caption: 'Detalii Caroserie' },
      { src: '/images/gallery-ext-6.png', caption: 'Spate Compact' },
    ],
    columns: 3,
  },
  {
    id: 'interior',
    label: 'Interior',
    images: [
      { src: '/images/gallery-int-1.png', caption: 'Habitaclu Modern' },
      { src: '/images/gallery-int-2.png', caption: 'Scaune Confortabile' },
      { src: '/images/gallery-int-3.png', caption: 'Bord Digital' },
      { src: '/images/gallery-int-4.png', caption: 'Ecran Touchscreen 7"' },
      { src: '/images/gallery-int-5.png', caption: 'Spațiu Interior' },
      { src: '/images/gallery-int-6.png', caption: 'Detalii Interior' },
    ],
    columns: 3,
  },
]

export default function SmartFeaturesGallery() {
  const [activeTab, setActiveTab] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (imgIndex: number) => {
    setLightboxIndex(imgIndex)
    setLightboxOpen(true)
  }

  const selectTab = (i: number) => {
    setActiveTab(i)
    setNavOpen(false)
    setLightboxOpen(false)
  }

  const currentSlides = tabs[activeTab].images.map((img) => ({
    src: img.src,
    alt: img.caption,
  }))

  return (
    <section id="galerie" className="technology-section gray-bg">
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
            <div className={`tab-section vertical-tab m-top-30${navOpen ? ' nav-open' : ''}`}>

              {/* Mobile: custom select-filter div — hidden on desktop via style.css */}
              <div
                className="select-filter"
                onClick={() => setNavOpen(!navOpen)}
              >
                {tabs[activeTab].label}
              </div>

              {/* Nav tabs */}
              <ul className="nav nav-tabs text-uppercase" role="tablist">
                {tabs.map((tab, i) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      className={`nav-link${i === activeTab ? ' active' : ''}`}
                      role="tab"
                      onClick={() => selectTab(i)}
                    >
                      {tab.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tab content */}
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
                              openLightbox(imgIdx)
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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={currentSlides}
        index={lightboxIndex}
        plugins={[Counter, Slideshow, Zoom, Thumbnails]}
        counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
        zoom={{ maxZoomPixelRatio: 3 }}
        thumbnails={{ position: 'bottom', width: 80, height: 60, gap: 8 }}
      />
    </section>
  )
}
