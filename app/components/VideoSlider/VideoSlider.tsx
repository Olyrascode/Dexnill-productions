'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import type { Video } from '@/app/data/videos'
import styles from './VideoSlider.module.scss'

type VideoSliderProps = {
  videos: Video[]
}

// Fonction pour extraire l'ID YouTube de différents formats d'URL
const getYouTubeId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return url
}

export default function VideoSlider({ videos }: VideoSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())
  const [isAnimating, setIsAnimating] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showVideos, setShowVideos] = useState(false)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Délai avant de charger les vidéos pour améliorer les performances
    const timer = setTimeout(() => {
      setShowVideos(true)
      // La première vidéo devient active
      if (videos.length > 0) {
        setActiveVideoId(videos[0].id)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [videos])

  // Gérer le changement de vidéo active
  useEffect(() => {
    if (!showVideos || !activeVideoId) return

    // Arrêter toutes les vidéos sauf celle active
    videos.forEach((video) => {
      if (video.id !== activeVideoId) {
        const iframe = videoRefs.current.get(video.id)
        if (iframe) {
          iframe.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          )
        }
      }
    })

    // Démarrer la vidéo active avec un délai pour s'assurer que l'iframe est prêt
    const startActiveVideo = () => {
      const activeIframe = videoRefs.current.get(activeVideoId)
      if (activeIframe) {
        const currentSrc = activeIframe.src
        const video = videos.find((v) => v.id === activeVideoId)
        
        if (video) {
          const videoId = getYouTubeId(video.src)
          // Reconstruire l'URL avec autoplay=1 pour forcer le démarrage
          const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
          
          // Si l'URL est différente, recharger l'iframe
          if (currentSrc !== newSrc) {
            activeIframe.src = newSrc
          }
          
          // Forcer la lecture après un délai pour s'assurer que l'iframe est chargé
          setTimeout(() => {
            activeIframe.contentWindow?.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              '*'
            )
          }, 500)
        }
      }
    }

    // Attendre un peu avant de démarrer pour s'assurer que l'animation est terminée
    const timer = setTimeout(startActiveVideo, 200)
    return () => clearTimeout(timer)
  }, [activeVideoId, showVideos, videos])

  useGSAP(() => {
    if (isClient && sliderRef.current) {
      // Attendre que la transition de page soit terminée avant d'initialiser
      // La transition prend environ 0.8s (montée) + 0.3s (délai) + 0.8s (descente) = ~1.9s
      // On attend un peu plus pour être sûr
      const transitionDelay = setTimeout(() => {
        initializeCards()
      }, 2000)
      
      return () => clearTimeout(transitionDelay)
    }
  }, { dependencies: [isClient], scope: sliderRef })

  const initializeCards = () => {
    if (!sliderRef.current) return
    
    const cards = Array.from(sliderRef.current.querySelectorAll(`.${styles.card}`))
    gsap.to(cards, {
      y: (i) => 0 + 8 * i + '%',
      z: (i) => 8 * i,
      duration: 1,
      ease: 'power3.out',
      stagger: -0.1,
      onComplete: () => {
        // Après l'animation, la première carte dans le DOM est celle au premier plan
        const firstCard = cards[0] as HTMLElement
        const firstVideoId = firstCard?.getAttribute('data-video-id')
        if (firstVideoId) {
          setActiveVideoId(firstVideoId)
        }
      },
    })
  }

  const handleClick = () => {
    if (isAnimating || !sliderRef.current) return
    setIsAnimating(true)

    const slider = sliderRef.current
    const cards = Array.from(slider.querySelectorAll(`.${styles.card}`))
    const lastCard = cards.pop() as HTMLElement
    
    // Arrêter la vidéo actuellement active
    if (activeVideoId) {
      const currentIframe = videoRefs.current.get(activeVideoId)
      if (currentIframe) {
        currentIframe.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        )
      }
    }
    
    gsap.to(lastCard, {
      y: '+=150%',
      duration: 0.75,
      ease: 'power3.inOut',
      onStart: () => {
        setTimeout(() => {
          slider.prepend(lastCard)
          initializeCards()
          setTimeout(() => {
            setIsAnimating(false)
          }, 1000)
        }, 300)
      },
    })
  }

  if (!isClient) {
    return null
  }

  // Vérifier si des vidéos sont disponibles
  if (!videos || videos.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.slider}>
          <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
            Aucune vidéo disponible
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.slider} ref={sliderRef}>
        {videos.map((video, index) => {
          const videoId = getYouTubeId(video.src)
          const isActive = activeVideoId === video.id
          // Seule la vidéo active a autoplay=1, les autres ont autoplay=0
          const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? 1 : 0}&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
          
          return (
            <div 
              className={styles.card} 
              key={video.id}
              data-video-id={video.id}
            >
              <div className={styles.cardInfo}>
                <div className={styles.cardItem}>
                  <p>{video.duration || 'N/A'}</p>
                </div>
                <div className={styles.cardItem}>
                  <p>{video.title}</p>
                </div>
                <div className={styles.cardItem}>
                  <p>{video.category || 'Vidéo'}</p>
                </div>
              </div>

              <div className={styles.videoPlayer}>
                {showVideos ? (
                  <iframe
                    ref={(el) => {
                      if (el) {
                        videoRefs.current.set(video.id, el)
                      } else {
                        videoRefs.current.delete(video.id)
                      }
                    }}
                    src={embedUrl}
                    className={styles.videoIframe}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                ) : (
                  video.thumbnail && (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className={styles.thumbnail}
                      sizes="(max-width: 900px) 90vw, 65vw"
                    />
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

