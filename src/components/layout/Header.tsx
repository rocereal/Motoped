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

  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    setAppHeight()
    window.addEventListener('resize', setAppHeight)
    return () => window.removeEventListener('resize', setAppHeight)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset, behavior: 'smooth' })
  }

  return (
    <header
      className={`main-header menu-absolute transparent light-header${sticky ? ' sticky' : ''}`}
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-3 logo">
            <a href="#top" onClick={(e) => handleNavClick(e, 'top')} title="Motoped.ro - NIEVE Q-EN">
              <img src="/images/logo-motoped.png" alt="Motoped.ro" className="regular-logo img-fluid" style={{ maxHeight: 50 }} />
              <img src="/images/logo-motoped.png" alt="Motoped.ro" className="sticky-logo img-fluid" style={{ maxHeight: 50 }} />
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
                <li><a href="#despre" onClick={(e) => handleNavClick(e, 'despre')}>Despre</a></li>
                <li><a href="#caracteristici" onClick={(e) => handleNavClick(e, 'caracteristici')}>Caracteristici</a></li>
                <li><a href="#culori" onClick={(e) => handleNavClick(e, 'culori')}>Culori</a></li>
                <li><a href="#avantaje" onClick={(e) => handleNavClick(e, 'avantaje')}>Avantaje</a></li>
                <li><a href="#galerie" onClick={(e) => handleNavClick(e, 'galerie')}>Galerie</a></li>
                <li><a href="#specificatii" onClick={(e) => handleNavClick(e, 'specificatii')}>Specificații</a></li>
                <li><a href="#dealer" onClick={(e) => handleNavClick(e, 'dealer')}>Dealer</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
