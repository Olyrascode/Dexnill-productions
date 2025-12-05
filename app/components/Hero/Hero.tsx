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
      // Faire disparaître le masque progressivement, en commençant quand le texte est déjà visible
      .to(
        maskRef.current,
        {
          opacity: 0,
          duration: 1.5, // Durée pour la disparition progressive
          ease: 'power2.in',
        },
        '-=1' // Commence à disparaître quand le zoom est déjà bien avancé
      )
      // Animations fade-in-up avec effet de glissement : titre légèrement avant le sous-titre
      // Après la fin complète de l'animation du masque pour éviter le filtre noir
      .fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 60, // Distance plus importante pour un effet de glissement prononcé
        },
        {
          opacity: 1,
          y: 0,
          duration: 2, // Durée plus longue pour plus de fluidité avec le scrub
          ease: 'power2.out', // Easing pour un glissement fluide
        }
      )
      .fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 60, // Distance plus importante pour un effet de glissement prononcé
        },
        {
          opacity: 1,
          y: 0,
          duration: 2, // Durée plus longue pour plus de fluidité avec le scrub
          ease: 'power2.out', // Easing pour un glissement fluide
        },
        '-=1.95' // Décalage très léger pour un effet fluide sans saut
      )
      // Animation de la navbar : slide du haut vers le bas au même moment que le sous-titre
      .fromTo(
        navbarRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 2, // Durée plus longue pour plus de fluidité avec le scrub
          ease: 'power2.out',
        },
        '-=1.95' // Au même moment que le sous-titre
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

