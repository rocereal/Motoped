'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

const variations = [
  { image: '/images/cap-img-1.png', color: 'Red' },
  { image: '/images/cap-img-2.png', color: 'Golden' },
  { image: '/images/cap-img-3.png', color: 'Gray Blue' },
]

export default function ColorVariation() {
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
                suits you the best. SS-100 is available in 3 color options: Red, Yellow, Blue.
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
                spaceBetween={0}
                loop
                className="color-variation-slider m-top-30"
              >
                {variations.map((v) => (
                  <SwiperSlide key={v.color}>
                    <div className="item pt-5">
                      <img src={v.image} alt={`SS-100 - ${v.color}`} className="img-fluid" />
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
