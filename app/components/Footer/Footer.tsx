import { forwardRef } from 'react'
import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = forwardRef<HTMLElement>((props, ref) => {
  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Colonne gauche - Logo et description */}
          <div className={styles.column}>
            <h3 className={styles.logo}>DEXNILL</h3>
            <p className={styles.description}>
              Capturer l'instant, révéler l'émotion. Photographie créative et artistique.
            </p>
          </div>

          {/* Colonne centre - Navigation */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Navigation</h4>
            <ul className={styles.links}>
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/gallery">Galerie</Link>
              </li>
              <li>
                <Link href="/videos">Vidéos</Link>
              </li>
              <li>
                <Link href="#about">À propos</Link>
              </li>
              <li>
                <Link href="#contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Colonne droite - Réseaux sociaux */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Suivez-moi</h4>
            <ul className={styles.links}>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:contact@dexnill.com">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de copyright */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Dexnill Productions. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
