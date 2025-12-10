'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import { projects } from '../data/projects'
import styles from './page.module.scss'

gsap.registerPlugin(ScrollTrigger)

export default function GalleryPage() {
  const containerRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const navbarRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  // Réinitialiser la position de la page et de la galerie au chargement
  useEffect(() => {
    // Scroller en haut de la page
    window.scrollTo(0, 0)
    
    // Réinitialiser la position de la galerie si elle existe déjà
    if (galleryRef.current) {
      gsap.set(galleryRef.current, { y: 0 })
    }
  }, [])

  useGSAP(() => {
    if (!galleryRef.current || !containerRef.current) return

    // Rendre la navbar visible immédiatement sur la page gallery
    if (navbarRef.current) {
      gsap.set(navbarRef.current, {
        opacity: 1,
        y: 0,
      })
    }

    const gallery = galleryRef.current
    const container = containerRef.current

    // Fonction pour calculer la hauteur totale
    const calculateTotalHeight = () => {
      let totalHeight = 0
      const gap = 20 // gap réduit en pixels
      
      // Ajouter la hauteur du titre
      if (titleRef.current) {
        totalHeight += titleRef.current.offsetHeight + gap
      }
      
      // Ajouter la hauteur des items
      const items = gallery.querySelectorAll(`.${styles.galleryItem}`)
      items.forEach((item) => {
        totalHeight += (item as HTMLElement).offsetHeight + gap
      })
      
      return totalHeight
    }

    // Calculer la hauteur totale
    let totalHeight = calculateTotalHeight()

    // Définir la hauteur du conteneur pour permettre le scroll vertical
    // ET réinitialiser la position à y: 0 pour toujours commencer en haut
    gsap.set(gallery, {
      height: totalHeight,
      y: 0, // Toujours commencer en haut
    })

    // Calculer la hauteur du conteneur visible (moins la navbar)
    const getContainerHeight = () => {
      const navbarHeight = navbarRef.current?.offsetHeight || 0
      return window.innerHeight - navbarHeight
    }

    const containerHeight = getContainerHeight()
    // Calculer la distance de scroll en tenant compte du footer
    // On ajoute un padding-bottom équivalent à la hauteur du footer pour éviter qu'il coupe le dernier projet
    const footerHeight = footerRef.current?.offsetHeight || 0
    const scrollDistance = Math.max(0, totalHeight - containerHeight + footerHeight)

    // Créer le carrousel avec ScrollTrigger (scroll vertical)
    const scrollTween = gsap.to(gallery, {
      y: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // Réinitialiser la position à 0 lors du refresh
          if (window.scrollY === 0) {
            gsap.set(gallery, { y: 0 })
          }
        },
      },
    })
    
    // S'assurer que le ScrollTrigger commence à 0
    scrollTween.progress(0)

    // Recalculer sur resize
    const handleResize = () => {
      totalHeight = calculateTotalHeight()
      gsap.set(gallery, { height: totalHeight })
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      scrollTween.kill()
    }
  }, { scope: containerRef })

  return (
    <>
      <Navbar ref={navbarRef} />
      <main ref={containerRef} className={styles.galleryPage}>
        {/* Texte DEXNILL en background fixe */}
        <div className={styles.backgroundText}>DEXNILL</div>

        {/* Conteneur du carrousel */}
        <div className={styles.galleryContainer}>
          <div ref={galleryRef} className={styles.gallery}>
            {/* Titre de la galerie */}
            <h1 ref={titleRef} className={styles.galleryTitle}>
              Photographie
            </h1>
            
            {projects.map((project, index) => {
              // Pattern : gauche (0), droite (1), centre (2), puis répéter
              const position = index % 3
              const isLeft = position === 0
              const isRight = position === 1
              const isCenter = position === 2

              return (
                <Link
                  key={project.id}
                  href={`/project/${project.slug}`}
                  className={`${styles.galleryItem} ${
                    isLeft ? styles.left : isRight ? styles.right : styles.center
                  }`}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.heroImage.src}
                      alt={project.heroImage.alt}
                      width={project.heroImage.width}
                      height={project.heroImage.height}
                      className={styles.image}
                      sizes="(max-width: 768px) 90vw, 40vw"
                      priority={index < 2}
                    />
                    <div className={styles.overlay}>
                      <h3 className={styles.imageTitle}>{project.title}</h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer ref={footerRef} />
    </>
  )
}
