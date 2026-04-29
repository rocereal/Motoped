export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-widget-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">About Us</h4>
                </div>
                <div className="widget-contet">
                  <img src="/images/e-bike-logo-white.png" className="footer-logo img-fluid" alt="E-Bike" />
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Useful Links</h4>
                </div>
                <div className="widget-contet footer-menu">
                  <ul className="menu">
                    <li><a href="#about">About</a></li>
                    <li><a href="#feature">Features</a></li>
                    <li><a href="#variation">Variations</a></li>
                    <li><a href="#impact">Impacts</a></li>
                    <li><a href="#dealer">Find Dealer</a></li>
                    <li><a href="#contact">Get in Touch</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Contact Info</h4>
                </div>
                <div className="widget-contet contact-info">
                  <div className="widget-contact-info">
                    <i className="fas fa-phone"></i>
                    <h3>Phone</h3>
                    <span><a href="tel:+011234567890">+01(123) 456 7890</a></span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-envelope-open"></i>
                    <h3>Email</h3>
                    <span><a href="mailto:info@wheels.com">info@wheels.com</a></span>
                  </div>
                  <div className="widget-contact-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Address</h3>
                    <span>3892 Fincham Road, <br />Los Angeles, CA 90017</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Subscribe</h4>
                </div>
                <div className="widget-contet">
                  <div className="newsletter-box">
                    <form method="post">
                      <input type="email" name="email" placeholder="Enter Email Address" required autoComplete="off" className="form-control" />
                      <button type="submit" className="signup-btn">Sign Up</button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="widget">
                <div className="widget-heading">
                  <h4 className="widget-title">Follow Us</h4>
                </div>
                <div className="widget-contet">
                  <div className="footer-social">
                    <ul>
                      <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i className="fab fa-twitter"></i></a></li>
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
            © 2024 Wheels. Design &amp; Developed by{' '}
            <a target="_blank" rel="noopener noreferrer" href="http://sacredthemes.net/">SacredThemes</a>.
          </div>
        </div>
      </div>
    </footer>
  )
}
