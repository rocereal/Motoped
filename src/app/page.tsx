import Preloader from '@/components/ui/Preloader'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import ColorVariation from '@/components/sections/ColorVariation'
import EnvironmentalImpacts from '@/components/sections/EnvironmentalImpacts'
import DealerFinder from '@/components/sections/DealerFinder'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Preloader />
      <div className="wrapper" id="top">
        <Header />
        <div className="main-container">
          <Hero />
          <About />
          <Features />
          <ColorVariation />
          <EnvironmentalImpacts />
          <DealerFinder />
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  )
}
