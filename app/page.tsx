'use client'

import { useRef } from 'react'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ReadingText from './components/ReadingText/ReadingText'
import Gallery from './components/Gallery/Gallery'
import Footer from './components/Footer/Footer'

export default function Home() {
  const navbarRef = useRef<HTMLElement>(null)

  // Image pour les bandes de la section Gallery
  const portraitImage = {
    src: '/images/dexnill rouge defaut.JPG',
    alt: 'Portrait',
    width: 1200,
    height: 1600,
  }

  return (
    <>
      <Navbar ref={navbarRef} />
      <main>
        <Hero navbarRef={navbarRef} />
        <ReadingText text="Capturer l'instant, révéler l'émotion. Chaque image raconte une histoire unique, figée dans le temps pour l'éternité." />
        <Gallery portraitImage={portraitImage} />
      </main>
      <Footer />
    </>
  )
}

