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

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '2px solid rgba(255,255,255,0.7)',
  borderRadius: '50%',
  width: 48,
  height: 48,
  minWidth: 48,
  minHeight: 48,
  boxSizing: 'border-box',
  padding: 0,
  color: '#fff',
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

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
                        {/* Wrapper with position:relative so the quote icon escapes overflow:hidden on .person-img */}
                        <div style={{ position: 'relative', flex: '0 0 350px', maxWidth: 350 }}>
                          <div className="person-img">
                            <img src={t.img} alt={t.name} />
                          </div>
                          <i
                            className="fas fa-quote-left"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              zIndex: 2,
                              background: '#fff',
                              color: '#000',
                              width: 90,
                              height: 90,
                              borderRadius: '50%',
                              fontSize: 45,
                              lineHeight: '48px',
                              padding: 20,
                              boxSizing: 'border-box',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          />
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

              <div className="owl-nav" style={{ display: 'flex', gap: 10 }}>
                <button
                  className="owl-prev"
                  style={btnStyle}
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Anterior"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="owl-next"
                  style={btnStyle}
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
