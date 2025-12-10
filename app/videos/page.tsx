'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import VideoSlider from '../components/VideoSlider/VideoSlider'
import { videos } from '../data/videos'
import styles from './page.module.scss'

export default function VideosPage() {
  const navbarRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  // Rendre la navbar visible
  useGSAP(() => {
    if (navbarRef.current) {
      gsap.set(navbarRef.current, {
        opacity: 1,
        y: 0,
      })
    }
  }, { scope: navbarRef })

  return (
    <>
      <Navbar ref={navbarRef} />
      <main className={styles.videosPage}>
        {/* Texte DEXNILL en background fixe */}
        <div className={styles.backgroundText}>DEXNILL</div>

        {/* Titre de la page */}
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Vidéos</h1>
        </div>

        {/* Section contenant le slider de vidéos */}
        <section className={styles.videosSection}>
          <VideoSlider videos={videos} />
        </section>
      </main>
      <Footer ref={footerRef} />
    </>
  )
}

