'use client'

import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

const slides = [
  { color: 'Red',      dotColor: '#a92323', filter: 'none' },
  { color: 'Golden',   dotColor: '#c0a05d', filter: 'hue-rotate(50deg) saturate(1.3)' },
  { color: 'Gray Blue',dotColor: '#7489af', filter: 'hue-rotate(220deg) saturate(0.6) brightness(0.9)' },
]

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
                <span>Choose Your Favourite</span> Color
              </h2>
              <p>
                Check out here the 3 SS-100 color images to decide which one
                suits you the best. SS-100 is available in 3 color options: Red, Golden, Blue.
                You can also download your favourite SS-100 color image.
              </p>
            </div>
          </div>
          <div className="col-lg-7 col-12 pt-lg-5">
            <div className="pt-lg-5">
              <Swiper
                modules={[Navigation]}
                navigation
                slidesPerView={1}
                loop
                onSwiper={(swiper) => { swiperRef.current = swiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="color-variation-slider m-top-30"
              >
                {slides.map((s) => (
                  <SwiperSlide key={s.color}>
                    <div className="item pt-5" style={{ filter: s.filter }}>
                      <img
                        src="/images/hero-bike.webp"
                        alt={`SS-100 - ${s.color}`}
                        className="img-fluid"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Colored dot pagination matching original Owl Carousel style */}
              <div className="color-variation-slider" style={{ textAlign: 'center', marginTop: 20 }}>
                <div className="owl-dots" style={{ display: 'inline-block' }}>
                  {slides.map((s, i) => (
                    <button
                      key={s.color}
                      onClick={() => swiperRef.current?.slideToLoop(i)}
                      className={`owl-dot ${s.color.toLowerCase().replace(' ', '-')}${activeIndex === i ? ' active' : ''}`}
                      aria-label={s.color}
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
