'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

const items = [
  { image: '/images/cap-img-1.png', title: 'Lights', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { image: '/images/cap-img-2.png', title: 'ABS', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { image: '/images/cap-img-3.png', title: 'Customize', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { image: '/images/cap-img-2.png', title: 'ABS', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { image: '/images/cap-img-3.png', title: 'Customize', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
]

export default function Capability() {
  return (
    <section id="capability" className="capability-section light-gray-bg">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase"><span>Modern</span>Capability</h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="m-top-30">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3000 }}
                slidesPerView={3}
                spaceBetween={30}
                loop
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                }}
                className="capability-slider"
              >
                {items.map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="cap-item">
                      <div className="cap-img">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="cap-details">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
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
