'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'motor',
    label: 'Motor Electric',
    title: 'Motor Electric',
    rows: [
      ['Tip Motor', 'BLDC (Fără Perii)'],
      ['Putere Nominală', '3100W'],
      ['Putere Maximă', '5100W'],
      ['Tensiune', '64V'],
      ['Cuplu Maxim', '175 Nm'],
      ['Pantă Maximă', '21%'],
      ['Viteză Maximă', '45 km/h'],
    ],
  },
  {
    id: 'baterie',
    label: 'Baterie & Încărcare',
    title: 'Baterie & Încărcare',
    rows: [
      ['Tip Baterie', 'LiFePO4 (Litiu Fosfat de Fier)'],
      ['Capacitate Baterie', '64V 100Ah'],
      ['Autonomie', '90–120 km'],
      ['Timp de Încărcare', '5–7 ore'],
      ['Priză de Încărcare', 'Standard (orice priză)'],
      ['Cicluri de Viață', '≥ 2000 cicluri'],
      ['Protecție BMS', 'Da (suprasarcină, scurtcircuit)'],
    ],
  },
  {
    id: 'suspensie',
    label: 'Suspensie & Direcție',
    title: 'Suspensie & Direcție',
    rows: [
      ['Suspensie Față', 'MacPherson cu arc'],
      ['Suspensie Spate', 'Arc triplu-link'],
      ['Tip Direcție', 'Volan cu coloană ajustabilă'],
      ['Roti', '145/70 R12'],
      ['Jante', 'Aliaj 12 inch'],
    ],
  },
  {
    id: 'frane',
    label: 'Frâne',
    title: 'Frâne',
    rows: [
      ['Frână Față', 'Disc hidraulic'],
      ['Frână Spate', 'Tambur'],
      ['Frână de Mână', 'Mecanism de parcare'],
      ['Sistem ABS', 'Da'],
    ],
  },
  {
    id: 'siguranta',
    label: 'Siguranță',
    title: 'Siguranță',
    rows: [
      ['Centură de Siguranță', 'Da (față și spate)'],
      ['Airbag Șofer', 'Da'],
      ['Cameră Marșarier', 'Da (înaltă rezoluție)'],
      ['Blocare Centralizată', 'Da'],
      ['Cheie cu Telecomandă', 'Da'],
      ['Sistem Anti-efracție', 'Da'],
      ['Geamuri Electrice', 'Da'],
    ],
  },
  {
    id: 'dimensiuni',
    label: 'Dimensiuni',
    title: 'Dimensiuni & Capacitate',
    rows: [
      ['Lungime (mm)', '2550'],
      ['Lățime (mm)', '1340'],
      ['Înălțime (mm)', '1520'],
      ['Ampatament (mm)', '1700'],
      ['Capacitate Pasageri', '2 locuri'],
      ['Greutate Proprie (kg)', '~545'],
      ['Sarcină Maximă (kg)', '150'],
    ],
  },
]

export default function TechnicalSpecifications() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="specifications" className="specifications-section gray-bg">
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/nieve-front-white.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'auto',
              opacity: 0.04,
            }}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase">
                <span>Specificații</span>Tehnice
              </h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="tab-section">

              {/* Mobile: native select dropdown */}
              <select
                className="tab-mobile-select"
                value={activeTab}
                onChange={(e) => setActiveTab(Number(e.target.value))}
              >
                {tabs.map((tab, i) => (
                  <option key={tab.id} value={i}>{tab.label}</option>
                ))}
              </select>

              {/* Desktop: horizontal nav tabs — hidden on mobile via CSS */}
              <ul className="nav nav-tabs text-uppercase" role="tablist">
                {tabs.map((tab, i) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      className={`nav-link${i === activeTab ? ' active' : ''}`}
                      role="tab"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="tab-content">
                {tabs.map((tab, i) => (
                  <div
                    key={tab.id}
                    className={`tab-pane${i === activeTab ? ' active' : ''}`}
                    role="tabpanel"
                    style={{ display: i === activeTab ? 'block' : 'none' }}
                  >
                    <h3 className="tab-title">{tab.title}</h3>
                    <table className="specifications">
                      <tbody>
                        {tab.rows.map(([key, value]) => (
                          <tr key={key}>
                            <th scope="row">{key}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
