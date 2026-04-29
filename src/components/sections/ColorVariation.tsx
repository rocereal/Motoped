'use client'

import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

const slides = [
  { color: 'Roșu',  colorClass: 'red',      dotBg: '#a92323', img: '/images/nieve-red.png'   },
  { color: 'Alb',   colorClass: 'golden',   dotBg: '#e0e0e0', img: '/images/nieve-white.png' },
  { color: 'Gri',   colorClass: 'gray-blue', dotBg: '#7489af', img: '/images/nieve-grey.png'  },
]

const dotStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  minWidth: 32,
  borderRadius: '50%',
  border: 'none',
  padding: 0,
  margin: '0 10px',
  cursor: 'pointer',
  display: 'inline-block',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  flexShrink: 0,
}

export default function ColorVariation() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section id="variation" className="color-section bus-layout" style={{ position: 'relative' }}>
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/color-background1.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
              backgroundSize: 'auto',
              zIndex: 0,
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-12 pt-lg-5">
            <div className="heading-wrapper pt-lg-5">
              <h2 className="large-heading text-uppercase" style={{ color: '#000' }}>
                <span>Alege Culoarea</span>Preferată
              </h2>
              <p>
                NIEVE Q-EN este disponibil în 3 culori elegante: Roșu, Alb și Gri.
                Fiecare variantă îți oferă același nivel de performanță și confort,
                iar tu alegi stilul care te reprezintă cel mai bine.
              </p>
            </div>
          </div>
          <div className="col-lg-7 col-12 pt-lg-5">
            <div className="pt-lg-5">
              <Swiper
                slidesPerView={1}
                loop
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="color-variation-slider m-top-30"
              >
                {slides.map((s) => (
                  <SwiperSlide key={s.color}>
                    <div className="item pt-5">
                      <img
                        src={s.img}
                        alt={`NIEVE Q-EN - ${s.color}`}
                        className="img-fluid"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="color-variation-slider">
                <div className="owl-dots" style={{ textAlign: 'center', marginTop: 30 }}>
                  {slides.map((s, i) => (
                    <button
                      key={s.color}
                      onClick={() => swiperRef.current?.slideToLoop(i)}
                      className={`owl-dot ${s.colorClass}${activeIndex === i ? ' active' : ''}`}
                      aria-label={s.color}
                      style={{ ...dotStyle, background: s.dotBg }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
