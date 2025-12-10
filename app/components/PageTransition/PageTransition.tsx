'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import styles from './PageTransition.module.scss'

type PageTransitionProps = {
  children: React.ReactNode
}

// Variable globale pour maintenir l'état de transition entre les remontages
let globalIsTransitioning = false
let globalColumnsState: { yPercent: number; visible: boolean } | null = null

export default function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const columnsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isTransitioning = useRef(false)
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [viewportHeight, setViewportHeight] = useState<string>('100vh')

  // Synchroniser isTransitioning avec globalIsTransitioning au montage
  useEffect(() => {
    isTransitioning.current = globalIsTransitioning
    
    // Calculer la hauteur de la fenêtre réelle (pour mobile avec barre d'adresse)
    const updateViewportHeight = () => {
      const vh = window.innerHeight
      setViewportHeight(`${vh}px`)
      
      // Appliquer aussi aux colonnes si elles existent
      if (columnsRef.current) {
        const columns = columnsRef.current.querySelectorAll(`.${styles.column}`)
        columns.forEach((col) => {
          ;(col as HTMLElement).style.height = `${vh}px`
          ;(col as HTMLElement).style.minHeight = `${vh}px`
        })
        ;(columnsRef.current as HTMLElement).style.height = `${vh}px`
        ;(columnsRef.current as HTMLElement).style.minHeight = `${vh}px`
      }
    }
    
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    window.addEventListener('orientationchange', updateViewportHeight)
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
    }
  }, [])

  // Animation de couverture : colonnes montent du bas vers le haut
  const coverPage = useCallback((url: string) => {
    // Vérifier les deux états pour éviter les conflits
    if (!columnsRef.current) {
      console.log('Cover page blocked - no columnsRef')
      return
    }
    
    if (isTransitioning.current || globalIsTransitioning) {
      console.log('Cover page blocked - already transitioning - isTransitioning:', isTransitioning.current, 'globalIsTransitioning:', globalIsTransitioning)
      return
    }

    console.log('Starting cover page transition to:', url, 'Current pathname:', pathname)
    isTransitioning.current = true
    globalIsTransitioning = true
    const columns = columnsRef.current.querySelectorAll(`.${styles.column}`)

    if (columns.length === 0) {
      isTransitioning.current = false
      globalIsTransitioning = false
      router.push(url)
      return
    }

    // Activer les pointer events pour bloquer les interactions
    if (columnsRef.current) {
      columnsRef.current.style.pointerEvents = 'auto'
      columnsRef.current.style.visibility = 'visible'
      columnsRef.current.style.opacity = '1'
      columnsRef.current.style.display = 'grid'
    }

    // Calculer la hauteur de l'écran pour positionner les colonnes
    const screenHeight = window.innerHeight

    // S'assurer que les colonnes sont visibles et positionnées en bas (hors de l'écran)
    gsap.set(columns, { 
      y: screenHeight, // Positionner en bas de l'écran (hors de la vue)
      opacity: 1,
      visibility: 'visible',
      display: 'block',
      backgroundColor: '#fff',
    })

    const tl = gsap.timeline({
      onComplete: () => {
        // Sauvegarder l'état : colonnes en position 0 (couvrant l'écran)
        globalColumnsState = { yPercent: 0, visible: true }
        
        // Naviguer vers la nouvelle page une fois les colonnes en place
        router.push(url)
      },
    })

    // Animation d'entrée : du bas (screenHeight) vers le haut (0)
    tl.to(columns, {
      y: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.08,
    })
  }, [router])

  // Animation de révélation : colonnes descendent du haut vers le bas
  const revealPage = useCallback(() => {
    if (!columnsRef.current) return

    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current)
    }

    const columns = columnsRef.current.querySelectorAll(`.${styles.column}`)

    if (columns.length === 0) return

    // Calculer la hauteur de l'écran pour positionner les colonnes
    const screenHeight = window.innerHeight

    // Si les colonnes sont en transition, les positionner en 0 avant de descendre
    if (globalColumnsState && globalColumnsState.yPercent === 0) {
      gsap.set(columns, {
        y: 0,
        opacity: 1,
        visibility: 'visible',
        backgroundColor: '#fff',
      })
    }

    // S'assurer que les colonnes sont visibles avant l'animation
    gsap.set(columns, { 
      opacity: 1, 
      visibility: 'visible',
      backgroundColor: '#fff',
    })

    // S'assurer que le conteneur est visible
    if (columnsRef.current) {
      columnsRef.current.style.pointerEvents = 'auto'
      columnsRef.current.style.visibility = 'visible'
      columnsRef.current.style.opacity = '1'
      columnsRef.current.style.display = 'grid'
    }

    // Animation de sortie : de la position normale (0) vers le bas (screenHeight)
    gsap.to(columns, {
      y: screenHeight,
      duration: 0.8,
      ease: 'power3.inOut',
      stagger: 0.08,
      onComplete: () => {
        console.log('Reveal animation complete, resetting transition state')
        // Réinitialiser immédiatement pour permettre la prochaine transition
        isTransitioning.current = false
        globalIsTransitioning = false
        globalColumnsState = null
        // Désactiver les pointer events
        if (columnsRef.current) {
          columnsRef.current.style.pointerEvents = 'none'
        }
        console.log('Transition state reset - ready for next transition')
      },
    })

    // Sécurité : forcer la révélation après un délai
    revealTimeoutRef.current = setTimeout(() => {
      if (columns.length > 0) {
        const firstColumn = columns[0] as HTMLElement
        const currentY = gsap.getProperty(firstColumn, 'y')
        const screenHeight = window.innerHeight
        if (firstColumn && currentY !== null && currentY !== screenHeight) {
          gsap.to(columns, {
            y: screenHeight,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
              console.log('Force reveal complete, resetting transition state')
              isTransitioning.current = false
              globalIsTransitioning = false
              globalColumnsState = null
              if (columnsRef.current) {
                columnsRef.current.style.pointerEvents = 'none'
              }
            },
          })
        }
      }
    }, 1000)
  }, [])

  // Gérer les clics sur les liens (comme dans le projet source)
  const onAnchorClick = useCallback(
    (e: MouseEvent) => {
      if (isTransitioning.current) {
        e.preventDefault()
        return
      }

      const target = e.currentTarget as HTMLAnchorElement

      // Ignorer les clics spéciaux (Ctrl, Cmd, Shift, etc.)
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        target.target === '_blank'
      ) {
        return
      }

      e.preventDefault()
      const href = target.href
      const url = new URL(href).pathname
      
      if (url !== pathname) {
        coverPage(url)
      }
    },
    [pathname, coverPage]
  )

  // Initialisation au montage du composant
  useEffect(() => {
    if (!columnsRef.current || !contentRef.current) return

    const columns = columnsRef.current.querySelectorAll(`.${styles.column}`)

    // Calculer la hauteur de l'écran pour positionner les colonnes
    const screenHeight = window.innerHeight

    // Initialiser les colonnes en bas (hors de l'écran)
    gsap.set(columns, { 
      y: screenHeight,
      opacity: 1,
      visibility: 'visible',
      display: 'block'
    })

    if (columnsRef.current) {
      columnsRef.current.style.visibility = 'visible'
      columnsRef.current.style.opacity = '1'
      columnsRef.current.style.display = 'grid'
    }

    // Afficher le contenu immédiatement
    gsap.set(contentRef.current, { opacity: 1 })

    // Révéler la page au chargement initial (les colonnes descendent)
    revealPage()

    // Attendre que le DOM soit complètement chargé avant d'attacher les listeners
    const attachListeners = () => {
      const links = document.querySelectorAll('a[href^="/"]')
      console.log('Found links:', links.length)
      links.forEach((link) => {
        link.addEventListener('click', onAnchorClick as EventListener)
      })
      return links
    }

    // Attendre un peu pour que tous les composants soient rendus
    const timer = setTimeout(() => {
      attachListeners()
    }, 100)

    return () => {
      clearTimeout(timer)
      const links = document.querySelectorAll('a[href^="/"]')
      links.forEach((link) => {
        link.removeEventListener('click', onAnchorClick as EventListener)
      })
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current)
      }
    }
  }, [onAnchorClick, revealPage]) // Seulement au montage

  // Gérer les transitions après changement de route
  useEffect(() => {
    // Synchroniser isTransitioning avec globalIsTransitioning
    isTransitioning.current = globalIsTransitioning

    // Si on est en transition et que les colonnes sont en position 0, révéler
    if (globalIsTransitioning && globalColumnsState && globalColumnsState.yPercent === 0) {
      console.log('Pathname changed, restoring columns and revealing page')
      
      if (!columnsRef.current) return

      const columns = columnsRef.current.querySelectorAll(`.${styles.column}`)
      if (columns.length === 0) return

      // Restaurer l'état des colonnes (en position 0, couvrant l'écran)
      gsap.set(columns, {
        y: 0,
        opacity: 1,
        visibility: 'visible',
        display: 'block',
        backgroundColor: '#fff',
      })
      
      if (columnsRef.current) {
        columnsRef.current.style.pointerEvents = 'auto'
        columnsRef.current.style.visibility = 'visible'
        columnsRef.current.style.opacity = '1'
        columnsRef.current.style.display = 'grid'
        columnsRef.current.style.zIndex = '99999'
      }

      // Attendre un peu pour que la nouvelle page soit chargée, puis révéler
      const revealTimer = setTimeout(() => {
        revealPage()
      }, 400)

      return () => clearTimeout(revealTimer)
    } else if (!globalIsTransitioning) {
      // Si pas de transition en cours, s'assurer que tout est réinitialisé
      isTransitioning.current = false
    }
  }, [pathname, revealPage]) // Se déclenche à chaque changement de pathname


  return (
    <>
      {/* Grille de 9 colonnes pour la transition */}
      <div 
        ref={columnsRef} 
        className={styles.columnsContainer}
        style={{ 
          visibility: 'visible', 
          opacity: 1,
          height: viewportHeight,
          minHeight: viewportHeight
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <div 
            key={index} 
            className={styles.column}
            style={{ 
              visibility: 'visible', 
              opacity: 1,
              height: viewportHeight,
              minHeight: viewportHeight
            }}
          />
        ))}
      </div>

      {/* Contenu de la page */}
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </>
  )
}
