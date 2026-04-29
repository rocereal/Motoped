import Preloader from '@/components/ui/Preloader'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import ColorVariation from '@/components/sections/ColorVariation'
import Capability from '@/components/sections/Capability'
import Specifications from '@/components/sections/Specifications'
import BookRide from '@/components/sections/BookRide'
import DealerFinder from '@/components/sections/DealerFinder'

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
          <Capability />
          <Specifications />
          <BookRide />
          <DealerFinder />
        </div>
        <Footer />
      </div>
    </>
  )
}
