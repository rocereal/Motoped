'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'engine', label: 'Engine',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Type</th><td>Liquid Cooled, Single Cylinder, DOHC</td></tr>
          <tr><th scope="row">Displacement</th><td>99 CC</td></tr>
          <tr><th scope="row">Max. Power</th><td>9.99 PS &amp; 9000 RPM</td></tr>
          <tr><th scope="row">Max. Torque</th><td>39 NM</td></tr>
          <tr><th scope="row">Max. Speed</th><td>199 KMPH</td></tr>
          <tr><th scope="row">Bore x Stroke</th><td>72x66 mm</td></tr>
          <tr><th scope="row">Starting</th><td>Kick and Self start</td></tr>
          <tr><th scope="row">Air Filtration</th><td>Dry Paper Pleated Type</td></tr>
          <tr><th scope="row">Valve Per Cylinder</th><td>6</td></tr>
          <tr><th scope="row">Gear Box</th><td>6 Speed</td></tr>
          <tr><th scope="row">Compression Ratio</th><td>9.9:1</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'suspension', label: 'Chassis & Suspension',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Chassis</th><td>Double Cradle</td></tr>
          <tr><th scope="row">Body Type</th><td>Cruiser Bikes</td></tr>
          <tr><th scope="row">Front Suspension</th><td>Telescopic Hydraulic Fork</td></tr>
          <tr><th scope="row">Rear Suspension</th><td>Gas Canister - Twin shock hydraulic</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'transmission', label: 'Transmission',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Transmission</th><td>Auto &amp; Manual</td></tr>
          <tr><th scope="row">Stroke</th><td>65 mm</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'brakes', label: 'Brakes',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Front brake</th><td>Disc</td></tr>
          <tr><th scope="row">Rear brake</th><td>Drum</td></tr>
          <tr><th scope="row">Front Brake Diameter</th><td>300</td></tr>
          <tr><th scope="row">Rear Brake Diameter</th><td>144</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'wheels', label: 'Wheels',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Wheels Type</th><td>Tubeless</td></tr>
          <tr><th scope="row">Tyre Type</th><td>Spoke</td></tr>
          <tr><th scope="row">Wheels Size</th><td>Front: 18 inch Rear: 21 inch</td></tr>
          <tr><th scope="row">Tyre Size</th><td>Front: 90/90-18 | Rear: 120/18-21</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'electricals', label: 'Electricals',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Headlight</th><td>White Halogen</td></tr>
          <tr><th scope="row">Taillight</th><td>Bulb</td></tr>
          <tr><th scope="row">Turn Signal Lamp</th><td>Bulb</td></tr>
          <tr><th scope="row">Low Battery Indicator</th><td>Yes</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: 'dimensions', label: 'Dimensions',
    content: (
      <table className="specifications">
        <tbody>
          <tr><th scope="row">Fuel Capacity</th><td>18 Ltr</td></tr>
          <tr><th scope="row">Saddle Height</th><td>765 mm</td></tr>
          <tr><th scope="row">Wheelbase</th><td>1368 mm</td></tr>
          <tr><th scope="row">Kerb Weight</th><td>180 Kgs</td></tr>
        </tbody>
      </table>
    ),
  },
]

export default function Specifications() {
  const [active, setActive] = useState('engine')
  const current = tabs.find((t) => t.id === active)!

  return (
    <section id="technical" className="specifications-section gray-bg">
      <div className="section-background">
        <div className="background-wrapper">
          <div
            className="background-inner"
            style={{
              backgroundImage: "url('/images/bike-1.png')",
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
              <h2 className="large-heading text-uppercase"><span>Technical</span>Specifications</h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="tab-section vertical-tab m-top-30">
              <div className="select-filter">{current.label}</div>
              <ul className="nav nav-tabs text-uppercase" role="tablist">
                {tabs.map((tab) => (
                  <li key={tab.id} className="nav-item">
                    <span
                      role="button"
                      className={`nav-link${active === tab.id ? ' active' : ''}`}
                      onClick={() => setActive(tab.id)}
                    >
                      {tab.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="tab-content">
                <div className="tab-pane active">
                  <h3 className="tab-title">{current.label}</h3>
                  {current.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
