'use client'

import { useRef, RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Hero.module.scss'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

type HeroProps = {
  navbarRef: RefObject<HTMLElement>
}

export default function Hero({ navbarRef }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!maskRef.current || !titleRef.current || !subtitleRef.current || !heroRef.current || !navbarRef.current) return

    // Animation de zoom révélateur du masque contrôlée par le scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top', // Démarre quand le haut de la section atteint le haut de la fenêtre
        end: '+=3000', // Augmente la distance de scroll pour ralentir l'animation (3000px de scroll)
        scrub: 1.5, // L'animation suit le scroll avec un délai légèrement plus long pour plus de fluidité
        pin: true, // Épingle la section pendant le scroll
      },
    })

    // Initialiser l'opacité du masque à 1
    tl.set(maskRef.current, {
      opacity: 1,
      scale: 1,
    })
      // Zoom du masque pour révéler toute la section hero (zoom encore plus important)
      // L'opacité commence à diminuer seulement après un certain zoom pour éviter le passage au noir
      .to(maskRef.current, {
        scale: 100, // Zoom très important pour un effet dramatique
        duration: 4, // Durée plus longue pour que le zoom prenne plus de distance de scroll
        ease: 'power2.inOut',
      })
      // Faire disparaître le masque progressivement, en commençant quand le zoom est bien avancé
      .to(
        maskRef.current,
        {
          opacity: 0,
          duration: 2, // Durée plus longue pour une disparition plus progressive
          ease: 'power2.in',
        },
        '-=1.5' // Commence à disparaître plus tôt pendant le zoom
      )
      // Animations fade-in-up avec effet de glissement : commencer pendant la disparition du masque
      // Le titre commence en premier, de manière très progressive
      .fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 40, // Distance réduite pour un effet plus doux
        },
        {
          opacity: 1,
          y: 0,
          duration: 2.5, // Durée plus longue pour une apparition plus progressive
          ease: 'power2.out', // Easing pour un glissement fluide
        },
        '-=2' // Commence pendant que le masque disparaît encore
      )
      // Le sous-titre apparaît légèrement après le titre
      .fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30, // Distance réduite pour un effet plus doux
        },
        {
          opacity: 1,
          y: 0,
          duration: 2.5, // Durée plus longue pour une apparition plus progressive
          ease: 'power2.out', // Easing pour un glissement fluide
        },
        '-=2.2' // Commence légèrement après le titre
      )
      // Animation de la navbar : slide du haut vers le bas de manière progressive
      // Mêmes réglages que le titre pour une cohérence visuelle
      .fromTo(
        navbarRef.current,
        {
          y: -40, // Même distance que le titre pour un effet cohérent
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 2.5, // Même durée que le titre
          ease: 'power2.out',
        },
        '-=2' // Commence au même moment que le titre
      )
  }, { scope: heroRef, dependencies: [navbarRef] })

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Conteneur vidéo YouTube - toujours visible, ne bouge pas */}
      <div ref={videoRef} className={styles.videoContainer}>
        <iframe
          src="https://www.youtube.com/embed/YodkjkC5jkw?autoplay=1&mute=1&loop=1&playlist=YodkjkC5jkw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          className={styles.video}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Background video"
        />
      </div>

      {/* Masque noir avec texte DEXNILL qui révèle la section hero */}
      {/* C'est CE div qui va zoomer pour révéler la vidéo */}
      <div ref={maskRef} className={styles.mask}>
        {/* Laissez cette div vide. Le masque SVG gère le 'trou' du texte. */}
      </div>

      {/* Sous-titre et titre final */}
      <div className={styles.titleContainer}>
        <p ref={subtitleRef} className={styles.subtitle}>
          Portfolio Photographie
        </p>
        <h1 ref={titleRef} id="site-title" className={styles.siteTitle}>
          Dexnill Productions
        </h1>
      </div>
    </section>
  )
}

