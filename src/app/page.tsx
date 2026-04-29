import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import SmartFeaturesGallery from '@/components/sections/SmartFeaturesGallery'
import ColorVariation from '@/components/sections/ColorVariation'
import EnvironmentalImpacts from '@/components/sections/EnvironmentalImpacts'
import TechnicalSpecifications from '@/components/sections/TechnicalSpecifications'
import BrandPeople from '@/components/sections/BrandPeople'
import DealerFinder from '@/components/sections/DealerFinder'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <div className="wrapper" id="top">
        <Header />
        <div className="main-container">
          <Hero />
          <About />
          <Features />
          <SmartFeaturesGallery />
          <ColorVariation />
          <EnvironmentalImpacts />
          <TechnicalSpecifications />
          <BrandPeople />
          <DealerFinder />
          <Contact />
        </div>
        <Footer />
      </div>
    </>
  )
}
