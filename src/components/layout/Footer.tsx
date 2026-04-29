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
                  <img src="/images/logo-motoped.png" className="footer-logo img-fluid" alt="Motoped.ro" style={{ maxHeight: 60 }} />
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
                    <li><a href="#about">Despre</a></li>
                    <li><a href="#feature">Caracteristici</a></li>
                    <li><a href="#variation">Culori</a></li>
                    <li><a href="#impact">Avantaje</a></li>
                    <li><a href="#dealer">Dealer</a></li>
                    <li><a href="#contact">Contact</a></li>
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
                    <span><a href="tel:+40376060045">+0376 060 045</a></span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-envelope-open"></i>
                    <h3>Email</h3>
                    <span><a href="mailto:contact@motoped.ro">contact@motoped.ro</a></span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Adresă</h3>
                    <span>
                      Nod Rutier Vestem<br />
                      Șoseaua Sibiului 296, Sibiu<br />
                      <em>(Lângă benzinăria MOL)</em>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Abonează-te</h4>
                </div>
                <div className="widget-contet">
                  <div className="newsletter-box">
                    <form method="post">
                      <input type="email" name="email" placeholder="Adresa ta de email" required autoComplete="off" className="form-control" />
                      <button type="submit" className="signup-btn">Abonează-te</button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Urmărește-ne</h4>
                </div>
                <div className="widget-contet">
                  <div className="footer-social">
                    <ul>
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                    </ul>
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
