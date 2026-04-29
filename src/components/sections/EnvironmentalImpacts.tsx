const impacts = [
  {
    icon: '/images/zero-emission.png',
    title: 'Reduced Emissions',
    desc: "E-bikes produce zero tailpipe emissions, which means they don't release harmful pollutants or greenhouse gases directly into the atmosphere.",
  },
  {
    icon: '/images/energy-saving.png',
    title: 'Energy Efficiency',
    desc: 'E-bikes are more energy-efficient than many other forms of transportation. They use relatively small amounts of electricity.',
  },
  {
    icon: '/images/traffic-light.png',
    title: 'Reduced Traffic Congestion',
    desc: 'E-bikes can help reduce traffic congestion in cities by providing an efficient and convenient mode of transportation.',
  },
  {
    icon: '/images/energy.png',
    title: 'Lower Energy Consumption',
    desc: 'E-bikes consume less energy per mile traveled compared to electric cars or motorcycles.',
  },
  {
    icon: '/images/no-sound.png',
    title: 'Reduced Noise Pollution',
    desc: 'E-bikes are generally quieter than gas-powered vehicles, reducing noise pollution in urban areas.',
  },
  {
    icon: '/images/lifestyles.png',
    title: 'Promotion of Active Transportation',
    desc: 'E-bikes encourage physical activity and outdoor recreation. They can motivate people to choose biking over car trips.',
  },
  {
    icon: '/images/long-bettery.png',
    title: 'Long-Lasting Batteries',
    desc: 'Reducing waste is one way to reduce one\'s carbon footprint. One benefit of owning and riding an e-bike is that it produces little waste.',
  },
  {
    icon: '/images/peak.png',
    title: 'Off-Peak Charging',
    desc: 'Charging a battery means drawing power from the power grid. After a long day, one can charge their bike during off-peak hours.',
  },
  {
    icon: '/images/dust.png',
    title: 'Preventing Air Pollution',
    desc: 'Pollution is a serious problem that plagues many cities. E-bikes do not contribute to the pollution in the air.',
  },
]

export default function EnvironmentalImpacts() {
  return (
    <section
      id="impact"
      className="gallery-section light-text"
      style={{
        position: 'relative',
        backgroundColor: '#000',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
      }}
    >
      <div className="container">
        <div className="row" style={{ position: 'relative' }}>
          <div className="my-lg-5 col-lg-6 col-md-5 col-12 bicycle-img">
            <div className="heading-wrapper text-left">
              <h2 className="large-heading text-uppercase" style={{ color: '#fff' }}>
                <span>Enviormental</span>Impacts of e-bike
              </h2>
              <p style={{ color: '#fff' }} className="mb-0 pt-3">
                E-bikes are zero-emission vehicles since they use lithium-ion
                batteries. Riding an e-bike means you&apos;re not contributing to
                global warming. You will emit no pollutants into the atmosphere.
                In fact, using e-bikes will save up to 500 pounds of carbon emissions each year.
              </p>
              <br />
              <p style={{ color: '#fff' }} className="mb-0">
                Are e-bikes eco friendly? Electric Bikes are Eco Friendly.
                Electric bicycles do consume energy. In comparison to a moped, motorbike
                or a car, the amount of energy used is very small, making them
                more eco friendly choice of transport. Ebikes only use battery power
                which can be recycled when they have reached their life span.
              </p>
            </div>
          </div>
          <div className="wrapper1 col-lg-6 col-md-7 col-12">
            <div className="carousel env-carousel owl-theme d-none d-lg-block d-md-block">
              {impacts.map((item) => (
                <div className="env_carousel__item" key={item.title}>
                  <div className="carousel__item-head">
                    <img src={item.icon} alt={item.title} className="img-fluid" />
                  </div>
                  <div className="carousel__item-body">
                    <p className="title mb-0 head">{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-block d-lg-none d-md-none">
              {impacts.map((item) => (
                <div className="env-sm mb-5" key={item.title}>
                  <div className="carousel__item-head">
                    <img src={item.icon} alt={item.title} className="img-fluid" />
                  </div>
                  <div className="carousel__item-body">
                    <p className="title mb-0 head">{item.title}</p>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
