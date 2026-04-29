const features = [
  { icon: '/images/rim-icon.png', title: 'More Powerful RIM', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { icon: '/images/engine-icon.png', title: 'More Powerful Engine', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { icon: '/images/shock-icon.png', title: 'All New Suspension', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
]

const featuresRight = [
  { icon: '/images/chasis-icon.png', title: 'Powerful Chassis', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { icon: '/images/break-icon.png', title: 'All New Brakes', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
  { icon: '/images/speedometer-icon.png', title: 'Digital Speedometer', desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque.' },
]

export default function Features() {
  return (
    <section id="feature" className="feature-section black-bg light-text">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-wrapper text-center">
              <h2 className="large-heading text-uppercase"><span>Smart</span>feature</h2>
            </div>
          </div>
          <div className="col-lg-4">
            {features.map((f) => (
              <div className="features-box" key={f.title}>
                <div className="feature-ico">
                  <img src={f.icon} alt={f.title} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="circle-animation"></div>
            <div className="features-middle-img">
              <img src="/images/motorcycle-features-img.png" alt="motorcycle features" />
            </div>
          </div>
          <div className="col-lg-4">
            {featuresRight.map((f) => (
              <div className="features-box" key={f.title}>
                <div className="feature-ico">
                  <img src={f.icon} alt={f.title} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
