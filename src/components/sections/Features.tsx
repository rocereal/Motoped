'use client'

import { useState, useEffect, useRef } from 'react'

const features = [
  {
    icon: '/images/efficient.png',
    label: 'Efficient Motor',
    text: 'What defines an electric bike from a conventional bicycle is its motor. An electric bike motor should deliver power and value. Hence, whether you are using it to commute to work, or you want to ride rough terrain or climb hills, it should let you do so effortlessly.',
    blockClass: 'block1',
    iconClass: 'icon icon1',
  },
  {
    icon: '/images/plug.png',
    label: 'Quick Charging',
    text: "The good thing about electric bikes is that they can last a wide range, around 35 to 100 miles, before the battery running out. If there is still some charge when you plug it in, then it may take less time.",
    blockClass: 'block2',
    iconClass: 'icon icon2',
  },
  {
    icon: '/images/eco-energy.png',
    label: 'Eco-Friendly',
    text: 'The average gasoline-driven car has a fuel economy of 22 miles and drives around 11,500 miles annually. Working with these figures, each car would produce 8887 grams of carbon dioxide each year.',
    blockClass: 'block3',
    iconClass: 'icon icon3',
  },
  {
    icon: '/images/weight.png',
    label: 'Weight',
    text: 'Their engineering compensates for the weight by clever designs that feel like the extra pounds have disappeared when you start to pedal. The pedal-assist or motor does most of the heavy-duty work so you can enjoy a smooth ride.',
    blockClass: 'block4',
    iconClass: 'icon icon4',
  },
  {
    icon: '/images/pedal.png',
    label: 'Pedaling',
    text: 'These bikes are so popular because they feel like conventional bikes while providing the superior experience of electric bikes. You are essentially controlling the speed with your feet; however, you can accelerate much quicker.',
    blockClass: 'block5',
    iconClass: 'icon icon5',
  },
  {
    icon: '/images/sync.png',
    label: 'Smartphone Integration',
    text: "You can easily connect your electric bike wirelessly with smartphones to include app capabilities like GPS, health tracking, and maps. Other apps may even allow you to unlock your electric bike's integrated lock system.",
    blockClass: 'block6',
    iconClass: 'icon icon6',
  },
]

// CSS .count6 li:nth-child(N) rotations (0-based index)
const LI_ROTATIONS = [0, 60, 120, 180, 240, -60]

const STEP = -60 // 360 / 6 items

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [deg, setDeg] = useState(0)
  const circleRef = useRef<HTMLUListElement>(null)

  // Replicate jQuery's autoHeightCircle() — make the circle square
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
                <span>Smart</span>Features
              </h2>
            </div>
          </div>
          <div className="col-lg-12 col-12 mb-lg-5" style={{ display: 'flex', justifyContent: 'end' }}>
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
                            {/* counter-rotate inner content so labels stay upright */}
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
                                    <span className="d-block d-lg-none d-md-none">
                                      <img src={f.icon} alt="" className="mb-3 img-fluid" />
                                    </span>
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
        </div>
      </div>
    </section>
  )
}
