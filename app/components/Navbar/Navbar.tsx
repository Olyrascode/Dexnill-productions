'use client'

import { useRef, useState, forwardRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Link from 'next/link'
import styles from './Navbar.module.scss'

const Navbar = forwardRef<HTMLElement>((props, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Animation du menu hamburger
  useGSAP(() => {
    if (!menuRef.current || !overlayRef.current) return

    if (isMenuOpen) {
      // Animation d'ouverture : slide de droite à gauche
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
    } else {
      // Animation de fermeture : slide vers la droite
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.6,
        ease: 'power3.in',
      })
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }, { scope: menuRef, dependencies: [isMenuOpen] })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav ref={ref} className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <span>DEXNILL</span>
      </Link>

      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={isMenuOpen ? styles.active : ''}></span>
        <span className={isMenuOpen ? styles.active : ''}></span>
        <span className={isMenuOpen ? styles.active : ''}></span>
      </button>

      {/* Overlay sombre */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        onClick={closeMenu}
        style={{ opacity: 0, pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      />

      {/* Menu slide */}
      <div ref={menuRef} className={styles.menu} style={{ transform: 'translateX(100%)' }}>
        <div className={styles.menuContent}>
          <ul className={styles.menuList}>
            <li>
              <Link href="/" onClick={closeMenu}>
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/gallery" onClick={closeMenu}>
                Gallery
              </Link>
            </li>
            <li>
              <a href="#about" onClick={closeMenu}>
                À propos
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar

