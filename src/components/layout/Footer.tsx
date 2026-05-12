import PhoneLink from '@/components/ui/PhoneLink'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-widget-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Despre Noi</h4>
                </div>
                <div className="widget-contet">
                  <img src="/images/logo-motoped.png" className="footer-logo img-fluid" alt="Motoped.ro" style={{ maxHeight: 50 }} />
                  <p>
                    Dealer autorizat NIEVE în România. Aducem mobilitatea electrică modernă
                    mai aproape de tine — vehicule 100% electrice, ecologice și accesibile,
                    disponibile în Sibiu.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Navigare</h4>
                </div>
                <div className="widget-contet footer-menu">
                  <ul className="menu">
                    <li><a href="#despre">Despre</a></li>
                    <li><a href="#caracteristici">Caracteristici</a></li>
                    <li><a href="#culori">Culori</a></li>
                    <li><a href="#avantaje">Avantaje</a></li>
                    <li><a href="#galerie">Galerie</a></li>
                    <li><a href="#specificatii">Specificații</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#dealer">Dealer</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Contact</h4>
                </div>
                <div className="widget-contet contact-info">
                  <div className="widget-contact-info">
                    <i className="fas fa-phone"></i>
                    <h3>Telefon</h3>
                    <span><PhoneLink href="tel:+40376060045">+0376 060 045</PhoneLink></span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-envelope-open"></i>
                    <h3>Email</h3>
                    <span><a href="mailto:contact@motoped.ro">contact@motoped.ro</a></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Adrese</h4>
                </div>
                <div className="widget-contet contact-info">
                  <div className="widget-contact-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Sibiu</h3>
                    <span>
                      Nod Rutier Vestem<br />
                      Șoseaua Sibiului 296, Sibiu<br />
                      <em>(Lângă benzinăria MOL)</em>
                    </span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Lunguletu</h3>
                    <span>
                      Strada Principală, DN7<br />
                      Lunguletu<br />
                      <em>(Vizavi de Piață)</em>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright text-center">
        <div className="container">
          <div className="copyright-text">
            Motoped.ro &copy; 2026 &middot; Toate drepturile rezervate
          </div>
        </div>
      </div>
    </footer>
  )
}
