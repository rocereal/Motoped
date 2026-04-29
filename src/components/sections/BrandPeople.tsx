'use client'

import { useState } from 'react'

const testimonials = [
  {
    img: '/images/nieve-front-45.png',
    quote:
      'NIEVE Q-EN este exact ce aveam nevoie pentru deplasările zilnice prin Sibiu. Consum zero, parcare ușoară și nu mai plătesc combustibil. O investiție care s-a amortizat rapid!',
    name: 'Andrei Popescu',
    role: 'Antreprenor, Sibiu',
  },
  {
    img: '/images/nieve-interior-dashboard.png',
    quote:
      'Am testat-o o săptămână înainte de a o cumpăra. Sunt surprins de cât de silențioasă și ușor de condus este. Bateria LiFePO4 îmi dă 100+ km pe o singură încărcare — mai mult decât am nevoie.',
    name: 'Maria Ionescu',
    role: 'Medic, Sibiu',
  },
  {
    img: '/images/nieve-front-led.png',
    quote:
      'Dealer-ul din Sibiu a fost foarte profesionist. Mi-au explicat totul despre mașină, documentație și au asigurat service rapid. Recomand cu încredere NIEVE Q-EN pentru oricine vrea mobilitate urbană inteligentă.',
    name: 'Cristian Moldovan',
    role: 'IT Manager, Sibiu',
  },
]

export default function BrandPeople() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((a) => (a + 1) % testimonials.length)

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
          <div className="overlay-bg" style={{ backgroundColor: '#dd0606', opacity: 0.88 }} />
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
            <div className="testimonial-wrapper" style={{ position: 'relative' }}>
              <div className="testimonial-slider">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="testimonial-item"
                    style={{ display: i === active ? 'flex' : 'none' }}
                  >
                    <div className="person-img" style={{ position: 'relative' }}>
                      <img
                        src={t.img}
                        alt={t.name}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
                ))}
              </div>

              <div className="owl-nav">
                <button onClick={prev} className="owl-prev" aria-label="Anterior">
                  <i className="fas fa-chevron-left" />
                </button>
                <button onClick={next} className="owl-next" aria-label="Următor">
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
