'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`main-header menu-absolute transparent light-header${sticky ? ' sticky' : ''}`}
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-3 logo">
            <a href="#top" onClick={(e) => handleNavClick(e, 'top')} title="Wheels E-Bike">
              <img src="/images/e-bike-logo-white.png" alt="e-bike" className="regular-logo img-fluid" />
              <img src="/images/e-bike-logo-dark.png" alt="e-bike" className="sticky-logo img-fluid" />
            </a>
            <div
              className={`menu-icon${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="top"></span>
              <span className="middle"></span>
              <span className="bottom"></span>
            </div>
          </div>
          <div className={`col-sm-9 menu-conainer${menuOpen ? ' menu-open' : ''}`}>
            <nav className="site-navigation">
              <ul className="main-menu">
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
                <li><a href="#feature" onClick={(e) => handleNavClick(e, 'feature')}>Features</a></li>
                <li><a href="#variation" onClick={(e) => handleNavClick(e, 'variation')}>Variations</a></li>
                <li><a href="#impact" onClick={(e) => handleNavClick(e, 'impact')}>Impacts</a></li>
                <li><a href="#dealer" onClick={(e) => handleNavClick(e, 'dealer')}>Find Dealer</a></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Get in Touch</a></li>
              </ul>
              <ul className="header-social-media">
                <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#"><i className="fab fa-youtube"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
