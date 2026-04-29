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
            <a href="#top" onClick={(e) => handleNavClick(e, 'top')} title="Motoped.ro - NIEVE Q-EN">
              <img src="/images/logo-motoped.png" alt="Motoped.ro" className="regular-logo img-fluid logo-img" />
              <img src="/images/logo-motoped.png" alt="Motoped.ro" className="sticky-logo img-fluid logo-img" />
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
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>Despre</a></li>
                <li><a href="#feature" onClick={(e) => handleNavClick(e, 'feature')}>Caracteristici</a></li>
                <li><a href="#variation" onClick={(e) => handleNavClick(e, 'variation')}>Culori</a></li>
                <li><a href="#impact" onClick={(e) => handleNavClick(e, 'impact')}>Avantaje</a></li>
                <li><a href="#dealer" onClick={(e) => handleNavClick(e, 'dealer')}>Dealer</a></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
              </ul>
              <ul className="header-social-media">
                <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                <li><a href="#"><i className="fab fa-youtube"></i></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
