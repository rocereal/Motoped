'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'

const testimonials = [
  {
    img: '/images/client-1.png',
    quote: 'Am luat permisul la 16 ani și prima mașină a fost NIEVE Q-EN. E perfectă pentru școală și ieșiri cu prietenii. O încarc acasă peste noapte și dimineața e gata — nu mai cer bani de benzină!',
    name: 'Alexandru M.',
    role: 'Elev, 16 ani, Cluj',
  },
  {
    img: '/images/client-2.png',
    quote: 'Nu credeam că voi conduce propria mașină la 17 ani. NIEVE Q-EN e ușor de condus, se parchează oriunde și colegii mei sunt toți curioși de ea. Cea mai bună decizie a familiei mele!',
    name: 'Ioana D.',
    role: 'Elevă, 17 ani, Sibiu',
  },
  {
    img: '/images/client-3.png',
    quote: 'Părinții mei au ales NIEVE Q-EN pentru că e sigură și economică. Eu o iubesc pentru că arată cool și pot merge oriunde în oraș fără să depind de nimeni.',
    name: 'Mihai T.',
    role: 'Elev, 16 ani, București',
  },
  {
    img: '/images/client-4.png',
    quote: 'De când am NIEVE Q-EN merg singură la liceu și la antrenamente. E silențioasă, nu poluează și părinții mei sunt liniștiți că e echipată cu ABS și centură. Win-win!',
    name: 'Sofia R.',
    role: 'Elevă, 17 ani, Brașov',
  },
  {
    img: '/images/client-5.png',
    quote: 'La 16 ani visam la o mașină. NIEVE Q-EN a făcut visul realitate — e accesibilă, nu costă nimic la încărcat și e perfectă pentru orașul nostru. Toți prietenii vor să vină cu mine!',
    name: 'Radu P.',
    role: 'Elev, 16 ani, Sibiu',
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
              <h2 className="large-heading text-uppercase">Ce Spun Tinerii</h2>
            </div>
            <div className="text-block text-lead text-center">
              <p>Experiențe reale de la tinerii de 16–17 ani care conduc NIEVE Q-EN în fiecare zi.</p>
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

              <div className="owl-nav" style={{ display: 'flex', gap: 10, position: 'relative', justifyContent: 'center', marginTop: 30 }}>
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
