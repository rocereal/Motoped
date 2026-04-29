'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

const testimonials = [
  {
    img: '/images/person-1.jpg',
    quote:
      'NIEVE Q-EN este exact ce aveam nevoie pentru deplasările zilnice prin Sibiu. Consum zero, parcare ușoară și nu mai plătesc combustibil. O investiție care s-a amortizat rapid!',
    name: 'Andrei Popescu',
    role: 'Antreprenor, Sibiu',
  },
  {
    img: '/images/person-1.jpg',
    quote:
      'Am testat-o o săptămână înainte de a o cumpăra. Sunt surprins de cât de silențioasă și ușor de condus este. Bateria LiFePO4 îmi dă 100+ km pe o singură încărcare — mai mult decât am nevoie.',
    name: 'Maria Ionescu',
    role: 'Medic, Sibiu',
  },
]

export default function BrandPeople() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <section id="testimonials" className="testimonial-section racing-car light-text">
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/bg-11.jpg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center bottom',
              backgroundSize: 'cover',
            }}
          />
          <div className="overlay-bg" style={{ backgroundColor: '#dd0606', opacity: 0.85 }} />
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper text-center m-bot-0">
              <h2 className="large-heading text-uppercase">Ce Spun Clienții</h2>
            </div>
            <div className="text-block text-lead text-center">
              <p>Experiențe reale de la proprietarii NIEVE Q-EN din România.</p>
            </div>
          </div>

          <div className="col-md-12">
            <div className="testimonial-wrapper">
              <div className="testimonial-slider">
                <Swiper
                  loop={true}
                  onSwiper={(swiper) => { swiperRef.current = swiper }}
                >
                  {testimonials.map((t, i) => (
                    <SwiperSlide key={i}>
                      <div className="testimonial-item">
                        <div className="person-img" style={{ position: 'relative' }}>
                          <img src={t.img} alt={t.name} />
                        </div>
                        <div className="quote-text">
                          <blockquote>{t.quote}</blockquote>
                          <div className="quote-details">
                            <h3 className="person-name">{t.name}</h3>
                            <span>{t.role}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="owl-nav">
                <button
                  className="owl-prev"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Anterior"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="owl-next"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Următor"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
