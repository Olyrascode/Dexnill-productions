'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './PageTransition.module.scss'

type PageTransitionProps = {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return

    // Pas d'animation au premier chargement
    if (isFirstLoad) {
      gsap.set(contentRef.current, { opacity: 1 })
      gsap.set(overlayRef.current, { display: 'none' })
      setIsFirstLoad(false)
      return
    }

    // Animation d'entrée : volet noir glisse de droite à gauche
    const tl = gsap.timeline()

    // Le contenu reste visible pendant que le volet arrive
    tl.set(contentRef.current, {
      opacity: 1,
    })
      .set(overlayRef.current, {
        x: '100%',
        display: 'block',
      })
      .to(overlayRef.current, {
        x: '0%',
        duration: 0.5,
        ease: 'power3.inOut',
      })
      // Une fois le volet noir couvre l'écran, on peut cacher le contenu
      .set(contentRef.current, {
        opacity: 0,
      })
      // Petit délai pour que le nouveau contenu se charge
      .to({}, { duration: 0.1 })
      // Afficher le nouveau contenu
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
      // Le volet noir sort vers la gauche
      .to(
        overlayRef.current,
        {
          x: '-100%',
          duration: 0.5,
          ease: 'power3.inOut',
        },
        '-=0.1'
      )
      .set(overlayRef.current, {
        display: 'none',
      })
  }, [pathname, isFirstLoad])

  return (
    <>
      <div ref={overlayRef} className={styles.overlay} />
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </>
  )
}

