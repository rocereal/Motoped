'use client'

import { useState, useEffect, useRef } from 'react'

const features = [
  {
    icon: '/images/svg/motor.svg',
    label: 'Motor Electric',
    text: 'Motorul electric de 3100W (putere maximă 5100W) asigură un cuplu excelent de la pornire. Urci pante de până la 21% fără efort, cu o accelerație liniară și silențioasă, ideală pentru traficul urban.',
    blockClass: 'block1',
    iconClass: 'icon icon1',
  },
  {
    icon: '/images/svg/battery.svg',
    label: 'Baterie LiFePO4',
    text: 'Bateria LiFePO4 de 64V 100Ah oferă siguranță superioară, durată lungă de viață și stabilitate termică excelentă. Tehnologia fosfat de fier-litiu rezistă la mai multe cicluri de încărcare față de bateriile convenționale.',
    blockClass: 'block2',
    iconClass: 'icon icon2',
  },
  {
    icon: '/images/svg/range.svg',
    label: 'Autonomie 90-120 km',
    text: 'O singură încărcare îți oferă între 90 și 120 km de autonomie, suficient pentru deplasările zilnice în oraș și în împrejurimi. Poți pleca dimineața cu bateria plină și ajungi acasă cu rezervă.',
    blockClass: 'block3',
    iconClass: 'icon icon3',
  },
  {
    icon: '/images/svg/charging.svg',
    label: 'Încărcare Simplă',
    text: 'Timpul de încărcare completă este de 5-7 ore, compatibil cu orice priză standard. Poți încărca acasă peste noapte sau la orice stație publică de încărcare, fără echipamente speciale.',
    blockClass: 'block4',
    iconClass: 'icon icon4',
  },
  {
    icon: '/images/svg/speed.svg',
    label: 'Viteză 45 km/h',
    text: 'Viteza maximă de 45 km/h este optimizată pentru mobilitate urbană. Ideală pentru deplasări în oraș fără nicio restricție de circulație, cu costuri de asigurare și întreținere semnificativ mai mici.',
    blockClass: 'block5',
    iconClass: 'icon icon5',
  },
  {
    icon: '/images/svg/connectivity.svg',
    label: 'Conectivitate Smart',
    text: 'Ecranul tactil de 7 inch, conectivitate Bluetooth, radio FM/AM și 2 porturi USB te țin conectat în permanență. Camera de marșarier de înaltă rezoluție și accesul prin cheie cu telecomandă completează experiența modernă.',
    blockClass: 'block6',
    iconClass: 'icon icon6',
  },
]

const LI_ROTATIONS = [0, 60, 120, 180, 240, -60]
const STEP = -60

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [deg, setDeg] = useState(0)
  const circleRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const setSquare = () => {
      const el = circleRef.current
      if (!el) return
      const w = el.offsetWidth
      el.style.height = w + 'px'
      const wrapper = el.nextElementSibling as HTMLElement | null
      if (wrapper) wrapper.style.height = wrapper.offsetWidth + 'px'
    }
    setSquare()
    window.addEventListener('resize', setSquare)
    return () => window.removeEventListener('resize', setSquare)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        setDeg((d) => d + STEP)
        return (prev + 1) % features.length
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  const handleIconClick = (index: number) => {
    const diff = index - activeIndex
    let steps = diff
    if (steps > 3) steps -= 6
    if (steps < -3) steps += 6
    setDeg((d) => d + steps * STEP)
    setActiveIndex(index)
  }

  return (
    <section id="feature" className="features-section gray-bg" style={{ position: 'relative' }}>
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundColor: '#000',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left',
              backgroundSize: '100% 100%',
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mb-lg-5">
            <div className="heading-wrapper text-center">
              <h2 className="large-heading text-uppercase" style={{ color: '#fff' }}>
                <span>Caracteristici</span>Smart
              </h2>
            </div>
          </div>

          {/* Desktop: spinning circle (lg+) */}
          <div className="col-lg-12 col-12 mb-lg-5 d-none d-lg-flex" style={{ justifyContent: 'end' }}>
            <div className="services">
              <div>
                <div className="circle--slider">
                  <div className="rotate--circle">
                    <ul
                      className="circle--rotate count6"
                      ref={circleRef}
                      style={{
                        transform: `rotate(${deg}deg)`,
                        WebkitTransform: `rotate(${deg}deg)`,
                        transition: 'transform 0.4s ease',
                      }}
                    >
                      {features.map((f, i) => (
                        <li
                          key={f.label}
                          className={`${f.blockClass}${i === activeIndex ? ' active' : ''}`}
                        >
                          <div
                            className={f.iconClass}
                            onClick={() => handleIconClick(i)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span
                              style={{
                                display: 'block',
                                transform: `rotate(${-(LI_ROTATIONS[i] + deg)}deg)`,
                                WebkitTransform: `rotate(${-(LI_ROTATIONS[i] + deg)}deg)`,
                              }}
                            >
                              <img src={f.icon} alt={f.label} className="img-fluid" />
                              <p className="icon-text">{f.label}</p>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="animate-wrapper">
                      {features.map((f, i) => (
                        <div
                          key={f.label}
                          className={`animate animate${i + 1}${i === activeIndex ? ' active' : ''}`}
                        >
                          <div className="animate-img">
                            <div className="animate-img__in">
                              <div className="animate-more">
                                <div className="animate-title">
                                  <div className="p-center sm-image">
                                    <p className="mb-0 text-dark font-w-600">{f.label}</p>
                                    <p className="feature-font text-dark">{f.text}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: simple card layout (below lg) */}
          <div className="col-12 d-block d-lg-none pb-5">
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div
                style={{
                  background: '#1a1a1a',
                  borderRadius: 16,
                  padding: '32px 24px',
                  textAlign: 'center',
                  minHeight: 260,
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <img
                    src={features[activeIndex].icon}
                    alt={features[activeIndex].label}
                    style={{ width: 64, height: 64 }}
                  />
                </div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 10, fontFamily: "'Poppins', sans-serif" }}>
                  {features[activeIndex].label}
                </p>
                <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  {features[activeIndex].text}
                </p>
              </div>

              {/* Dot navigation */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveIndex(i); setDeg(i * STEP); }}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: 'none',
                      padding: 0,
                      background: i === activeIndex ? '#DD0707' : '#555',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
