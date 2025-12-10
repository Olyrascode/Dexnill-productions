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
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const bandsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !textRef.current || !bandsRef.current || !buttonRef.current) return

    // Animation d'apparition du titre
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        x: -60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animation d'apparition du texte
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animation d'apparition des bandes
    gsap.fromTo(
      bandsRef.current,
      {
        opacity: 0,
        x: 60,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animation d'apparition du bouton
    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className={styles.gallery}>
      {/* Image de fond */}
      <div className={styles.backgroundImage}>
        <Image
          src="/images/fond_rouge.webp"
          alt="Background"
          fill
          className={styles.bgImage}
          priority={false}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
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

