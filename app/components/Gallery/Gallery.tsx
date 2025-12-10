'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Gallery.module.scss'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
}

type GalleryProps = {
  portraitImage: GalleryImage
  title?: string
  text?: string
}

export default function Gallery({ portraitImage, title = 'Portfolio', text = 'Découvrez une sélection de mes meilleures photographies, capturant des moments uniques et des émotions authentiques.' }: GalleryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const backgroundImageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const bandsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current || !backgroundImageRef.current || !titleRef.current || !textRef.current || !bandsRef.current || !buttonRef.current) return

    // Animation principale : commence dès que le texte ReadingText est complètement affiché
    // L'animation se termine quand la Gallery atteint 20% du haut de l'écran (top 20%)
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', // Commence quand le haut de Gallery atteint le bas de l'écran (texte ReadingText complètement affiché)
        end: 'top 20%', // Se termine quand le haut de Gallery atteint 20% du haut de l'écran (Gallery en pleine taille)
        scrub: 1.5, // Animation liée au scroll
        pin: false, // Pas de pin pour permettre à la Gallery d'être visible pendant ReadingText
      },
    })

    // Initialiser la Gallery et l'image de background très petites, invisibles, et à 100px sous le texte ReadingText
    // ReadingText fait 100vh et Gallery fait aussi 100vh
    // Le texte est centré dans ReadingText, donc à environ 50vh du haut
    // Pour positionner Gallery à 100px sous le texte, on doit remonter de 50vh (centre de Gallery) moins 100px
    gsap.set([containerRef.current, backgroundImageRef.current], {
      scale: 0.15, // Très petit (15% de la taille normale)
      x: 0,
      y: -window.innerHeight * 0.5 + 100, // Positionnée à 100px sous le texte ReadingText (50vh - 100px)
      opacity: 0, // Invisible au début
      transformOrigin: 'center center',
    })

    // Étape 1 : Opacité 0 à 1 (affichage de la section Gallery en tout petit)
    mainTimeline.to([containerRef.current, backgroundImageRef.current], {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    })

    // Étape 2 : Descente depuis sous le texte jusqu'à la position finale
    mainTimeline.to([containerRef.current, backgroundImageRef.current], {
      y: 0, // Descend à sa position finale
      duration: 1,
      ease: 'power2.inOut',
    })

    // Étape 3 : Scale de la section (de très petit à taille normale)
    mainTimeline.to([containerRef.current, backgroundImageRef.current], {
      scale: 1,
      duration: 1.5,
      ease: 'power2.out',
    })

    // Animation d'apparition du titre (pendant la croissance)
    mainTimeline.fromTo(
      titleRef.current,
      {
        x: -60,
      },
      {
        x: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=1.5' // Commence pendant la croissance
    )

    // Animation d'apparition du texte
    mainTimeline.fromTo(
      textRef.current,
      {
        y: 40,
      },
      {
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=1.3' // Légèrement après le titre
    )

    // Animation d'apparition des bandes
    mainTimeline.fromTo(
      bandsRef.current,
      {
        x: 60,
      },
      {
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=1.1' // Légèrement après le texte
    )

    // Animation d'apparition du bouton
    mainTimeline.fromTo(
      buttonRef.current,
      {
        y: 20,
      },
      {
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.9' // Dernier élément à apparaître
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className={styles.gallery}>
      {/* Image de fond */}
      <div ref={backgroundImageRef} className={styles.backgroundImage}>
        <Image
          src="/images/fond_rouge.webp"
          alt="Background"
          fill
          className={styles.bgImage}
          priority={false}
        />
      </div>

      <div className={styles.container}>
        <div ref={containerRef} className={styles.content}>
          <div className={styles.left}>
            <h2 ref={titleRef} className={styles.title}>
              {title}
            </h2>
            <div className={styles.textWrapper}>
              <p ref={textRef} className={styles.text}>
                {text}
              </p>
              <div ref={buttonRef}>
                <Link href="/gallery" className={styles.button}>
                  Gallery
                </Link>
              </div>
            </div>
          </div>
          <div ref={bandsRef} className={styles.right}>
            <div className={styles.bands}>
              {/* Première bande */}
              <div className={styles.band}>
                <div className={styles.bandImageWrapper}>
                  <Image
                    src={portraitImage.src}
                    alt={portraitImage.alt}
                    width={portraitImage.width}
                    height={portraitImage.height}
                    className={styles.bandImage}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
              </div>
              {/* Deuxième bande */}
              <div className={styles.band}>
                <div className={styles.bandImageWrapper}>
                  <Image
                    src={portraitImage.src}
                    alt={portraitImage.alt}
                    width={portraitImage.width}
                    height={portraitImage.height}
                    className={styles.bandImage}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

