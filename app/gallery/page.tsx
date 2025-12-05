'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import { projects } from '../data/projects'
import styles from './page.module.scss'

gsap.registerPlugin(ScrollTrigger, Draggable)

export default function GalleryPage() {
  const containerRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const draggableInstance = useRef<Draggable | null>(null)
  const navbarRef = useRef<HTMLElement>(null)

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
      const items = gallery.querySelectorAll(`.${styles.galleryItem}`)
      let totalHeight = 0
      const gap = 20 // gap réduit en pixels
      items.forEach((item) => {
        totalHeight += (item as HTMLElement).offsetHeight + gap
      })
      return totalHeight
    }

    // Calculer la hauteur totale
    let totalHeight = calculateTotalHeight()

    // Définir la hauteur du conteneur pour permettre le scroll vertical
    gsap.set(gallery, {
      height: totalHeight,
    })

    // Calculer la hauteur du conteneur visible (moins la navbar)
    const getContainerHeight = () => {
      const navbarHeight = navbarRef.current?.offsetHeight || 0
      return window.innerHeight - navbarHeight
    }

    const containerHeight = getContainerHeight()
    const scrollDistance = Math.max(0, totalHeight - containerHeight)

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
        onUpdate: (self) => {
          // Synchroniser le drag avec le scroll
          if (draggableInstance.current && !draggableInstance.current.isDragging) {
            const progress = self.progress
            const y = -scrollDistance * progress
            gsap.set(gallery, { y })
          }
        },
      },
    })

    // Créer le drag & drop vertical avec Draggable
    draggableInstance.current = Draggable.create(gallery, {
      type: 'y',
      bounds: {
        minY: -scrollDistance,
        maxY: 0,
      },
      inertia: true,
      onDrag: function () {
        // Synchroniser avec le scroll
        const progress = Math.abs(this.y) / scrollDistance
        scrollTween.progress(progress)
      },
    })[0]

    // Recalculer sur resize
    const handleResize = () => {
      totalHeight = calculateTotalHeight()
      gsap.set(gallery, { height: totalHeight })
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (draggableInstance.current) {
        draggableInstance.current.kill()
      }
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
      <Footer />
    </>
  )
}
