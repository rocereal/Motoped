'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote:
      'NIEVE Q-EN este exact ce aveam nevoie pentru deplasările zilnice prin Sibiu. Consum zero, parcare ușoară și nu mai plătesc combustibil. O investiție care s-a amortizat rapid!',
    name: 'Andrei Popescu',
    role: 'Antreprenor, Sibiu',
  },
  {
    quote:
      'Am testat-o o săptămână înainte de a o cumpăra. Sunt surprins de cât de silențioasă și ușor de condus este. Bateria LiFePO4 îmi dă 100+ km pe o singură încărcare — mai mult decât am nevoie.',
    name: 'Maria Ionescu',
    role: 'Medic, Sibiu',
  },
  {
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
            <div className="testimonial-wrapper">
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="testimonial-item"
                    style={{
                      display: i === active ? 'flex' : 'none',
                    }}
                  >
                    <div className="person-img" style={{ flexShrink: 0 }}>
                      <div
                        style={{
                          width: 80, height: 80, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 32, color: '#fff',
                        }}
                      >
                        <i className="fas fa-user" />
                      </div>
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

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 32 }}>
                <button
                  onClick={prev}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                    width: 44, height: 44, color: '#fff', fontSize: 18, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      style={{
                        width: 10, height: 10, borderRadius: '50%', border: 'none', padding: 0,
                        background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer', transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                    width: 44, height: 44, color: '#fff', fontSize: 18, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
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
