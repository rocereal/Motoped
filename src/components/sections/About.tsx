export default function About() {
  return (
    <section id="about" className="about-section mb-5">
      <div className="container">
        <div className="row align-items-center bicycle-img">
          <div className="col-md-6">
            <div className="img-wrapper">
              <img src="/images/image-2.jpg" alt="SS-100 E-Bike" className="img-fluid" />
            </div>
          </div>
          <div className="col-md-6 about-text">
            <div className="heading-wrapper">
              <h2 className="large-heading text-uppercase"><span>About</span>SS-100</h2>
            </div>
            <div className="text-block">
              <p>
                The SS-100 is an electric motorcycle produced by an Indian electric
                vehicle manufacturer. As last update in January 2023, the SS-100 was
                one of Fantastic Motors&apos; flagship models and was designed to cater to the growing
                demand for electric two-wheelers in India.
              </p>
              <p>
                It&apos;s essential to check the latest information and reviews to get the most up-to-date
                details about this electric motorcycle if you are considering purchasing one or
                learning more about it.
              </p>
            </div>
            <div className="btn-wrapper">
              <a href="#" className="btn btn-primary has-icon">
                <span>Read More</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
