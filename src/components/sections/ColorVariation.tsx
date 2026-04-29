'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

const variations = [
  { image: '/images/variation-bike-3.png', color: 'Navy' },
  { image: '/images/variation-bike-1.png', color: 'Black' },
  { image: '/images/variation-bike-2.png', color: 'Green' },
  { image: '/images/variation-bike-4.png', color: 'Brown' },
]

export default function ColorVariation() {
  return (
    <section id="variation" className="variation-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper text-center">
              <h2 className="large-heading text-uppercase">
                <span>Choose The</span>Color You Love
              </h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="m-top-30">
              <Swiper
                modules={[Navigation]}
                navigation
                slidesPerView={1}
                spaceBetween={0}
                centeredSlides
                loop
                className="color-variation-slider"
              >
                {variations.map((v) => (
                  <SwiperSlide key={v.color}>
                    <div className="item">
                      <img src={v.image} alt={`Motorcycle - ${v.color}`} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
