const impacts = [
  {
    icon: '/images/svg/zero-co2.svg',
    title: 'Zero Emisii CO₂',
    desc: 'NIEVE Q-EN nu produce nicio emisie de gaze de eșapament. Conduci fără să contribui la poluarea aerului și fără să adaugi CO₂ în atmosferă — o alegere responsabilă pentru tine și pentru mediu.',
  },
  {
    icon: '/images/svg/no-fuel.svg',
    title: 'Fără Costuri de Combustibil',
    desc: 'Uită de prețurile în continuă creștere la carburanți. Cu NIEVE Q-EN, plătești doar electricitatea necesară încărcării — echivalentul a câțiva lei pe zi pentru deplasările tale zilnice.',
  },
  {
    icon: '/images/svg/silent.svg',
    title: 'Silențios & Confortabil',
    desc: 'Motorul electric al lui Q-EN funcționează practic în tăcere. Fără zgomotul unui motor cu ardere internă, fiecare deplasare devine mai plăcută — atât pentru tine, cât și pentru comunitate.',
  },
  {
    icon: '/images/svg/disc-brake.svg',
    title: 'Frâne pe Disc 4 Roți',
    desc: 'Sistemul de frânare hidraulic pe toate cele patru roți asigură o oprire sigură și controlată în orice condiții. Siguranța ta este prioritatea noastră numărul unu.',
  },
  {
    icon: '/images/svg/lfp-battery.svg',
    title: 'Baterie Sigură LiFePO4',
    desc: 'Tehnologia LiFePO4 (litiu-fier-fosfat) este considerată cea mai sigură chimie pentru baterii electrice. Stabilitate termică excelentă, risc minim de supraîncălzire și o durată de viață extinsă față de bateriile Li-ion convenționale.',
  },
  {
    icon: '/images/svg/charging-home.svg',
    title: 'Încărcare Acasă',
    desc: 'Nu ai nevoie de o stație specială. Conectezi Q-EN la orice priză standard 220V și în 5-7 ore ai bateria plină. Poți încărca peste noapte și dimineața ești gata de drum.',
  },
  {
    icon: '/images/svg/traffic.svg',
    title: 'Ideal pentru Trafic Urban',
    desc: 'Dimensiunile compacte (2435 x 1192 mm) fac din Q-EN alegerea perfectă pentru traficul din oraș. Parcarea devine simplă, manevrele sunt ușoare, iar deplasările scurte sunt mai rapide ca niciodată.',
  },
  {
    icon: '/images/svg/led.svg',
    title: 'Iluminare LED Completă',
    desc: 'Faruri LED față și spate, lumini de semnalizare integrate și lumini de ceață — o iluminare completă care crește vizibilitatea și siguranța ta pe drumuri, indiferent de condiții.',
  },
  {
    icon: '/images/svg/camera.svg',
    title: 'Cameră Marșarier',
    desc: 'Camera de marșarier de înaltă rezoluție îți oferă o vizibilitate perfectă în spate la fiecare manevră. Parcarea în spații înguste devine simplă și sigură, chiar și pentru șoferii mai puțin experimentați.',
  },
]

export default function EnvironmentalImpacts() {
  return (
    <section
      id="avantaje"
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
                <span>De ce să alegi</span>NIEVE Q-EN?
              </h2>
              <p style={{ color: '#fff' }} className="mb-0 pt-3">
                NIEVE Q-EN este mai mult decât o mașină electrică — este o soluție completă
                pentru mobilitatea urbană modernă. Zero emisii, zero costuri de combustibil
                și un impact minim asupra mediului înconjurător.
              </p>
              <br />
              <p style={{ color: '#fff' }} className="mb-0">
                Cu o baterie LiFePO4 sigură și durabilă, frâne pe disc pe toate cele patru roți
                și dotări smart moderne, Q-EN îți oferă toate avantajele unui vehicul electric
                la un cost accesibil pentru fiecare zi.
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
