'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ReadingText.module.scss'

// Enregistrer le plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

type ReadingTextProps = {
  text: string
}

export default function ReadingText({ text }: ReadingTextProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current) return

    // Séparer le texte en caractères individuels pour l'animation
    const chars = textRef.current.querySelectorAll('.char')
    
    if (chars.length === 0) return

    // Animation de lecture : les lettres passent du gris foncé au blanc progressivement
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2500', // Distance de scroll pour l'animation complète
        scrub: 1.5,
        pin: true, // Épingle la section pendant le scroll
      },
    }).to(chars, {
      color: '#ffffff',
      stagger: {
        each: 0.05, // Délai entre chaque lettre
        from: 'start',
      },
      ease: 'none',
    })
  }, { scope: sectionRef })

  // Fonction pour séparer le texte en caractères
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section ref={sectionRef} className={styles.readingText}>
      <div ref={textRef} className={styles.textContainer}>
        {splitText(text)}
      </div>
    </section>
  )
}

