'use client'

import { useRef } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'
import PageTransition from '@/app/components/PageTransition/PageTransition'
import { getProjectBySlug } from '@/app/data/projects'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './page.module.scss'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProjectBySlug(slug)

  const navbarRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroImageRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  if (!project) {
    notFound()
  }

  useGSAP(() => {
    // Rendre la navbar visible immédiatement
    if (navbarRef.current) {
      gsap.set(navbarRef.current, {
        opacity: 1,
        y: 0,
      })
    }

    // Animation du titre
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 0.5,
        }
      )
    }

    // Animation de l'image hero
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.7,
        }
      )
    }

    // Animation de la description
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    // Animation de la galerie
    if (galleryRef.current) {
      const galleryItems = galleryRef.current.querySelectorAll(`.${styles.galleryItem}`)
      gsap.fromTo(
        galleryItems,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, [])

  return (
    <PageTransition>
      <Navbar ref={navbarRef} />
      <main className={styles.projectPage}>
        {/* Titre du projet */}
        <section className={styles.titleSection}>
          <h1 ref={titleRef} className={styles.title}>
            {project.title}
          </h1>
        </section>

        {/* Image hero en format paysage 100vh/100vw */}
        <section className={styles.heroSection}>
          <div ref={heroImageRef} className={styles.heroImageWrapper}>
            <Image
              src={project.heroImage.src}
              alt={project.heroImage.alt}
              fill
              className={styles.heroImage}
              priority
              sizes="100vw"
            />
          </div>
        </section>

        {/* Description du projet */}
        <section className={styles.descriptionSection}>
          <div ref={descriptionRef} className={styles.descriptionContent}>
            <p className={styles.category}>{project.category}</p>
            <p className={styles.description}>{project.description}</p>
          </div>
        </section>

        {/* Galerie d'images */}
        <section className={styles.gallerySection}>
          <div ref={galleryRef} className={styles.gallery}>
            {project.galleryImages.map((image, index) => (
              <div key={index} className={styles.galleryItem}>
                <div className={styles.galleryImageWrapper}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className={styles.galleryImage}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}

